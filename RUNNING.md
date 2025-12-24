# Running the Student Performance Dashboard

## 🚀 Quick Start (Recommended)

The easiest way to run everything at once:

### Windows
```bash
RUN.bat
```

### PowerShell (All platforms)
```bash
powershell -ExecutionPolicy Bypass -File RUN.ps1
```

These scripts will:
✅ Start the backend server (Port 5000)
✅ Start the frontend server (Port 5173)
✅ Auto-open the dashboard in your browser
✅ Keep both servers running in separate windows

---

## 🔧 Manual Setup

If you prefer to run servers separately:

### Terminal 1 - Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend: http://localhost:5000

### Terminal 2 - Frontend (new terminal/tab)
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

---

## 🌐 Accessing the Application

Once both servers are running:

- **Dashboard**: http://localhost:5173
- **API Health**: http://localhost:5000/api/health
- **Students API**: http://localhost:5000/api/students

## 📊 Main Pages

1. **Dashboard** - Key metrics and overview
2. **Overview** - Top performers and statistics
3. **Analytics** - Detailed performance analysis
4. **Performance** - Performance charts and trends
5. **Management** - Add, edit, delete student records

---

## 🔍 Student Management Features

On the Management page:

- **Add Student**: Click "Add New Student" button
- **Edit Student**: Click pencil icon on any row
- **Delete Student**: Click trash icon with confirmation
- **Search**: Filter by name, ID, or department
- **Color-coded Metrics**: Visual indicators for performance

---

## 🛠️ Troubleshooting

### Port Already in Use

If you get "Address already in use":

**Windows:**
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Backend won't start

```bash
cd backend
pip install --upgrade -r requirements.txt
python app.py
```

### Frontend won't load

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### No data showing

Verify the CSV file exists:
- `backend/data/student_data.csv` - Should have 60 students

---

## 📁 Project Structure

```
student_performance_full_prod/
├── RUN.bat                  # Windows batch starter
├── RUN.ps1                  # PowerShell starter
├── backend/                 # Flask API server
│   ├── app.py              # Main app
│   ├── routes/             # API endpoints
│   └── data/               # CSV student data
├── frontend/               # React dashboard
│   ├── src/                # React components
│   ├── package.json        # Dependencies
│   └── vite.config.js      # Build config
└── docs/                   # Documentation
```

---

## 🔗 Integration Details

The frontend and backend are fully integrated:

- **Frontend API Calls**: Use relative paths `/api/students`
- **Backend Configuration**: 
  - Serves frontend from `frontend/dist/`
  - CORS enabled for development
  - All routes prefixed with `/api/`
- **Data Format**: CSV-based with 60 students (id, name, department, gpa, attendance, activityScore)

---

## 📊 API Endpoints

All endpoints require backend to be running:

```
GET  /api/students          - List all 60 students
GET  /api/health            - Health check
GET  /api                   - API info
```

---

## ⚙️ System Requirements

- **Python**: 3.8+
- **Node.js**: 14+
- **npm**: 6+
- **Ports Available**: 5000, 5173

---

## 📝 Next Steps

1. Run `RUN.bat` or `RUN.ps1`
2. Wait for both servers to start
3. Browser opens automatically
4. Navigate through pages to explore
5. Test student management features

Enjoy! 🎉
