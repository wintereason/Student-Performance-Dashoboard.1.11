#!/usr/bin/env python
"""
Development server startup script for Student Performance Dashboard API

Usage:
    python manage.py                        # Run development server
    python app.py                          # Alternative: direct run
"""

import os
import sys
from app import create_app

def main():
    """Main entry point for development server"""
    env = os.getenv('FLASK_ENV', 'development')
    app = create_app(env)
    
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║   Student Performance Dashboard API - Development Server     ║
╚══════════════════════════════════════════════════════════════╝

Environment: {env}
Host: 0.0.0.0
Port: 5000
Debug: {env == 'development'}

API Documentation: http://localhost:5000/api
Health Check: http://localhost:5000/api/health

Endpoints:
  Students: http://localhost:5000/api/students/
  Analytics: http://localhost:5000/api/analytics/

Press CTRL+C to stop the server.
    """)
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=(env == 'development')
    )

if __name__ == '__main__':
    main()
