// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');

domReady(() => {
  // this is just one example of how to import data. there are lots of ways to do it!
  fetch('./data/example.json')
    .then(response => response.json())
    .then(data => myVis(data));

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
  console.log('hi!')

  // EXAMPLE FIRST FUNCTION
}
