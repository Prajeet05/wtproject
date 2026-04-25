@echo off
REM Smart Parking Frontend-React Quick Setup Script
REM This script automates the setup process for the React frontend

echo.
echo ========================================
echo   Smart Parking - React Setup
echo ========================================
echo.

REM Check if Node.js is installed
where /q node
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found
node --version

REM Navigate to frontend-react directory
echo.
echo Installing dependencies...
cd frontend-react

REM Install npm packages
npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Build the React app for production:
echo    npm run build
echo.
echo 2. OR, start development server:
echo    npm run dev
echo.
echo 3. In another terminal, start the backend:
echo    cd backend
echo    npm start
echo.
echo The app will be available at:
echo    http://localhost:5000 (production)
echo    http://localhost:3000 (development)
echo.
pause
