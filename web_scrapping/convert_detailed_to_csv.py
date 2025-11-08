import json
import pandas as pd

# Load detailed JSON data
with open('detailed_holiday_packages_20251107_015852.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Create DataFrame from packages
df = pd.DataFrame(data['packages'])

# Save to CSV
csv_file = 'detailed_holiday_packages.csv'
df.to_csv(csv_file, index=False, encoding='utf-8')

print(f'Detailed holiday packages data saved to {csv_file}')
print(f'Total packages: {len(df)}')
print(f'Columns included: {list(df.columns)}')
print('\nData preview:')
print(df[['name', 'destination', 'price', 'duration', 'rating', 'accommodation', 'transport', 'meals']].head())
