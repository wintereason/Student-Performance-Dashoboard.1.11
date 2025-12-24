#!/usr/bin/env pwsh
# Student Performance Dashboard - Easy Runner
# This script starts both backend and frontend servers

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Student Performance Dashboard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running on Windows
if ($PSVersionTable.Platform -eq "Win32NT" -or $PSVersionTable.OS -like "*Windows*") {
    Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Green
    Write-Host "Starting Frontend Server (Port 5173)..." -ForegroundColor Green
    Write-Host ""
    
    # Start Backend in new window
    $backendPath = Join-Path $PSScriptRoot "backend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python app.py" -WindowStyle Normal -PassThru
    
    # Wait for backend to start
    Start-Sleep -Seconds 2
    
    # Start Frontend in new window
    $frontendPath = Join-Path $PSScriptRoot "frontend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal -PassThru
    
    # Wait for frontend to start
    Start-Sleep -Seconds 3
    
    # Open browser
    Write-Host "Opening application in browser..." -ForegroundColor Yellow
    Start-Sleep -Seconds 1
    Start-Process "http://localhost:5173"
} else {
    # For Linux/Mac
    Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Green
    Write-Host "Starting Frontend Server (Port 5173)..." -ForegroundColor Green
    Write-Host ""
    
    $backendPath = Join-Path $PSScriptRoot "backend"
    $frontendPath = Join-Path $PSScriptRoot "frontend"
    
    # Start backend in background
    Start-Process -FilePath "python" -ArgumentList "$backendPath/app.py" -PassThru
    Start-Sleep -Seconds 2
    
    # Start frontend in background
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $frontendPath -PassThru
    Start-Sleep -Seconds 3
    
    # Open browser if command exists
    if (Get-Command open -ErrorAction SilentlyContinue) {
        open "http://localhost:5173"
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Servers are running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Gray
