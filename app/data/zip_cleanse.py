import csv
import json

data = {}

def getRelevantData(filename, year, state_r, zipcode_r, total_income_r, agi_amount_r):
    with open(filename) as zip_csv:
        zip_reader = csv.reader(zip_csv, delimiter=',')
        for row in zip_reader:
            state = row[state_r]
            zipcode = row[zipcode_r]
            total_income = row[total_income_r]
            agi_amount = row[agi_amount_r]
            if (state == "IL"):
                if ((year + zipcode) not in data):
                    data[year + zipcode] = {
                        'income': int(round(float(total_income))),
                        'agi_amount': int(round(float(agi_amount)))
                    }
                else:
                    (data[year + zipcode])['income'] += int(round(float(total_income))) 
                    (data[year + zipcode])['agi_amount'] += int(round(float(agi_amount))) 

def main():

    zipformats = [
        ['16zpallagi.csv', '2016_', 1, 2, 10, 8],
        ['15zpallagi.csv', '2015_', 1, 2, 20, 18],
        ['14zpallagi.csv', '2014_', 1, 2, 16, 14],
        ['13zpallagi.csv', '2013_', 1, 2, 13, 11],
        ['12zpallagi.csv', '2012_', 1, 2, 0, 11], # does not have total income
        ['11zpallagi.csv', '2011_', 1, 2, 0, 9], # does not have total income
        ['10zpallagi.csv', '2010_', 1, 2, 0, 9], # does not have total income
        ['09zpallagi.csv', '2009_', 1, 2, 0, 9], # does not have total income
        #['08zpall.csv', '2008_', 1, 2, 0, 8], # does not have total income
        #['zipcode07.csv', '2007_', 1, 2, 0, 8], # does not have total income
        ['zipcode06.csv', '2006_', 1, 2, 0, 6] # does not have total income
    ]

    for i in range(len(zipformats)):
        year_row = zipformats[i]
        print(year_row)
        getRelevantData(year_row[0], year_row[1], year_row[2], year_row[3], year_row[4], year_row[5])
    
    with open('zipdata.json', 'w') as fp:
        json.dump(data, fp, indent=4) # indent = 4 makes it pretty :)

if __name__ == '__main__':
    main()


# with open('16zpallagi.csv') as zip_16_csv:
#         zip_16_reader = csv.reader(zip_16_csv, delimiter=',')
#         for row in zip_16_reader:
#             state = row [1]
#             zipcode = row[2]
#             total_income = row[10] #10, 3, 8
#             agi_amount = row[8]
#             if (state == "IL"):
#                 if (('2016_' + zipcode) not in data):
#                     data['2016_' + zipcode] = {
#                         'income': int(total_income),
#                         'agi_amount': int(agi_amount)
#                     }
#                 else:
#                     (data['2016_' + zipcode])['income'] += int(total_income) 
#                     (data['2016_' + zipcode])['agi_amount'] += int(agi_amount) 

# with open('15zpallagi.csv') as zip_15_csv:
#         zip_15_reader = csv.reader(zip_15_csv, delimiter=',')
#         for row in zip_15_reader:
#             state = row [1]
#             zipcode = row[2]
#             total_income = row[20]#10, 3, 8
#             agi_amount = row[18]
#             if (state == "IL"):
#                 if (('2015_' + zipcode) not in data):
#                     data['2015_' + zipcode] = {
#                         'income': int(total_income),
#                         'agi_amount': int(agi_amount)
#                     }
#                 else:
#                     (data['2015_' + zipcode])['income'] += int(total_income) 
#                     (data['2015_' + zipcode])['agi_amount'] += int(agi_amount) 