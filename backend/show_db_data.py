import sqlite3

db_path = 'student_dashboard.db'
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("\n" + "="*70)
print("SQLITE DATABASE CONTENTS")
print("="*70)

print("\n📚 STUDENTS TABLE:")
print("-" * 70)
cursor.execute('SELECT * FROM students ORDER BY student_id')
for row in cursor.fetchall():
    print(f"  ID: {row['student_id']} | Name: {row['name']} | Dept: {row['department']} | GPA: {row['gpa']}")

print("\n📊 DEPARTMENT DATA TABLE:")
print("-" * 70)
cursor.execute('''SELECT student_id, term, attendance_pct, assignments_submitted, 
                          internal_marks, exam_marks, behavior_flag FROM department_data ORDER BY student_id''')
for row in cursor.fetchall():
    print(f"  Student: {row['student_id']} | Term: {row['term']} | Attendance: {row['attendance_pct']}% | Exam: {row['exam_marks']} | Behavior: {row['behavior_flag'] or 'Normal'}")

print("\n✓ Database Statistics:")
cursor.execute('SELECT COUNT(*) FROM students')
student_count = cursor.fetchone()[0]
cursor.execute('SELECT COUNT(*) FROM department_data')
dept_count = cursor.fetchone()[0]
print(f"  Total Students: {student_count}")
print(f"  Total Department Records: {dept_count}")
print("="*70 + "\n")

conn.close()
