@echo off
REM Student Performance Dashboard - Easy Runner
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo Student Performance Dashboard
echo ========================================
echo.
echo Starting Backend Server (Port 5000)...
echo Starting Frontend Server (Port 5173)...
echo.

REM Start Backend
cd /d "%~dp0backend"
start "Student Dashboard Backend" cmd /k python app.py

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Start Frontend
cd /d "%~dp0frontend"
start "Student Dashboard Frontend" cmd /k npm run dev

REM Wait for servers to fully start
timeout /t 3 /nobreak

REM Open browser
echo.
echo Opening application in browser...
timeout /t 2 /nobreak
start http://localhost:5173

echo.
echo ========================================
echo Servers are running!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo ========================================
echo.
pause
