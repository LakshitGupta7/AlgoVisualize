@echo off
REM DSA Visualizer - Start Script (Windows Batch)
REM Run this to start both frontend and backend

echo.
echo Starting DSA Visualizer...
echo.

REM Start Backend in new window
echo Starting Python Backend (port 8000)...
start "Backend" cmd /k "cd backend\fastapi && uvicorn main:app --reload"

REM Wait for backend
timeout /t 3 /nobreak > nul

REM Start Frontend in new window
echo Starting React Frontend (port 5173)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   DSA Visualizer Started!
echo ========================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
pause
