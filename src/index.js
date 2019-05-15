import {barVis} from './bar';
import {bgLake, bgLand} from './bg';
import {title} from './title';
import {phaseDiagram} from './phase';
import {visScatterTime} from './monthly_rides';
import {visScatterIncome} from './scatter_income';

import {select} from 'd3-selection';

import AVG_DATA from '../app/data/cta_data_avg.json';

// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');
const width = 5000;
const height = 36 / 24 * width;

domReady(() => {
  const svg = prepVis();

  stationVis(AVG_DATA, svg);

  fetch('./data/data.json')
    .then(response => response.json())
    .then(data => phaseDiagram(data, svg));

  Promise.all([fetch('./data/cta_monthly_totals.json').then(response => response.json()),
    fetch('./data/cta_annual_totals.json')
    .then(response => response.json())])
    .then(data => visScatterTime(svg, data));

  fetch('./data/cta_data_avg_2.json')
    .then(response => response.json())
    .then(data => visScatterIncome(svg, data));
});

function prepVis() {
  // The posters will all be 24 inches by 36 inches
  // Your graphic can either be portrait or landscape, up to you
  // the important thing is to make sure the aspect ratio is correct.

  // portrait
  const svg = select('.vis-container').attr('width', width).attr('height', height);

  bgLand(svg, width, height);
  bgLake(svg, width);
  title(svg);

  return svg;
}

function stationVis(data, svg) {
  // EXAMPLE FIRST FUNCTION
  const barSvg = svg.append('g').attr('transform', 'translate(0, 450)');
  barVis(barSvg, data, width, height - 450);
}
