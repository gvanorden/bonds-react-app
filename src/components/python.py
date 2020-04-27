import os
import re
import json
import datetime
import traceback
import mysql.connector
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

current_year = (datetime.datetime.now()).year


def translate_month(date):
    if re.match(r'[ /-]|\\|\|', date):
        month = re.split(r'[ /-]|\\|\|', date)[0]
    else:
        month = date

    if int(month) < 10:
        translated_month = '0' + str(month)
    else:
        translated_month = str(month)

    return translated_month


month_map = {
    '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '01': '1', '02': '2', '03': '3', '04': '4', '05': '5', '06': '6', '07': '7', '08': '8', '09': '9', '10': '10', '11': '11', '12': '12',
    'Jan': '1', 'Feb': '2', 'Mar': '3', 'Apr': '4', 'May': '5', 'Jun': '6', 'Jul': '7', 'Aug': '8', 'Sep': '9', 'Oct': '10', 'Nov': '11', 'Dec': '12',
    'January': '1', 'February': '2', 'March': '3', 'April': '4', 'May': '5', 'June': '6', 'July': '7', 'August': '8', 'September': '9', 'October': '10', 'November': '11', 'December': '12'
}


def translate_year(date):
    if re.match(r'[ /-]|\\|\|', date):
        year = re.split(r'[ /-]|\\|\|', date)[1]
    else:
        year = date

    if len(year) == 2 and int(year) > 0 and int(year) <= 50:
        translated_year = '20' + year
    elif len(year) == 2 and int(year) > 50:
        translated_year = '19' + year
    else:
        translated_year = year

    return translated_year


@app.route('/update', methods=['POST'])
def update():
    conn = mysql.connector.connect(
        host='localhost', user='gregg', passwd='Ocean122386', db='bonds')

    cur = conn.cursor()

    bond_results = []
    bonds = request.json['bonds']

    total_denominations = []
    total_prices = []
    total_interests = []
    total_values = []

    for bond in bonds:
        series = 'S' if bond['series'] == 'NOTE' else bond['series']

        denomination = bond['denomination']

        total_denominations.append(denomination)

        if series == 'I':
            issue_price = denomination
        elif series == 'S':
            issue_price = denomination * .81
        elif series == 'E':
            issue_price = denomination * .75
        elif series == 'EE':
            issue_price = denomination * .5

        total_prices.append(float(issue_price))

        serial_number = bond['serialNumber']
        if not serial_number:
            serial_number = 'N/A'

        value_date = translate_month(
            str(bond['vMonth'])) + '/' + translate_year(bond['vYear'])

        print(bond['iDate'])

        iMonth = re.split(r'[ /-]|\\|\|', bond['iDate'])[0]
        iMonth = month_map[iMonth]

        iYear = re.split(r'[ /-]|\\|\|', bond['iDate'])[1]
        if len(iYear) == 2:
            if int(iYear) >= 0 and int(iYear) <= 30:
                iYear = '20' + iYear
            else:
                iYear = '19' + iYear

        issue_date = translate_month(
            str(int(iMonth))) + '/' + translate_year(iYear)

        mature_year = str(int(translate_year(iYear)) + 30)

        if current_year >= int(mature_year):
            accrual_date = 'Matured'
        elif int(bond['vMonth']) in [5, 6, 7, 8, 9, 10]:
            accrual_date = translate_month(
                '11') + '/' + translate_year(bond['vYear'])
        else:
            accrual_date = translate_month(
                '5') + '/' + translate_year(bond['vYear'])

        mature_date = translate_month(
            str(int(iMonth))) + '/' + translate_year(mature_year)

        table_name = series + '_' + \
            translate_year(bond['vYear']) + '_' + \
            translate_month(bond['vMonth'])

        sql = "SELECT v" + str(denomination) + ", i" + str(denomination) + " FROM " + table_name + " WHERE Year = " + \
            translate_year(iYear) + " AND Month = " + \
            str(int(translate_month(iMonth))) + ";"

        print(sql)

        cur.execute(sql)
        get_bond = cur.fetchone()

        bond_value = get_bond[0]
        total_values.append(float(bond_value))

        bond_interest = get_bond[1]
        total_interests.append(float(bond_interest))

        bond_result = {
            'vDate': value_date,
            'series': 'NOTE' if series == 'S' else series,
            'denomination': denomination,
            'serialNumber': serial_number,
            'iDate': issue_date,
            'iPrice': issue_price,
            'aDate': accrual_date,
            'mDate': mature_date,
            'interest': bond_interest if bond_interest >= 0 else 0,
            'value': bond_value if bond_value >= 0 else 0
        }

        print(bond_result)

        bond_results.append(bond_result)

    bond_totals = {
        'totalDate': bond_results[0]['vDate'],
        'totalDenominations': int(sum(total_denominations)),
        'totalPrices': sum(total_prices),
        'totalInterests': sum(total_interests) if sum(total_interests) >= 0 else 0,
        'totalValues': sum(total_values) if sum(total_values) >= 0 else 0
    }

    results = [bond_results, bond_totals]

    conn.close()

    return(json.dumps(results))


if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run()
