const fs = require('fs');

const rawcta = fs.readFileSync('cta_jsons/cta_annual_data.json');
var cta_data = JSON.parse(rawcta);

const rawzip = fs.readFileSync('cta_jsons/stationToZip.json');  
const redLineZips = JSON.parse(rawzip);

const rawnames = fs.readFileSync('cta_jsons/stationNames.json');  
const redLineStops = JSON.parse(rawnames);

const raworder = fs.readFileSync('cta_jsons/stationOrder.json');  
const redLineOrder = JSON.parse(raworder);

const rawinc = fs.readFileSync('cta_jsons/stationToZipIncomes.json');  
const redLineZipInc = JSON.parse(rawinc);

cta_data = cta_data.map(generateElementObj);
cta_data = cta_data.filter(d => isRed(d));
cta_data = groupBy(cta_data, 'month_beginning');

console.log(cta_data);

const keys = Object.keys(cta_data);
var totals = [];

keys.forEach(function(elem) {
  var total = 0;
  cta_data[elem].forEach(function(sub_elem) {
    total += Number(sub_elem.monthtotal);
  });
  totals.push({date : elem, year : Number(elem.slice(-2)), total_rides : total});
});

let dataString = JSON.stringify(totals);  
fs.writeFileSync('cta_monthly_totals.json', dataString);

const cta_data_years = groupBy(totals, 'year');
var yearly_totals = [];
Object.keys(cta_data_years).forEach(function(elem) {
  var total = 0;
  cta_data_years[elem].forEach(function(sub_elem) {
    total += Number(sub_elem.total_rides);
  });
  if(Number(elem) !== 18) { // data is incomplete for 2018
    yearly_totals.push({year : ('01/01/' + (2000 + Number(elem))), total_rides : total});
  }
});
console.log(yearly_totals);

let dataString2 = JSON.stringify(yearly_totals);  
fs.writeFileSync('cta_annual_totals.json', dataString2);

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
    const infoString = element['station_id,stationame,month_beginning,avg_weekday_rides,avg_saturday_rides,avg_sunday-holiday_rides,monthtotal'].split(',');
    return {station_id : infoString[0], stationname : infoString[1], month_beginning: infoString[2], monthtotal : infoString[6]};
}