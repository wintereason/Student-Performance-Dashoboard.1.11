"""
Student prediction and detail routes (legacy/placeholder routes)
These routes provide individual student details and predictions
"""
from flask import Blueprint, jsonify, request, current_app
import csv
import os

bp = Blueprint('student', __name__)

def get_csv_data():
    """Read CSV data from the rich Students Performance Dataset"""
    csv_path = os.path.join(os.path.dirname(__file__), '../data/student_data.csv')
    data = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                data.append(row)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        current_app.logger.error(f"Error reading CSV: {e}")
    return data

@bp.route('/summary', methods=['GET'])
def summary():
    """Get overall student summary with list of all students"""
    try:
        data = get_csv_data()
        
        if not data:
            return jsonify({'data': [], 'message': 'No student data found'})
        
        # Process and return all students
        students = []
        for row in data:
            try:
                student = {
                    'student_id': row.get('Student_ID', ''),
                    'name': f"{row.get('First_Name', '')} {row.get('Last_Name', '')}".strip(),
                    'department': row.get('Department', ''),
                    'attendance': float(row.get('Attendance (%)', 0)),
                    'total_score': float(row.get('Total_Score', 0)),
                    'final_score': float(row.get('Final_Score', 0)),
                    'grade': row.get('Grade', 'F'),
                    'email': row.get('Email', ''),
                    'age': row.get('Age', ''),
                    'midterm': float(row.get('Midterm_Score', 0)) if row.get('Midterm_Score') else 0,
                    'assignments': float(row.get('Assignments_Avg', 0)) if row.get('Assignments_Avg') else 0
                }
                students.append(student)
            except (ValueError, TypeError) as e:
                continue
        
        return jsonify({
            'data': students,
            'total': len(students),
            'message': 'Student list retrieved successfully'
        }), 200
        
    except Exception as e:
        print(f"Error in summary: {e}")
        current_app.logger.error(f"Error in summary: {e}")
        return jsonify({'error': str(e), 'data': []}), 500
            'avg_exam_marks': round(avg_exam, 2),
            'total_students': len(data),
            'risk_rate': round(risk_rate, 2)
        })
    except Exception as e:
        current_app.logger.error(f"Error in summary: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/<student_id>', methods=['GET'])
def get_student(student_id):
    """Get specific student details"""
    try:
        data = get_csv_data()
        student = next((s for s in data if s.get('Student_ID') == student_id), None)
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        return jsonify({
            'student_id': student.get('Student_ID'),
            'name': f"{student.get('First_Name')} {student.get('Last_Name')}",
            'email': student.get('Email'),
            'department': student.get('Department'),
            'grade': student.get('Grade'),
            'attendance_pct': float(student.get('Attendance (%)', 0)),
            'final_score': float(student.get('Final_Score', 0)),
            'midterm_score': float(student.get('Midterm_Score', 0)),
            'total_score': float(student.get('Total_Score', 0)),
            'study_hours_per_week': float(student.get('Study_Hours_per_Week', 0))
        })
    except Exception as e:
        current_app.logger.error(f"Error fetching student: {e}")
        return jsonify({'error': str(e)}), 500

@bp.route('/predict', methods=['POST'])
def predict():
    """Predict student exam marks based on input metrics"""
    try:
        payload = request.json or {}
        
        # Extract input metrics
        attendance = float(payload.get('attendance_pct', 70))
        midterm = float(payload.get('midterm_score', 60))
        study_hours = float(payload.get('study_hours_per_week', 8))
        assignments = float(payload.get('assignments_avg', 70))
        participation = float(payload.get('participation_score', 60))
        
        # Simple weighted prediction model
        predicted_score = (
            0.25 * attendance +
            0.30 * midterm +
            0.15 * study_hours +
            0.20 * assignments +
            0.10 * participation
        )
        
        # Clamp to 0-100
        predicted_score = max(0, min(100, predicted_score))
        
        # Determine grade
        if predicted_score >= 90:
            grade = 'A'
        elif predicted_score >= 80:
            grade = 'B'
        elif predicted_score >= 70:
            grade = 'C'
        elif predicted_score >= 60:
            grade = 'D'
        else:
            grade = 'F'
        
        # Calculate confidence
        confidence = min(85, 50 + (abs(midterm - 70) / 2) + (study_hours / 2))
        
        return jsonify({
            'predicted_exam_marks': round(predicted_score, 2),
            'predicted_grade': grade,
            'confidence': round(confidence, 1)
        })
    except (ValueError, KeyError) as e:
        return jsonify({'error': 'Invalid input parameters', 'details': str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error in prediction: {e}")
        return jsonify({'error': str(e)}), 500
