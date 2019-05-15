import {scaleLinear, scaleTime} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {line} from 'd3-shape';
import {annotation, annotationLabel} from 'd3-svg-annotation';
import {timeFormat} from 'd3-time-format';

const margin = {top: 3000, left: 3000, right: 200, bottom: 100};

const width = 5000 - margin.left - margin.right;
const height = width;

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

function buildLabels(g) {
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

function buildLegend(g, groupNames) {
  const h = g.append('g').attr('transform', `translate(${width * 0.7}, ${height * 0.8})`);
  h.selectAll('.point').data(groupNames)
    .enter().append('circle')
    .attr('cx', 0)
    .attr('cy', (d, i) => i * 40)
    .attr('r', 10)
    .attr('fill', d => d.color);

  h.selectAll('text').data(groupNames)
    .enter().append('text')
    .attr('font-size', '16px')
    .attr('x', 20)
    .attr('y', (d, i) => i * 40 + 5)
    .text(d => d.text);
}

export function visScatterTime(svg, datasets) {
  const data = datasets[0];
  const annualData = datasets[1];

  const xDom = getTimeDomainScatterTime(data);
  const yDom = getYDomainScatterTime(data);

  const x = scaleTime()
    .domain([new Date(xDom.min), new Date(xDom.max)])
    .range([0, width]);
  const y = scaleLinear()
    .domain([yDom.min / 1000, yDom.max / 1000])
    .range([height, 0])
    .nice();
  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  g.selectAll('.yearlypoint').data(annualData)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', d => 12)
      .attr('fill', d => '#CA2F3E')
      .attr('cx', d => x(new Date(d.year)))
      .attr('cy', d => y(d.total_rides / 12 / 1000));

  g.selectAll('.monthlypoint').data(data)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', d => 12)
      .attr('fill', d => '#1E78B5')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.total_rides / 1000));

  const lineEval = line()
    .defined(d => d)
    .x(d => x(new Date(d.year)))
    .y(d => y(d.total_rides / 12 / 1000));

  g.append('path')
    .datum(annualData)
    .attr('d', lineEval)
    .attr('fill', 'none')
    .attr('stroke', '#CA2F3E')
    .attr('stroke-width', 8);

  const yAxis = g.append('g')
    .call(axisLeft(y)
      .ticks(9));

  yAxis.select('path')
    .style('stroke', '#000')
    .style('stroke-width', '15px');

  yAxis.selectAll('line')
    .style('stroke', '#000')
    .style('stroke-width', '15px');

  yAxis.selectAll('text')
    .attr('y', 0)
    .style('letter-spacing', '0.1em')
    .attr('font-size', '50px');

  const xAxis = g.append('g')
    .call(axisBottom(x))
    .attr('transform', `translate(0,${height})`);

  xAxis.select('path')
    .style('stroke', '#000')
    .style('stroke-width', '15px');

  buildLabels(g);

  buildLegend(g, [
    {color: '#1A5276', text: 'Total rides per month'},
    {color: '#B03A2E', text: 'Average rides per month by year'}]);

  const annotations = [{
    note: {
      label: 'some stations closed between 5/19/2013 and 10/19/2013.',
      title: 'CONSTRUCTION'
    },
    connector: {
      end: 'arrow'
    },
    data: {
      date: '2012-11-1',
      totalRides: 5300000
    },
    dy: 100,
    dx: -100,
    color: '#626262'
  }];

  const buildAnnotations = annotation()
    .type(annotationLabel)
    .accessors({
      x: d => x(new Date(d.date)),
      y: d => y(Number(d.totalRides))
    })
    .accessorsInverse({
      date: d => timeFormat(x.invert(d.x)),
      high: d => y.invert(d.y)
    })
    .annotations(annotations);

  svg.append('g')
    .attr('class', 'annotation-group')
    .call(buildAnnotations);
}
