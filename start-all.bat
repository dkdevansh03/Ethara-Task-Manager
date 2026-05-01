@echo off
echo.
echo ===================================
echo Task Manager - Quick Start Guide
echo ===================================
echo.
echo This will start both backend and frontend servers.
echo Make sure MongoDB is running!
echo.
echo Starting Backend Server (Port 5000)...
start cmd /k "cd /d "%~dp0backend" && npm start"
echo.
echo Waiting 3 seconds before starting Frontend...
timeout /t 3
echo.
echo Starting Frontend Server (Port 3000)...
start cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo.
echo ===================================
echo Services starting:
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo ===================================
echo.
pause
