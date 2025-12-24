import csv

csv_path = 'data/student_data.csv'

try:
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        print(f"Fieldnames: {fieldnames}")
        print(f"Total fields: {len(fieldnames)}")
        
        for i, row in enumerate(reader):
            print(f"Row {i}:")
            print(f"  Student_ID: {repr(row.get('Student_ID'))}")
            print(f"  First_Name: {repr(row.get('First_Name'))}")
            print(f"  Keys in row: {list(row.keys())}")
except Exception as e:
    print(f"Error: {e}")
