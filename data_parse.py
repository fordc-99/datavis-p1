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

def get_quarter(dt):
    """
    function to get the quarter from the date

    dt : date
        the date in question

    returns a string detailing the quarter
    """
    # define the dates of the quarters
    win_16_start = date(2016, 1, 4)
    win_16_end = date(2016, 3, 19)

    spring_16_start = date(2016, 3, 28)
    spring_16_end = date(2016, 6, 11)

    sum_16_start = date(2016, 6, 20)
    sum_16_end = date(2016, 8, 27)

    aut_16_start = date(2016, 9, 17)
    aut_16_end = date(2016, 12, 10)

    if (dt >= win_16_start and dt <= win_16_end):
        return 'Winter 16'
    elif (dt >= spring_16_start and dt <= spring_16_end):
        return 'Spring 16'
    elif (dt >= sum_16_start and dt <= sum_16_end):
        return 'Summer 16'
    elif (dt >= aut_16_start and dt <= aut_16_end):
        return 'Fall 16'
    else:
        return 'Unknown Date Range'

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
        meta['day_type'] = 'weekday' if dt.isoweekday() in range(1, 6) else 'weekend'
        meta['day_of_week'] = dt.strftime("%A")
        meta['quarter'] = get_quarter(dt) 
        meta['171_rides'] = 0
        meta['172_rides'] = 0
        meta['temp'] = 0
        meta['precip'] = 0
        data[dt.strftime("%Y-%m-%d")] = meta  # assign metadata dict to the data dict

    # input ridership data from the CTA csv
    with open('CTA_-_Ridership_-_Bus_Routes_-_Daily_Totals_by_Route.csv') as cta_csv:
        cta_reader = csv.reader(cta_csv, delimiter=',')
        for row in cta_reader:
            route = row[0]
            d = row[1]
            if len(d) > 4:
                cta_date = convert_to_date(d, '%m/%d/%Y')
                if (cta_date >= start_dt and cta_date <= end_dt): 
                    if route == '171':
                        (data[cta_date.strftime("%Y-%m-%d")])['171_rides'] = row[3]
                    if route == '172':
                        (data[cta_date.strftime("%Y-%m-%d")])['172_rides'] = row[3]

    # input weather data from weather csv
    with open('chicago_weather.csv') as weather_csv:
        weather_reader = csv.reader(weather_csv, delimiter=',')
        for row in weather_reader:
            w_d = row[1]
            if len(w_d) > 4:
                weather_date = convert_to_date(w_d, '%Y-%m-%d')
                if (weather_date >= start_dt and weather_date <= end_dt):
                    (data[weather_date.strftime("%Y-%m-%d")])['precip'] = row[2]
                    (data[weather_date.strftime("%Y-%m-%d")])['temp'] = row[3]
                    
    # convert dict to json object, and place in json file
    with open('data.json', 'w') as fp:
        json.dump(data, fp, indent=4) # indent = 4 makes it pretty :)

if __name__ == '__main__':
    main()
