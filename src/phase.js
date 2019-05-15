import {scaleLinear, scaleQuantize} from 'd3-scale';
import {interpolateRgb} from 'd3-interpolate';
import {arc, pie} from 'd3-shape';
import {getDomain} from './utils';

const margin = {top: 550, left: 2200, right: 100, bottom: 100};
const plotWidth = 5000 - margin.left - margin.right;
const plotHeight = plotWidth;
const radius = plotHeight / 2;

const centerX = margin.left + plotWidth / 2;
const centerY = margin.top + plotHeight / 2;

function buildAxis(r, g) {
  const ticks = r.ticks();

  g.selectAll('radial-ticks').data(ticks)
    .enter().append('circle')
      .attr('class', 'radial-ticks')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', d => r(d))
      .attr('stroke', '#333')
      .attr('stroke-width', 3)
      .style('fill-opacity', 0);

  g.selectAll('radial-tick-labels').data(ticks)
    .enter().append('text')
      .attr('class', 'radial-tick-labels')
      .attr('x', centerX)
      .attr('y', d => centerY - r(d) - 45 / 2)
      .attr('font-size', '50px')
      .attr('stroke', '#fff')
      .attr('stroke-width', 10)
      .style('font-family', 'sans-serif')
      .style('text-anchor', 'middle')
      .style('paint-order', 'stroke')
      .text(d => d);
}

export function phaseDiagram(importData, svg) {

  // create g
  const g = svg.append('g');

  g.append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', radius)
    .attr('fill', '#fff');

  const weekday = [1, 2, 3, 4, 5];
  const data = importData.filter(d => weekday.includes(d.dow));

  const tempDomain = getDomain(importData, 'temp');
  const riderDomain = getDomain(importData, 'ridership');

  const r = scaleLinear()
    .domain([0, riderDomain.max])
    .range([0, radius - 50]);

  const colors = ['#043971', '#145793', '#1E78B5', '#0999D5', '#6CB9E0', '#B0CDE6', '#DCE8F2', '#FFF',
    '#FFF4DD', '#FDC275', '#FF875C', '#E85647', '#CA2F3E', '#9B1843', '#710733'];

  const c = scaleQuantize()
    .domain([tempDomain.min, tempDomain.max])
    .range(colors);

  const phase = g.append('g')
    .attr('transform', `translate(${centerX}, ${centerY})`)
    .attr('width', plotWidth)
    .attr('height', plotHeight);

  const arcH = arc()
    .innerRadius(0)
    .outerRadius(d => r(d.data.ridership));

  const pieH = pie()
    .value(d => d.value);

  const arcs = phase.selectAll('slice')
    .data(pieH(data))
    .enter().append('g')
      .attr('class', (d, i) => `slice-${i}`);

  arcs.append('path')
    .attr('fill', d => c(d.data.temp))
    .attr('d', arcH);

  buildAxis(r, g);
}
