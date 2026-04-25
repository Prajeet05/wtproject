# 🏗️ System Architecture & Design Documentation

## 📐 Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Frontend)                   │
│  HTML (index.html, dashboard.html) + CSS (style.css)        │
│  JavaScript (auth.js, dashboard.js) + Fetch API             │
│  Browser Local Storage (Tokens, User Data)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                 HTTP/REST Requests
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   API LAYER (Backend)                        │
│  Express.js Server (server.js)                              │
│  ├── Routes (routes/)                                        │
│  │   ├── auth.js (Register, Login)                          │
│  │   ├── slots.js (Get Slots, Initialize)                   │
│  │   └── bookings.js (CRUD Bookings)                        │
│  │                                                           │
│  ├── Models (models/) - Mongoose Schemas                    │
│  │   ├── User.js (name, email, password, isAdmin)           │
│  │   ├── Slot.js (slotNumber, section, isBooked)            │
│  │   └── Booking.js (userId, slotId, date, time)            │
│  │                                                           │
│  └── Middleware                                              │
│      ├── CORS (Enable cross-origin requests)                │
│      ├── JSON Parser (Parse request bodies)                 │
│      └── JWT Verification (Protect endpoints)               │
└────────────────────────┬────────────────────────────────────┘
                         │
                 MongoDB Protocol
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  DATABASE LAYER                              │
│  MongoDB (parking-booking-system)                            │
│  ├── users (User documents)                                 │
│  ├── slots (Slot documents)                                 │
│  └── bookings (Booking documents)                           │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### User Registration Flow
```
1. User enters details → Frontend (auth.js)
2. Fetch POST /api/auth/register → Backend
3. Validate email not exists → Check MongoDB
4. Hash password with bcryptjs
5. Create User document → Save to MongoDB
6. Generate JWT token
7. Return token & user info → Frontend
8. Store token in localStorage
9. Redirect to dashboard
```

### Slot Booking Flow
```
1. User clicks available slot → Frontend (dashboard.js)
2. Select booking details (date, time, duration)
3. Fetch POST /api/bookings → Backend
4. Verify JWT token
5. Check slot availability
6. Create Booking document
7. Update Slot (isBooked = true)
8. Return confirmation → Frontend
9. Show modal with details
10. Reload slots and bookings
```

### Admin View All Bookings Flow
```
1. Admin clicks "View All Bookings"
2. Fetch GET /api/bookings (with token that has isAdmin=true)
3. Backend verifies isAdmin flag
4. Return ALL bookings from MongoDB
5. Frontend displays in grid format
```

## 🔐 Security Features

### Password Security
- **Hashing Algorithm:** bcryptjs with 10 salt rounds
- **Never stored as plain text**
- **Compared during login:** `bcrypt.compare(enteredPassword, hashedPassword)`

### Token Security
- **Type:** JSON Web Token (JWT)
- **Secret Key:** Environment variable (never exposed in code)
- **Expiration:** 7 days
- **Payload:** `{ id, email, isAdmin }`

### Access Control
- **Authentication:** Required for all endpoints except register & login
- **Authorization:** 
  - Regular users: Only see their own bookings
  - Admin users: Can see all bookings and reset slots

### Data Validation
- **Email:** Regex validation + unique constraint in MongoDB
- **Password:** Minimum 6 characters, must match confirmation
- **Date:** Must be current date or future
- **Time:** 24-hour format (HH:MM)

## 🗄️ Database Schema

### User Collection
```javascript
db.users.find()
// [
//   {
//     _id: ObjectId("..."),
//     name: "John Doe",
//     email: "john@example.com",
//     password: "$2a$10$...", // Hashed
//     isAdmin: false,
//     createdAt: ISODate("2024-04-23T10:00:00Z")
//   }
// ]
```

### Slots Collection
```javascript
db.slots.find().sort({ section: 1, position: 1 })
// [
//   {
//     _id: ObjectId("..."),
//     slotNumber: "A1",
//     section: "A",
//     position: 1,
//     isBooked: false,
//     bookedBy: null,
//     createdAt: ISODate("2024-04-23T10:00:00Z")
//   },
//   {
//     _id: ObjectId("..."),
//     slotNumber: "A2",
//     section: "A",
//     position: 2,
//     isBooked: true,
//     bookedBy: ObjectId("507f1f77bcf86cd799439011"),
//     createdAt: ISODate("2024-04-23T10:00:00Z")
//   },
//   ...
// ]
```

### Bookings Collection
```javascript
db.bookings.find()
// [
//   {
//     _id: ObjectId("..."),
//     userId: ObjectId("507f1f77bcf86cd799439011"),
//     slotId: ObjectId("507f1f77bcf86cd799439012"),
//     slotNumber: "A1",
//     bookingDate: ISODate("2024-04-25T00:00:00Z"),
//     bookingTime: "10:30",
//     duration: 2,
//     status: "active",  // active, completed, cancelled
//     createdAt: ISODate("2024-04-23T11:00:00Z"),
//     updatedAt: ISODate("2024-04-23T11:00:00Z")
//   }
// ]
```

## 🎯 Key Features Explained

### 1. Automatic Slot Initialization
- **When:** First call to GET /api/slots if database is empty
- **What:** Creates 12 slots (A1-A4, B1-B4, C1-C4)
- **Why:** No manual setup needed

