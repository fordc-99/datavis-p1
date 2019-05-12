import csv
import json

data = {}

with open('16zpallagi.csv') as zip_16_csv:
        zip_16_reader = csv.reader(zip_16_csv, delimiter=',')
        for row in zip_16_reader:
            state = row [1]
            zipcode = row[2]
            total_income = row[10] #10, 3, 8
            agi_amount = row[8]
            if (state == "IL"):
                if (('2016_' + zipcode) not in data):
                    data['2016_' + zipcode] = {
                        'income': int(total_income),
                        'agi_amount': int(agi_amount)
                    }
                else:
                    (data['2016_' + zipcode])['income'] += int(total_income) 
                    (data['2016_' + zipcode])['agi_amount'] += int(agi_amount) 
                #print(row)
            # d = row[1]
            # if len(d) > 4:
            #     cta_date = convert_to_date(d, '%m/%d/%Y')
            #     if (cta_date >= start_dt and cta_date <= end_dt): 
            #         if route == '171':
            #             (data[cta_date.strftime("%Y-%m-%d")])['171_rides'] = row[3]
            #         if route == '172':
            #             (data[cta_date.strftime("%Y-%m-%d")])['172_rides'] = row[3]

with open('zipdata.json', 'w') as fp:
        json.dump(data, fp, indent=4) # indent = 4 makes it pretty :)