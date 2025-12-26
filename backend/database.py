"""
Database initialization and configuration
"""

from flask_sqlalchemy import SQLAlchemy
import os

# Initialize SQLAlchemy
db = SQLAlchemy()

def init_db(app):
    """Initialize database with Flask app"""
    
    # Configure SQLite database
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, 'student_dashboard.db')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        db.create_all()
        print(f"✓ Database initialized at: {db_path}")
    
    return db

def reset_db(app):
    """Reset database - WARNING: This will delete all data"""
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("✓ Database reset successfully")
