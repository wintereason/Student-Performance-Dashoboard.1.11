from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

def create_app():
    """Create and configure the Flask app"""
    app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
    
    app.config['SECRET_KEY'] = 'dev-secret-key'
    app.config['DEBUG'] = True
    
    CORS(app)
    
    # Initialize database
    from database import init_db
    init_db(app)
    
    # Register routes
    from routes.students_routes import bp as students_bp
    from routes.subjects_routes import bp as subjects_bp
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
    
    # Serve frontend - must be last
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        """Serve frontend files, fallback to index.html for SPA routing"""
        # Don't intercept API routes
        if path.startswith('api'):
            return jsonify({'error': 'API route not found'}), 404
        
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        elif os.path.exists(os.path.join(app.static_folder, 'index.html')):
            return send_from_directory(app.static_folder, 'index.html')
        else:
            return jsonify({'error': 'Frontend not built'}), 404
    
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
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("=" * 60)
    print("Student Performance Dashboard API")
    print("=" * 60)
    print("Backend API: http://127.0.0.1:5000")
    print("Frontend: http://127.0.0.1:5000")
    print("=" * 60)
    app.run(host='127.0.0.1', port=5000, debug=True)

