@echo off
echo Starting Task Manager Backend...
cd /d "%~dp0backend"
echo Installing/updating dependencies...
call npm install
echo.
echo Starting backend server on http://localhost:5000
call npm start
pause
