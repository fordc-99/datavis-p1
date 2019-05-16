const fs = require('fs');

const rawcta = fs.readFileSync('cta_jsons/cta_annual_data.json');
let ctaData = JSON.parse(rawcta);

ctaData = ctaData.map(generateElementObj);
ctaData = ctaData.filter(d => isRed(d));
ctaData = groupBy(ctaData, 'month_beginning');

const keys = Object.keys(ctaData);
const totals = [];

keys.forEach(elem => {
  let total = 0;
  ctaData[elem].forEach(subElem => {
    total += Number(subElem.monthtotal);
  });
  totals.push({date: elem, year: Number(elem.slice(-2)), totalrides: total});
});

const dataString = JSON.stringify(totals);
fs.writeFileSync('cta_monthly_totals.json', dataString);

const ctaDataYears = groupBy(totals, 'year');
const yearlyTotals = [];
Object.keys(ctaDataYears).forEach(elem => {
  let total = 0;
  ctaDataYears[elem].forEach(subElem => {
    total += Number(subElem.total_rides);
  });
  if (Number(elem) !== 18) {
    // data is incomplete for 2018
    yearlyTotals.push({year: `01/01/${(2000 + Number(elem))}`, totalrides: total});
  }
});

const dataString2 = JSON.stringify(yearlyTotals);
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
  const infoString =
      element['station_id,stationame,month_beginning,avg_weekday_rides,' +
      'avg_saturday_rides,avg_sunday-holiday_rides,monthtotal']
      .split(',');
  return {stationid: infoString[0], stationname: infoString[1],
    monthbeginning: infoString[2], monthtotal: infoString[6]};
}
