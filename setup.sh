#!/bin/bash
# Smart Parking System - Mac/Linux Setup Script

echo "========================================"
echo "  Smart Parking System - Setup"
echo "========================================"
echo

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "[✓] Node.js found: $(node --version)"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "[WARNING] MongoDB not found in PATH"
    echo "Install with: brew install mongodb-community (Mac) or apt install mongodb (Linux)"
    echo
fi

# Install backend dependencies
cd backend
echo "[INFO] Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "[ERROR] npm install failed!"
    exit 1
fi

echo
echo "[✓] Backend dependencies installed!"
echo
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo
echo "Next steps:"
echo
echo "1. Start MongoDB:"
echo "   mongod"
echo
echo "2. Start the server (new terminal, from backend dir):"
echo "   npm start"
echo
echo "3. Open browser:"
echo "   http://localhost:5000"
echo
echo "========================================"
