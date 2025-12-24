#!/bin/bash

# Student Performance Dashboard - Easy Startup Script
# For Linux/Mac users

echo ""
echo "============================================================"
echo "   STUDENT PERFORMANCE DASHBOARD - STARTUP"
echo "============================================================"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if frontend dist exists, if not build it
if [ ! -d "$SCRIPT_DIR/frontend/dist" ]; then
    echo "[*] Building frontend (first time setup)..."
    cd "$SCRIPT_DIR/frontend"
    npm run build > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "[OK] Frontend built successfully"
    else
        echo "[WARNING] Frontend build may have issues, but continuing..."
    fi
    echo ""
fi

# Check Python installation
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 not found. Please install Python 3 first."
    exit 1
fi

# Setup backend
echo "[*] Setting up backend..."
cd "$SCRIPT_DIR/backend"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "[*] Creating Python virtual environment..."
    python3 -m venv venv > /dev/null 2>&1
fi

# Activate virtual environment
source venv/bin/activate > /dev/null 2>&1

# Install requirements
echo "[*] Installing Python packages..."
pip install -q -r requirements.txt > /dev/null 2>&1

echo "[OK] Backend setup complete"
echo ""

# Display startup info
echo "============================================================"
echo "   APPLICATION STARTING..."
echo "============================================================"
echo ""
echo "   Access the application at:"
echo "   -> http://localhost:5000"
echo ""
echo "   API Documentation:"
echo "   -> http://localhost:5000/api"
echo ""
echo "   Frontend and Backend running in single process!"
echo ""
echo "   Features:"
echo "   - Dashboard with statistics"
echo "   - Student search and details"
echo "   - Performance analysis"
echo "   - Data editing capabilities"
echo ""
echo "   Press Ctrl+C to stop the server"
echo "============================================================"
echo ""

# Start Flask backend (serves both frontend and API)
python app.py
