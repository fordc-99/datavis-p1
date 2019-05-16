import {getDomain} from './utils';
import {scaleLinear, scaleBand, scaleLog} from 'd3-scale';
import {hcl} from 'd3-color';
import {format} from 'd3-format';
import {ascending} from 'd3-array';
import {axisLeft, axisBottom, axisRight} from 'd3-axis';

function buildLegend(svg, plotHeight, plotWidth, incDomain) {
  // setting constants
  const legendWidth = 650;
  const legendHeight = 1300;
  const offsetLeft = plotWidth + 650 - legendWidth;
  const offsetHeight = plotHeight - legendHeight - 90;
  const lMargin = {top: 50, left: 65, right: 65, bottom: 50};

  // creating legend box
  const g = svg.append('g').attr('transform', `translate(${offsetLeft}, ${offsetHeight})`);
  g.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('stroke', '#000')
    .attr('stroke-width', 6)
    .attr('fill', '#FCFCFB');

  // legend title
  g.append('text')
    .attr('x', legendWidth / 2)
    .attr('y', lMargin.top + 55)
    .attr('font-size', '55px')
    .attr('text-anchor', 'middle')
    .style('font-family', 'sans-serif')
    .style('letter-spacing', '0.1em')
    .text('MEDIAN INCOME');

  // color map gradient
  const grHeight = legendHeight - lMargin.top - lMargin.bottom - 200;
  const grMap = d => hcl(d / grHeight * 300, 30, 20 + d / grHeight * 60);
  const grData = [...new Array(grHeight)].map((d, i) => i);

  const y = d => lMargin.top + 150 + grHeight - d;

  g.selectAll('gradient').data(grData)
    .enter().append('line')
    .attr('class', 'gradient')
    .attr('x1', lMargin.left)
    .attr('x2', lMargin.left + 200)
    .attr('y1', d => y(d))
    .attr('y2', d => y(d))
    .attr('stroke', d => grMap(d));

  // color map scale
  const inc = scaleLog()
    .domain([incDomain.min, incDomain.max])
    .range([grHeight, 0]);

  // setting ticks
  const incTicks = [].concat(incDomain.min, inc.ticks(), inc.domain()[1]);

  const incAxis = g.append('g')
    .attr('transform', `translate(${lMargin.left + 275}, ${lMargin.top + 150})`)
    .call(axisRight(inc)
      .tickFormat(format(',d'))
      .tickValues(incTicks)
      .tickSize(-275, 0, 0));

  incAxis.selectAll('text')
    .attr('transform', 'translate(25, 0)')
    .style('letter-spacing', '0.1em')
    .style('text-transform', 'uppercase')
    .attr('font-size', '50px');

  incAxis.selectAll('.tick')
    .selectAll('line')
    .attr('stroke-width', 3);

  incAxis.selectAll('path')
    .remove();
}

export function barVis(svg, importData, width, height) {
  const margin = {top: 100, left: 650, right: 100, bottom: 400};

  const plotWidth = (width - margin.left - margin.right) / 2 - 300;
  const plotHeight = height - margin.top - margin.bottom;

  const data = importData.sort((a, b) => ascending(a.order, b.order));
  const rideDomain = getDomain(data, 'avg_rides');
  const incomeDomain = getDomain(data, 'med_income');

  const st = scaleBand()
    .domain(data.map(d => d.station))
    .range([0, plotHeight])
    .paddingInner([0.6])
    .paddingOuter([0]);

  const r = scaleLinear()
    .domain([0, rideDomain.max])
    .range([0, plotWidth]);

  const inc = scaleLog()
    .domain([incomeDomain.min, incomeDomain.max])
    .range([0, 1]);

  // x-axis base - added first to simulate low z-index
  svg.append('line')
    .attr('x1', margin.left)
    .attr('y1', 2 * margin.top + plotHeight)
    .attr('x2', margin.left + plotWidth - 20)
    .attr('y2', 2 * margin.top + plotHeight)
    .attr('stroke', '#000')
    .attr('stroke-width', 18);

  // y-axis base - added first to simulate low z-index
  svg.append('line')
    .attr('x1', margin.left)
    .attr('y1', margin.top)
    .attr('x2', margin.left)
    .attr('y2', 2 * margin.top + plotHeight)
    .attr('stroke', '#000')
    .attr('stroke-width', 18);

  // x-axis with gridlines
  const rAxis = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${2 * margin.top + plotHeight})`)
    .call(axisBottom(r).tickSize(-(plotHeight + margin.top), 0, 0));

  // x-axis text
  rAxis.selectAll('text')
    .attr('y', 75)
    .style('letter-spacing', '0.1em')
    .attr('font-size', '50px');

  // x-axis circles
  rAxis.selectAll('.tick')
    .append('circle')
    .attr('fill', '#fff')
    .attr('r', 0.9 * st.bandwidth() / 2)
    .attr('stroke', '#000')
    .attr('stroke-width', 0.2 * st.bandwidth());

  rAxis.selectAll('.tick')
    .selectAll('line')
    .attr('stroke-width', 2);

  // remove outer ticks
  rAxis.selectAll('path')
    .remove();

  // bars
  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  g.selectAll('rect')
    .data(data)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('width', d => r(d.avg_rides))
      .attr('y', d => st(d.station))
      .attr('height', st.bandwidth())
      .attr('rx', 0.5 * st.bandwidth() / 2)
      .attr('fill', d => hcl(inc(d.med_income) * 300, 30, 20 + inc(d.med_income) * 60));

  // y-axis
  const stAxis = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(axisLeft(st));

  // y-axis text
  stAxis.selectAll('text')
    .attr('transform', 'rotate(-30)')
    .attr('x', -70)
    .attr('y', -25)
    .attr('font-size', '45px')
    .style('text-transform', 'uppercase')
    .style('letter-spacing', '0.1em');

  // y-axis circles
  stAxis.selectAll('.tick')
    .append('circle')
    .attr('fill', '#fff')
    .attr('r', 0.9 * st.bandwidth() / 2)
    .attr('stroke', '#000')
    .attr('stroke-width', 0.2 * st.bandwidth());

  // x-axis label
  svg.append('text')
    .attr('transform', `translate(${margin.left + plotWidth / 2}, ${4 * margin.top + plotHeight + 20})`)
    .attr('font-size', '55px')
    .style('text-anchor', 'middle')
    .style('font-family', 'sans-serif')
    .style('font-weight', 'bold')
    .style('letter-spacing', '0.1em')
    .text('AVERAGE DAILY RIDERSHIP (2016)');

  const stAxisLab = [
    {content: 'STATION', y: 0},
    {content: 'NAME', y: 65}
  ];

  svg.selectAll('st-axis-label')
    .data(stAxisLab)
    .enter().append('text')
      .attr('x', 100)
      .attr('y', d => d.y + 1.5 * margin.top)
      .attr('font-size', '55px')
      .style('font-family', 'sans-serif')
      .style('font-weight', 'bold')
      .style('letter-spacing', '0.1em')
      .text(d => d.content);

  buildLegend(svg, plotHeight, plotWidth, incomeDomain);
}
