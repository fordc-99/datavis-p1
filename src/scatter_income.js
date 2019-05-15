import {scaleLinear, scaleBand, scaleTime} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {select} from 'd3-selection';
import {hcl} from 'd3-color';
import {line} from 'd3-shape';
import {annotation, annotationCalloutElbow, annotationLabel} from 'd3-svg-annotation';


// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');

domReady(() => {
  getJsonsScatterTime();
});

export function getJsonsScatterTime() {
  Promise.all([fetch('./data/cta_monthly_totals.json').then(response => response.json()),
    fetch('./data/cta_annual_totals.json')
    .then(response => response.json())])
    .then(data => visScatterTime(data));
}

export function getTimeDomainScatterTime(data) {
  return data.reduce((acc, row) => {
    const epochTime = (new Date(row.date)).getTime();
    return {
      minVal: Math.min(epochTime, acc.minVal),
      maxVal: Math.max(epochTime, acc.maxVal),
      min: epochTime < acc.minVal ? row.date : acc.min,
      max: epochTime > acc.maxVal ? row.date : acc.max
    };
  }, {minVal: Infinity, maxVal: -Infinity, min: null, max: null});
}

export function getYDomainScatterTime(data) {
  return data.reduce((acc, row) => {
    const numHigh = Number(row.total_rides);
    return {
      min: Math.min(numHigh, acc.min),
      max: Math.max(numHigh, acc.max)
    };
  }, {min: Infinity, max: -Infinity});
}

export function visScatterTime(datasets) {

  const data = datasets[0];
  const annualData = datasets[1];

  const height = 600;
  const width = 36 / 24 * height;
  const margin = {top: 10, left: 100, right: 10, bottom: 60};

  document.getElementById('vis-container').style.width = (width + margin.left + margin.right) + 'px';
  document.getElementById('vis-container').style.height = (height + margin.top + margin.bottom) + 'px';

  const x = scaleTime().domain([new Date(getTimeDomainScatterTime(data).min),
    new Date(getTimeDomainScatterTime(data).max)]).range([0, width]);
  const y = scaleLinear().domain([0, getYDomainScatterTime(data).max]).range([height, 0]);

  const svg = select('.vis-container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  svg.selectAll('.yearlypoint').data(annualData)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', d => 5)
      .attr('fill', d => '#B03A2E')
      .attr('cx', d => x(new Date(d.year)))
      .attr('cy', d => y(d.total_rides / 12));

  svg.selectAll('.monthlypoint').data(data)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', d => 5)
      .attr('fill', d => '#1A5276')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.total_rides));
      

  console.log(annualData);

  const lineEval = line()
    .defined(d => d)
    .x(d => x(new Date(d.year)))
    .y(d => y(d.total_rides / 12));

  svg.append('path')
    .datum(annualData)
    .attr('d', lineEval)
    .attr('fill', 'none')
    .attr('stroke', '#B03A2E')
    .attr('stroke-width', '2px');


  svg.selectAll('.point').data(annualData)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', d => 100)
      .attr('fill', d => 'red')
      .attr('cx', d => {
        console.log(x(new Date(d.year)));
      }).attr('cy', d => {
        console.log(y(d.total_rides / 12));
      });

  svg.append('g')
  .call(axisLeft(y));

  svg.append('g')
    .call(axisBottom(x))
    .attr('transform', `translate(0,${height})`);

  buildLabels();

  function buildLabels() {
    const g = svg.append('g');
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('font-style', 'italic')
      .attr('font-size', '16px')
      .text('Date');

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', (-height) / 2)
      .attr('y', -margin.left / 2 - 30)
      .attr('font-style', 'italic')
      .attr('font-size', '16px')
      .attr('transform', 'rotate(-90)')
      .text('Riders');

  }

  buildLegend([{color: '#1A5276', text: 'Total rides per month'}, {color: '#B03A2E', text: 'Average rides per month by year'}]);

  function buildLegend(groupNames) {
    const g = svg.append('g').attr('transform', `translate(${width * 0.7}, ${height * 0.8})`);
    g.selectAll('.point').data(groupNames)
      .enter().append('circle')
      .attr('cx', 0)
      .attr('cy', (d, i) => i * 40)
      .attr('r', 10)
      .attr('fill', d => d.color);

    g.selectAll('text').data(groupNames)
      .enter().append('text')
      .attr('font-size', '16px')
      .attr('x', 20)
      .attr('y', (d, i) => i * 40 + 5)
      .text(d => d.text);
  }

  const annotations = [{
    note: {
      label: "some stations closed between 5/19/2013 and 10/19/2013.",
      title: "CONSTRUCTION"
    },
    connector: {
      end: "arrow"
    },
    data: {
      date: '2012-11-1',
      total_rides: 5300000
    },
    dy: 100,
    dx: -100,
    color: '#626262'
  }];

  const buildAnnotations = annotation()
    .type(annotationLabel)
    .accessors({
      x: d => x(new Date(d.date)),
      y: d => y(Number(d.total_rides))
    })
    .accessorsInverse({
      date: d => timeFormatter(x.invert(d.x)),
      high: d => y.invert(d.y)
    })
    .annotations(annotations);

  svg.append("g")
    .attr("class", "annotation-group")
    .call(buildAnnotations);

}
