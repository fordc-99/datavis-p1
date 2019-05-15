import {scaleLinear, scaleTime} from 'd3-scale';
import {axisBottom, axisRight} from 'd3-axis';
import {line} from 'd3-shape';
import {annotation, annotationCallout} from 'd3-svg-annotation';
import {timeFormat} from 'd3-time-format';
import {format} from 'd3-format';

const margin = {top: 3550, left: 2900, right: 200, bottom: 100};
const width = 5000 - margin.left - margin.right;
const height = 5 / 6 * width;

function getTimeDomainScatterTime(data) {
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

function getYDomainScatterTime(data) {
  return data.reduce((acc, row) => {
    const numHigh = Number(row.total_rides);
    return {
      min: Math.min(numHigh, acc.min),
      max: Math.max(numHigh, acc.max)
    };
  }, {min: Infinity, max: -Infinity});
}

function title(svg) {
  svg.append('text')
    .attr('x', 5000 - margin.right)
    .attr('y', margin.top - 80)
    .attr('font-size', '60px')
    .attr('text-anchor', 'end')
    .style('font-family', 'sans-serif')
    .style('letter-spacing', '0.1em')
    .style('font-weight', 'bold')
    .text('RIDERSHIP FROM 2001 TO 2018');
}

function buildAxes(g, x, y) {
  const yAxis = g.append('g')
    .call(axisRight(y).tickSize(-30, 0, 0)
      .tickFormat(format('.2s')));

  yAxis.select('path')
    .style('stroke', '#000')
    .style('stroke-width', '12px');

  yAxis.selectAll('line')
    .style('stroke', '#000')
    .style('stroke-width', '12px');

  yAxis.selectAll('text')
    .attr('transform', 'translate(-180, 0)')
    .style('letter-spacing', '0.1em')
    .attr('font-size', '50px');

  const xAxis = g.append('g')
    .call(axisBottom(x).tickSize(30, 0, 0)
      .tickSizeOuter(0))
    .attr('transform', `translate(0,${height})`);

  xAxis.select('path')
    .style('stroke', '#000')
    .style('stroke-width', '15px');

  xAxis.selectAll('line')
    .style('stroke', '#000')
    .style('stroke-width', '12px');

  xAxis.selectAll('text')
    .attr('transform', 'translate(0, 20)')
    .style('letter-spacing', '0.1em')
    .attr('font-size', '50px');
}

function buildLabels(g) {
  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom + 70)
    .attr('font-size', '55px')
    .style('font-family', 'sans-serif')
    .style('font-weight', 'bold')
    .style('letter-spacing', '0.1em')
    .text('YEAR');

  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', (-height) / 2)
    .attr('y', -220)
    .attr('transform', 'rotate(-90)')
    .attr('font-size', '55px')
    .style('font-family', 'sans-serif')
    .style('font-weight', 'bold')
    .style('letter-spacing', '0.1em')
    .text('RIDERSHIP');
}

function buildLegend(g, groupNames) {
  const h = g.append('g').attr('transform', 'translate(90, 90)');

  h.selectAll('.point').data(groupNames)
    .enter().append('circle')
    .attr('cx', 0)
    .attr('cy', (d, i) => i * 70)
    .attr('r', 12)
    .attr('fill', d => d.color);

  h.selectAll('text').data(groupNames)
    .enter().append('text')
    .attr('font-size', '42px')
    .attr('x', 35)
    .attr('y', (d, i) => i * 70 + 15)
    .style('letter-spacing', '0.1em')
    .style('font-family', 'sans-serif')
    .text(d => d.text);
}

export function visScatterTime(svg, datasets) {
  title(svg);

  const data = datasets[0];
  const annualData = datasets[1];
  const xDom = getTimeDomainScatterTime(data);
  const yDom = getYDomainScatterTime(data);

  const x = scaleTime()
    .domain([new Date(xDom.min), new Date(xDom.max)])
    .range([0, width]);
  const y = scaleLinear()
    .domain([yDom.min, yDom.max])
    .range([height, 0])
    .nice();
  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  g.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#F7FBFF');

  g.selectAll('.yearlypoint').data(annualData)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', d => 13)
      .attr('fill', d => '#CA2F3E')
      .attr('cx', d => x(new Date(d.year)))
      .attr('cy', d => y(d.total_rides / 12));

  g.selectAll('.monthlypoint').data(data)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', d => 13)
      .attr('fill', d => '#1E78B5')
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.total_rides));

  const lineEval = line()
    .defined(d => d)
    .x(d => x(new Date(d.year)))
    .y(d => y(d.total_rides / 12));

  g.append('path')
    .datum(annualData)
    .attr('d', lineEval)
    .attr('fill', 'none')
    .attr('stroke', '#CA2F3E')
    .attr('stroke-width', 8);

  buildAxes(g, x, y);
  buildLabels(g);
  buildLegend(g, [
    {color: '#1E78B5', text: 'MONTHLY TOTAL'},
    {color: '#CA2F3E', text: 'YEARLY AVERAGE'}]);

  const annotations = [{
    note: {
      label: 'Nine stations were closed from May 19th to October 19th, 2013.',
      title: 'CONSTRUCTION'
    },
    data: {
      date: '2013-03-01',
      totalRides: 5360000
    },
    dy: 250,
    dx: 120,
    color: '#626262'
  }];

  const buildAnnotations = annotation()
    .type(annotationCallout)
    .textWrap(150)
    .accessors({
      x: d => x(new Date(d.date)),
      y: d => y(Number(d.totalRides))
    })
    .accessorsInverse({
      date: d => timeFormat(x.invert(d.x)),
      high: d => (y).invert(d.y)
    })
    .annotations(annotations);

  const anno = g.append('g')
    .attr('class', 'annotation-group')
    .call(buildAnnotations);

  anno.select('path:nth-child(1)')
    .attr('stroke-width', 8);

  anno.select('path:nth-child(2)')
    .remove();

  anno.selectAll('text')
    .attr('transform', 'translate(0, 20)')
    .style('letter-spacing', '0.1em')
    .style('font-family', 'sans-serif')
    .attr('font-size', '35px');

  anno.selectAll('.annotation-note-label')
    .attr('transform', 'translate(0, 45)');

}
