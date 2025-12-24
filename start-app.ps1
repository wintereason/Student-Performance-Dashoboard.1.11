# Student Performance Dashboard - PowerShell Startup Script
# This script starts both the backend and frontend servers

Write-Host ""
Write-Host "============================================================"
Write-Host "  Student Performance Dashboard - Startup"
Write-Host "============================================================"
Write-Host ""

# Define directories
$backendDir = "D:\project\student_performance_full_prod\backend"
$frontendDir = "D:\project\student_performance_full_prod\frontend"

# Start Backend Server
Write-Host "Starting Backend API on http://127.0.0.1:5000..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; python app.py"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "Starting Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev"

# Wait for frontend to start
Start-Sleep -Seconds 5

# Open browser
Write-Host "Opening http://localhost:5173 in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "============================================================"
Write-Host "  Both servers are running!" -ForegroundColor Green
Write-Host "============================================================"
Write-Host ""
Write-Host "Backend API: http://127.0.0.1:5000"
Write-Host "Frontend UI: http://localhost:5173"
Write-Host ""
Write-Host "Keep this window open to keep the servers running."
Write-Host ""
