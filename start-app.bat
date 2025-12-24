@echo off
REM Student Performance Dashboard - Startup Script
REM This script starts both the backend and frontend servers

echo.
echo ============================================================
echo   Student Performance Dashboard - Startup
echo ============================================================
echo.

REM Start Backend Server
echo Starting Backend API on http://127.0.0.1:5000...
start cmd /k "cd /d D:\project\student_performance_full_prod\backend && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start Frontend Server
echo Starting Frontend on http://localhost:5173...
start cmd /k "cd /d D:\project\student_performance_full_prod\frontend && npm run dev"

REM Wait for frontend to start
timeout /t 5 /nobreak

REM Open browser
echo Opening http://localhost:5173 in browser...
start http://localhost:5173

echo.
echo ============================================================
echo   Both servers are running!
echo ============================================================
echo.
echo Backend API: http://127.0.0.1:5000
echo Frontend UI: http://localhost:5173
echo.
echo Press any key to continue...
pause
