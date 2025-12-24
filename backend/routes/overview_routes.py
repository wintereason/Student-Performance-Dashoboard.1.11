"""
Overview Routes - Top Performers, Top Attendance, Top Activities
Provides comprehensive overview data for dashboard analytics
"""

from flask import Blueprint, jsonify
import pandas as pd
import os
from datetime import datetime
import numpy as np
import json

overview_bp = Blueprint('overview', __name__, url_prefix='/api/overview')

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

def safe_json_response(data):
    """Safely convert data to JSON, handling NaN and Inf values"""
    try:
        # Convert NaN and Inf to None
        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, float):
                    if np.isnan(value) or np.isinf(value):
                        data[key] = None
        return data
    except:
        return data

def clean_dataframe_dict(df_dict):
    """Clean dataframe dict for JSON serialization"""
    if isinstance(df_dict, list):
        clean_data = []
        for item in df_dict:
            clean_item = {}
            for key, value in item.items():
                if isinstance(value, np.integer):
                    clean_item[key] = int(value)
                elif isinstance(value, np.floating):
                    if np.isnan(value) or np.isinf(value):
                        clean_item[key] = None
                    else:
                        clean_item[key] = float(value)
                else:
                    clean_item[key] = value
            clean_data.append(clean_item)
        return clean_data
    return df_dict

@overview_bp.route('/top-scorers', methods=['GET'])
def get_top_scorers():
    """Get top 10 students by total score"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Sort by Total_Score and get top 10
        top_scorers = df.nlargest(10, 'Total_Score')[
            ['Student_ID', 'First_Name', 'Last_Name', 'Department', 'Total_Score', 'Grade', 'Attendance (%)', 'Final_Score']
        ].reset_index(drop=True)
        
        # Add ranking
        top_scorers = top_scorers.rename(columns={
            'Student_ID': 'id',
            'First_Name': 'firstName',
            'Last_Name': 'lastName',
            'Department': 'department',
            'Total_Score': 'score',
            'Grade': 'grade',
            'Attendance (%)': 'attendance',
            'Final_Score': 'finalScore'
        })
        
        # Add rank column
        top_scorers.insert(0, 'rank', range(1, len(top_scorers) + 1))
        
        # Calculate percentage (score out of 100)
        top_scorers['scorePercentage'] = (top_scorers['score'] / 100 * 100).round(2)
        
        # Convert to dict and handle NaN values
        data_dict = top_scorers.to_dict(orient='records')
        clean_data = clean_dataframe_dict(data_dict)
        
        return jsonify({
            'status': 'success',
            'count': len(clean_data),
            'data': clean_data
        }), 200
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@overview_bp.route('/top-attendance', methods=['GET'])
def get_top_attendance():
    """Get top 10 students by attendance rate"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Sort by Attendance and get top 10
        top_attendance = df.nlargest(10, 'Attendance (%)')[
            ['Student_ID', 'First_Name', 'Last_Name', 'Department', 'Attendance (%)', 'Total_Score', 'Grade', 'Study_Hours_per_Week']
        ].reset_index(drop=True)
        
        # Rename columns
        top_attendance = top_attendance.rename(columns={
            'Student_ID': 'id',
            'First_Name': 'firstName',
            'Last_Name': 'lastName',
            'Department': 'department',
            'Attendance (%)': 'attendance',
            'Total_Score': 'score',
            'Grade': 'grade',
            'Study_Hours_per_Week': 'studyHours'
        })
        
        # Add rank column
        top_attendance.insert(0, 'rank', range(1, len(top_attendance) + 1))
        
        return jsonify({
            'status': 'success',
            'count': len(top_attendance),
            'data': top_attendance.to_dict(orient='records')
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@overview_bp.route('/top-participants', methods=['GET'])
def get_top_participants():
    """Get top 10 students by extracurricular activities and participation"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Create activity score based on participation and extracurricular
        df['activity_score'] = df['Participation_Score'] + df['Projects_Score']
        
        # Get students with extracurricular activities first, sorted by activity score
        active_students = df[df['Extracurricular_Activities'] == 'Yes'].copy()
        top_participants = active_students.nlargest(10, 'activity_score')[
            ['Student_ID', 'First_Name', 'Last_Name', 'Department', 'Participation_Score', 'Projects_Score', 
             'Extracurricular_Activities', 'Total_Score', 'Grade']
        ].reset_index(drop=True)
        
        # Rename columns
        top_participants = top_participants.rename(columns={
            'Student_ID': 'id',
            'First_Name': 'firstName',
            'Last_Name': 'lastName',
            'Department': 'department',
            'Participation_Score': 'participationScore',
            'Projects_Score': 'projectScore',
            'Extracurricular_Activities': 'extracurricular',
            'Total_Score': 'score',
            'Grade': 'grade'
        })
        
        # Add combined activity score
        top_participants['activityScore'] = (top_participants['participationScore'] + top_participants['projectScore']).round(2)
        
        # Add rank column
        top_participants.insert(0, 'rank', range(1, len(top_participants) + 1))
        
        # Add "Prize Status" (simulated based on activity score)
        top_participants['prizeStatus'] = top_participants['activityScore'].apply(
            lambda x: '🏆 Gold' if x >= 180 else ('🥈 Silver' if x >= 160 else '🥉 Bronze')
        )
        
        return jsonify({
            'status': 'success',
            'count': len(top_participants),
            'data': top_participants.to_dict(orient='records')
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@overview_bp.route('/top-overall', methods=['GET'])
def get_top_overall():
    """Get top 10 overall students (combined metrics)"""
    try:
        df = load_student_data()
        if df is None:
            return jsonify({'error': 'Data not found'}), 404
        
        # Calculate overall score: 40% Total_Score, 30% Attendance, 20% Participation, 10% Projects
        df['overall_score'] = (
            (df['Total_Score'] / 100 * 40) +
            (df['Attendance (%)'] / 100 * 30) +
            (df['Participation_Score'] / 100 * 20) +
            (df['Projects_Score'] / 100 * 10)
        )
        
        top_overall = df.nlargest(10, 'overall_score')[
            ['Student_ID', 'First_Name', 'Last_Name', 'Department', 'Total_Score', 
             'Attendance (%)', 'Participation_Score', 'Grade', 'overall_score']
        ].reset_index(drop=True)
        
        # Rename columns
        top_overall = top_overall.rename(columns={
            'Student_ID': 'id',
            'First_Name': 'firstName',
            'Last_Name': 'lastName',
            'Department': 'department',
            'Total_Score': 'academicScore',
            'Attendance (%)': 'attendanceRate',
            'Participation_Score': 'participationScore',
            'Grade': 'grade',
            'overall_score': 'overallScore'
        })
        
        # Add rank and round scores
        top_overall.insert(0, 'rank', range(1, len(top_overall) + 1))
        top_overall['overallScore'] = top_overall['overallScore'].round(2)
        
        return jsonify({
            'status': 'success',
            'count': len(top_overall),
            'data': top_overall.to_dict(orient='records')
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
