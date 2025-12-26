#!/usr/bin/env python
"""
Test the API endpoints
"""

import requests
import json
import time

BASE_URL = 'http://127.0.0.1:5000/api'

def test_api():
    print("\n" + "="*60)
    print("TESTING API ENDPOINTS")
    print("="*60)
    
    # Test 1: Health check
    print("\n[TEST 1] Health Check")
    try:
        response = requests.get(f'{BASE_URL}/health')
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    # Test 2: Get all students
    print("\n[TEST 2] Get All Students")
    try:
        response = requests.get(f'{BASE_URL}/students')
        print(f"  Status: {response.status_code}")
        data = response.json()
        if data.get('success'):
            print(f"  Students found: {len(data.get('data', []))}")
            for student in data.get('data', [])[:2]:
                print(f"    - {student['name']} ({student['department']})")
        else:
            print(f"  Error: {data}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    # Test 3: Get subjects management
    print("\n[TEST 3] Get All Subjects (Management)")
    try:
        response = requests.get(f'{BASE_URL}/subjects/management')
        print(f"  Status: {response.status_code}")
        data = response.json()
        if data.get('success'):
            print(f"  Subjects found: {len(data.get('data', []))}")
        else:
            print(f"  Error: {data}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    # Test 4: Get subjects for first student
    print("\n[TEST 4] Get Subjects for Student #1")
    try:
        response = requests.get(f'{BASE_URL}/subjects/student/1/subjects')
        print(f"  Status: {response.status_code}")
        data = response.json()
        if data.get('success'):
            print(f"  Subject scores found: {len(data.get('data', []))}")
            for score in data.get('data', [])[:3]:
                print(f"    - {score['subject_name']}: {score['marks']}/{score['maxMarks']} ({score['percentage']:.1f}%)")
        else:
            print(f"  Error: {data}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    # Test 5: Add a new subject score (POST)
    print("\n[TEST 5] Add Subject Score (POST)")
    try:
        payload = {
            'name': 'Computer Networks',
            'marks': 95,
            'maxMarks': 100
        }
        response = requests.post(
            f'{BASE_URL}/subjects/student/1/subjects',
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        print(f"  Status: {response.status_code}")
        data = response.json()
        print(f"  Response: {json.dumps(data, indent=2)}")
        if data.get('success'):
            print(f"  ✓ Subject added successfully!")
        else:
            print(f"  ❌ Error: {data.get('error', data.get('message'))}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    print("\n" + "="*60)
    print("✓ API TESTS COMPLETE")
    print("="*60 + "\n")

if __name__ == '__main__':
    # Wait a moment for server to be ready
    time.sleep(2)
    test_api()
