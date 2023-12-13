import subprocess
from flask import Flask, render_template, make_response
from xhtml2pdf import pisa
import io
import os

app = Flask(__name__)


@app.template_filter('clamp')
def clamp_filter(value, min_value, max_value):
    return max(min_value, min(value, max_value))


@app.route('/')
def home():
    # Sample data to pass to the template
    report_data = {
        'title': 'Soumen Structure',
        'subtitle': 'Report for 2019',
        'orderID': '123456789',
        'Frontal_lobe': [
            {'left_volume': 3095.5, 'left_percentage': 99.5,
                'right_volume': 3195.5, 'right_percentage': 50.5}
        ],
        'Parietal_lobe': [
            {'left_volume': 3495.5, 'left_percentage': 15.5,
                'right_volume': 2195.5, 'right_percentage': 65.5}
        ],
        'Occipital_lobe': [
            {'left_volume': 3195.5, 'left_percentage': 45.5,
                'right_volume': 3195.5, 'right_percentage': 45.5}
        ],
        'Temporal_lobe': [
            {'left_volume': 3195.5, 'left_percentage': 45.5,
                'right_volume': 3195.5, 'right_percentage': 45.5}
        ],
        'Cingulate_Parietal_lobe': [
            {'left_volume': 1195.5, 'left_percentage': 45.5,
                'right_volume': 6195.5, 'right_percentage': 45.5}
        ],
        'Cingulate_Frontal_lobe': [
            {'left_volume': 7195.5, 'left_percentage': 95.5,
                'right_volume': 8195.5, 'right_percentage': 40.5}
        ],
    }

    rendered_html = render_template('index.html', report=report_data)

    # try:
    #     subprocess.run(['node', 'generate_pdf.js'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    # except subprocess.CalledProcessError as e:
    #     print("Error occurred:", e.stderr.decode())
    #     return "An error occurred while generating the PDF", 500

    # Convert the HTML to a response object and then return it
    response = make_response(rendered_html)
    response.headers['Content-Type'] = 'text/html'
    return response


if __name__ == '__main__':
    app.run(debug=True)
