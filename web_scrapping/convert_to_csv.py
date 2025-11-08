import json
import pandas as pd

# Load JSON data
with open('sample_holiday_packages_20251107_015012.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Create DataFrame
df = pd.DataFrame(data['packages'])

# Save to CSV
csv_file = 'holiday_packages.csv'
df.to_csv(csv_file, index=False, encoding='utf-8')

print(f'Holiday packages data saved to {csv_file}')
print(f'Total packages: {len(df)}')
print('\nData preview:')
print(df[['name', 'destination', 'price', 'duration']].head())
