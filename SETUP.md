# Setup Instructions

Complete step-by-step guide to set up and run the Student Performance Dashboard.

## System Requirements

- **OS**: Windows, macOS, or Linux
- **Python**: 3.8 or higher
- **Node.js**: 14.x or higher
- **npm**: 6.x or higher
- **Available Ports**: 5000 (backend), 5173 (frontend)

## Installation Steps

### Step 1: Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Frontend Setup

```bash
cd frontend
npm install
```

### Step 3: Run the Application

**Backend:**
```bash
cd backend
python app.py
```
Server runs on http://127.0.0.1:5000

**Frontend (new terminal):**
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173

## Environment Configuration

### Backend (backend/config.py)
- Debug mode: OFF (production)
- CORS enabled for frontend integration
- CSV data storage in `data/` directory

### Frontend (frontend/vite.config.js)
- Built with Vite 6.3.5
- React 18.3.1 + TypeScript
- Tailwind CSS 4.1.12

## Data Files

- `backend/data/student_data.csv` - Student records (70 students)
- `backend/data/department_data.csv` - Department information

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```bash
# Backend
pip install --upgrade -r requirements.txt

# Frontend
rm -rf node_modules package-lock.json
npm install
```

#### Requirements
- flask==2.3.3
- flask-cors==4.0.0
- pandas==2.2.3
- numpy==1.24.3
- gunicorn==21.2.0
- python-dotenv==1.0.0

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

## Running the Application

### Option 1: Development Mode (Recommended)

#### Terminal 1 - Start Backend
```bash
cd backend
python app.py
```

Output should show:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: off
```

#### Terminal 2 - Start Frontend
```bash
cd frontend
npm run dev
```

Output should show:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

#### Access the Dashboard
Open your browser and navigate to: **http://localhost:5173**

### Option 2: Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Run Backend (Gunicorn)
```bash
cd backend
gunicorn -c gunicorn_config.py wsgi:app
```

### Option 3: Docker Compose

```bash
docker-compose -f infra/docker-compose.prod.yml up -d
```

Then access: **http://localhost**

## Verify Installation

### Test API Endpoints

Run the comprehensive test suite:

**Windows (PowerShell):**
```powershell
cd student_performance_full_prod
./comprehensive_test.ps1
```

**Linux/macOS (Bash):**
```bash
cd student_performance_full_prod
python test_api.py
```

Expected output:
```
Total Tests: 23
Passed: 23
Failed: 0
Result: ALL TESTS PASSED ✅
```

### Manual Testing

Test the health endpoint:

```bash
# Using curl
curl http://localhost:5000/api/health

# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/health"
```

## Configuration

### Backend Configuration (backend/config.py)

```python
UPLOAD_FOLDER = 'data'
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
JSON_SORT_KEYS = False
CORS_ORIGINS = "http://localhost:5173"  # Frontend URL
```

### Environment Variables (backend/.env)

Create a `.env` file if needed:

```
FLASK_ENV=development
FLASK_DEBUG=False
PORT=5000
CSV_FILE_PATH=data/student_data.csv
```

### Frontend Configuration (frontend/.env)

Create a `.env` file in frontend directory:

```
VITE_API_BASE_URL=http://localhost:5000
```

## Database Setup

### CSV File Location
- **Path**: `backend/data/student_data.csv`
- **Format**: CSV with headers
- **Records**: 60 pre-populated student records
- **Departments**: Computer Science, Engineering, Business

### CSV Columns
```
Student_ID, First_Name, Last_Name, Email, Gender, Age, Department,
Attendance (%), Midterm_Score, Final_Score, Assignments_Avg, Quizzes_Avg,
Participation_Score, Projects_Score, Total_Score, Grade,
Study_Hours_per_Week, Extracurricular_Activities, Internet_Access_at_Home,
Parent_Education_Level, Family_Income_Level, Stress_Level (1-10),
Sleep_Hours_per_Night
```

### Data Import (if needed)

To add new students to the CSV:
1. Add rows in Excel/Google Sheets format
2. Export as CSV
3. Replace `backend/data/student_data.csv`
4. Restart backend

**Important**: Ensure numeric columns contain valid numbers, not text.

## Troubleshooting

### Backend Issues

**Error: Port 5000 already in use**
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Or run on different port
python app.py --port 5001
```

