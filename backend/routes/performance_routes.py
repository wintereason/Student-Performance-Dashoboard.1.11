"""
Performance Routes - Department Analysis, Comparative Performance, Score Analysis
Provides comprehensive performance metrics and comparisons
"""

from flask import Blueprint, jsonify
import pandas as pd
import numpy as np
import os

performance_bp = Blueprint('performance', __name__, url_prefix='/api/performance')

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

@performance_bp.route('/department-analysis', methods=['GET'])
def get_department_analysis():
    """Get comprehensive analysis by department"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Filter out bad rows first
        df = df[df['Department'].notna()]
        df = df[df['Department'] != '-']
        df = df[df['Department'] != '']
        
        dept_analysis = []
        
        for dept in df['Department'].unique():
            dept_data = df[df['Department'] == dept]
            
            if len(dept_data) == 0:
                continue
            
            passed = len(dept_data[dept_data['Grade'] != 'F'])
            total = len(dept_data)
            pass_rate = (passed / total * 100) if total > 0 else 0
            
            dept_analysis.append({
                'department': str(dept),
                'studentCount': int(total),
                'averageScore': float(round(dept_data['Total_Score'].mean(), 2)),
                'averageAttendance': float(round(dept_data['Attendance (%)'].mean(), 2)),
                'averageParticipation': float(round(dept_data['Participation_Score'].mean(), 2)),
                'passRate': float(round(pass_rate, 2)),
                'failCount': int(total - passed),
                'averageGrade': str(dept_data['Grade'].mode()[0]) if len(dept_data['Grade'].mode()) > 0 else 'N/A',
                'topScore': float(round(dept_data['Total_Score'].max(), 2)),
                'bottomScore': float(round(dept_data['Total_Score'].min(), 2))
            })
        
        # Sort by averageScore descending
        dept_analysis.sort(key=lambda x: x['averageScore'], reverse=True)
        
        return jsonify({
            'status': 'success',
            'departmentCount': len(dept_analysis),
            'data': dept_analysis
        }), 200
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@performance_bp.route('/score-comparison', methods=['GET'])
def get_score_comparison():
    """Get score comparison across different metrics"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Calculate averages for different score types
        def safe_round(value):
            """Safely round a value, handling NaN and Inf"""
            if isinstance(value, float) and (np.isnan(value) or np.isinf(value)):
                return None
            return float(round(value, 2))
        
        comparison = {
            'totalScore': {
                'average': safe_round(df['Total_Score'].mean()),
                'median': safe_round(df['Total_Score'].median()),
                'stdDev': safe_round(df['Total_Score'].std())
            },
            'midtermScore': {
                'average': safe_round(df['Midterm_Score'].mean()),
                'median': safe_round(df['Midterm_Score'].median()),
                'stdDev': safe_round(df['Midterm_Score'].std())
            },
            'finalScore': {
                'average': safe_round(df['Final_Score'].mean()),
                'median': safe_round(df['Final_Score'].median()),
                'stdDev': safe_round(df['Final_Score'].std())
            },
            'assignmentsAvg': {
                'average': safe_round(df['Assignments_Avg'].mean()),
                'median': safe_round(df['Assignments_Avg'].median()),
                'stdDev': safe_round(df['Assignments_Avg'].std())
            },
            'quizzesAvg': {
                'average': safe_round(df['Quizzes_Avg'].mean()),
                'median': safe_round(df['Quizzes_Avg'].median()),
                'stdDev': safe_round(df['Quizzes_Avg'].std())
            },
            'participationScore': {
                'average': safe_round(df['Participation_Score'].mean()),
                'median': safe_round(df['Participation_Score'].median()),
                'stdDev': safe_round(df['Participation_Score'].std())
            },
            'projectScore': {
                'average': safe_round(df['Projects_Score'].mean()),
                'median': safe_round(df['Projects_Score'].median()),
                'stdDev': safe_round(df['Projects_Score'].std())
            }
        }
        
        return jsonify({
            'status': 'success',
            'data': comparison
        }), 200
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@performance_bp.route('/score-distribution-ranges', methods=['GET'])
def get_score_distribution_ranges():
    """Get distribution of scores in different ranges"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        ranges = [
            {'label': '90-100', 'min': 90, 'max': 100, 'count': 0},
            {'label': '80-90', 'min': 80, 'max': 90, 'count': 0},
            {'label': '70-80', 'min': 70, 'max': 80, 'count': 0},
            {'label': '60-70', 'min': 60, 'max': 70, 'count': 0},
            {'label': '50-60', 'min': 50, 'max': 60, 'count': 0},
            {'label': 'Below 50', 'min': 0, 'max': 50, 'count': 0}
        ]
        
        total = len(df)
        
        for _, student in df.iterrows():
            score = student['Total_Score']
            for range_item in ranges:
                if range_item['min'] <= score <= range_item['max']:
                    range_item['count'] += 1
                    break
        
        colors = ['#059669', '#10b981', '#fbbf24', '#f97316', '#ef4444', '#991b1b']
        distribution_data = []
        
        for range_item, color in zip(ranges, colors):
            percentage = (range_item['count'] / total * 100) if total > 0 else 0
            distribution_data.append({
                'range': range_item['label'],
                'count': range_item['count'],
                'percentage': round(percentage, 2),
                'color': color
            })
        
        return jsonify({
            'status': 'success',
            'totalStudents': total,
            'data': distribution_data
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@performance_bp.route('/department-comparison', methods=['GET'])
def get_department_comparison():
    """Get detailed comparison data by department"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        departments = df['Department'].unique()
        comparison_data = []
        
        for dept in departments:
            dept_data = df[df['Department'] == dept]
            
            # Calculate percentages for grades
            total = len(dept_data)
            grade_counts = dept_data['Grade'].value_counts().to_dict()
            
            comparison_data.append({
                'department': dept,
                'metrics': {
                    'studentCount': total,
                    'averageScore': round(dept_data['Total_Score'].mean(), 2),
                    'averageAttendance': round(dept_data['Attendance (%)'].mean(), 2),
                    'averageMidterm': round(dept_data['Midterm_Score'].mean(), 2),
                    'averageFinal': round(dept_data['Final_Score'].mean(), 2),
                    'averageAssignment': round(dept_data['Assignments_Avg'].mean(), 2),
                    'averageQuiz': round(dept_data['Quizzes_Avg'].mean(), 2),
                    'averageParticipation': round(dept_data['Participation_Score'].mean(), 2),
                    'averageProject': round(dept_data['Projects_Score'].mean(), 2)
                },
                'gradeDistribution': {
                    'A': {'count': grade_counts.get('A', 0), 'percentage': round(grade_counts.get('A', 0) / total * 100, 2)},
                    'B': {'count': grade_counts.get('B', 0), 'percentage': round(grade_counts.get('B', 0) / total * 100, 2)},
                    'C': {'count': grade_counts.get('C', 0), 'percentage': round(grade_counts.get('C', 0) / total * 100, 2)},
                    'D': {'count': grade_counts.get('D', 0), 'percentage': round(grade_counts.get('D', 0) / total * 100, 2)},
                    'F': {'count': grade_counts.get('F', 0), 'percentage': round(grade_counts.get('F', 0) / total * 100, 2)}
                }
            })
        
        # Sort by average score
        comparison_data.sort(key=lambda x: x['metrics']['averageScore'], reverse=True)
        
        return jsonify({
            'status': 'success',
            'departmentCount': len(comparison_data),
            'data': comparison_data
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@performance_bp.route('/performance-metrics', methods=['GET'])
def get_performance_metrics():
    """Get comprehensive performance metrics"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Calculate correlations and insights
        metrics = {
            'attendance': {
                'average': round(df['Attendance (%)'].mean(), 2),
                'range': {
                    'min': round(df['Attendance (%)'].min(), 2),
                    'max': round(df['Attendance (%)'].max(), 2)
                }
            },
            'academicPerformance': {
                'average': round(df['Total_Score'].mean(), 2),
                'range': {
                    'min': round(df['Total_Score'].min(), 2),
                    'max': round(df['Total_Score'].max(), 2)
                }
            },
            'participation': {
                'average': round(df['Participation_Score'].mean(), 2),
                'range': {
                    'min': round(df['Participation_Score'].min(), 2),
                    'max': round(df['Participation_Score'].max(), 2)
                }
            },
            'projectWork': {
                'average': round(df['Projects_Score'].mean(), 2),
                'range': {
                    'min': round(df['Projects_Score'].min(), 2),
                    'max': round(df['Projects_Score'].max(), 2)
                }
            },
            'extracurricular': {
                'participatingStudents': len(df[df['Extracurricular_Activities'] == 'Yes']),
                'percentage': round(len(df[df['Extracurricular_Activities'] == 'Yes']) / len(df) * 100, 2)
            },
            'internetAccess': {
                'withAccess': len(df[df['Internet_Access_at_Home'] == 'Yes']),
                'percentage': round(len(df[df['Internet_Access_at_Home'] == 'Yes']) / len(df) * 100, 2)
            },
            'studyHours': {
                'average': round(df['Study_Hours_per_Week'].mean(), 2),
                'range': {
                    'min': round(df['Study_Hours_per_Week'].min(), 2),
                    'max': round(df['Study_Hours_per_Week'].max(), 2)
                }
            },
            'gradeBreakdown': {
                'A': len(df[df['Grade'] == 'A']),
                'B': len(df[df['Grade'] == 'B']),
                'C': len(df[df['Grade'] == 'C']),
                'D': len(df[df['Grade'] == 'D']),
                'F': len(df[df['Grade'] == 'F'])
            }
        }
        
        return jsonify({
            'status': 'success',
            'data': metrics
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
