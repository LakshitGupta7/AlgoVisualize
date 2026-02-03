# DSA Visualizer - Start Script (PowerShell)
# Run this to start both frontend and backend

Write-Host "Starting DSA Visualizer..." -ForegroundColor Cyan
Write-Host ""

# Start Backend in background
Write-Host "Starting Python Backend (port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/fastapi; uvicorn main:app --reload"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting React Frontend (port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " DSA Visualizer Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host " Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host " Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host " API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
