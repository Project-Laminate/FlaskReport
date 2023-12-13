from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def report():
    # Here you would get your data, for example from a database or a CSV file
    data = get_your_data()
    return render_template('report.html', data=data)

if __name__ == '__main__':
    app.run(debug=True)
