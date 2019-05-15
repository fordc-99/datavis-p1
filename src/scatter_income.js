import {scaleLinear, scaleBand} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {select} from 'd3-selection';
import {hcl} from 'd3-color';
// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)

export function visScatterIncome(svg, data) {

  const height = 600;
  const width = 36 / 24 * height;
  const margin = {top: 80, left: 80, right: 10, bottom: 60};

  const x = scaleLinear().domain([0, 150000]).range([0, width]);
  const y = scaleLinear().domain([0, 12000]).range([height, 0]);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  g.selectAll('.point').data(data)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', d => 5)
      .attr('fill', d => '#1A5276')
      .attr('cx', d => x(d.med_income))
      .attr('cy', d => y(d.avg_rides));

  g.append('g')
  .call(axisLeft(y));

  g.append('g')
    .call(axisBottom(x))
    .attr('transform', `translate(0,${height})`);

  goodLabels();

  function goodLabels() {
    const h = g.append('g');
    h.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('font-style', 'italic')
      .attr('font-size', '16px')
      .text('Median  Household Income for Zipcode ($)');

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
      .attr('y', - margin.top / 4)
      .attr('font-weight', 'bold')
      .attr('font-size', '16px')
      .text('Ridership vs. Zipcode Income for Each Station');

  }

  //buildLegend([{color: '#1A5276', text: 'Stations'}]);

  function buildLegend(groupNames) {
    const h = svg.append('g').attr('transform', `translate(${width * 0.9}, ${height * 0.9})`);
    h.selectAll('.point').data(groupNames)
      .enter().append('circle')
      .attr('cx', 0)
      .attr('cy', (d, i) => i * 40)
      .attr('r', 10)
      .attr('fill', d => d.color)

    h.selectAll('.rect').data(groupNames)
      .enter().append('rect')
      .attr('x', -20)
      .attr('y', -20)
      .attr('width', 100)
      .attr('height', 40)
      .attr('fill', 'none')
      .attr('stroke', 'black')

    h.selectAll('text').data(groupNames)
      .enter().append('text')
      .attr('font-size', '16px')
      .attr('x', 20)
      .attr('y', (d, i) => i * 40 + 5)
      .text(d => d.text);
  }
}