**Error: Module not found**
```bash
# Reinstall requirements
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**Error: CSV file not found**
- Verify `backend/data/student_data.csv` exists
- Check file path in `backend/app.py`
- Ensure file has proper permissions

### Frontend Issues

**Error: npm packages not installed**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Error: Cannot connect to backend**
- Verify backend is running on port 5000
- Check CORS configuration in `backend/app.py`
- Ensure firewall allows localhost connections
- Try: `curl http://localhost:5000/api/health`

**Error: Port 5173 already in use**
```bash
# Specify different port
npm run dev -- --port 5174
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| API returns 500 errors | Check backend logs for error messages |
| Student data won't load | Verify CSV file is properly formatted |
| Frontend shows blank screen | Check browser console for errors |
| Dashboard unresponsive | Restart both backend and frontend |

## Project Structure After Setup

```
student_performance_full_prod/
├── backend/
│   ├── app.py                 # Flask app entry point
│   ├── config.py              # Configuration
│   ├── wsgi.py                # WSGI entry for production
│   ├── requirements.txt        # Python dependencies
│   ├── routes/
│   │   ├── students_routes.py
│   │   ├── overview_routes.py
│   │   ├── distribution_routes.py
│   │   └── performance_routes.py
│   ├── data/
│   │   └── student_data.csv   # Student database
│   ├── Dockerfile
│   └── gunicorn_config.py
├── frontend/
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── styles.css
│   │   └── components/
│   │       ├── Dashboard.jsx
│   │       ├── Overview.jsx
│   │       ├── Performance.jsx
│   │       ├── Distribution.jsx
│   │       ├── StudentPerformance.jsx
│   │       └── DataManagement.jsx
│   ├── Dockerfile
│   └── nginx.conf
├── infra/
│   └── docker-compose.prod.yml
├── docs/
│   └── deployment.md
├── SETUP.md                   # This file
├── README.md                  # Project overview
└── comprehensive_test.ps1     # Test suite
```

## Next Steps

1. ✅ Install backend dependencies
2. ✅ Install frontend dependencies
3. ✅ Start backend server
4. ✅ Start frontend server
5. ✅ Access dashboard at http://localhost:5173
6. ✅ Run tests with `./comprehensive_test.ps1`
7. ✅ Review QUICKSTART.md for quick reference

## Development Workflow

### Making Changes

**Backend Changes:**
1. Edit file in `backend/routes/`
2. Backend auto-reloads (development mode)
3. Test with `http://localhost:5000/api/...`

**Frontend Changes:**
1. Edit file in `frontend/src/`
2. Vite hot-reloads automatically
3. Changes appear in browser immediately

### Adding New Features

See `docs/deployment.md` for deployment considerations.

## Performance Tips

- Use production build for deployment: `npm run build`
- Enable gzip compression in Nginx
- Use CDN for frontend assets
- Cache API responses appropriately
- Monitor CSV file size (consider database for large datasets)

## Security Checklist

- [ ] Change CORS origins for production
- [ ] Implement authentication
- [ ] Validate all file uploads
- [ ] Use HTTPS in production
- [ ] Backup CSV data regularly
- [ ] Restrict API access if needed
- [ ] Update dependencies regularly

## Getting Help

1. Check the README.md for overview
2. Review QUICKSTART.md for quick reference
3. Check docs/deployment.md for deployment
4. Run comprehensive_test.ps1 to verify setup
5. Check backend logs for error details

---

**Last Updated**: December 12, 2025

