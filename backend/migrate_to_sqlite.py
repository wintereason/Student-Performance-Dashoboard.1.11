"""
Migration script to populate SQLite database from CSV files
Run this script to migrate data from CSV to SQLite database
"""

import sqlite3
import csv
import os
from datetime import datetime

# Database path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'student_dashboard.db')
DATA_DIR = os.path.join(BASE_DIR, 'data')

def init_database():
    """Create SQLite database tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Drop existing tables to start fresh
    cursor.execute('DROP TABLE IF EXISTS student_subjects')
    cursor.execute('DROP TABLE IF EXISTS students')
    cursor.execute('DROP TABLE IF EXISTS subjects')
    cursor.execute('DROP TABLE IF EXISTS department_data')
    
    # Create students table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT UNIQUE,
            name TEXT NOT NULL,
            department TEXT,
            gpa REAL DEFAULT 0.0,
            attendance INTEGER DEFAULT 0,
            activityScore INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create subjects table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create student_subjects junction table for scores
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS student_subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            subject_name TEXT NOT NULL,
            marks REAL NOT NULL,
            maxMarks REAL DEFAULT 100.0,
            percentage REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id)
        )
    ''')
    
    # Create department_data table for storing detailed performance metrics
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS department_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            term TEXT,
            attendance_pct INTEGER,
            assignments_submitted INTEGER,
            internal_marks INTEGER,
            lab_score INTEGER,
            class_participation INTEGER,
            exam_marks INTEGER,
            study_hours_per_week INTEGER,
            behavior_flag TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(student_id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✓ Database tables created successfully")

def migrate_student_data():
    """Migrate student data from CSV"""
    csv_path = os.path.join(DATA_DIR, 'student_data.csv')
    
    if not os.path.exists(csv_path):
        print(f"✗ Student data CSV not found at {csv_path}")
        return 0
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    migrated_count = 0
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if not row.get('id') or not row.get('name'):
                    continue
                
                try:
                    gpa = float(row.get('gpa', 0)) if row.get('gpa') else 0.0
                    attendance = int(row.get('attendance', 0)) if row.get('attendance') else 0
                    activity_score = int(row.get('activityScore', 0)) if row.get('activityScore') else 0
                    
                    cursor.execute('''
                        INSERT INTO students (student_id, name, department, gpa, attendance, activityScore)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ''', (
                        row.get('id'),
                        row.get('name'),
                        row.get('department', ''),
                        gpa,
                        attendance,
                        activity_score
                    ))
                    migrated_count += 1
                except sqlite3.IntegrityError:
                    # Student already exists, skip
                    pass
                except Exception as e:
                    print(f"  Error inserting student {row.get('id')}: {e}")
    except Exception as e:
        print(f"✗ Error reading student CSV: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"✓ Migrated {migrated_count} students from CSV")
    return migrated_count

def migrate_department_data():
    """Migrate department performance data from CSV"""
    csv_path = os.path.join(DATA_DIR, 'department_data.csv')
    
    if not os.path.exists(csv_path):
        print(f"✗ Department data CSV not found at {csv_path}")
        return 0
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    migrated_count = 0
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if not row.get('student_id'):
                    continue
                
                try:
                    attendance_pct = int(row.get('attendance_pct', 0)) if row.get('attendance_pct') else None
                    assignments = int(row.get('assignments_submitted', 0)) if row.get('assignments_submitted') else None
                    internal = int(row.get('internal_marks', 0)) if row.get('internal_marks') else None
                    lab = int(row.get('lab_score', 0)) if row.get('lab_score') else None
                    participation = int(row.get('class_participation', 0)) if row.get('class_participation') else None
                    exam = int(row.get('exam_marks', 0)) if row.get('exam_marks') else None
                    study_hours = int(row.get('study_hours_per_week', 0)) if row.get('study_hours_per_week') else None
                    
                    cursor.execute('''
                        INSERT INTO department_data 
                        (student_id, term, attendance_pct, assignments_submitted, internal_marks, 
                         lab_score, class_participation, exam_marks, study_hours_per_week, behavior_flag)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        row.get('student_id'),
                        row.get('term', ''),
                        attendance_pct,
                        assignments,
                        internal,
                        lab,
                        participation,
                        exam,
                        study_hours,
                        row.get('behavior_flag', '')
                    ))
                    migrated_count += 1
                except Exception as e:
                    print(f"  Error inserting department data for {row.get('student_id')}: {e}")
    except Exception as e:
        print(f"✗ Error reading department CSV: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"✓ Migrated {migrated_count} department records from CSV")
    return migrated_count

def verify_migration():
    """Verify the migration was successful"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("\n=== Migration Verification ===")
    
    # Check students
    cursor.execute('SELECT COUNT(*) FROM students')
    student_count = cursor.fetchone()[0]
    print(f"✓ Students in database: {student_count}")
    
    # Check department data
    cursor.execute('SELECT COUNT(*) FROM department_data')
    dept_count = cursor.fetchone()[0]
    print(f"✓ Department records in database: {dept_count}")
    
    # Show sample data
    if student_count > 0:
        cursor.execute('SELECT student_id, name, department, gpa FROM students LIMIT 3')
        print("\nSample Student Records:")
        for row in cursor.fetchall():
            print(f"  - ID: {row[0]}, Name: {row[1]}, Dept: {row[2]}, GPA: {row[3]}")
    
    if dept_count > 0:
        cursor.execute('SELECT student_id, term, attendance_pct, exam_marks FROM department_data LIMIT 3')
        print("\nSample Department Records:")
        for row in cursor.fetchall():
            print(f"  - Student: {row[0]}, Term: {row[1]}, Attendance: {row[2]}%, Exam: {row[3]}")
    
    conn.close()

def migrate_subject_data():
    """Migrate default subjects to database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    default_subjects = [
        ('Mathematics', 'Core mathematics subject'),
        ('Science', 'General science and laboratory'),
        ('English', 'English language and literature'),
        ('History', 'Historical studies and analysis'),
        ('Physical Education', 'Sports and physical fitness'),
        ('Art', 'Visual arts and creative expression'),
        ('Computer Science', 'Programming and IT basics'),
        ('Chemistry', 'Chemical science and reactions'),
    ]
    
    migrated_count = 0
    try:
        for name, description in default_subjects:
            cursor.execute('SELECT id FROM subjects WHERE name = ?', (name,))
            if not cursor.fetchone():
                cursor.execute(
                    'INSERT INTO subjects (name, description) VALUES (?, ?)',
                    (name, description)
                )
                migrated_count += 1
        
        conn.commit()
    except Exception as e:
        print(f"  Error inserting subjects: {e}")
    finally:
        conn.close()
    
    print(f"✓ Migrated {migrated_count} subjects to database")
    return migrated_count

def main():
    """Run the complete migration"""
    print("=" * 60)
    print("CSV to SQLite Migration")
    print("=" * 60)
    
    # Initialize database
    init_database()
    
    # Migrate data
    print("\nMigrating data from CSV files...")
    migrate_student_data()
    migrate_department_data()
    migrate_subject_data()
    
    # Verify
    verify_migration()
    
    print("\n" + "=" * 60)
    print("✓ Migration completed successfully!")
    print("=" * 60)

if __name__ == '__main__':
    main()
