#!/usr/bin/env python3
"""
Migration script to add marks breakdown columns
"""

import sys
import os
import sqlite3

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db

def migrate_add_marks_columns():
    """Add assignment, test, project, quiz columns to student_subjects table"""
    
    db_path = "student_dashboard.db"
    
    print("\n" + "="*70)
    print("DATABASE MIGRATION: Adding Marks Breakdown Columns")
    print("="*70)
    
    try:
        # Connect directly to SQLite
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check existing columns
        cursor.execute("PRAGMA table_info(student_subjects)")
        existing_columns = [row[1] for row in cursor.fetchall()]
        print(f"\n📋 Existing columns: {existing_columns}")
        
        # Add columns if they don't exist
        columns_to_add = [
            ('assignment', 'REAL DEFAULT 0'),
            ('test', 'REAL DEFAULT 0'),
            ('project', 'REAL DEFAULT 0'),
            ('quiz', 'REAL DEFAULT 0')
        ]
        
        for col_name, col_type in columns_to_add:
            if col_name not in existing_columns:
                try:
                    query = f"ALTER TABLE student_subjects ADD COLUMN {col_name} {col_type}"
                    cursor.execute(query)
                    print(f"✅ Added column: {col_name}")
                except sqlite3.OperationalError as e:
                    if "already exists" in str(e):
                        print(f"⚠️  Column already exists: {col_name}")
                    else:
                        raise
            else:
                print(f"⚠️  Column already exists: {col_name}")
        
        conn.commit()
        conn.close()
        
        print("\n" + "="*70)
        print("✅ MIGRATION COMPLETED SUCCESSFULLY")
        print("="*70)
        print("\nNext: Run seed_marks_data.py to populate student marks\n")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    migrate_add_marks_columns()
