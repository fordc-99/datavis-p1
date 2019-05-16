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

/*
const redLinePopDens = {'40900' : 11439.03, '41190' : 11439.03, '40100'  : 11439.03, '41300' : 11439.03, '40760' : 34193.05, 
'40880' : 34193.05, '41380' : 34193.05, '40340' : 31,204.02, '41200' : 31,204.02,
    '40770' : 31,204.02, '40540' : 31,204.02, '40080' : 25,857.54, '41420' : 25,857.54, '41320' : 31,204.02, 
    '41220' : 20,838.01, '40650' : 17,489.00, '40630' : 30,110.68, '41450' : 30,110.68, '40330' : 30,110.68, 
    '40260' : 17,101.15, '41090' : 4,553.49, '40560' : 546.75, '41490' : 6027.29, '41400' : 6027.29, 
    '41000' : 13,948.12, '40190' : 13,948.12, '41230' : 10,286.83, '41170' : 10,286.83, '40910' : 12,891.83, 
    '40990' : 12,891.83, '40240' : 11,439.03, '41430' : 11,439.03, '40450' : 11,439.03};
*/

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
