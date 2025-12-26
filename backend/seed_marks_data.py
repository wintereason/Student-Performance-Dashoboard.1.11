#!/usr/bin/env python3
"""
Seed Script: Add detailed marks data with assignment/test/project/quiz breakdown
This script adds sample marks data for students that will display in Student Marks History
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db
from models.database_models import Student, StudentSubject
import random

def seed_marks_data():
    """Add detailed marks data for all existing students"""
    
    app = create_app()
    
    with app.app_context():
        print("\n" + "="*70)
        print("SEEDING MARKS DATA - Student Marks History Setup")
        print("="*70)
        
        # Get all existing students
        students = Student.query.all()
        
        if not students:
            print("❌ No students found in database. Please add students first.")
            print("\nRun this to add students:")
            print("  python seed_data.py")
            return
        
        # List of subjects to add marks for
        subjects_list = [
            "Mathematics", "Physics", "Chemistry", "English", 
            "History", "Computer Science", "Biology", "Economics"
        ]
        
        marks_count = 0
        
        for student in students:
            print(f"\n📚 Adding marks for: {student.name} (ID: {student.id})")
            
            # Randomly select 3-5 subjects per student
            num_subjects = random.randint(3, 5)
            selected_subjects = random.sample(subjects_list, num_subjects)
            
            for subject_name in selected_subjects:
                # Generate realistic marks breakdown
                assignment = random.randint(12, 20)  # Out of 20
                test = random.randint(15, 25)        # Out of 25
                project = random.randint(15, 25)     # Out of 25
                quiz = random.randint(8, 15)         # Out of 15
                
                # Total marks (sum of all components)
                total_marks = assignment + test + project + quiz
                max_marks = 100
                
                # Check if this subject already exists for student
                existing = StudentSubject.query.filter_by(
                    student_id=student.id,
                    subject_name=subject_name
                ).first()
                
                if existing:
                    # Update existing record
                    existing.marks = total_marks
                    existing.maxMarks = max_marks
                    existing.percentage = (total_marks / max_marks) * 100
                    existing.assignment = assignment
                    existing.test = test
                    existing.project = project
                    existing.quiz = quiz
                    print(f"   ✓ Updated: {subject_name} - Total: {total_marks}/{max_marks} ({existing.percentage:.1f}%)")
                else:
                    # Create new subject score
                    subject_score = StudentSubject(
                        student_id=student.id,
                        subject_name=subject_name,
                        marks=total_marks,
                        maxMarks=max_marks
                    )
                    # Store component marks
                    subject_score.assignment = assignment
                    subject_score.test = test
                    subject_score.project = project
                    subject_score.quiz = quiz
                    
                    db.session.add(subject_score)
                    print(f"   ✓ Added: {subject_name}")
                    print(f"      ├─ Assignment: {assignment}/20")
                    print(f"      ├─ Test: {test}/25")
                    print(f"      ├─ Project: {project}/25")
                    print(f"      ├─ Quiz: {quiz}/15")
                    print(f"      └─ Total: {total_marks}/100 ({subject_score.percentage:.1f}%)")
                    marks_count += 1
        
        # Commit all changes
        try:
            db.session.commit()
            print("\n" + "="*70)
            print(f"✅ SUCCESS: Added {marks_count} subject marks records")
            print("="*70)
            print("\n📊 Marks Data Summary:")
            print(f"   • Total Students: {len(students)}")
            print(f"   • Subjects Populated: {marks_count}")
            print(f"   • Marks Range: 30-100 per subject")
            print("="*70)
            print("\n🎯 Next Steps:")
            print("   1. Go to Dashboard > Student Marks History")
            print("   2. Search for a student by name or roll number")
            print("   3. View their marks breakdown by subject")
            print("   4. See assignment/test/project/quiz details")
            print("\n")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ ERROR: Failed to seed marks data: {str(e)}")
            import traceback
            traceback.print_exc()


def update_schema():
    """Add columns to StudentSubject model if they don't exist"""
    app = create_app()
    
    with app.app_context():
        # Check if columns exist, if not add them
        from sqlalchemy import inspect
        
        inspector = inspect(db.engine)
        columns = [c['name'] for c in inspector.get_columns('student_subjects')]
        
        if 'assignment' not in columns:
            print("Adding assignment column...")
            db.engine.execute("ALTER TABLE student_subjects ADD COLUMN assignment FLOAT DEFAULT 0")
        
        if 'test' not in columns:
            print("Adding test column...")
            db.engine.execute("ALTER TABLE student_subjects ADD COLUMN test FLOAT DEFAULT 0")
        
        if 'project' not in columns:
            print("Adding project column...")
            db.engine.execute("ALTER TABLE student_subjects ADD COLUMN project FLOAT DEFAULT 0")
        
        if 'quiz' not in columns:
            print("Adding quiz column...")
            db.engine.execute("ALTER TABLE student_subjects ADD COLUMN quiz FLOAT DEFAULT 0")


if __name__ == '__main__':
    seed_marks_data()
