from flask import Flask, Response, render_template, make_response, url_for
import pandas as pd
import json
import os
import argparse


app = Flask(__name__)

@app.template_filter('clamp')
def clamp_filter(value, min_value, max_value):
    return max(min_value, min(value, max_value))

def round_floats(obj):
    if isinstance(obj, float):
        return round(obj, 1)
    elif isinstance(obj, dict):
        return dict((k, round_floats(v)) for k, v in obj.items())
    elif isinstance(obj, (list, tuple)):
        return list(map(round_floats, obj))
    return obj


# Add argument parser
parser = argparse.ArgumentParser(description='Run the Flask app with specified JSON data file and patient ID.')
parser.add_argument('--input', type=str, required=True, help='Path to the JSON data file.')
parser.add_argument('--id', type=str, required=True, help='Patient ID.')

args = parser.parse_args()

def load_report_data():
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), args.input)
    # json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data/csv_data.json')
    with open(json_path, 'r') as json_file:
        data = json.load(json_file)

    # recursively round all floats in json to 2 decimal places
    return round_floats(data)

# Load the JSON data
loaded_data = load_report_data()

report_data = {
    'title': 'Laminate Volumetric Brain Report',
    'subtitle': 'Single Timepoint Dementia Analysis',
    'ID': f'{args.id}',
    # 'csvData': loaded_data.get('data', {}),
    'csvData': load_report_data(),
    'age': loaded_data.get('age'),
    'sex': loaded_data.get('sex')
}

@app.route('/')
def home():
    rendered_html = render_template('index.html', report=report_data)

    # Convert the HTML to a response object and then return it
    response = make_response(rendered_html)
    response.headers['Content-Type'] = 'text/html'
    return response

if __name__ == '__main__':
    # print(report_data)
    app.run(debug=True)
