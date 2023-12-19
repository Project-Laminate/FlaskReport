import pandas as pd
import json
import os

# take directory of this file
current_dir = os.path.dirname(__file__)
# print(current_dir)

# go one directory up
parent_dir = os.path.dirname(current_dir)

# join parent directory with the path to the csv file
csv_path = os.path.join(parent_dir, 'StatProcessingPipeline', 'data', 'output', 'final_report.csv')
import pandas as pd
import json
import os

# Load the CSV file
df = pd.read_csv(csv_path)

# Process and restructure the data
report_data = {}
for column in df.columns:
    parts = column.split('_')
    if len(parts) < 3:
        continue

    base_label = parts[0]
    hemisphere = parts[1]
    metric_type = parts[2]

    if base_label not in report_data:
        report_data[base_label] = {}

    if hemisphere not in report_data[base_label]:
        report_data[base_label][hemisphere] = {}

    metric_value = df[column].iloc[0]
    if metric_type == 'volume':
        report_data[base_label][hemisphere]['volume'] = metric_value
    elif metric_type == 'percentile':
        report_data[base_label][hemisphere]['percentile'] = metric_value
    elif metric_type == 'max':
        report_data[base_label][hemisphere]['max'] = metric_value
    elif metric_type == 'min':
        report_data[base_label][hemisphere]['min'] = metric_value


# Path for the JSON output file in the same directory as the script and create the path if it doesn't exist
json_output_path = os.path.join(current_dir, 'data/csv_data.json')

# create the path if it doesn't exist
os.makedirs(os.path.dirname(json_output_path), exist_ok=True)

# Save the processed data as JSON
with open(json_output_path, 'w') as json_file:
    json.dump(report_data, json_file, indent=4)

