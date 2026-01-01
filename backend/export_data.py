import sqlite3
import json

conn = sqlite3.connect('student_dashboard.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print('Tables in database:')
for table in tables:
    table_name = table[0]
    print(f'\n{table_name}:')
    cursor.execute(f'SELECT * FROM {table_name}')
    rows = [dict(row) for row in cursor.fetchall()]
    print(json.dumps(rows, indent=2))

conn.close()
