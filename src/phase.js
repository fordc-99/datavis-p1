import {scaleLinear} from 'd3-scale';
import {interpolateRgb} from 'd3-interpolate';
import {select} from 'd3-selection';
import {arc, pie} from 'd3-shape';

// uses './data/data.json'
export function phaseDiagram(data) {
  const width = 2000;
  const height = 2000;
  const centerY = 500;
  const centerX = 1000;

  const weekday = [1, 2, 3, 4, 5];
  const weekend = [6, 7];

  const weekdayData = data.filter(d => weekday.includes(d.dow));
  const weekendData = data.filter(d => weekend.includes(d.dow));
  const mData = data.filter(d => d.dow === 1);
  const tData = data.filter(d => d.dow === 2);
  const wData = data.filter(d => d.dow === 3);
  const hData = data.filter(d => d.dow === 4);
  const fData = data.filter(d => d.dow === 5);
  const sData = data.filter(d => d.dow === 6);
  const uData = data.filter(d => d.dow === 7);
  const filterss = [weekdayData, weekendData,
    mData, tData, wData, hData, fData, sData, uData, data];
  const label = ['Weekday', 'Weekend', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun', 'All'];

  const fillScale = scaleLinear().domain([0, 349810]).range([0, 500]);
  const color = scaleLinear().domain([0, 100]).range(['#0000FF', '#FF0000']).interpolate(interpolateRgb);

  for (let j = 0; j < 10; j = j + 1) {
    const svg = select('.vis-container');

    const g = svg.append('g')
      .attr('transform', `translate(${centerX * j}, ${centerY * j})`)
      .attr('width', width)
      .attr('height', height);

    const arcH = arc()
      .innerRadius(0)
      .outerRadius(d => fillScale(d.data.ridership));

    const pieH = pie()
      .value(d => d.value);

    const arcs = g.selectAll('slice')
      .data(pieH(filterss[j]))
        .enter()
        .append('g')
        .attr('class', (d, i) => `slice-${i}`);

    arcs.append('path')
      .attr('fill', d => color(d.data.temp))
      .attr('d', arcH);

    svg.append('text')
      .attr('x', 1000)
      .attr('y', 1000)
      .text(label[j]);
  }
}
