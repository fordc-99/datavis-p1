import {barVis} from './bar';
import {bgLake, bgLand} from './bg';
import {title} from './title';
import {select} from 'd3-selection';

// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');
import {select} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import {arc, pie} from 'd3-shape';
import {interpolateRgb} from 'd3-interpolate';

domReady(() => {
  // this is just one example of how to import data. there are lots of ways to do it!
  fetch('./data/cta_data_avg.json')
    .then(response => response.json())
    .then(data => phaseDiagram(data));
});
  

  // landscape
  // const height = 5000;
  // const width = 36 / 24 * height;

  const svg = select('.vis-container').attr('width', width).attr('height', height);

  // EXAMPLE FIRST FUNCTION
  bgLand(svg, width, height);
  bgLake(svg, width);

  title(svg);

  const barSvg = svg.append('g').attr('transform', 'translate(0, 450)');
  barVis(barSvg, data, width, height - 450);

