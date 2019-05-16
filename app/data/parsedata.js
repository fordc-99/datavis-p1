const fs = require('fs');

const rawcta = fs.readFileSync('cta_jsons/cta_data.json');
let ctaData = JSON.parse(rawcta);

const rawzip = fs.readFileSync('cta_jsons/stationToZip.json');
const redLineZips = JSON.parse(rawzip);

const rawnames = fs.readFileSync('cta_jsons/stationNames.json');
const redLineStops = JSON.parse(rawnames);

const raworder = fs.readFileSync('cta_jsons/stationOrder.json');
const redLineOrder = JSON.parse(raworder);

const rawinc = fs.readFileSync('cta_jsons/stationToZipIncomes.json');
const redLineZipInc = JSON.parse(rawinc);

ctaData = ctaData.map(generateElementObj);
ctaData = ctaData.filter(d => isRed(d));
ctaData = ctaData.filter(d => d.date.slice(-2) === '16');
ctaData = groupBy(ctaData, 'station_id');

const dataString = JSON.stringify(ctaData);
fs.writeFileSync('cta_data_2016red.json', dataString);

const keys = Object.keys(ctaData);
const averages = [];

keys.forEach(elem => {
  let total = 0;
  ctaData[elem].forEach(subElem => {
    total += Number(subElem.rides);
  });
  const avg = total / ctaData[elem].length;
  averages.push({stationid: elem, station: redLineStops[elem], order: redLineOrder[elem], medincome: redLineZipInc[elem], avgrides: avg, zipcode: redLineZips[elem]});
});

const dataString2 = JSON.stringify(averages);
fs.writeFileSync('cta_data_avg.json', dataString2);

function isRed(element) {

  if (typeof element === 'undefined') {
    return false;
  }
  if (redLineStops.indexOf(element.station_id) >= 0) {
    return true;
  }
  return false;
}

function groupBy(data, accessorKey) {
  const ret = {};

  data.forEach(handleEach);
  function handleEach(element) {
    const val = element[accessorKey];
    if (ret[val]) {
      ret[val].push(element);
    } else {
      ret[val] = [];
      ret[val].push(element);
    }
  }

  return ret;
}

function generateElementObj(element) {
  if (typeof element === 'undefined') {
    return undefined;
  }
  const infoString = element['station_id,stationname,date,daytype,rides'].split(',');
  return {stationid: infoString[0], stationname: infoString[1], date: infoString[2],
    daytype: infoString[3], rides: infoString[4]};
}
