import {getDomain} from './utils';
import {scaleLinear, scaleBand} from 'd3-scale';
import {hcl} from 'd3-color';
import {ascending} from 'd3';
import {axisLeft, axisBottom} from 'd3-axis';

export function barVis(svg, importData) {
  const width = 5000;
  const height = 36 / 24 * width;
  const margin = {top: 100, left: 560, right: 100, bottom: 550};

  const plotWidth = (width - margin.left - margin.right) / 2;
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
    .range([0, plotWidth])
    .nice();

  const inc = scaleLinear()
    .domain([incomeDomain.min, incomeDomain.max])
    .range([0, 1])
    .nice();

  // x-axis base
  svg.append('line')
    .attr('x1', margin.left)
    .attr('y1', 2 * margin.top + plotHeight)
    .attr('x2', margin.left + plotWidth)
    .attr('y2', 2 * margin.top + plotHeight)
    .attr('stroke', '#000')
    .attr('stroke-width', 18);

  // y-axis base
  svg.append('line')
    .attr('x1', margin.left)
    .attr('y1', margin.top)
    .attr('x2', margin.left)
    .attr('y2', 2 * margin.top + plotHeight)
    .attr('stroke', '#000')
    .attr('stroke-width', 18);

  // x-axis
  const rAxis = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${2 * margin.top + plotHeight})`)
    .call(axisBottom(r)
      .tickSize(-(plotHeight + margin.top), 0, 0));

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
      .attr('fill', d => hcl(inc(d.med_income) * 300, 40, 20 + inc(d.med_income) * 60));

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
    .text('AVERAGE DAILY RIDES');

  // y-axis label
  svg.append('text')
    .attr('transform', 'rotate (-90)')
    .attr('y', 100)
    .attr('x', -(margin.top + 20))
    .attr('font-size', '55px')
    .style('text-anchor', 'end')
    .style('font-family', 'sans-serif')
    .style('font-weight', 'bold')
    .style('letter-spacing', '0.1em')
    .text('STATION NAME');
}
