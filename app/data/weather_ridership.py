import csv
import json
from datetime import timedelta, date, datetime

def daterange(date1, date2):
    """ 
    function to create a range of dates, from date1 to date2 inclusive

    date1 : date
        the first date of the range
    date2 : date
        the second date of the range
    """
    for n in range(int ((date2 - date1).days)+1):
        yield date1 + timedelta(n)

def convert_to_date(dt, format):
    """
    function to convert a datetime object to a date object

    dt : datetime
        the datetime object that needs to be converted
    format : string
        the string for the format the datetime is written in

    returns a date object
    """
    d_datetime = datetime.strptime(dt, format)
    d_date = date(int(d_datetime.strftime('%Y')), 
                  int(d_datetime.strftime('%m')), 
                  int(d_datetime.strftime('%d'))) # I know this is awful, I'm sorry
    return d_date

def main():
    # generate a dict for data, where key = date, val = info
    data = {}

    # define the start and end dates
    start_dt = date(2016, 1, 1)
    end_dt = date(2016, 12, 31)

    for dt in daterange(start_dt, end_dt):
        # generate a dict for the metadata; initialize fields
        meta = {}
        meta['date'] = dt.strftime("%Y-%m-%d")
        meta['dow'] = dt.isoweekday()
        meta['temp'] = 0
        meta['ridership'] = 0
        meta['value'] = 1
        data[dt.strftime("%Y-%m-%d")] = meta  # assign metadata dict to the data dict
    
    # input weather data from weather csv
    with open('chicago_weather.csv') as weather_csv:
        weather_reader = csv.reader(weather_csv, delimiter=',')
        for row in weather_reader:
            w_d = row[1]
            if len(w_d) > 4:
                weather_date = convert_to_date(w_d, '%Y-%m-%d')
                if (weather_date >= start_dt and weather_date <= end_dt):
                    (data[weather_date.strftime("%Y-%m-%d")])['temp'] = row[3]

    # input ridership data from the CTA csv
    redline_id = ['40080', '40100', '40190', '40240', '40260', 
                  '40330', '40340', '40450', '40540', '40560', 
                  '40630', '40650', '40760', '40770', '40880', 
                  '40900', '40910', '40990', '41000', '41090', 
                  '41170', '41190', '41200', '41220', '41230', 
                  '41300', '41320', '41380', '41400', '41420', 
                  '41430', '41450', '41490']
    max = 0
    with open('cta_l_ridership.csv') as cta_csv:
        cta_reader = csv.reader(cta_csv, delimiter=',')
        for row in cta_reader:
            if len(row[2]) > 4:
                station_id = row[0]
                cta_date = convert_to_date(row[2], '%m/%d/%Y')
                if (station_id in redline_id and (cta_date >= start_dt and cta_date <= end_dt)):
                    (data[cta_date.strftime('%Y-%m-%d')])['ridership'] += int(row[4])
                    if (data[cta_date.strftime('%Y-%m-%d')])['ridership'] > max:
                        max = (data[cta_date.strftime('%Y-%m-%d')])['ridership']
    print(max)
                    
    # convert dict to json object, and place in json file
    with open('data.json', 'w') as fp:
        json.dump(list(data.values()), fp, indent=4) # indent = 4 makes it pretty :)

if __name__ == '__main__':
    main()