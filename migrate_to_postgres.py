"""
Migration script to transfer data from SQLite to PostgreSQL
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.models.database_models import Student, Subject, StudentSubject, DepartmentData
from backend.database import db, Base

def migrate_to_postgres(postgres_url):
    """Migrate data from SQLite to PostgreSQL"""
    
    print("=" * 60)
    print("Database Migration: SQLite → PostgreSQL")
    print("=" * 60)
    
    # Create SQLite engine (source)
    sqlite_path = os.path.join(os.path.dirname(__file__), 'backend', 'student_dashboard.db')
    sqlite_url = f'sqlite:///{sqlite_path}'
    sqlite_engine = create_engine(sqlite_url)
    SQLiteSession = sessionmaker(bind=sqlite_engine)
    sqlite_session = SQLiteSession()
    
    # Create PostgreSQL engine (destination)
    postgres_engine = create_engine(postgres_url)
    PostgresSession = sessionmaker(bind=postgres_engine)
    postgres_session = PostgresSession()
    
    try:
        # Create all tables in PostgreSQL
        print("\n1. Creating tables in PostgreSQL...")
        Base.metadata.create_all(postgres_engine)
        print("   ✓ Tables created")
        
        # Migrate Students
        print("\n2. Migrating Students...")
        students = sqlite_session.query(Student).all()
        for student in students:
            new_student = Student(
                id=student.id,
                student_id=student.student_id,
                name=student.name,
                department=student.department,
                gpa=student.gpa,
                attendance=student.attendance,
                activityScore=student.activityScore,
                created_at=student.created_at,
                updated_at=student.updated_at
            )
            postgres_session.add(new_student)
        postgres_session.commit()
        print(f"   ✓ Migrated {len(students)} students")
        
        # Migrate StudentSubjects
        print("\n3. Migrating Student Subjects...")
        subjects = sqlite_session.query(StudentSubject).all()
        for subject in subjects:
            new_subject = StudentSubject(
                id=subject.id,
                student_id=subject.student_id,
                subject_name=subject.subject_name,
                marks=subject.marks,
                maxMarks=subject.maxMarks,
                percentage=subject.percentage,
                assignment=subject.assignment,
                test=subject.test,
                project=subject.project,
                quiz=subject.quiz,
                created_at=subject.created_at,
                updated_at=subject.updated_at
            )
            postgres_session.add(new_subject)
        postgres_session.commit()
        print(f"   ✓ Migrated {len(subjects)} subject records")
        
        # Migrate Department Data
        print("\n4. Migrating Department Data...")
        dept_data = sqlite_session.query(DepartmentData).all()
        for data in dept_data:
            new_data = DepartmentData(
                id=data.id,
                student_id=data.student_id,
                term=data.term,
                attendance_pct=data.attendance_pct,
                assignments_submitted=data.assignments_submitted,
                internal_marks=data.internal_marks,
                lab_score=data.lab_score,
                class_participation=data.class_participation,
                exam_marks=data.exam_marks,
                study_hours_per_week=data.study_hours_per_week,
                behavior_flag=data.behavior_flag,
                created_at=data.created_at,
                updated_at=data.updated_at
            )
            postgres_session.add(new_data)
        postgres_session.commit()
        print(f"   ✓ Migrated {len(dept_data)} department records")
        
        print("\n" + "=" * 60)
        print("✓ Migration completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        postgres_session.rollback()
        raise
    finally:
        sqlite_session.close()
        postgres_session.close()

if __name__ == '__main__':
    # Get PostgreSQL URL from environment or argument
    postgres_url = os.getenv('DATABASE_URL')
    
    if not postgres_url:
        print("Error: DATABASE_URL environment variable not set")
        print("\nUsage:")
        print("  set DATABASE_URL=postgresql://user:password@host/database")
        print("  python migrate_to_postgres.py")
        sys.exit(1)
    
    migrate_to_postgres(postgres_url)
