"""
Database initialization and configuration
"""

from flask_sqlalchemy import SQLAlchemy
import os

# Initialize SQLAlchemy
db = SQLAlchemy()

def init_db(app):
    """Initialize database with Flask app"""
    
    # Check for DATABASE_URL (PostgreSQL in production)
    database_url = os.getenv('DATABASE_URL')
    
    if database_url:
        # Production: Use PostgreSQL from environment variable
        # Fix PostgreSQL URL format if needed
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    else:
        # Development: Use SQLite
        basedir = os.path.abspath(os.path.dirname(__file__))
        db_path = os.path.join(basedir, 'student_dashboard.db')
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        db.create_all()
        if database_url:
            print(f"✓ Database initialized with PostgreSQL: {database_url.split('@')[1]}")
        else:
            print(f"✓ Database initialized at: {app.config['SQLALCHEMY_DATABASE_URI']}")
    
    return db

def reset_db(app):
    """Reset database - WARNING: This will delete all data"""
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("✓ Database reset successfully")
