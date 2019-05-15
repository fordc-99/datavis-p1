import {scaleLinear, scaleQuantize} from 'd3-scale';
import {arc, pie} from 'd3-shape';
import {getDomain} from './utils';

const margin = {top: 650, left: 2300, right: 100, bottom: 100};
const plotWidth = 5000 - margin.left - margin.right;
const plotHeight = plotWidth;
const radius = plotHeight / 2;

const centerX = margin.left + plotWidth / 2;
const centerY = margin.top + plotHeight / 2;

function title(svg) {
  svg.append('text')
    .attr('x', 5000 - 2 * margin.right)
    .attr('y', margin.top - 75)
    .attr('font-size', '60px')
    .attr('text-anchor', 'end')
    .style('font-family', 'sans-serif')
    .style('letter-spacing', '0.1em')
    .style('font-weight', 'bold')
    .text('WEEKDAY RIDERSHIP AND TEMPERATURE IN 2016');
}

function buildBackground(g) {
  g.append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', radius)
    .attr('fill', '#fff');

  const arcC = arc()
    .innerRadius(0)
    .outerRadius(radius)
    .startAngle(0).endAngle(Math.PI / 6);

  const months = [
    {label: 'JAN', value: 2},
    {label: 'FEB', value: 2},
    {label: 'MAR', value: 2},
    {label: 'APR', value: 2},
    {label: 'MAY', value: 2},
    {label: 'JUN', value: 2},
    {label: 'JUL', value: 2},
    {label: 'AUG', value: 2},
    {label: 'SEP', value: 2},
    {label: 'OCT', value: 2},
    {label: 'NOV', value: 2},
    {label: 'DEC', value: 2}
  ];

  const bgData = [...new Array(12)].map((d, i) => ({
    rotate: i * 30,
    text: months[i].label
  }));

  const bg = g.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('width', plotWidth)
    .attr('height', plotHeight);

  bg.selectAll('.month-slice')
    .data(bgData)
    .enter().append('path')
      .attr('class', 'month-slice')
      .attr('d', arcC)
      .attr('stroke', '#a7a7a7')
      .attr('stroke-width', 3)
      .attr('fill', '#fff')
      .attr('transform',
        d => `translate(${plotWidth / 2}, ${plotHeight / 2})
          rotate(${d.rotate})`);

  const xCoord = d => plotWidth / 2 + Math.cos((d.rotate - 75) / 360 * 2 * Math.PI) * 0.95 * radius;
  const yCoord = d => (d.rotate < 75 || d.rotate > 255) ?
    plotWidth / 2 + Math.sin((d.rotate - 75) / 360 * 2 * Math.PI) * 0.95 * radius :
    plotWidth / 2 + Math.sin((d.rotate - 75) / 360 * 2 * Math.PI) * 0.95 * radius + 30;
  const rotateLabel = d => (d < 90 || d > 270) ? d : d + 180;

  bg.selectAll('.tlabel')
    .data(bgData)
    .enter().append('text')
      .attr('class', 'tlabel')
      .attr('transform',
        d => `translate(${xCoord(d)}, ${yCoord(d)}) rotate (${rotateLabel(d.rotate + 15)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#000')
      .attr('font-size', '45px')
      .attr('font-weight', 'bold')
      .style('font-family', 'sans-serif')
      .text(d => d.text);
}

function buildAxis(r, g) {
  const ticks = r.ticks();

  g.selectAll('radial-ticks').data(ticks)
    .enter().append('circle')
      .attr('class', 'radial-ticks')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', d => r(d))
      .attr('stroke', '#000')
      .attr('stroke-width', 3)
      .style('fill-opacity', 0);

  g.append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', radius)
    .attr('stroke', '#fff')
    .attr('stroke-width', 4)
    .style('fill-opacity', 0);

  // stroke
  g.selectAll('radial-tick-labels-stroke').data(ticks)
    .enter().append('text')
      .attr('class', 'radial-tick-labels-stroke')
      .attr('x', centerX)
      .attr('y', d => centerY - r(d) + 45 / 2)
      .attr('font-size', '50px')
      .attr('stroke', '#fff')
      .attr('stroke-width', 15)
      .style('font-family', 'sans-serif')
      .style('text-anchor', 'middle')
      .text(d => d);

  // overlay text over stroke
  g.selectAll('radial-tick-labels').data(ticks)
    .enter().append('text')
      .attr('class', 'radial-tick-labels')
      .attr('x', centerX)
      .attr('y', d => centerY - r(d) + 45 / 2)
      .attr('font-size', '50px')
      .style('font-family', 'sans-serif')
      .style('text-anchor', 'middle')
      .text(d => d);
}

function buildAnnotations(g) {
  const offsetLeft = margin.left + 235;
  const offsetBottom = margin.top + 580;

  g.append('line')
    .attr('x1', offsetLeft + 10)
    .attr('y1', offsetBottom)
    .attr('x2', offsetLeft + 10)
    .attr('y2', offsetBottom - 280)
    .attr('stroke-width', 8)
    .attr('stroke', '#626262');

  const offsetTop = offsetBottom - 560;

  const annText = [
    {content: 'CUBS WIN', y: 0, weight: 700},
    {content: 'On November 4th, 2016,', y: 50, weight: 400},
    {content: '5 million people attended', y: 100, weight: 400},
    {content: 'the Chicago Cubs', y: 150, weight: 400},
    {content: 'World Series parade', y: 200, weight: 400},
    {content: 'in Grant Park.', y: 250, weight: 400}
  ];

  g.selectAll('phase-annotation-text').data(annText)
  .enter().append('text')
  .attr('x', d => offsetLeft)
  .attr('y', d => offsetTop + d.y)
  .attr('font-size', 35)
  .attr('font-weight', d => d.weight)
  .attr('fill', '#626262')
  .style('letter-spacing', '0.1em')
  .style('font-family', 'sans-serif')
  .text(d => d.content);
}

export function phaseDiagram(importData, svg) {
  title(svg);
  // create g
  const g = svg.append('g');
  buildBackground(g);

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
  buildAnnotations(g);
}
