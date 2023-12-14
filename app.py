from flask import Flask, Response, render_template, make_response, url_for
from os import walk
from weasyprint import HTML, CSS
from flask_weasyprint import HTML, render_pdf
import os


app = Flask(__name__)

@app.template_filter('clamp')
def clamp_filter(value, min_value, max_value):
    return max(min_value, min(value, max_value))

# # Display Web View
@app.route('/test')
def test_html():
    return render_template('test.html')

@app.route('/test.pdf')
def test_pdf():
    rendered_html = render_template('test.html')
    return render_pdf(HTML(string=rendered_html))

# Sample data to pass to the template
report_data = {
    'title': 'Brain Cortexes Report',
    'subtitle': 'Volumetric Radiology Report',
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


@app.route('/report')
def home():
    rendered_html = render_template('index.html', report=report_data)

    pdf = HTML(string=rendered_html).write_pdf()
    with open('report.pdf', 'wb') as f:
        f.write(pdf)

    # Convert the HTML to a response object and then return it
    response = make_response(rendered_html)
    response.headers['Content-Type'] = 'text/html'
    return response

# Generate PDF Version
@app.route('/reportpdf')
def report_pdf():
    # Make a PDF straight from HTML in a string just like the rendered HTML page
    rendered_html = render_template('index.html', report=report_data)
    pdf = HTML(string=rendered_html).write_pdf()
    # print(pdf)

    # Convert the PDF to a response object and then return it
    response = Response(pdf, content_type='application/pdf')
    response.headers['Content-Disposition'] = 'inline; filename=report.pdf'
    response.headers['Content-Transfer-Encoding'] = 'utf-8'
    return response


if __name__ == '__main__':
    app.run(debug=True)
