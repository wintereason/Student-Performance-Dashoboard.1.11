from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

app = Flask(__name__)
CORS(app)

# Initialize database
from backend.database import init_db
init_db(app)

# Register routes
from backend.routes.students_routes import bp as students_bp
from backend.routes.subjects_routes import bp as subjects_bp

app.register_blueprint(students_bp, url_prefix="/api/students")
app.register_blueprint(subjects_bp, url_prefix="/api/subjects")

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

# Root endpoint
@app.route('/api', methods=['GET'])
def api_root():
    return jsonify({
        'name': 'Student Performance Dashboard API',
        'version': '1.0.0'
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    import traceback
    print("Error occurred:")
    print(traceback.format_exc())
    return jsonify({'error': 'Server error', 'details': str(error)}), 500
