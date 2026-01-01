"""
Subject and Subject Scores API Routes
"""

from flask import Blueprint, request, jsonify
from database import db
from models.database_models import Student, Subject, StudentSubject
from datetime import datetime

bp = Blueprint('subjects', __name__)

# ==================== Subject Management Routes ====================

@bp.route('/management', methods=['GET'])
def get_all_subjects():
    """Get all subjects for management"""
    try:
        subjects = Subject.query.all()
        return jsonify({
            'success': True,
            'data': [subject.to_dict() for subject in subjects],
            'total': len(subjects)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/management', methods=['POST'])
def create_subject():
    """Create a new subject"""
    try:
        data = request.get_json()
        print(f"[API] Creating subject: {data}")
        
        # Validate required fields
        if not data or 'name' not in data:
            return jsonify({'success': False, 'error': 'Subject name is required'}), 400
        
        # Check if subject already exists
        existing = Subject.query.filter_by(name=data.get('name')).first()
        if existing:
            return jsonify({'success': False, 'error': 'Subject already exists'}), 409
        
        # Create new subject
        subject = Subject(
            name=data.get('name'),
            description=data.get('description', '')
        )
        
        db.session.add(subject)
        db.session.commit()
        
        print(f"[API] Subject created successfully: {subject.name}")
        return jsonify({
            'success': True,
            'data': subject.to_dict(),
            'message': 'Subject created successfully'
        }), 201
    except Exception as e:
        print(f"[API] Error creating subject: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/management/<int:subject_id>', methods=['PUT'])
def update_subject(subject_id):
    """Update a subject"""
    try:
        subject = Subject.query.get(subject_id)
        if not subject:
            return jsonify({'success': False, 'error': 'Subject not found'}), 404
        
        data = request.get_json()
        subject.name = data.get('name', subject.name)
        subject.description = data.get('description', subject.description)
        subject.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify({'success': True, 'data': subject.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/management/<int:subject_id>', methods=['DELETE'])
def delete_subject(subject_id):
    """Delete a subject"""
    try:
        subject = Subject.query.get(subject_id)
        if not subject:
            return jsonify({'success': False, 'error': 'Subject not found'}), 404
        
        # Delete all related student subjects
        StudentSubject.query.filter_by(subject_name=subject.name).delete()
        
        db.session.delete(subject)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Subject deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== Subject Scores Routes ====================

@bp.route('/student/<int:student_id>/subjects', methods=['GET'])
def get_student_subjects(student_id):
    """Get all subjects for a specific student"""
    try:
        subjects = StudentSubject.query.filter_by(student_id=student_id).all()
        return jsonify({
            'success': True,
            'data': [subject.to_dict() for subject in subjects],
            'total': len(subjects)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/student/<int:student_id>/subjects', methods=['POST'])
def add_subject_score(student_id):
    """Add a subject score for a student"""
    try:
        data = request.get_json()
        print(f"\n[API] ===== ADD SUBJECT SCORE REQUEST =====")
        print(f"[API] Student ID: {student_id}")
        print(f"[API] Request Data: {data}")
        
        # Validate required fields
        if not data or 'name' not in data or 'marks' not in data:
            error_msg = 'Missing required fields: name, marks'
            print(f"[API] ❌ Validation error: {error_msg}")
            return jsonify({'success': False, 'error': error_msg}), 400
        
        # Verify/create student exists
        student = Student.query.get(student_id)
        if not student:
            print(f"[API] ⚠️ Student {student_id} not found, creating new student...")
            # If student doesn't exist, create them with data from the request
            student_name = data.get('student_name', f'Student {student_id}')
            student = Student(
                id=student_id,
                name=student_name,
                department=data.get('department', 'Unknown'),
                gpa=data.get('gpa', 0.0),
                attendance=data.get('attendance', 0.0),
                activityScore=data.get('activityScore', 0.0)
            )
            db.session.add(student)
            db.session.flush()  # Flush to get ID but don't commit yet
            print(f"[API] ✓ Created student {student_id}: {student_name}")
        else:
            print(f"[API] ✓ Student found: {student.name}")
        
        # Create new subject score
        try:
            # Support both old format (marks/maxMarks) and new format (assignment/test/project/quiz)
            assignment = float(data.get('assignment', 0))
            test = float(data.get('test', 0))
            project = float(data.get('project', 0))
            quiz = float(data.get('quiz', 0))
            
            # Validate component ranges
            if assignment < 0 or assignment > 20:
                raise ValueError("Assignment must be between 0-20")
            if test < 0 or test > 25:
                raise ValueError("Test must be between 0-25")
            if project < 0 or project > 25:
                raise ValueError("Project must be between 0-25")
            if quiz < 0 or quiz > 15:
                raise ValueError("Quiz must be between 0-15")
            
            # Calculate total marks
            total_marks = assignment + test + project + quiz
            maxMarks = 100  # Fixed max marks for this schema
            
            # Use subject_name from request
            subject_name = str(data.get('subject_name', data.get('name', ''))).strip()
            
            if not subject_name:
                raise ValueError("Subject name cannot be empty")
            if total_marks < 0 or total_marks > maxMarks:
                raise ValueError(f"Total marks must be between 0-{maxMarks}")
            
            # Check if subject already exists for this student
            existing = StudentSubject.query.filter_by(
                student_id=student_id,
                subject_name=subject_name
            ).first()
            
            if existing:
                print(f"[API] Subject '{subject_name}' already exists for student {student_id}. Updating...")
                existing.marks = total_marks
                existing.maxMarks = maxMarks
                existing.assignment = assignment
                existing.test = test
                existing.project = project
                existing.quiz = quiz
                db.session.commit()
                subject_score = existing
            else:
                subject_score = StudentSubject(
                    student_id=student_id,
                    subject_name=subject_name,
                    marks=total_marks,
                    maxMarks=maxMarks,
                    assignment=assignment,
                    test=test,
                    project=project,
                    quiz=quiz
                )
                
                print(f"[API] Creating new subject score: {subject_score.subject_name} - {subject_score.marks}/{subject_score.maxMarks}")
                print(f"[API] Breakdown: Assignment={assignment}, Test={test}, Project={project}, Quiz={quiz}")
                print(f"[API] Calculated percentage: {subject_score.percentage}%")
                
                db.session.add(subject_score)
                db.session.commit()
            
            response_data = subject_score.to_dict()
            print(f"[API] ✓ Subject saved successfully: {response_data}")
            print(f"[API] ===== REQUEST COMPLETED SUCCESSFULLY =====\n")
            
            return jsonify({
                'success': True,
                'data': response_data,
                'message': 'Subject score added successfully'
            }), 201
            
        except ValueError as ve:
            print(f"[API] ❌ Validation error: {str(ve)}")
            db.session.rollback()
            return jsonify({'success': False, 'error': str(ve)}), 400
            
    except Exception as e:
        print(f"[API] ❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        print(f"[API] ===== REQUEST FAILED =====\n")
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'}), 500


@bp.route('/subject/<int:subject_id>', methods=['PUT'])
def update_subject_score(subject_id):
    """Update a subject score"""
    try:
        data = request.get_json()
        subject = StudentSubject.query.get(subject_id)
        
        if not subject:
            return jsonify({'success': False, 'error': 'Subject score not found'}), 404
        
        # Update fields if provided
        if 'marks' in data:
            subject.marks = float(data['marks'])
        if 'maxMarks' in data:
            subject.maxMarks = float(data['maxMarks'])
        if 'name' in data:
            subject.subject_name = data['name']
        
        # Recalculate percentage
        if subject.marks is not None and subject.maxMarks and subject.maxMarks > 0:
            subject.percentage = (subject.marks / subject.maxMarks) * 100
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': subject.to_dict(),
            'message': 'Subject score updated successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/student/<int:student_id>/subject/<int:subject_id>', methods=['PUT'])
def update_student_subject_marks(student_id, subject_id):
    """Update student subject marks with component breakdown"""
    try:
        data = request.get_json()
        print(f"\n[API] ===== UPDATE MARKS REQUEST =====")
        print(f"[API] Student ID: {student_id}, Subject ID: {subject_id}")
        print(f"[API] Update Data: {data}")
        
        # Verify student exists
        student = Student.query.get(student_id)
        if not student:
            return jsonify({'success': False, 'error': 'Student not found'}), 404
        
        # Get subject
        subject = StudentSubject.query.get(subject_id)
        if not subject or subject.student_id != student_id:
            return jsonify({'success': False, 'error': 'Subject not found for this student'}), 404
        
        # Update component marks
        if 'assignment' in data:
            subject.assignment = float(data['assignment'])
        if 'test' in data:
            subject.test = float(data['test'])
        if 'project' in data:
            subject.project = float(data['project'])
        if 'quiz' in data:
            subject.quiz = float(data['quiz'])
        
        # Auto-calculate total marks from components
        total_from_components = subject.assignment + subject.test + subject.project + subject.quiz
        subject.marks = total_from_components
        
        print(f"[API] Calculated Total: {subject.marks} (Assignment: {subject.assignment} + Test: {subject.test} + Project: {subject.project} + Quiz: {subject.quiz})")
        
        # Auto-calculate percentage
        if subject.marks is not None and subject.maxMarks and subject.maxMarks > 0:
            subject.percentage = (subject.marks / subject.maxMarks) * 100
        
        print(f"[API] Calculated Percentage: {subject.percentage}%")
        
        db.session.commit()
        
        print(f"[API] ✓ Marks updated successfully")
        print(f"[API] ===== UPDATE COMPLETED =====\n")
        
        return jsonify({
            'success': True,
            'data': subject.to_dict(),
            'message': 'Marks updated successfully'
        }), 200
        
    except ValueError as ve:
        print(f"[API] ❌ Validation error: {str(ve)}")
        db.session.rollback()
        return jsonify({'success': False, 'error': f'Invalid value: {str(ve)}'}), 400
    except Exception as e:
        print(f"[API] ❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/subject/<int:subject_id>', methods=['DELETE'])
def delete_subject_score(subject_id):
    """Delete a subject score"""
    try:
        subject = StudentSubject.query.get(subject_id)
        
        if not subject:
            return jsonify({'success': False, 'error': 'Subject score not found'}), 404
        
        db.session.delete(subject)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Subject score deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/students/subjects-stats', methods=['GET'])
def get_all_subjects_stats():
    """Get statistics for all subjects across all students"""
    try:
        # Get all subject scores grouped by subject name
        all_subjects = StudentSubject.query.all()
        
        # Group by subject name
        subjects_dict = {}
        for subject in all_subjects:
            if subject.subject_name not in subjects_dict:
                subjects_dict[subject.subject_name] = []
            subjects_dict[subject.subject_name].append(subject)
        
        # Calculate average for each subject
        result = []
        colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316']
        
        for idx, (name, scores) in enumerate(subjects_dict.items()):
            percentages = [s.percentage for s in scores if s.percentage is not None]
            avg_percentage = sum(percentages) / len(percentages) if percentages else 0
            
            result.append({
                'name': name,
                'avgScore': round(avg_percentage, 2),
                'color': colors[idx % len(colors)],
                'students': len(scores),
                'totalMarks': sum(s.marks for s in scores),
            })
        
        return jsonify({
            'success': True,
            'data': result,
            'total': len(result)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/students/subjects-export', methods=['GET'])
def export_all_subject_scores():
    """Export all subject scores for all students"""
    try:
        students_data = []
        students = Student.query.all()
        
        for student in students:
            student_dict = student.to_dict()
            student_dict['subjects'] = [
                subject.to_dict() for subject in StudentSubject.query.filter_by(student_id=student.id).all()
            ]
            students_data.append(student_dict)
        
        return jsonify({
            'success': True,
            'data': students_data,
            'total': len(students_data)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/student/<int:student_id>/marks', methods=['GET'])
def get_student_detailed_marks(student_id):
    """Get detailed marks for student with assignment/test/project/quiz breakdown"""
    try:
        subjects = StudentSubject.query.filter_by(student_id=student_id).all()
        
        marks_data = []
        for subject in subjects:
            # Parse the marks from notes/metadata if available, else use the main marks
            marks_entry = {
                'subject': subject.subject_name,
                'assignment': getattr(subject, 'assignment', 0),
                'test': getattr(subject, 'test', 0),
                'project': getattr(subject, 'project', 0),
                'quiz': getattr(subject, 'quiz', 0),
                'totalMarks': subject.marks,
                'maxMarks': subject.maxMarks,
                'percentage': round(subject.percentage, 2) if subject.percentage else 0
            }
            marks_data.append(marks_entry)
        
        return jsonify({
            'success': True,
            'data': marks_data,
            'total': len(marks_data)
        }), 200
    except Exception as e:
        print(f"[API] Error fetching student marks: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
