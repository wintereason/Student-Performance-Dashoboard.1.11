from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

app = Flask(__name__)
CORS(app)

# Configure Flask app for database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///student_dashboard.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
try:
    from backend.database import db, init_db
    init_db(app)
except Exception as e:
    print(f"Database initialization error: {e}")
    import traceback
    traceback.print_exc()

# Register routes
try:
    from backend.routes.students_routes import bp as students_bp
    from backend.routes.subjects_routes import bp as subjects_bp

    app.register_blueprint(students_bp, url_prefix="/api/students")
    app.register_blueprint(subjects_bp, url_prefix="/api/subjects")
except Exception as e:
    print(f"Route registration error: {e}")
    import traceback
    traceback.print_exc()

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'API is running'}), 200

# Root endpoint
@app.route('/api', methods=['GET'])
def api_root():
    return jsonify({
        'name': 'Student Performance Dashboard API',
        'version': '1.0.0',
        'endpoints': {
            '/api/health': 'Health check',
            '/api/students': 'Student management',
            '/api/subjects': 'Subject management'
        }
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'message': str(error)}), 404

@app.errorhandler(500)
def server_error(error):
    import traceback
    print("Error occurred:")
    print(traceback.format_exc())
    return jsonify({'error': 'Server error', 'details': str(error)}), 500
