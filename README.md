# 🅿️ Smart Parking Slot Booking System

A full-stack web application for managing and booking parking slots with user authentication, real-time slot status, and admin features.

## 📋 Features

✅ **User Authentication**
- User registration with validation
- Secure login with JWT tokens
- Password encryption with bcryptjs

✅ **Parking Slot Management**
- 12 parking slots organized in 3 sections (A, B, C with 4 slots each)
- Real-time slot status (Available = Green, Booked = Red)
- Interactive grid-based slot display

✅ **Booking System**
- Book parking slots with date and time
- Duration selection (1-24 hours)
- Booking confirmation with details
- View all your bookings
- Cancel bookings anytime

✅ **Admin Features**
- View all bookings across all users
- Reset all slots functionality
- Admin dashboard exclusive access

✅ **Modern UI/UX**
- Clean, responsive design
- Mobile-friendly interface
- Color-coded slot status
- Real-time updates

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **JavaScript (ES6+)** - Interactive features and API calls
- **Fetch API** - Backend communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **JSON Web Tokens (JWT)** - Authentication
- **CORS** - Cross-Origin Resource Sharing

## 📁 Project Structure

```
wt_project/
├── frontend/
│   ├── index.html          # Login & Register page
│   ├── dashboard.html      # Main dashboard with slots
│   ├── css/
│   │   └── style.css       # All styling
│   └── js/
│       ├── auth.js         # Authentication logic
│       └── dashboard.js    # Booking & slot logic
├── backend/
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env                # Environment variables
│   ├── models/
│   │   ├── User.js         # User schema
│   │   ├── Slot.js         # Parking slot schema
│   │   └── Booking.js      # Booking schema
│   └── routes/
│       ├── auth.js         # Authentication routes
│       ├── slots.js        # Slot routes
│       └── bookings.js     # Booking routes
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download Community Edition](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)

### Installation & Setup

#### Step 1: Start MongoDB

**On Windows:**
```bash
# If MongoDB is installed as a service, it should run automatically
# Or start it manually:
mongod
```

**On Mac:**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

Verify MongoDB is running by opening a new terminal:
```bash
mongosh
```
You should see a connection to MongoDB. Type `exit` to quit.

#### Step 2: Install Backend Dependencies

```bash
cd wt_project/backend
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv

#### Step 3: Configure Environment Variables

The `.env` file is already created with default values. You can modify it if needed:

```env
MONGODB_URI=mongodb://localhost:27017/parking-booking-system
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

#### Step 4: Start the Backend Server

```bash
npm start
```

You should see:
```
✓ MongoDB connected successfully
🚀 Server running on http://localhost:5000
📱 Access the app at http://localhost:5000
```

#### Step 5: Access the Application

Open your browser and go to:
```
http://localhost:5000
```

## 📖 How to Use

### 1. **User Registration**
   - Click "Register here" link
   - Fill in your name, email, and password
   - Click "Register"
   - Automatically logged in and redirected to dashboard

### 2. **User Login**
   - Enter your email and password
   - Click "Login"
   - Access your dashboard

### 3. **Book a Parking Slot**
   - Select an available slot from the grid (green slots)
   - Fill in the booking details:
     - Select Slot: Choose from dropdown
     - Booking Date: Pick a future date
     - Time: Set parking start time
     - Duration: How many hours you need
   - Click "Book Slot"
   - See confirmation with all details

### 4. **View Your Bookings**
   - Scroll to "My Bookings" section
   - See all your active and cancelled bookings
   - Cancel any active booking if needed

### 5. **Admin Features** (Admin users only)
   - View All Bookings: See bookings from all users
   - Reset All Slots: Cancel all bookings and reset slots

## 🔐 Test Credentials

You can create your own account, but here's how to test:

### Test Account (Manual Creation)
1. Register a new account with any email/password
2. You can also manually create an admin account by modifying the database

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (encrypted),
  isAdmin: Boolean,
  createdAt: Date
}
```

### Slot Model
```javascript
{
  slotNumber: String (e.g., "A1", "B2"),
  section: String (A, B, or C),
  position: Number,
  isBooked: Boolean,
  bookedBy: ObjectId (User reference),
  createdAt: Date
}
```

### Booking Model
```javascript
{
  userId: ObjectId (User reference),
  slotId: ObjectId (Slot reference),
  slotNumber: String,
  bookingDate: Date,
  bookingTime: String (HH:MM),
  duration: Number (hours),
  status: String (active, completed, cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Slots
- `GET /api/slots` - Get all slots
- `POST /api/slots/initialize` - Initialize parking slots
- `GET /api/slots/:id` - Get specific slot

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user's bookings (or all if admin)
- `GET /api/bookings/:id` - Get specific booking
- `DELETE /api/bookings/:id` - Cancel booking

## 🐛 Troubleshooting

### MongoDB Connection Error
```
✗ MongoDB connection error: connect ECONNREFUSED
```
**Solution:** Make sure MongoDB is running:
```bash
mongod
# Or check if it's running as a service
```

### Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process using port 5000:

On Windows (PowerShell):
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

On Mac/Linux:
```bash
lsof -ti:5000 | xargs kill -9
```

### CORS Error
Make sure your backend is running and the API_BASE_URL in frontend JS files is correct.

### Cannot connect to server
1. Check if backend server is running (you should see the startup messages)
2. Ensure no firewall is blocking port 5000
3. Try accessing `http://localhost:5000` directly in browser

## 🎨 Customization

### Change Parking Slots
Edit `backend/routes/slots.js` in the `initializeSlots` function to change:
- Number of sections
- Slots per section
- Slot naming convention

### Change Colors
Edit `frontend/css/style.css` and modify the CSS variables:
```css
:root {
    --primary-color: #2563eb;
    --success-color: #10b981;    /* Available slots */
    --danger-color: #ef4444;     /* Booked slots */
    ...
}
```

### Change Port
Modify `backend/.env`:
```env
PORT=3000
```
Or set when starting:
```bash
PORT=3000 npm start
```

## 📝 Notes

- Passwords are hashed using bcryptjs with 10 salt rounds
- JWT tokens expire after 7 days
- All API requests require authentication (except registration and login)
- Slot bookings are associated with the logged-in user
- The system auto-initializes slots on first API call if they don't exist

## 🚀 Deployment

### To deploy to production:

1. **Update JWT Secret:**
   ```env
   JWT_SECRET=your_long_random_secret_key
   ```

2. **Use MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parking-booking
   ```

3. **Build frontend** (if using a bundler)
4. **Deploy backend** to services like:
   - Heroku
   - Railway
   - Render
   - AWS
   - DigitalOcean

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Smart Parking System - Full Stack Application

## 📞 Support

For issues or questions, please check the console logs for detailed error messages.

---

**Happy Parking! 🅿️**
