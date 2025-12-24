from flask import Blueprint, jsonify
import csv
import os

bp = Blueprint('students', __name__)

def get_csv_data():
    """Read student data from CSV"""
    # Get absolute path to CSV file
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, 'data', 'student_data.csv')
    
    print(f"DEBUG: Attempting to read CSV from: {csv_path}")
    print(f"DEBUG: File exists: {os.path.exists(csv_path)}")
    
    data = []
    try:
        if not os.path.exists(csv_path):
            print(f"CSV file not found at: {csv_path}")
            return []
        
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                data.append(row)
        print(f"DEBUG: Successfully read {len(data)} rows from CSV")
    except Exception as e:
        print(f"Error reading CSV: {e}")
        import traceback
        traceback.print_exc()
    return data

@bp.route('', methods=['GET'])
@bp.route('/', methods=['GET'])
def get_students():
    """Get all students"""
    try:
        print("DEBUG: Starting get_students function")
        data = get_csv_data()
        print(f"DEBUG: get_csv_data returned {len(data)} rows")
        
        # Convert to list format for JSON serialization
        students = []
        for row in data:
            try:
                # Safely convert numeric fields
                gpa = 0
                attendance = 0
                activity_score = 0
                
                if 'gpa' in row and row['gpa']:
                    try:
                        gpa = float(row['gpa'])
                    except:
                        gpa = 0
                
                if 'attendance' in row and row['attendance']:
                    try:
                        attendance = int(row['attendance'])
                    except:
                        attendance = 0
                
                if 'activityScore' in row and row['activityScore']:
                    try:
                        activity_score = int(row['activityScore'])
                    except:
                        activity_score = 0
                
                student = {
                    'id': str(row.get('id', '')).strip(),
                    'name': str(row.get('name', '')).strip(),
                    'department': str(row.get('department', '')).strip(),
                    'gpa': gpa,
                    'attendance': attendance,
                    'activityScore': activity_score
                }
                students.append(student)
            except Exception as e:
                print(f"DEBUG: Error processing row {row}: {e}")
                continue
        
        print(f"DEBUG: Converted to {len(students)} student records")
        if students:
            print(f"DEBUG: First student: {students[0]}")
        
        response_data = {
            'success': True,
            'count': len(students),
            'data': students
        }
        print(f"DEBUG: Returning response with count={len(students)}")
        return jsonify(response_data), 200
    except Exception as e:
        print(f"DEBUG: Exception in get_students: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/<student_id>', methods=['GET'])
def get_student(student_id):
    """Get single student by ID"""
    try:
        data = get_csv_data()
        for student in data:
            if str(student.get('Student_ID')) == str(student_id):
                return jsonify({'success': True, 'data': student}), 200
        return jsonify({'success': False, 'error': 'Student not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

