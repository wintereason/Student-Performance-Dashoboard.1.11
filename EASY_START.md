# 🚀 Student Performance Dashboard - Easy Start Guide

## Quick Start (Easiest Way)

### Option 1: Double-Click to Start (Recommended)

1. **Navigate to**: `D:\project\student_performance_full_prod`
2. **Find**: `start.bat` file
3. **Double-click** it
4. **Wait** 10 seconds for servers to start
5. **Browser** will automatically open the dashboard at `http://localhost:5173`

That's it! The application will:
- ✅ Start Backend API automatically
- ✅ Start Frontend Dev Server automatically  
- ✅ Open your browser automatically
- ✅ Show both servers in separate windows

---

## ⚙️ Manual Start (If Needed)

### Step 1: Start Backend Server
```bash
cd D:\project\student_performance_full_prod\backend
python app.py
```
Backend runs on: **http://127.0.0.1:5000**

### Step 2: Start Frontend Server (in new terminal)
```bash
cd D:\project\student_performance_full_prod\frontend
npm run dev
```
Frontend runs on: **http://localhost:5173**

### Step 3: Open Browser
Visit: **http://localhost:5173**

---

## 📊 Dashboard Features

Once the application opens, you'll see:

✅ **Statistics Dashboard**
- Total Students: 60
- Average GPA
- Attendance Rate
- Honor Roll Count
- At-Risk Students

✅ **Student Rankings**
- Top 5 by GPA
- Top 5 by Attendance
- Top 5 by Activity Score

✅ **Analytics**
- Performance Charts
- Grade Distribution
- Department Statistics
- Student Search

---

## 🔧 Architecture

```
Your Computer:
├─ Backend (Python Flask)
│  ├─ Port: 127.0.0.1:5000
│  └─ Serves API & Data
│
└─ Frontend (React + Vite)
   ├─ Port: localhost:5173
   ├─ Beautiful UI
   └─ Proxies to Backend API
```

---

## 📁 Project Structure

```
student_performance_full_prod/
├── start.bat              ← DOUBLE-CLICK THIS! 🎯
├── start-app.bat          ← Alternative batch file
├── start-app.ps1          ← PowerShell version
│
├── backend/
│   ├── app.py             ← Flask API
│   ├── data/
│   │   └── student_data.csv   ← Student Database
│   └── requirements.txt    ← Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── models/        ← Student Model
│   │   │   ├── services/      ← StudentService
│   │   │   ├── context/       ← StudentContext
│   │   │   └── components/    ← UI Components
│   │   └── main.tsx
│   └── package.json       ← Node dependencies
│
└── docs/
    ├── MODEL_SETUP.md         ← Model Documentation
    └── MODEL_QUICK_REFERENCE.md ← API Reference
```

---

## ✅ Verification Checklist

After starting, verify everything works:

- [ ] **Backend** shows "Running on http://127.0.0.1:5000" in terminal
- [ ] **Frontend** shows "ready in X ms" with "Local: http://localhost:5173"
- [ ] **Browser** opens with beautiful dashboard UI
- [ ] **Student data** displays (60 students total)
- [ ] **Statistics** show: Total, Avg GPA, Attendance, etc.
- [ ] **Charts** and **rankings** render correctly

---

## 🛑 How to Stop

Simply close the terminal windows where the servers are running:
1. Close the "Backend API" window
2. Close the "Frontend UI" window

Both servers will stop.

---

## 🐛 Troubleshooting

### Problem: "Ports already in use"
**Solution**: Close any existing instances and try again:
```bash
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

### Problem: "Module not found" error
**Solution**: Install dependencies:
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend  
cd frontend
npm install
```

### Problem: "API not responding"
**Solution**: Ensure backend started successfully - check for errors in backend terminal

### Problem: "No student data showing"
**Solution**: 
1. Verify backend is running and showing "60 rows from CSV"
2. Check browser console for errors (F12)
3. Verify `http://127.0.0.1:5000/api/students` returns data

---

## 📖 Model Setup Reference

The application uses a professional model-service-context architecture:

### Models (`frontend/src/app/models/Student.ts`)
- `Student` interface - Data structure
- `StudentStats` interface - Aggregated statistics
- `StudentModel` class - Helper methods

### Services (`frontend/src/app/services/StudentService.ts`)
- `getAllStudents()` - Fetch all students
- `getTopStudents()` - Get top N by metric
- `calculateStats()` - Calculate statistics
- `searchStudents()` - Search functionality
- And many more...

### Context (`frontend/src/app/context/StudentContext.tsx`)
- `StudentProvider` - Global state wrapper
- `useStudents()` - Hook to access students

See [MODEL_SETUP.md](./MODEL_SETUP.md) for detailed documentation.

---

## 🎯 Quick Links

| Resource | URL |
|----------|-----|
| Frontend Dashboard | http://localhost:5173 |
| Backend API | http://127.0.0.1:5000 |
| Student API Endpoint | http://127.0.0.1:5000/api/students |
| Health Check | http://127.0.0.1:5000/api/health |

---

## 💡 Tips

1. **Keep terminal windows visible** - You can see real-time logs
2. **Refresh browser** (F5) if data doesn't load initially
3. **Check browser console** (F12) for any errors
4. **Backend must start first** - Frontend needs API available
5. **Network needed** - If ports are blocked, contact IT

---

## 📝 Summary

**To run the application:**
1. Double-click `start.bat` in `D:\project\student_performance_full_prod`
2. Wait 10 seconds
3. Dashboard opens automatically at `http://localhost:5173`
4. View student performance data with beautiful charts and rankings

**No complicated commands needed!** 🎉

---

Created: December 17, 2025  
Dashboard Version: 1.0  
Model Architecture: Complete ✅
