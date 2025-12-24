# Student Performance Dashboard

A comprehensive full-stack application for managing and analyzing student performance data with real-time analytics and interactive visualizations.

## Features

- **Dashboard**: Overview with key metrics and performance trends
- **Analytics**: Comprehensive analysis of student performance data
- **Performance Tracking**: Detailed performance metrics and visualizations
- **Student Management**: CRUD operations for managing student records
- **Distribution Analysis**: Visual distribution of key metrics
- **Responsive Design**: Dark theme UI optimized for all screen sizes
- **Real-time Search**: Instant filtering across all student data

## Tech Stack

**Backend:**
- Python 3.x
- Flask 2.x
- CSV-based data storage
- CORS enabled for frontend integration

**Frontend:**
- React 18.3.1
- TypeScript
- Tailwind CSS 4.1.12
- Radix UI components
- Vite 6.3.5 build tool
- Recharts for data visualization

## Quick Start

### ⚡ Easiest Way - Run Both Servers at Once

**Windows:**
```bash
RUN.bat
```

**PowerShell (Windows, macOS, Linux):**
```bash
powershell -ExecutionPolicy Bypass -File RUN.ps1
```

This will:
- Start backend on http://localhost:5000
- Start frontend on http://localhost:5173
- Auto-open the application in your browser

---

### Manual Setup

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

1. **Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```
   Backend runs on `http://localhost:5000`

2. **Frontend** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## Frontend & Backend Integration

The application is fully integrated:
- **Frontend API Base**: Uses relative paths `/api/students`
- **Backend Static Files**: Serves frontend from `frontend/dist/`
- **CORS**: Enabled for cross-origin requests
- **API Endpoints**: All backend routes accessible at `http://localhost:5000/api/`

When running via `RUN.bat` or `RUN.ps1`:
- Both servers start in separate windows
- No manual configuration needed
- Browser auto-opens to the dashboard
- `GET /api/students/performance-metrics` - Performance metrics

### Overview Routes (4 endpoints)
- `GET /api/overview/top-scorers` - Top 10 students by score
- `GET /api/overview/top-attendance` - Top 10 by attendance
- `GET /api/overview/top-participants` - Top 10 by participation
- `GET /api/overview/top-overall` - Top 10 overall performers

### Distribution Routes (5 endpoints)
- `GET /api/distribution/pass-fail-rate` - Pass/fail statistics
- `GET /api/distribution/grade-distribution` - Grade breakdown
- `GET /api/distribution/attendance-distribution` - Attendance patterns
- `GET /api/distribution/risk-students` - At-risk student identification
- `GET /api/distribution/statistics` - Comprehensive statistics

### Performance Routes (5 endpoints)
- `GET /api/performance/department-analysis` - Department performance
- `GET /api/performance/score-comparison` - Score comparisons
- `GET /api/performance/score-distribution-ranges` - Score ranges
- `GET /api/performance/department-comparison` - Cross-department analysis
- `GET /api/performance/performance-metrics` - Performance indicators

### Health Check
- `GET /api/health` - Server health status

## 🚀 Quick Start

### Prerequisites
- Python 3.x with Conda
- Node.js and npm (for frontend)
- Git

### Installation

1. **Setup Backend**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

2. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

3. **Access Dashboard**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
student_performance_full_prod/
├── backend/
│   ├── app.py              # Flask application
│   ├── config.py           # Configuration
│   ├── routes/             # API route modules
│   │   ├── students_routes.py
│   │   ├── overview_routes.py
│   │   ├── distribution_routes.py
│   │   └── performance_routes.py
│   ├── data/
│   │   └── student_data.csv # Student database (60 records)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── infra/
│   └── docker-compose.prod.yml
├── docs/
│   └── deployment.md       # Deployment guide
├── SETUP.md               # Detailed setup instructions
├── QUICKSTART.md          # Quick reference guide
└── README.md              # This file
```

## 🧪 Testing

Run the comprehensive test suite:
```bash
./comprehensive_test.ps1
```

Expected output:
```
Total Tests: 23
Passed: 23
Failed: 0
Result: ALL TESTS PASSED
```

## 📊 Sample Data

The project includes 60 pre-populated student records across 3 departments:
- **Computer Science**: 20 students
- **Engineering**: 20 students
- **Business**: 20 students

All students have complete records including:
- Attendance percentage (72-96%)
- Score ranges (70-96)
- Grades (A-C range, 100% pass rate)
- Study hours, stress levels, and demographics

## 🔧 Key Features

- **Real-time Analytics**: Instant calculation of performance metrics
- **Department Comparisons**: Cross-departmental performance analysis
- **Risk Identification**: Automatic flagging of at-risk students
- **Grade Distribution**: Visual representation of grade spread
- **Attendance Tracking**: Monitor attendance patterns
- **Performance Growth**: Track improvement over time
- **Data Management**: Add, update, and delete student records

## ⚙️ Configuration

### Backend Configuration (backend/config.py)
```python
UPLOAD_FOLDER = 'data'
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max
JSON_SORT_KEYS = False
```

### CORS Settings
- Cross-Origin enabled for localhost:5173 (frontend)
- Supports credentials and custom headers

## 🐳 Docker Deployment

### Build Images
```bash
cd backend && docker build -t student-perf-api .
cd frontend && docker build -t student-perf-dashboard .
```

### Run with Docker Compose
```bash
docker-compose -f infra/docker-compose.prod.yml up
```

## 📝 Data Format

### student_data.csv Columns
- Student_ID, First_Name, Last_Name
- Email, Gender, Age, Department
- Attendance (%), Midterm_Score, Final_Score
- Assignments_Avg, Quizzes_Avg, Participation_Score
- Projects_Score, Total_Score, Grade
- Study_Hours_per_Week, Extracurricular_Activities
- Internet_Access_at_Home, Parent_Education_Level
- Family_Income_Level, Stress_Level (1-10)
- Sleep_Hours_per_Night

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.x is installed
- Verify all packages: `pip install -r requirements.txt`
- Check port 5000 is not in use

### Frontend won't connect
- Verify backend is running on localhost:5000
- Check CORS configuration in backend/app.py
- Ensure frontend development server is on localhost:5173

### API returns 500 errors
- Check backend logs for detailed error messages
- Verify student_data.csv is properly formatted
- Ensure all numeric fields contain valid numbers

## 📈 Performance Metrics Calculated

- **Pass Rate**: Percentage of students with Grade A-C
- **Average Score**: Mean of all Total_Score values
- **Attendance Average**: Mean attendance percentage
- **At-Risk Students**: Identified by score < 70
- **Top Performers**: Students with scores >= 90
- **Grade Distribution**: Count of each grade level
- **Department Comparison**: Performance by department

## 🔐 Security Notes

- CORS is configured for development (adjust for production)
- CSV file should be backed up regularly
- Consider implementing authentication for production
- Validate all file uploads

## 📞 Support

For issues or questions:
1. Check the SETUP.md for detailed configuration
2. Review API documentation in docs/
3. Run comprehensive_test.ps1 to verify functionality
4. Check backend logs for error details

## 📄 License

This project is provided as-is for educational purposes.

---

**Last Updated**: December 12, 2025  
**Status**: ✅ Production Ready - All Systems Operational
