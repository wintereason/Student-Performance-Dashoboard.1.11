# Student Performance Dashboard - Technology Stack & Architecture

A comprehensive guide to all technologies, dependencies, and custom code used in this full-stack application.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Frontend Stack](#frontend-stack)
3. [Backend Stack](#backend-stack)
4. [Database](#database)
5. [Deployment](#deployment)
6. [Custom Files & Components](#custom-files--components)
7. [Installation & Setup](#installation--setup)

---

## 🎯 Project Overview

**Student Performance Dashboard** is a full-stack web application for tracking and analyzing student academic performance, attendance, and activity metrics.

- **Type:** Educational Management System
- **Architecture:** Client-Server (Frontend + Backend + Database)
- **Deployment:** Vercel (Frontend + Serverless Backend)
- **Database:** Supabase (PostgreSQL)

---

## 🎨 Frontend Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **TypeScript** | Latest | Type Safety |
| **Vite** | 6.3.5 | Build Tool & Dev Server |
| **Tailwind CSS** | 4.1.12 | Utility-first CSS Framework |

### Major UI Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| **Radix UI** | Latest | Unstyled, accessible components |
| **Material-UI (MUI)** | 7.3.5 | Pre-styled material design components |
| **Lucide Icons** | 0.487.0 | SVG Icons |
| **Sonner** | 2.0.3 | Toast notifications |

### Data Visualization & Charts
| Package | Version | Purpose |
|---------|---------|---------|
| **Recharts** | 2.15.2 | React charts (Bar, Line, Pie, Area) |
| **React DnD** | 16.0.1 | Drag & Drop functionality |
| **React Slick** | 0.31.0 | Carousel/Slider |

### Data Management & Forms
| Package | Version | Purpose |
|---------|---------|---------|
| **React Hook Form** | 7.55.0 | Form state management |
| **Supabase JS** | 2.38.4 | Database client & Auth |
| **Date-fns** | 3.6.0 | Date utilities |

### UI Components & Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| **Class Variance Authority** | 0.7.1 | Component variant management |
| **CLSX** | 2.1.1 | Conditional CSS classes |
| **Tailwind Merge** | 3.2.0 | Merge Tailwind classes |
| **Motion** | 12.23.24 | Animation library |
| **Embla Carousel** | 8.6.0 | Carousel component |
| **React Resizable Panels** | 2.1.7 | Resizable panel layouts |

### Dev Dependencies
```json
{
  "@vitejs/plugin-react": "4.7.0",
  "@tailwindcss/vite": "4.1.12",
  "tailwindcss": "4.1.12",
  "vite": "6.3.5"
}
```

### Frontend Directory Structure
```
frontend/
├── src/
│   ├── main.tsx                          # Entry point
│   ├── app/
│   │   ├── App.tsx                       # Main app component
│   │   ├── components/
│   │   │   ├── management-board.tsx      # Student/Subject/Exam management
│   │   │   ├── marks-history-chart.tsx   # Subject performance aggregation
│   │   │   ├── subject-performance.tsx   # Donut pie chart
│   │   │   ├── performance-chart.tsx     # GPA visualization
│   │   │   ├── grade-distribution.tsx    # Grade statistics
│   │   │   ├── at-risk-students.tsx      # At-risk indicators
│   │   │   ├── attendance-chart.tsx      # Attendance tracking
│   │   │   ├── top-students.tsx          # Honor roll
│   │   │   ├── recent-activity.tsx       # Activity log
│   │   │   ├── student-search.tsx        # Search functionality
│   │   │   ├── student-detail-modal.tsx  # Student details dialog
│   │   │   ├── edit-marks-modal.tsx      # Marks editing
│   │   │   ├── subject-management.tsx    # Subject CRUD
│   │   │   ├── subject-scores-table.tsx  # Score table
│   │   │   ├── stats-card.tsx            # Metric cards
│   │   │   ├── sidebar.tsx               # Navigation
│   │   │   └── ui/                       # Radix UI base components
│   │   ├── context/
│   │   │   └── StudentContext.tsx        # Global student state
│   │   ├── services/
│   │   │   ├── SupabaseService.ts       # Database operations
│   │   │   ├── StudentService.ts        # Business logic
│   │   │   └── SubjectService.ts        # Subject operations
│   │   ├── models/
│   │   │   ├── Student.ts               # Student interface
│   │   │   └── index.ts                 # Export models
│   │   └── App.tsx                      # Root component
│   ├── styles/
│   │   ├── index.css                    # Global styles
│   │   ├── fonts.css                    # Font definitions
│   │   ├── theme.css                    # Theme variables
│   │   └── tailwind.css                 # Tailwind config
│   └── components/
│       └── Dashboard.jsx                # Legacy dashboard
├── package.json                         # Dependencies
├── vite.config.ts                       # Vite configuration
├── postcss.config.mjs                   # PostCSS for Tailwind
├── .env.example                         # Environment template
├── dist/                                # Production build
└── nginx.conf                           # Web server config (Docker)
```

### Key Frontend Code Examples

#### 1. **Dashboard State Management (App.tsx)**
```typescript
// React Context for global student state
const { students, loading } = useStudents();

// State for statistics
const [stats, setStats] = useState({
  totalStudents: 0,
  averageScore: 0,
  attendanceRate: 0,
  honorRoll: 0,
  atRiskCount: 0,
  subjectTrend: 0,
});

// Supabase data fetching
const [supabaseSubjects, setSupabaseSubjects] = useState<any[]>([]);
const [supabaseExams, setSupabaseExams] = useState<any[]>([]);
```

#### 2. **Marks History Chart (Aggregation)**
```typescript
// Subject-level performance with CT1/CT2 analysis
const marksData = subjectNames.map((subject) => {
  const ct1Exams = subjectExams.filter(e => 
    e.name.includes('CT-1') || e.name.includes('CT1')
  );
  const ct2Exams = subjectExams.filter(e => 
    e.name.includes('CT-2') || e.name.includes('CT2')
  );
  
  // Calculate averages and passing percentages
  return {
    subject,
    'CT-1 Avg': ct1Average,
    'CT-2 Avg': ct2Average,
    'CT-1 Pass %': ct1PassingPercentage,
    'CT-2 Pass %': ct2PassingPercentage,
  };
});
```

#### 3. **Recharts Implementation**
```typescript
// Subject Performance - Donut Pie Chart
<PieChart width={500} height={300}>
  <Pie
    data={chartData}
    cx="50%"
    cy="50%"
    innerRadius={40}  // Creates donut effect
    outerRadius={100}
    dataKey="value"
  />
</PieChart>

// Marks History - Vertical Bar Chart
<BarChart data={marksData}>
  <XAxis dataKey="subject" />
  <Bar dataKey="CT-1 Avg" fill="#3b82f6" />
  <Bar dataKey="CT-2 Avg" fill="#a855f7" />
  <Bar dataKey="CT-1 Pass %" fill="#22c55e" />
  <Bar dataKey="CT-2 Pass %" fill="#f97316" />
</BarChart>
```

#### 4. **Form Handling (React Hook Form)**
```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  department: '',
  gpa: 0,
  attendance: 0,
  activity_score: 0,
});

const handleSubmit = async (e) => {
  e.preventDefault();
  await StudentSupabaseService.updateStudent(id, formData);
};
```

#### 5. **Activity Score Display (Updated)**
```typescript
// Conditional rendering with progress bar
{student.activity_score ? (
  <div className="flex items-center gap-2">
    <div className="w-16 bg-slate-700 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
        style={{ width: `${Math.min((student.activity_score) * 10, 100)}%` }}
      />
    </div>
    <span className="font-semibold text-purple-400">
      {student.activity_score.toFixed(1)}
    </span>
  </div>
) : (
  <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-medium">
    Not Set
  </span>
)}
```

---

## 🔧 Backend Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.13+ | Programming language |
| **Flask** | 3.0.0+ | Web framework |
| **Flask-CORS** | 4.0.0+ | Cross-origin requests |
| **Gunicorn** | 21.2.0+ | Production WSGI server |

### Database & ORM
| Package | Version | Purpose |
|---------|---------|---------|
| **Flask-SQLAlchemy** | 3.0.5+ | ORM for Python |
| **SQLAlchemy** | 2.0.0+ | SQL toolkit |
| **Flask-Migrate** | 4.0.0+ | Database migrations |

### Data Processing
| Package | Version | Purpose |
|---------|---------|---------|
| **Pandas** | 2.0.0+ | Data manipulation & analysis |
| **NumPy** | 1.26.0+ | Numerical computing |

### Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| **python-dotenv** | 1.0.0+ | Environment variables |
| **Werkzeug** | 3.0.0+ | WSGI utilities |

### Backend Directory Structure
```
backend/
├── app.py                          # Flask app initialization
├── run.py                          # Development server entry
├── wsgi.py                         # Production WSGI entry
├── config.py                       # Configuration management
├── database.py                     # Database connection
├── gunicorn_config.py             # Gunicorn production config
├── requirements.txt               # Python dependencies
├── models/
│   ├── __init__.py
│   └── database_models.py         # SQLAlchemy ORM models
├── routes/
│   ├── __init__.py
│   ├── analytics_routes.py        # Analytics endpoints
│   ├── distribution_routes.py     # Distribution data
│   ├── overview_routes.py         # Overview endpoints
│   ├── performance_routes.py      # Performance analytics
│   ├── student_routes.py          # Student CRUD
│   ├── students_routes.py         # Batch student operations
│   ├── subjects_routes.py         # Subject management
│   └── __pycache__/               # Compiled files
├── utils/
│   └── __init__.py                # Utility functions
├── data/
│   ├── student_data.csv           # Sample student data
│   └── department_data.csv        # Department data
├── Dockerfile                     # Container configuration
└── __pycache__/                   # Compiled Python files
```

### Key Backend Code Examples

#### 1. **Flask App Initialization (app.py)**
```python
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig, ProductionConfig

app = Flask(__name__)
CORS(app)

# Configuration
app.config.from_object(ProductionConfig)

# Database
db = SQLAlchemy(app)

# Register blueprints
from routes import student_routes, subject_routes, exam_routes
app.register_blueprint(student_routes.bp)
app.register_blueprint(subject_routes.bp)
app.register_blueprint(exam_routes.bp)

if __name__ == '__main__':
    app.run(debug=False)
```

#### 2. **Student Model (database_models.py)**
```python
from database import db
from datetime import datetime

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True)
    department = db.Column(db.String(100))
    gpa = db.Column(db.Float, default=0.0)
    attendance = db.Column(db.Float, default=0.0)
    activity_score = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(50), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'department': self.department,
            'gpa': self.gpa,
            'attendance': self.attendance,
            'activity_score': self.activity_score,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
```

#### 3. **API Routes (student_routes.py)**
```python
from flask import Blueprint, request, jsonify
from models.database_models import Student
from database import db

bp = Blueprint('students', __name__, url_prefix='/api/students')

@bp.route('/', methods=['GET'])
def get_students():
    """Get all students"""
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students])

@bp.route('/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """Get single student"""
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify(student.to_dict())

@bp.route('/', methods=['POST'])
def create_student():
    """Create new student"""
    data = request.get_json()
    student = Student(**data)
    db.session.add(student)
    db.session.commit()
    return jsonify(student.to_dict()), 201

@bp.route('/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    """Update student"""
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    data = request.get_json()
    for key, value in data.items():
        setattr(student, key, value)
    
    db.session.commit()
    return jsonify(student.to_dict())

@bp.route('/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Delete student"""
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    db.session.delete(student)
    db.session.commit()
    return '', 204
```

#### 4. **Analytics Endpoint (analytics_routes.py)**
```python
@bp.route('/performance-summary', methods=['GET'])
def get_performance_summary():
    """Get performance analytics"""
    students = Student.query.all()
    
    stats = {
        'total_students': len(students),
        'average_gpa': sum(s.gpa for s in students) / len(students),
        'average_attendance': sum(s.attendance for s in students) / len(students),
        'at_risk_count': len([s for s in students if s.gpa < 2.5]),
        'honor_roll': len([s for s in students if s.gpa >= 3.5]),
    }
    
    return jsonify(stats)
```

#### 5. **Activity Score Filling (SupabaseService.ts)**
```typescript
async fillActivityScores(): Promise<boolean> {
  try {
    const students = await this.getStudents();
    
    for (const student of students) {
      if (!student.activity_score || student.activity_score === 0) {
        const randomScore = Math.floor(Math.random() * 10) + 1; // 1-10
        await this.updateStudent(student.id, {
          ...student,
          activity_score: randomScore
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error filling activity scores:', error);
    return false;
  }
}
```

---

## 💾 Database

### Database Type
- **Provider:** Supabase (PostgreSQL)
- **Connection:** Supabase JavaScript Client (`@supabase/supabase-js`)
- **Authentication:** Supabase Anon Key

### Tables & Schema

#### Students Table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  department VARCHAR(100),
  gpa DECIMAL(3,2),
  attendance DECIMAL(5,2),
  activity_score DECIMAL(3,1),
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Subjects Table
```sql
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE,
  instructor VARCHAR(100),
  credits INT,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Exams Table
```sql
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  exam_date DATE,
  exam_time TIME,
  duration VARCHAR(20),
  room VARCHAR(50),
  ct1_score DECIMAL(3,1),
  ct2_score DECIMAL(3,1),
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Environment Variables Required
```env
# Frontend (.env)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend (if needed)
DATABASE_URL=postgresql://user:password@localhost/dbname
FLASK_ENV=production
FLASK_DEBUG=0
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm ci && npm run build",
  "outputDirectory": "frontend/dist",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_key"
  }
}
```

### Backend Deployment
- **Serverless Functions:** Python on Vercel (`/api/index.py`)
- **Web Server:** Gunicorn for traditional deployment
- **Environment:** Python 3.13+

### Docker Configuration
- **Frontend:** Nginx-based container
- **Backend:** Python Flask container

---

## 📁 Custom Files & Components Created

### Frontend Custom Components
1. **management-board.tsx** - Student/Subject/Exam CRUD interface
2. **marks-history-chart.tsx** - Subject-level performance visualization
3. **subject-performance.tsx** - Donut pie chart for subject distribution
4. **performance-chart.tsx** - GPA trend visualization
5. **student-detail-modal.tsx** - Student information dialog
6. **edit-marks-modal.tsx** - Exam score editing
7. **stats-card.tsx** - Dashboard metric cards
8. **at-risk-students.tsx** - At-risk student indicators

### Frontend Services
1. **SupabaseService.ts** - Database CRUD operations
2. **StudentService.ts** - Business logic for students
3. **SubjectService.ts** - Subject management logic

### Frontend Context
1. **StudentContext.tsx** - Global state management

### Backend Routes
1. **student_routes.py** - Student CRUD endpoints
2. **students_routes.py** - Batch operations
3. **subject_routes.py** - Subject management
4. **exam_routes.py** - Exam operations
5. **analytics_routes.py** - Performance analytics
6. **performance_routes.py** - Performance metrics

### Backend Models
1. **database_models.py** - SQLAlchemy ORM definitions

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.13+
- Git
- Supabase account
- Vercel account (for deployment)

### Frontend Installation
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add Supabase credentials to .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Start development server
npm run dev
# Runs on http://localhost:5175

# Build for production
npm run build
```

### Backend Installation
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (if needed)
cp .env.example .env

# Run development server
python run.py
# Runs on http://localhost:5000

# Run production server
gunicorn -c gunicorn_config.py wsgi:app
```

### Database Setup
1. Create Supabase project
2. Create tables using the SQL schema above
3. Get connection credentials
4. Add to environment variables

### Deployment to Vercel
```bash
# Push to GitHub
git push origin main

# Go to vercel.com
# Import repository
# Add environment variables:
#   - VITE_SUPABASE_URL
#   - VITE_SUPABASE_ANON_KEY
# Deploy!
```

---

## 🔑 Key Features Built

### Frontend Features
- ✅ Student management dashboard
- ✅ Real-time data visualization with Recharts
- ✅ Responsive design with Tailwind CSS
- ✅ Student search and filtering
- ✅ Exam score editing and management
- ✅ Subject performance analysis
- ✅ Activity score tracking
- ✅ At-risk student identification
- ✅ Grade distribution charts
- ✅ Attendance tracking

### Backend Features
- ✅ RESTful API endpoints
- ✅ Student CRUD operations
- ✅ Subject management
- ✅ Exam tracking
- ✅ Performance analytics
- ✅ Database migrations
- ✅ CORS support
- ✅ Error handling
- ✅ Production-ready server

### Database Features
- ✅ Student information storage
- ✅ Subject and exam tracking
- ✅ Performance metrics
- ✅ Attendance records
- ✅ Timestamps for audit trail

---

## 📚 Additional Resources

- **React Docs:** https://react.dev
- **TypeScript Docs:** https://www.typescriptlang.org
- **Tailwind CSS:** https://tailwindcss.com
- **Radix UI:** https://www.radix-ui.com
- **Recharts:** https://recharts.org
- **Supabase:** https://supabase.com/docs
- **Flask Docs:** https://flask.palletsprojects.com
- **Vercel Docs:** https://vercel.com/docs

---

## 📝 Notes

- All custom code follows TypeScript/Python best practices
- Frontend uses responsive design patterns
- Backend follows REST API conventions
- Database queries are optimized for performance
- Code is modular and maintainable
- All dependencies are production-ready and well-maintained

---

**Last Updated:** January 2026  
**Project Status:** Production Ready
