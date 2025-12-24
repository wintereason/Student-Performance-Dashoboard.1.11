"""
Distribution Routes - Pass/Fail Analysis, Attendance Distribution, Risk Assessment
Provides distribution and risk analysis for student performance
"""

from flask import Blueprint, jsonify
import pandas as pd
import numpy as np
import os
from collections import Counter
from datetime import datetime

distribution_bp = Blueprint('distribution', __name__, url_prefix='/api/distribution')

def load_student_data():
    """Load student data from CSV - Limited to first 60 students with proper type conversion"""
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'student_data.csv')
    try:
        df = pd.read_csv(csv_path)
        # Convert numeric columns
        numeric_columns = ['Attendance (%)', 'Midterm_Score', 'Final_Score', 'Assignments_Avg', 
                         'Quizzes_Avg', 'Participation_Score', 'Projects_Score', 'Total_Score', 
                         'Study_Hours_per_Week', 'Stress_Level (1-10)', 'Sleep_Hours_per_Night', 'Age']
        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        # Limit to first 60 students
        return df.head(60)
    except Exception as e:
        return None

@distribution_bp.route('/pass-fail-rate', methods=['GET'])
def get_pass_fail_rate():
    """Get pass/fail distribution pie chart data"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Define pass as Grade A-D, fail as F (using Grade column)
        passed = len(df[df['Grade'] != 'F'])
        failed = len(df[df['Grade'] == 'F'])
        
        total = passed + failed
        pass_percentage = (passed / total * 100) if total > 0 else 0
        fail_percentage = (failed / total * 100) if total > 0 else 0
        
        return jsonify({
            'status': 'success',
            'pass_rate': round(pass_percentage, 2),
            'fail_rate': round(fail_percentage, 2),
            'data': {
                'passed': passed,
                'failed': failed,
                'total': total,
                'passPercentage': round(pass_percentage, 2),
                'failPercentage': round(fail_percentage, 2),
                'chartData': [
                    {'label': 'Passed (A-D)', 'value': passed, 'percentage': round(pass_percentage, 2), 'color': '#10b981'},
                    {'label': 'Failed (F)', 'value': failed, 'percentage': round(fail_percentage, 2), 'color': '#ef4444'}
                ]
            }
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@distribution_bp.route('/grade-distribution', methods=['GET'])
def get_grade_distribution():
    """Get distribution of grades (A, B, C, D, F)"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        grade_counts = df['Grade'].value_counts().to_dict()
        total = len(df)
        
        grades = ['A', 'B', 'C', 'D', 'F']
        colors = ['#059669', '#10b981', '#fbbf24', '#f97316', '#ef4444']
        grade_data = []
        
        for grade, color in zip(grades, colors):
            count = grade_counts.get(grade, 0)
            percentage = (count / total * 100) if total > 0 else 0
            grade_data.append({
                'grade': grade,
                'count': count,
                'percentage': round(percentage, 2),
                'color': color
            })
        
        return jsonify({
            'status': 'success',
            'total': total,
            'data': grade_data
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@distribution_bp.route('/attendance-distribution', methods=['GET'])
def get_attendance_distribution():
    """Get attendance distribution by ranges and simulated monthly breakdown"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Attendance ranges
        ranges = [
            {'label': '90-100%', 'min': 90, 'max': 100, 'students': 0},
            {'label': '80-90%', 'min': 80, 'max': 90, 'students': 0},
            {'label': '70-80%', 'min': 70, 'max': 80, 'students': 0},
            {'label': '60-70%', 'min': 60, 'max': 70, 'students': 0},
            {'label': '50-60%', 'min': 50, 'max': 60, 'students': 0},
            {'label': '<50%', 'min': 0, 'max': 50, 'students': 0}
        ]
        
        for _, student in df.iterrows():
            attendance = student['Attendance (%)']
            for range_item in ranges:
                if range_item['min'] <= attendance <= range_item['max']:
                    range_item['students'] += 1
                    break
        
        total = len(df)
        attendance_data = []
        
        colors_att = ['#059669', '#10b981', '#fbbf24', '#f97316', '#ef4444', '#991b1b']
        for range_item, color in zip(ranges, colors_att):
            percentage = (range_item['students'] / total * 100) if total > 0 else 0
            attendance_data.append({
                'range': range_item['label'],
                'students': range_item['students'],
                'percentage': round(percentage, 2),
                'color': color
            })
        
        # Simulate monthly attendance (Jan-Dec with realistic variation)
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        monthly_data = []
        base_attendance = df['Attendance (%)'].mean()
        
        for i, month in enumerate(months):
            # Create realistic monthly variation
            variation = (i % 3 - 1) * 2  # Vary by -2, 0, +2
            monthly_avg = max(50, min(100, base_attendance + variation))
            monthly_data.append({
                'month': month,
                'attendance': round(monthly_avg, 2)
            })
        
        return jsonify({
            'status': 'success',
            'total': total,
            'averageAttendance': round(df['Attendance (%)'].mean(), 2),
            'rangeDistribution': attendance_data,
            'monthlyTrend': monthly_data
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@distribution_bp.route('/risk-students', methods=['GET'])
def get_risk_students():
    """Get students in danger zone (at risk of failing)"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Define risk criteria:
        # Critical Risk: Grade F or (Grade D and Attendance < 70%)
        # High Risk: Grade D or (Grade C and Attendance < 60%)
        # Medium Risk: Grade C or (Grade D and Attendance >= 70%)
        
        risk_students = []
        
        for _, student in df.iterrows():
            grade = student['Grade']
            attendance = student['Attendance (%)']
            score = student['Total_Score']
            
            risk_level = None
            risk_score = 0
            
            # Critical Risk (Danger Zone - Red)
            if grade == 'F' or (grade == 'D' and attendance < 70):
                risk_level = 'Critical'
                risk_score = 100
            # High Risk (Orange)
            elif grade == 'D' or (grade == 'C' and attendance < 60):
                risk_level = 'High'
                risk_score = 75
            # Medium Risk (Yellow)
            elif grade == 'C' or (attendance < 70 and score < 50):
                risk_level = 'Medium'
                risk_score = 50
            
            if risk_level:
                risk_students.append({
                    'id': student['Student_ID'],
                    'firstName': student['First_Name'],
                    'lastName': student['Last_Name'],
                    'department': student['Department'],
                    'grade': grade,
                    'attendance': round(student['Attendance (%)'], 2),
                    'score': round(score, 2),
                    'riskLevel': risk_level,
                    'riskScore': risk_score,
                    'recommendation': get_recommendation(risk_level, grade, attendance, score)
                })
        
        # Sort by risk score (highest first)
        risk_students.sort(key=lambda x: x['riskScore'], reverse=True)
        
        # Statistics
        total_at_risk = len(risk_students)
        critical_count = len([s for s in risk_students if s['riskLevel'] == 'Critical'])
        high_count = len([s for s in risk_students if s['riskLevel'] == 'High'])
        medium_count = len([s for s in risk_students if s['riskLevel'] == 'Medium'])
        
        return jsonify({
            'status': 'success',
            'statistics': {
                'totalAtRisk': total_at_risk,
                'criticalRisk': critical_count,
                'highRisk': high_count,
                'mediumRisk': medium_count,
                'riskPercentage': round(total_at_risk / len(df) * 100, 2)
            },
            'data': risk_students[:50]  # Return top 50 at-risk students
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_recommendation(risk_level, grade, attendance, score):
    """Generate recommendation based on risk level"""
    recommendations = {
        'Critical': [
            'Immediate intervention required',
            'Increase tutoring hours',
            'Monitor attendance closely',
            'Schedule parent conference'
        ],
        'High': [
            'Provide additional support',
            'Encourage attendance',
            'Review study habits',
            'Consider peer tutoring'
        ],
        'Medium': [
            'Monitor progress closely',
            'Maintain attendance',
            'Continue current support',
            'Encourage study groups'
        ]
    }
    
    return recommendations.get(risk_level, [])

@distribution_bp.route('/statistics', methods=['GET'])
def get_distribution_statistics():
    """Get overall distribution statistics"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Calculate at-risk students
        at_risk = 0
        for _, student in df.iterrows():
            grade = student['Grade']
            attendance = student['Attendance (%)']
            score = student['Total_Score']
            
            # Critical Risk: Grade F or (Grade D and Attendance < 70%)
            if grade == 'F' or (grade == 'D' and attendance < 70):
                at_risk += 1
            # High Risk: Grade D or (Grade C and Attendance < 60%)
            elif grade == 'D' or (grade == 'C' and attendance < 60):
                at_risk += 1
            # Medium Risk: Grade C or (Grade D and Attendance >= 70%)
            elif grade == 'C' or (attendance < 70 and score < 50):
                at_risk += 1
        
        # Build response with safe JSON serialization
        stats_data = {
            'status': 'success',
            'data': {
                'total_students': int(len(df)),
                'totalStudents': int(len(df)),
                'average_score': float(round(df['Total_Score'].mean(), 2)),
                'averageScore': float(round(df['Total_Score'].mean(), 2)),
                'average_attendance': float(round(df['Attendance (%)'].mean(), 2)),
                'averageAttendance': float(round(df['Attendance (%)'].mean(), 2)),
                'average_participation': float(round(df['Participation_Score'].mean(), 2)),
                'averageParticipation': float(round(df['Participation_Score'].mean(), 2)),
                'median_score': float(round(df['Total_Score'].median(), 2)),
                'medianScore': float(round(df['Total_Score'].median(), 2)),
                'median_attendance': float(round(df['Attendance (%)'].median(), 2)),
                'medianAttendance': float(round(df['Attendance (%)'].median(), 2)),
                'score_std_dev': float(round(df['Total_Score'].std(), 2)),
                'scoreStdDev': float(round(df['Total_Score'].std(), 2)),
                'attendance_std_dev': float(round(df['Attendance (%)'].std(), 2)),
                'attendanceStdDev': float(round(df['Attendance (%)'].std(), 2)),
                'min_score': float(round(df['Total_Score'].min(), 2)),
                'minScore': float(round(df['Total_Score'].min(), 2)),
                'max_score': float(round(df['Total_Score'].max(), 2)),
                'maxScore': float(round(df['Total_Score'].max(), 2)),
                'min_attendance': float(round(df['Attendance (%)'].min(), 2)),
                'minAttendance': float(round(df['Attendance (%)'].min(), 2)),
                'max_attendance': float(round(df['Attendance (%)'].max(), 2)),
                'maxAttendance': float(round(df['Attendance (%)'].max(), 2)),
                'at_risk_count': int(at_risk)
            }
        }
        
        # Clean NaN and Inf values
        for key, value in stats_data['data'].items():
            if isinstance(value, float) and (np.isnan(value) or np.isinf(value)):
                stats_data['data'][key] = None
        
        return jsonify(stats_data), 200
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
