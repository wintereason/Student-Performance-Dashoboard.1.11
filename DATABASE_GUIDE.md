# Database Setup & Access Guide

## 📊 Database Information

### Database Type
- **Type:** SQLite 3
- **Location:** `backend/student_dashboard.db`
- **Size:** ~500KB
- **Created:** December 26, 2025

### Database Access

#### Direct Access
The database file is included in the repository:
```
Student-Performance-Dashoboard/
└── backend/
    └── student_dashboard.db  ← SQLite database file
```

#### Via Python Script
To access and view database contents:

```bash
cd backend
python show_db_data.py
```

This will display:
- All students with their details
- All subject marks with component breakdown
- Statistics and summaries

#### Via SQLite Command Line
```bash
cd backend
sqlite3 student_dashboard.db

# Then use SQL queries:
.tables                          # List all tables
SELECT * FROM student;           # View all students
SELECT * FROM student_subject;   # View all marks
.quit                           # Exit
```

#### Via Python (Interactive)
```python
import sqlite3

conn = sqlite3.connect('backend/student_dashboard.db')
cursor = conn.cursor()

# View all students
cursor.execute("SELECT id, name, department, gpa FROM student")
students = cursor.fetchall()
for student in students:
    print(student)

# View student marks
cursor.execute("SELECT * FROM student_subject WHERE student_id = 1")
marks = cursor.fetchall()
for mark in marks:
    print(mark)

conn.close()
```

## 🗂️ Database Schema

### Tables

#### 1. **student** Table
```sql
CREATE TABLE student (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255),
    department VARCHAR(100),
    gpa FLOAT DEFAULT 0.0,
    attendance FLOAT DEFAULT 0.0,
    activityScore FLOAT DEFAULT 0.0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Sample Data:**
- John Smith (ID: 1)
- Emma Johnson (ID: 2)
- Michael Brown (ID: 3)
- Sarah Davis (ID: 4)
- David Wilson (ID: 5)

#### 2. **student_subject** Table
```sql
CREATE TABLE student_subject (
    id INTEGER PRIMARY KEY,
    student_id INTEGER,
    subject_name VARCHAR(255),
    assignment FLOAT DEFAULT 0,     -- 0-20 points
    test FLOAT DEFAULT 0,           -- 0-25 points
    project FLOAT DEFAULT 0,        -- 0-25 points
    quiz FLOAT DEFAULT 0,           -- 0-15 points
    marks FLOAT DEFAULT 0,          -- Total (auto-calculated)
    maxMarks FLOAT DEFAULT 100,
    percentage FLOAT DEFAULT 0,     -- (marks/maxMarks)*100
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id)
);
```

**Subjects:**
- Mathematics
- Physics
- Chemistry
- English
- History
- Computer Science
- Biology
- Economics

### Data Relationships
```
student (1) ──→ (many) student_subject
   ↓                      ↓
   id (PK)  ←─── student_id (FK)
```

## 📈 Current Data Status

### Students: 6
```
ID | Name              | Department | GPA
---|-------------------|------------|-----
1  | John Smith        | Engineering | 3.2
2  | Emma Johnson      | Science     | 3.8
3  | Michael Brown     | Engineering | 2.9
4  | Sarah Davis       | Arts        | 3.5
5  | David Wilson      | Science     | 3.1
6  | Student 6         | Engineering | 2.7
```

### Records: 25 Marks Entries
- 8 subjects total
- 3-5 marks per student
- All components filled (assignment, test, project, quiz)
- Auto-calculated totals and percentages

## 🔧 Reset Database

### Generate Fresh Database
To reset the database and regenerate sample data:

```bash
cd backend

# 1. Delete old database
rm student_dashboard.db

# 2. Run migrations
python migrate_marks.py

# 3. Seed sample data
python seed_marks_data.py

# 4. Verify data
python show_db_data.py
```

### Recreate Schema Only
```bash
cd backend
python migrate_marks.py
```

## 📝 API Endpoints Using Database

### Read Operations
```
GET /api/students                    # All students
GET /api/subjects/student/{id}/marks # Student marks
GET /api/subjects/student/{id}/subjects # Student subjects
```

### Write Operations
```
POST /api/subjects/student/{id}/subjects     # Add subject
PUT /api/subjects/student/{id}/subject/{sid} # Update marks
DELETE /api/subject/{id}                     # Delete subject
```

### Example: Update Marks
```bash
curl -X PUT http://127.0.0.1:5000/api/subjects/student/1/subject/1 \
  -H "Content-Type: application/json" \
  -d '{
    "assignment": 18,
    "test": 22,
    "project": 20,
    "quiz": 14
  }'
