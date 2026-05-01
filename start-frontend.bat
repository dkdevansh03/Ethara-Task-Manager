@echo off
echo Starting Task Manager Frontend...
cd /d "%~dp0frontend"
echo Installing/updating dependencies...
call npm install
echo.
echo Starting frontend dev server on http://localhost:3000
call npm run dev
pause