### 2. Real-time Slot Status
- **Available (Green):** `isBooked = false`
- **Booked (Red):** `isBooked = true`
- **Updates:** When booking or canceling

### 3. Booking Validation
```
✓ Slot must exist
✓ Slot must not be booked
✓ User cannot book same slot twice on same date
✓ Booking date must be today or future
✓ Time and duration must be valid
```

### 4. Cancellation Flow
```
1. User clicks "Cancel"
2. Confirmation dialog
3. Fetch DELETE /api/bookings/:id
4. Booking status → "cancelled"
5. Slot.isBooked → false
6. Slot.bookedBy → null
7. UI updates instantly
```

## 📊 Database Indexes

**Recommended indexes for optimal performance:**

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Slots
db.slots.createIndex({ slotNumber: 1 }, { unique: true })
db.slots.createIndex({ section: 1, position: 1 })

// Bookings
db.bookings.createIndex({ userId: 1 })
db.bookings.createIndex({ slotId: 1 })
db.bookings.createIndex({ userId: 1, createdAt: -1 })
db.bookings.createIndex({ bookingDate: 1 })
```

## 🚀 Performance Considerations

### Frontend Optimization
- **Lazy Loading:** Bookings loaded on demand
- **Caching:** Slots fetched once, updated on booking
- **Debouncing:** Form submission prevented during request
- **Local Storage:** Reduces re-authentication

### Backend Optimization
- **Query Population:** Efficient data retrieval with `.populate()`
- **Pagination Ready:** Can add limit/skip for large datasets
- **Indexing:** MongoDB indexes on frequently queried fields
- **Middleware:** CORS, compression ready

### Database Optimization
- **Document Size:** Keeping documents lean and normalized
- **References:** Using ObjectId references instead of embedding
- **Atomic Operations:** Each operation is atomic

## 🧪 Testing Scenarios

### Test Case 1: Complete Booking Flow
```
1. Register new account
2. View slots (should see 12 slots, all available)
3. Select slot A1, today, 10:00, 2 hours
4. Confirm booking
5. Check "My Bookings" section
6. Verify slot A1 is now red (booked)
```

### Test Case 2: Multiple Users
```
1. Register User A
2. Book slot A1
3. Logout
4. Register User B
5. Try to book slot A1 (should fail)
6. Book slot B1 instead (should succeed)
7. Admin views all bookings (should see both)
```

### Test Case 3: Cancellation
```
1. User books a slot
2. Verify it's booked (red)
3. Click "Cancel" on booking
4. Confirm cancellation
5. Verify slot is available again (green)
```

## 🔧 Customization Guide

### Add New Parking Section
**File:** `backend/routes/slots.js`
```javascript
// Change sections array
const sections = ['A', 'B', 'C', 'D']; // Add 'D'
// Change positions per section
for (let i = 1; i <= 6; i++) { // Change 4 to 6
```

### Modify JWT Expiration
**File:** `backend/routes/auth.js`
```javascript
{ expiresIn: '30d' } // Change from '7d' to '30d'
```

### Change Colors
**File:** `frontend/css/style.css`
```css
:root {
    --success-color: #10b981; /* Green for available */
    --danger-color: #ef4444;  /* Red for booked */
}
```

### Add Booking Duration Limits
**File:** `backend/routes/bookings.js`
```javascript
if (duration > 24 || duration < 1) {
    // Return error
}
```

## 📈 Future Enhancements

Possible features to add:

1. **Payment Integration**
   - Stripe/PayPal for paid bookings
   - Invoice generation

2. **Email Notifications**
   - Confirmation emails
   - Reminder emails

3. **Ratings & Reviews**
   - User reviews for parking areas
   - Star ratings

4. **Advanced Analytics**
   - Booking statistics
   - Peak hour analysis
   - Revenue reports

5. **Mobile App**
   - React Native/Flutter mobile application
   - Push notifications

6. **Multi-location Support**
   - Multiple parking areas
   - Location selection

7. **Real-time Updates**
   - WebSocket integration
   - Live slot updates across browsers

8. **Calendar View**
   - Month/week view of bookings
   - Visual availability

## 🐛 Debugging Tips

### Enable Detailed Logging
**File:** `backend/server.js`
```javascript
// Add before routes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});
```

### Browser DevTools
- **Network Tab:** Check API requests/responses
- **Console Tab:** JavaScript errors
- **Application Tab:** Check localStorage tokens

### MongoDB Shell
```bash
mongosh

# Show databases
show dbs

# Use parking database
use parking-booking-system

# Show collections
show collections

# View users
db.users.find()

# View bookings
db.bookings.find().pretty()
```

## 📚 Code Organization

### Frontend Structure
```
frontend/
├── index.html          # Public page (login/register)
├── dashboard.html      # Protected page (after login)
├── css/
│   └── style.css       # All styling (1000+ lines)
└── js/
    ├── auth.js         # Authentication logic
    └── dashboard.js    # Booking logic
```

### Backend Structure
```
backend/
├── server.js           # Express app setup
├── package.json        # Dependencies
├── .env                # Configuration
├── models/
│   ├── User.js         # User schema & methods
│   ├── Slot.js         # Slot schema
│   └── Booking.js      # Booking schema
└── routes/
    ├── auth.js         # Login/Register endpoints
    ├── slots.js        # Slot CRUD endpoints
    └── bookings.js     # Booking CRUD endpoints
```

---

**This architecture ensures scalability, security, and maintainability. 🎯**