```

## 🚀 Database Operations in Application

### Frontend (React)
The frontend communicates with the database through Flask APIs:

```typescript
// Fetch student marks
const response = await fetch(
  `http://127.0.0.1:5000/api/subjects/student/${studentId}/marks`
);

// Update marks
const response = await fetch(
  `/api/subjects/student/${studentId}/subject/${subjectId}`,
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assignment: 18,
      test: 22,
      project: 20,
      quiz: 14
    })
  }
);
```

### Backend (Flask)
Flask ORM (SQLAlchemy) handles database operations:

```python
# Get all students
students = Student.query.all()

# Get student marks
subjects = StudentSubject.query.filter_by(student_id=student_id).all()

# Update marks
subject = StudentSubject.query.get(subject_id)
subject.assignment = 18
subject.test = 22
subject.project = 20
subject.quiz = 14
# Auto-calculate total and percentage
subject.marks = subject.assignment + subject.test + subject.project + subject.quiz
subject.percentage = (subject.marks / 100) * 100
db.session.commit()
```

## 📊 Data Analysis Queries

### Average GPA by Department
```sql
SELECT department, AVG(gpa) as avg_gpa
FROM student
GROUP BY department
ORDER BY avg_gpa DESC;
```

### Subject Performance Rankings
```sql
SELECT subject_name, AVG(percentage) as avg_percentage, COUNT(*) as students
FROM student_subject
GROUP BY subject_name
ORDER BY avg_percentage DESC;
```

### At-Risk Students (GPA < 2.5)
```sql
SELECT id, name, department, gpa
FROM student
WHERE gpa < 2.5
ORDER BY gpa ASC;
```

### Student Performance Distribution
```sql
SELECT 
  CASE 
    WHEN percentage >= 80 THEN 'Excellent (80-100%)'
    WHEN percentage >= 60 THEN 'Good (60-79%)'
    WHEN percentage >= 40 THEN 'Average (40-59%)'
    ELSE 'Poor (<40%)'
  END as performance,
  COUNT(*) as count
FROM student_subject
GROUP BY 1
ORDER BY count DESC;
```

## 🔒 Database Security

### Current Setup
- SQLite (file-based)
- No authentication required (development)
- No encryption (development)

### Production Recommendations
- Use PostgreSQL or MySQL
- Implement user authentication
- Enable SSL/TLS for connections
- Add password protection
- Implement database backups
- Use environment variables for credentials

## 📦 Backup & Export

### Backup Database
```bash
cp backend/student_dashboard.db backend/student_dashboard.db.backup
```

### Export to CSV
```bash
cd backend
sqlite3 student_dashboard.db

.mode csv
.output students.csv
SELECT * FROM student;
.quit
```

### Import Data
```bash
sqlite3 student_dashboard.db < data.sql
```

## 🐛 Troubleshooting

### Database Locked
**Problem:** "database is locked" error
**Solution:** Close other connections and restart Flask

### Data Not Updating
**Problem:** Changes don't persist
**Solution:** Ensure `db.session.commit()` is called in Flask

### Connection Refused
**Problem:** Can't connect to backend API
**Solution:** Ensure Flask server is running (`python run.py`)

### Empty Database
**Problem:** No data showing
**Solution:** Run seed script: `python seed_marks_data.py`

## 📖 Related Documentation

- [EDIT_MARKS_FEATURE.md](../EDIT_MARKS_FEATURE.md) - Edit marks functionality
- [EDIT_MARKS_QUICK_START.md](../EDIT_MARKS_QUICK_START.md) - User guide
- [backend/database.py](../backend/database.py) - Database initialization
- [backend/models/database_models.py](../backend/models/database_models.py) - ORM models

## 🔗 Repository Links

- **GitHub Repository:** https://github.com/wintereason/Student-Performance-Dashoboard
- **Database File:** [backend/student_dashboard.db](../backend/student_dashboard.db)
- **Database Models:** [backend/models/database_models.py](../backend/models/database_models.py)
- **Migration Scripts:** [backend/migrate_marks.py](../backend/migrate_marks.py)
- **Seed Data:** [backend/seed_marks_data.py](../backend/seed_marks_data.py)

---

**Last Updated:** December 26, 2025
**Database Version:** 1.0
**Status:** ✅ Ready for Use
