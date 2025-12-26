"""
Database Models for Student Performance Dashboard
"""

from database import db
from datetime import datetime

class Student(db.Model):
    """Student model"""
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    department = db.Column(db.String(255), nullable=False)
    gpa = db.Column(db.Float, default=0.0)
    attendance = db.Column(db.Float, default=0.0)
    activityScore = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subjects = db.relationship('StudentSubject', backref='student', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'department': self.department,
            'gpa': self.gpa,
            'attendance': self.attendance,
            'activityScore': self.activityScore,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class Subject(db.Model):
    """Subject model"""
    __tablename__ = 'subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships - removed for now to avoid FK issues
    # student_subjects = db.relationship('StudentSubject', backref='subject', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class StudentSubject(db.Model):
    """Student Subject Score model - Junction table for many-to-many relationship"""
    __tablename__ = 'student_subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    subject_name = db.Column(db.String(255), nullable=False)  # Store subject name for flexibility
    marks = db.Column(db.Float, nullable=False)
    maxMarks = db.Column(db.Float, default=100.0)
    percentage = db.Column(db.Float)  # Calculated automatically
    
    # Marks breakdown fields (component-wise)
    assignment = db.Column(db.Float, default=0.0)
    test = db.Column(db.Float, default=0.0)
    project = db.Column(db.Float, default=0.0)
    quiz = db.Column(db.Float, default=0.0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, **kwargs):
        super(StudentSubject, self).__init__(**kwargs)
        # Calculate percentage
        if self.marks is not None and self.maxMarks and self.maxMarks > 0:
            self.percentage = (self.marks / self.maxMarks) * 100
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'name': self.subject_name,
            'marks': self.marks,
            'maxMarks': self.maxMarks,
            'percentage': round(self.percentage, 2) if self.percentage else 0,
            'assignment': self.assignment,
            'test': self.test,
            'project': self.project,
            'quiz': self.quiz,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
