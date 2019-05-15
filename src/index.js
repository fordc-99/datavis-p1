import {barVis} from './bar';
import {bgLake, bgLand} from './bg';
import {title} from './title';
import {phaseDiagram} from './phase';
import {select} from 'd3-selection';

// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');

domReady(() => {
  // this is just one example of how to import data. there are lots of ways to do it!
  fetch('./data/cta_data_avg.json')
    .then(response => response.json())
    .then(data => myVis(data));

  fetch('./data/cta_data_2016red.json')
    .then(response => response.json())
    .then(data => phaseDiagram(data));
});

function myVis(data) {
  // The posters will all be 24 inches by 36 inches
  // Your graphic can either be portrait or landscape, up to you
  // the important thing is to make sure the aspect ratio is correct.

  // portrait
  const width = 5000;
  const height = 36 / 24 * width;

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

  phaseDiagram(data, svg);
}
