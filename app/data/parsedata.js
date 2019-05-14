const fs = require('fs');

const rawcta = fs.readFileSync('cta_jsons/cta_data.json');
var cta_data = JSON.parse(rawcta);

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

cta_data = cta_data.map(generateElementObj);
cta_data = cta_data.filter(d => isRed(d));
cta_data = cta_data.filter(d => d.date.slice(-2) === '16');
cta_data = groupBy(cta_data, 'station_id');

let dataString = JSON.stringify(cta_data);  
fs.writeFileSync('cta_data_2016red.json', dataString);

const keys = Object.keys(cta_data);
var averages = [];

keys.forEach(function(elem) {
  var total = 0;
  cta_data[elem].forEach(function(sub_elem) {
    total += Number(sub_elem.rides)
  });
  var avg = total / cta_data[elem].length;
  averages.push({station_id : elem, station: redLineStops[elem], order: redLineOrder[elem], med_income : redLineZipInc[elem], avg_rides : avg, zipcode : redLineZips[elem]});
});

let dataString2 = JSON.stringify(averages);  
fs.writeFileSync('cta_data_avg.json', dataString2);




function isRed(element) {

    const redLineStops = ['40900', '41190', '40100', '41300', '40760', '40880', '41380', '40340', '41200',
    '40770', '40540', '40080', '41420', '41320', '41220', '40650', '40630', '41450', '40330', 
    '40260', '41090', '40560', '41490', '41400', '41000', '40190', '41230', '41170', '40910', 
    '40990', '40240', '41430', '40450'];

    if (typeof element === 'undefined') {
        return false;
    }
    if (redLineStops.indexOf(element.station_id) >= 0) {
        return true;
    }
    else {
        return false;
    }
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
    return {station_id : infoString[0], stationname : infoString[1], date : infoString[2], 
        daytype : infoString[3], rides: infoString[4]};
}