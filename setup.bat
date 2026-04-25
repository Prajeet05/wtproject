@echo off
REM Smart Parking System - Windows Setup Script
REM This script automates the installation process

echo.
echo ===============================================
echo  Smart Parking System - Windows Setup
echo ===============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MongoDB is not found in PATH
    echo Please ensure MongoDB is installed and running
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
)

echo [✓] Node.js found
echo.

REM Navigate to backend directory
cd backend

echo [INFO] Installing backend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)

echo.
echo [✓] Backend dependencies installed successfully!
echo.
echo ===============================================
echo  Setup Complete!
echo ===============================================
echo.
echo Next steps:
echo.
echo 1. Start MongoDB:
echo    - Open MongoDB Compass or Command Prompt
echo    - Run: mongod
echo.
echo 2. Start the server (from backend directory):
echo    - Run: npm start
echo.
echo 3. Open your browser:
echo    - http://localhost:5000
echo.
echo 4. Register and start booking parking slots!
echo.
echo ===============================================
echo.
pause
