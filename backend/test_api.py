#!/usr/bin/env python
"""Test the Subject API endpoint"""

from app import create_app
from database import db
from models.database_models import Subject

app = create_app()

with app.app_context():
    print("=" * 60)
    print("Testing API endpoints")
    print("=" * 60)
    
    # Check database
    subjects = Subject.query.all()
    print(f"\nSubjects in database: {len(subjects)}")
    for subject in subjects:
        print(f"  - {subject.name} (ID: {subject.id})")
    
    # Test the API endpoint using client
    with app.test_client() as client:
        print("\n[TEST] GET /api/subjects/management")
        response = client.get('/api/subjects/management')
        print(f"Status: {response.status_code}")
        print(f"Response: {response.get_json()}")
        
        print("\n[TEST] POST /api/subjects/management")
        test_data = {"name": "Test Subject", "description": "Test Description"}
        response = client.post('/api/subjects/management', json=test_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.get_json()}")

print("\n" + "=" * 60)
print("Test completed")
print("=" * 60)
