import {scaleLinear} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {getDomain} from './utils';
import {format} from 'd3-format';

const margin = {top: 5610, left: 2900, right: 200, bottom: 100};
const width = 5000 - margin.left - margin.right;
const height = 5 / 6 * width;

function title(svg) {
  svg.append('text')
    .attr('x', 5000 - margin.right)
    .attr('y', margin.top - 80)
    .attr('font-size', '60px')
    .attr('text-anchor', 'end')
    .style('font-family', 'sans-serif')
    .style('letter-spacing', '0.1em')
    .style('font-weight', 'bold')
    .text('RIDERSHIP VS. INCOME AT EACH RED LINE STATION');
}

function buildLabels(g) {
  const h = g.append('g');
  h.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .attr('font-style', 'italic')
    .attr('font-size', '16px')
    .text('Median Household Income for Zipcode ($)');

  h.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', (-height) / 2)
    .attr('y', -margin.left / 2 - 20)
    .attr('font-style', 'italic')
    .attr('font-size', '16px')
    .attr('transform', 'rotate(-90)')
    .text('Daily Riders');

  h.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom + 70)
    .attr('font-size', '55px')
    .style('font-family', 'sans-serif')
    .style('font-weight', 'bold')
    .style('letter-spacing', '0.1em')
    .text('MEDIAN HOUSEHOLD INCOME');

  h.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', (-height) / 2)
    .attr('y', -210)
    .attr('transform', 'rotate(-90)')
    .attr('font-size', '55px')
    .style('font-family', 'sans-serif')
    .style('font-weight', 'bold')
    .style('letter-spacing', '0.1em')
    .text('AVERAGE DAILY RIDERSHIP');
}

function buildAxes(g, x, y) {
  const yAxis = g.append('g')
    .call(axisLeft(y).tickSize(30, 0, 0)
    .tickFormat(d => d / 1000 + 'k'));

  yAxis.select('path')
    .style('stroke', '#000')
    .style('stroke-width', '12px');

  yAxis.selectAll('line')
    .style('stroke', '#000')
    .style('stroke-width', '12px');

  yAxis.selectAll('text')
    .attr('transform', 'translate(-20, 0)')
    .style('letter-spacing', '0.1em')
    .attr('font-size', '50px');

  const xAxis = g.append('g')
    .call(axisBottom(x)
      .ticks(5)
      .tickSize(30, 0, 0)
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

export function visScatterIncome(svg, data) {
  title(svg);

  const xDom = getDomain(data, 'med_income');
  const yDom = getDomain(data, 'avg_rides');
  const x = scaleLinear()
    .domain([0, xDom.max])
    .range([0, width]);
  const y = scaleLinear()
    .domain([0, yDom.max])
    .range([height, 0])
    .nice();

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  g.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#F7FBFF');

  g.selectAll('.point').data(data)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', d => 18)
      .attr('fill', d => '#1E78B5')
      .attr('cx', d => x(d.med_income))
      .attr('cy', d => y(d.avg_rides));

  buildAxes(g, x, y);
  buildLabels(g);
}
