import sqlite3
import os

db_path = 'student_dashboard.db'

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("SQLite Database Tables:")
    if tables:
        for t in tables:
            print(f"  - {t[0]}")
            # Get column info for each table
            cursor.execute(f"PRAGMA table_info({t[0]});")
            columns = cursor.fetchall()
            for col in columns:
                print(f"      {col[1]} ({col[2]})")
    else:
        print("  No tables found")
    conn.close()
else:
    print(f"Database not found at {db_path}")
