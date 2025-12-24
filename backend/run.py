#!/usr/bin/env python
"""
Simple runner script for the Flask app
Fixes common startup issues
"""

import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import create_app
    
    if __name__ == '__main__':
        print("=" * 60)
        print("Starting Student Performance Dashboard Backend")
        print("=" * 60)
        
        app = create_app()
        
        print(f"✓ Flask app created successfully")
        print(f"✓ Starting server on http://127.0.0.1:5000")
        print(f"✓ Press Ctrl+C to stop\n")
        
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=False,
            use_reloader=False
        )
        
except Exception as e:
    print(f"✗ ERROR: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
