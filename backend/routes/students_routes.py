from flask import Blueprint, jsonify, request
from database import db
from models.database_models import Student

bp = Blueprint('students', __name__)

@bp.route('', methods=['GET'])
@bp.route('/', methods=['GET'])
def get_students():
    """Get all students from database"""
    try:
        print("[API] ===== GET STUDENTS REQUEST =====")
        students = Student.query.all()
        print(f"[API] ✓ Retrieved {len(students)} students from database")
        
        response_data = {
            'success': True,
            'count': len(students),
            'data': [student.to_dict() for student in students]
        }
        print(f"[API] ===== REQUEST COMPLETED =====\n")
        return jsonify(response_data), 200
    except Exception as e:
        print(f"[API] ❌ Error retrieving students: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """Get single student by ID from database"""
    try:
        student = Student.query.get(student_id)
        if student:
            return jsonify({'success': True, 'data': student.to_dict()}), 200
        else:
            return jsonify({'success': False, 'error': 'Student not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
@bp.route('/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    """Update student information"""
    try:
        print(f"[API] ===== UPDATE STUDENT {student_id} REQUEST =====")
        student = Student.query.get(student_id)
        
        if not student:
            print(f"[API] ❌ Student {student_id} not found")
            return jsonify({'success': False, 'error': 'Student not found'}), 404
        
        data = request.get_json()
        print(f"[API] Update data: {data}")
        
        # Update fields if provided
        if 'name' in data:
            student.name = data['name']
        if 'department' in data:
            student.department = data['department']
        if 'gpa' in data:
            student.gpa = data['gpa']
        if 'attendance' in data:
            student.attendance = data['attendance']
        if 'activityScore' in data:
            student.activityScore = data['activityScore']
        
        db.session.commit()
        print(f"[API] ✓ Student {student_id} updated successfully")
        print(f"[API] ===== REQUEST COMPLETED =====\n")
        
        return jsonify({
            'success': True,
            'message': 'Student updated successfully',
            'data': student.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[API] ❌ Error updating student: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500
