@echo off
title Student Performance Dashboard - Quick Start
cd /d "%~dp0"

echo.
echo ============================================================
echo    STUDENT PERFORMANCE DASHBOARD
echo ============================================================
echo.
echo Starting Backend API Server...
echo.

REM Start Backend Server in new window
start "Backend API - http://127.0.0.1:5000" cmd /k "cd /d %CD%\backend && python app.py"

REM Wait for backend to start
timeout /t 3 /nobreak

echo.
echo Starting Frontend Development Server...
echo.

REM Start Frontend Server in new window
start "Frontend UI - http://localhost:5173" cmd /k "cd /d %CD%\frontend && npm run dev"

REM Wait for frontend to start
timeout /t 5 /nobreak

echo.
echo Opening application in browser...
echo.

REM Open the application
start http://localhost:5173

echo.
echo ============================================================
echo    SUCCESS! Application Started
echo ============================================================
echo.
echo Backend API:  http://127.0.0.1:5000
echo Frontend UI:  http://localhost:5173
echo.
echo Keep the server windows open to use the application.
echo Close them to stop the servers.
echo.
pause



