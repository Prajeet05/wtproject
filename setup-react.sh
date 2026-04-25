#!/bin/bash

# Smart Parking Frontend-React Quick Setup Script
# This script automates the setup process for the React frontend

echo ""
echo "========================================"
echo "   Smart Parking - React Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found"
node --version

# Navigate to frontend-react directory
echo ""
echo "Installing dependencies..."
cd frontend-react

# Install npm packages
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "========================================"
echo "✓ Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Build the React app for production:"
echo "   npm run build"
echo ""
echo "2. OR, start development server:"
echo "   npm run dev"
echo ""
echo "3. In another terminal, start the backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "The app will be available at:"
echo "    http://localhost:5000 (production)"
echo "    http://localhost:3000 (development)"
echo ""
