"""
WSGI entry point for production server (Gunicorn)
Run with: gunicorn -c gunicorn_config.py wsgi:app
"""
import os
from app import create_app

# Create app with production config
env = os.getenv('FLASK_ENV', 'production')
app = create_app(env)

if __name__ == '__main__':
    app.run()
