# ⚡ Quick Start Guide - Smart Parking System (React Version)

## 🎯 60-Second Setup

### Prerequisites Check ✓
- [ ] Node.js installed? `node --version` (should be v16+)
- [ ] MongoDB running? (Backend requirement)

### Step 1️⃣: Install React Frontend Dependencies
```bash
cd wt_project/frontend-react
npm install
```

### Step 2️⃣: Build React App
```bash
npm run build
```

### Step 3️⃣: Install & Start Backend (New Terminal)
```bash
cd wt_project/backend
npm install  # if not already installed
npm start
```

### Step 4️⃣: Open in Browser
```
http://localhost:5000
```

**Done!** Your Smart Parking React app is running! 🎉

---

## 🚀 Development Mode (Hot Reload)

Want to modify code and see changes instantly?

### Terminal 1: React Dev Server
```bash
cd wt_project/frontend-react
npm run dev
```
App runs on: `http://localhost:3000`

### Terminal 2: Backend API
```bash
cd wt_project/backend
npm start
```
API runs on: `http://localhost:5000`

Both terminals should show success messages. API requests automatically forward to backend.

---

## 📋 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |

---

## 🔑 Test Credentials

You can test the system immediately after setup:

**Option 1: Use Admin Account** (if exists)
- Email: `admin@example.com`
- Password: `(ask admin)`

**Option 2: Create New Account**
- Click "Register here" on login page
- Create your own account
- Test booking parking slots

---

## 📂 Project Structure

```
wt_project/
├── frontend/           ← [OLD] Original HTML files
├── frontend-react/     ← [NEW] React application
│   ├── src/
│   │   ├── pages/      # Auth, Dashboard, Admin pages
│   │   ├── components/ # Reusable components
│   │   ├── services/   # API client
│   │   ├── context/    # Auth state
│   │   └── styles/     # CSS files
│   └── dist/           # Built app (after npm run build)
└── backend/            # Express API
```

---

## 🔍 What's New in React Version?

✅ Component-based architecture
✅ Hot module reloading (dev only)
✅ React Router for navigation
✅ Context API for state management  
✅ Axios for API calls
✅ Vite for fast builds
✅ Protected routes for authentication
✅ Responsive design

---

## 🆘 Common Issues & Fixes

**"Port 3000 already in use"**
```bash
npm run dev -- --port 3001
```

**"Cannot GET /" in browser**
- Run: `npm run build` in frontend-react
- Then restart backend: `npm start` in backend

**"API connection error"**
- Check backend is running: `npm start` in backend folder
- Verify http://localhost:5000/api is accessible
- Check browser console for CORS errors

**"Module not found" error**
```bash
cd frontend-react
rm -r node_modules
npm install
npm run build
```

---

## 📚 Learn More

- `REACT_MIGRATION_GUIDE.md` - Complete React migration details
- `frontend-react/README.md` - Full frontend documentation
- `API_DOCUMENTATION.md` - Backend API reference

---

## 🎓 File Locations

| What | Where |
|------|-------|
| React Components | `frontend-react/src/pages/` |
| Styling | `frontend-react/src/styles/` |
| API Client | `frontend-react/src/services/api.js` |
| Auth State | `frontend-react/src/context/AuthContext.jsx` |
| Routes Config | `frontend-react/src/App.jsx` |
| Backend Server | `backend/server.js` |

---

**Now you're ready! Start with:**
```bash
cd wt_project/frontend-react
npm install && npm run build
cd ../backend
npm start
```

Then visit: **http://localhost:5000** 🚀
Wait for:
```
✓ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### Step 3️⃣: Open Application
```
Open browser → http://localhost:5000
```

### Step 4️⃣: Test It! 🎉

**Create Account:**
1. Click "Register here"
2. Fill in details
3. Click "Register"

**Book a Slot:**
1. On dashboard, select a green (available) slot
2. Pick date & time
3. Click "Book Slot"
4. See confirmation!

---

## 🎮 Test Actions

### Available Slots
- All green slots are available for booking

### Make a Booking
- Select any green slot
- Pick today or future date
- Enter time (e.g., 10:00)
- Set duration (1-24 hours)
- Confirm!

### View Bookings
- Scroll to "My Bookings" section
- See all your reservations
- Cancel if needed

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to server" | Make sure `mongod` and `npm start` are running |
| "Port 5000 in use" | Kill process: `lsof -ti:5000 \| xargs kill -9` (Mac/Linux) |
| "MongoDB connection error" | Run `mongod` in separate terminal |
| Slots not loading | Try refreshing browser (Ctrl+R or Cmd+R) |
| Login fails | Create new account instead |

---

## 📁 Project Structure at a Glance

```
wt_project/
├── backend/          ← Node.js API Server
│   ├── server.js     ← Main server
│   ├── models/       ← Database schemas
│   ├── routes/       ← API endpoints
│   └── package.json  ← Dependencies
└── frontend/         ← HTML, CSS, JS
    ├── index.html    ← Login page
    ├── dashboard.html ← Main app
    ├── css/
    └── js/
```

---

## 🔐 Login Credentials

**Create your own!** Register a new account with any email/password.

---

## 📞 Still Stuck?

1. Check browser console (F12 → Console tab) for errors
2. Check terminal where `npm start` is running for server errors
3. Ensure MongoDB is running in a separate terminal
4. Try refreshing the page or clearing browser cache

---

## 🚀 Next Steps

After testing:
1. **Customize colors** → Edit `frontend/css/style.css`
2. **Change slot layout** → Edit `backend/routes/slots.js`
3. **Add features** → Modify backend routes and frontend components

---

**That's it! You now have a working parking system! 🅿️**
