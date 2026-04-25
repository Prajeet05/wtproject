# 📡 API Documentation - Smart Parking System

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error
- `500` - Server error

---

### 2. Login User
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Missing credentials
- `401` - Invalid credentials
- `500` - Server error

---

## 🅿️ Slots Endpoints

### 3. Get All Slots
**Endpoint:** `GET /api/slots`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Slots retrieved successfully",
  "slots": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "slotNumber": "A1",
      "section": "A",
      "position": 1,
      "isBooked": false,
      "bookedBy": null,
      "createdAt": "2024-04-23T10:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "slotNumber": "A2",
      "section": "A",
      "position": 2,
      "isBooked": true,
      "bookedBy": "507f1f77bcf86cd799439013",
      "createdAt": "2024-04-23T10:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Slots retrieved
- `401` - Unauthorized
- `500` - Server error

---

### 4. Initialize Slots
**Endpoint:** `POST /api/slots/initialize`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success):**
```json
{
  "success": true,
  "message": "12 slots created successfully",
  "slots": [...]
}
```

**Status Codes:**
- `201` - Slots created
- `400` - Slots already exist
- `500` - Server error

---

### 5. Get Single Slot
**Endpoint:** `GET /api/slots/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Slot MongoDB ID

**Response (Success):**
```json
{
  "success": true,
  "slot": {
    "_id": "507f1f77bcf86cd799439011",
    "slotNumber": "A1",
    "section": "A",
    "position": 1,
    "isBooked": false,
    "bookedBy": null,
    "createdAt": "2024-04-23T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Slot found
- `404` - Slot not found
- `401` - Unauthorized
- `500` - Server error

---

## 📅 Bookings Endpoints

### 6. Create Booking
**Endpoint:** `POST /api/bookings`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "slotId": "507f1f77bcf86cd799439011",
  "bookingDate": "2024-04-25",
  "bookingTime": "10:30",
  "duration": 2
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "507f1f77bcf86cd799439020",
    "userId": "507f1f77bcf86cd799439011",
    "slotId": "507f1f77bcf86cd799439012",
    "slotNumber": "A1",
    "bookingDate": "2024-04-25T00:00:00Z",
    "bookingTime": "10:30",
    "duration": 2,
    "status": "active",
    "createdAt": "2024-04-23T11:00:00Z",
    "updatedAt": "2024-04-23T11:00:00Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Slot is already booked"
}
```

**Status Codes:**
- `201` - Booking created
- `400` - Validation error or slot unavailable
- `401` - Unauthorized
- `404` - Slot not found
- `500` - Server error

---

### 7. Get Bookings
**Endpoint:** `GET /api/bookings`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (Optional):**
- None (regular users see their own bookings, admins see all)

**Response (Success):**
```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "total": 2,
  "bookings": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "slotId": {
        "_id": "507f1f77bcf86cd799439012",
        "slotNumber": "A1",
        "section": "A",
        "position": 1,
        "isBooked": true
      },
      "slotNumber": "A1",
      "bookingDate": "2024-04-25T00:00:00Z",
      "bookingTime": "10:30",
      "duration": 2,
      "status": "active",
      "createdAt": "2024-04-23T11:00:00Z",
      "updatedAt": "2024-04-23T11:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Bookings retrieved
- `401` - Unauthorized
- `500` - Server error

---

### 8. Get Single Booking
**Endpoint:** `GET /api/bookings/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Booking MongoDB ID

**Response (Success):**
```json
{
  "success": true,
  "booking": {
    "_id": "507f1f77bcf86cd799439020",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "slotId": {
      "_id": "507f1f77bcf86cd799439012",
      "slotNumber": "A1",
      "section": "A",
      "position": 1,
      "isBooked": true
    },
    "slotNumber": "A1",
    "bookingDate": "2024-04-25T00:00:00Z",
    "bookingTime": "10:30",
    "duration": 2,
    "status": "active",
    "createdAt": "2024-04-23T11:00:00Z",
    "updatedAt": "2024-04-23T11:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Booking found
- `401` - Unauthorized
- `403` - Forbidden (cannot view others' bookings)
- `404` - Booking not found
- `500` - Server error

---

### 9. Cancel Booking
**Endpoint:** `DELETE /api/bookings/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Booking MongoDB ID

**Response (Success):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "booking": {
    "_id": "507f1f77bcf86cd799439020",
    "userId": "507f1f77bcf86cd799439011",
    "slotId": "507f1f77bcf86cd799439012",
    "slotNumber": "A1",
    "bookingDate": "2024-04-25T00:00:00Z",
    "bookingTime": "10:30",
    "duration": 2,
    "status": "cancelled",
    "createdAt": "2024-04-23T11:00:00Z",
    "updatedAt": "2024-04-23T12:00:00Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Not authorized to cancel this booking"
}
```

**Status Codes:**
- `200` - Booking cancelled
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Booking not found
- `500` - Server error

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Slots
```bash
curl -X GET http://localhost:5000/api/slots \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "slotId": "SLOT_ID_HERE",
    "bookingDate": "2024-04-25",
    "bookingTime": "10:30",
    "duration": 2
  }'
```

---

## 📊 Data Models

### User Document
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,  // Hashed
  isAdmin: Boolean,
  createdAt: Date
}
```

### Slot Document
```javascript
{
  _id: ObjectId,
  slotNumber: String,     // e.g., "A1"
  section: String,        // e.g., "A"
  position: Number,       // e.g., 1
  isBooked: Boolean,
  bookedBy: ObjectId,     // Reference to User
  createdAt: Date
}
```

### Booking Document
```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // Reference to User
  slotId: ObjectId,       // Reference to Slot
  slotNumber: String,     // e.g., "A1"
  bookingDate: Date,      // 2024-04-25
  bookingTime: String,    // "10:30"
  duration: Number,       // Hours
  status: String,         // "active", "completed", "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Authentication Details

- **Password Hashing:** bcryptjs with 10 salt rounds
- **Token Type:** JSON Web Token (JWT)
- **Token Expiration:** 7 days
- **Token Claims:** id, email, isAdmin

---

## ⚠️ Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## 📝 Example Flow

1. **Register User**
   ```
   POST /api/auth/register → Get token
   ```

2. **Get Available Slots**
   ```
   GET /api/slots + token → See all slots
   ```

3. **Book a Slot**
   ```
   POST /api/bookings + token + slot data → Create booking
   ```

4. **View Your Bookings**
   ```
   GET /api/bookings + token → See your bookings
   ```

5. **Cancel Booking** (if needed)
   ```
   DELETE /api/bookings/:id + token → Cancel booking
   ```

---

**For more info, check the frontend code in `frontend/js/dashboard.js` and `frontend/js/auth.js`**
