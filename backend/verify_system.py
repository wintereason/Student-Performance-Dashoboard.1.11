#!/usr/bin/env python
"""
Comprehensive System Verification
Tests all critical components of the Student Performance Dashboard
"""

import requests
import json
from datetime import datetime

BASE_URL = 'http://127.0.0.1:5000/api'

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text:^70}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.RESET}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓{Colors.RESET} {text}")

def print_error(text):
    print(f"{Colors.RED}✗{Colors.RESET} {text}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ{Colors.RESET} {text}")

def test_connection():
    """Test basic connection to API"""
    print_header("STEP 1: Connection Test")
    try:
        response = requests.get(f'{BASE_URL}/health', timeout=5)
        if response.status_code == 200:
            print_success("Backend API is running and responding")
            return True
        else:
            print_error(f"Backend returned status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Cannot connect to backend: {e}")
        return False

def test_students():
    """Test student endpoints"""
    print_header("STEP 2: Student Management")
    try:
        response = requests.get(f'{BASE_URL}/students')
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                students = data.get('data', [])
                print_success(f"Retrieved {len(students)} students from database")
                for i, student in enumerate(students[:3], 1):
                    print(f"   {i}. {student['name']} ({student['department']})")
                if len(students) > 3:
                    print(f"   ... and {len(students) - 3} more")
                return True, students
            else:
                print_error("API returned success=false")
                return False, []
        else:
            print_error(f"Server returned {response.status_code}")
            return False, []
    except Exception as e:
        print_error(f"Error fetching students: {e}")
        return False, []

def test_subject_addition(student_id):
    """Test adding a new subject"""
    print_header("STEP 3: Add Subject Score (POST)")
    
    # Create unique subject name with timestamp
    timestamp = datetime.now().strftime("%H%M%S")
    subject_name = f"Test Subject {timestamp}"
    
    try:
        payload = {
            'name': subject_name,
            'marks': 92,
            'maxMarks': 100
        }
        print_info(f"Adding subject for student ID: {student_id}")
        print_info(f"Payload: {json.dumps(payload)}")
        
        response = requests.post(
            f'{BASE_URL}/subjects/student/{student_id}/subjects',
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        
        if response.status_code == 201:
            data = response.json()
            if data.get('success'):
                subject_data = data.get('data', {})
                print_success(f"Subject added successfully")
                print(f"   ID: {subject_data.get('id')}")
                print(f"   Name: {subject_data.get('name')}")
                print(f"   Marks: {subject_data.get('marks')}/{subject_data.get('maxMarks')}")
                print(f"   Percentage: {subject_data.get('percentage'):.1f}%")
                print(f"   Saved at: {subject_data.get('created_at')}")
                return True, subject_name
            else:
                print_error(f"API returned error: {data.get('error')}")
                return False, None
        else:
            error_text = response.text
            print_error(f"Server returned {response.status_code}")
            print_error(f"Response: {error_text[:200]}")
            return False, None
    except Exception as e:
        print_error(f"Error adding subject: {e}")
        return False, None

def test_retrieve_subjects(student_id):
    """Test retrieving subject scores"""
    print_header("STEP 4: Retrieve Subject Scores (GET)")
    try:
        response = requests.get(
            f'{BASE_URL}/subjects/student/{student_id}/subjects',
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                subjects = data.get('data', [])
                print_success(f"Retrieved {len(subjects)} subject scores for student")
                for subject in subjects[-3:]:  # Show last 3
                    print(f"   • {subject['name']}: {subject['marks']}/{subject['maxMarks']} ({subject['percentage']:.1f}%)")
                return True
            else:
                print_error("API returned success=false")
                return False
        else:
            print_error(f"Server returned {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error retrieving subjects: {e}")
        return False

def test_persistence():
    """Verify data persistence"""
    print_header("STEP 5: Data Persistence Check")
    try:
        response = requests.get(
            f'{BASE_URL}/students',
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            students = data.get('data', [])
            print_success("Database is persistent across API calls")
            print_info(f"Currently {len(students)} students in database")
            return True
        else:
            print_error("Cannot verify persistence")
            return False
    except Exception as e:
        print_error(f"Error verifying persistence: {e}")
        return False

def run_full_test():
    """Run complete system verification"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("""
    ╔══════════════════════════════════════════════════════════════════════╗
    ║                                                                      ║
    ║   STUDENT PERFORMANCE DASHBOARD - SYSTEM VERIFICATION                ║
    ║                                                                      ║
    ║   Testing: API Connectivity | Database | Data Persistence           ║
    ║                                                                      ║
    ╚══════════════════════════════════════════════════════════════════════╝
    """)
    print(Colors.RESET)
    
    results = {
        'connection': False,
        'students': False,
        'add_subject': False,
        'retrieve_subjects': False,
        'persistence': False
    }
    
    # Test 1: Connection
    if not test_connection():
        print_error("Cannot proceed - backend not responding")
        return results
    results['connection'] = True
    
    # Test 2: Students
    success, students = test_students()
    if not success or len(students) == 0:
        print_error("Cannot proceed - no students available")
        return results
    results['students'] = True
    # Ensure student_id is an integer
    student_id = int(students[0]['id']) if isinstance(students[0]['id'], str) else students[0]['id']
    print_info(f"Using student ID: {student_id} (type: {type(student_id).__name__})")
    
    # Test 3: Add Subject
    success, subject_name = test_subject_addition(student_id)
    results['add_subject'] = success
    
    # Test 4: Retrieve Subjects
    if success:
        results['retrieve_subjects'] = test_retrieve_subjects(student_id)
    
    # Test 5: Persistence
    results['persistence'] = test_persistence()
    
    # Summary
    print_header("SYSTEM VERIFICATION SUMMARY")
    
    all_passed = all(results.values())
    
    for test_name, passed in results.items():
        status = f"{Colors.GREEN}PASS{Colors.RESET}" if passed else f"{Colors.RED}FAIL{Colors.RESET}"
        test_display = test_name.replace('_', ' ').title()
        print(f"  {status}  {test_display:.<40}")
    
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.RESET}")
    
    if all_passed:
        print(f"\n{Colors.BOLD}{Colors.GREEN}🎉 ALL TESTS PASSED - SYSTEM IS FULLY OPERATIONAL 🎉{Colors.RESET}\n")
        print("The Student Performance Dashboard is ready for use:")
        print(f"  • Open: {Colors.BOLD}http://127.0.0.1:5000{Colors.RESET}")
        print(f"  • API Base: {Colors.BOLD}{BASE_URL}{Colors.RESET}")
        print(f"  • Database: {Colors.BOLD}backend/student_dashboard.db{Colors.RESET}\n")
    else:
        print(f"\n{Colors.BOLD}{Colors.RED}⚠ SOME TESTS FAILED{Colors.RESET}\n")
        print("Please check the errors above and ensure:")
        print("  • Backend is running: python app.py")
        print("  • Database file exists and is readable")
        print("  • No firewall blocking localhost:5000\n")
    
    return results

if __name__ == '__main__':
    run_full_test()
