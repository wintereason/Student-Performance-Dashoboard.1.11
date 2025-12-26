import sqlite3

db_path = 'student_dashboard.db'
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("\n📚 SUBJECTS IN DATABASE:")
print("-" * 70)
cursor.execute('SELECT id, name, description FROM subjects ORDER BY id')
for row in cursor.fetchall():
    print(f"  ID: {row['id']} | Name: {row['name']} | Desc: {row['description']}")

print("\n✓ Total subjects: ", end="")
cursor.execute('SELECT COUNT(*) FROM subjects')
print(cursor.fetchone()[0])

conn.close()
