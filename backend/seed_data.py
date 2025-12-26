#!/usr/bin/env python
"""
Seed the database with sample data for testing
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from database import db
from models.database_models import Student, Subject, StudentSubject

def seed_database():
    """Add sample data to database"""
    app = create_app()
    
    with app.app_context():
        # Check if data already exists
        existing_students = Student.query.count()
        if existing_students > 0:
            print(f"✓ Database already has {existing_students} students. Skipping seed.")
            return
        
        print("\n" + "="*60)
        print("SEEDING DATABASE WITH SAMPLE DATA")
        print("="*60)
        
        # Create sample students
        students_data = [
            {
                'name': 'Raj Kumar',
                'department': 'Computer Science',
                'gpa': 3.8,
                'attendance': 95,
                'activityScore': 85
            },
            {
                'name': 'Priya Singh',
                'department': 'Electronics',
                'gpa': 3.9,
                'attendance': 98,
                'activityScore': 90
            },
            {
                'name': 'Amit Patel',
                'department': 'Mechanical',
                'gpa': 3.6,
                'attendance': 92,
                'activityScore': 80
            },
        ]
        
        students = []
        for student_data in students_data:
            student = Student(**student_data)
            db.session.add(student)
            students.append(student)
            print(f"  ✓ Added student: {student_data['name']}")
        
        db.session.flush()
        
        # Create sample subject scores
        subjects_data = [
            ('Mathematics', 85, 100),
            ('Physics', 90, 100),
            ('Chemistry', 78, 100),
            ('English', 88, 100),
            ('History', 92, 100),
        ]
        
        for i, student in enumerate(students):
            for subject_name, marks, max_marks in subjects_data:
                # Vary marks by student
                varied_marks = marks + (i * 3) - 3
                if varied_marks < 0:
                    varied_marks = 60
                if varied_marks > max_marks:
                    varied_marks = max_marks
                    
                score = StudentSubject(
                    student_id=student.id,
                    subject_name=subject_name,
                    marks=varied_marks,
                    maxMarks=max_marks
                )
                db.session.add(score)
            print(f"  ✓ Added {len(subjects_data)} subject scores for {student.name}")
        
        db.session.commit()
        
        print("\n" + "="*60)
        print(f"✓ SEED COMPLETE")
        print(f"  - Students: {Student.query.count()}")
        print(f"  - Subject Scores: {StudentSubject.query.count()}")
        print("="*60 + "\n")

if __name__ == '__main__':
    seed_database()
