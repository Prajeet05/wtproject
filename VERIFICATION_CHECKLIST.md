# ✅ Smart Parking System - Verification Checklist

## Pre-Setup Verification

- [ ] Node.js is installed (`node --version` shows v14+)
- [ ] npm is installed (`npm --version` shows version)
- [ ] MongoDB is installed (`mongod --version` shows version)
- [ ] Port 5000 is available (not used by other apps)
- [ ] Port 27017 is available (MongoDB default)

## Installation & Setup

### Backend Setup
- [ ] Navigate to `backend` directory
- [ ] Run `npm install` successfully
- [ ] `.env` file exists in backend folder
- [ ] `package.json` has all dependencies

### MongoDB Setup
- [ ] MongoDB daemon is running (`mongod` command)
- [ ] Can connect with `mongosh` command
- [ ] No connection errors in terminal

### Server Startup
- [ ] Run `npm start` from backend directory
- [ ] See "✓ MongoDB connected successfully" message
- [ ] See "🚀 Server running on http://localhost:5000" message
- [ ] No errors in console

## Frontend Verification

### Home Page (Login/Register)
- [ ] Can access http://localhost:5000 in browser
- [ ] See "Smart Parking System" heading
- [ ] Login form is visible with email & password fields
- [ ] Register tab can be clicked
- [ ] Register form has name, email, password, confirm password fields
- [ ] Forms have proper styling

### Registration Test
- [ ] Can fill out registration form
- [ ] Can click "Register" button
- [ ] Error appears if passwords don't match
- [ ] Error appears if email already registered
- [ ] Successful registration shows success message
- [ ] Redirects to dashboard.html after registration
- [ ] Token is saved in localStorage

### Login Test
- [ ] Can fill out login form
- [ ] Can click "Login" button
- [ ] Error appears for invalid email/password
- [ ] Successful login shows success message
- [ ] Redirects to dashboard.html after login
- [ ] Token is saved in localStorage

## Dashboard Verification

### Initial Load
- [ ] Dashboard loads without errors
- [ ] User name displays in header
- [ ] User email displays in header
- [ ] "Logout" button is visible
- [ ] Page layout is responsive

### Parking Slots Display
- [ ] All 12 parking slots are displayed
- [ ] Slots are arranged in grid format
- [ ] Slots show slot numbers (A1, A2, B1, B2, etc.)
- [ ] Available slots are green
- [ ] Booked slots are red
- [ ] Available slots can be clicked
- [ ] Booked slots cannot be clicked

### Slot Statistics
- [ ] "Total Slots" shows 12
- [ ] "Available" count is correct
- [ ] "Booked" count is correct
- [ ] Statistics update when booking

### Slot Selection Dropdown
- [ ] Dropdown shows "Choose a slot..." by default
- [ ] Dropdown lists all available (green) slots
- [ ] Can select a slot from dropdown
- [ ] Selected slot is highlighted

### Booking Form
- [ ] Form is visible below slots grid
- [ ] Has fields: Select Slot, Booking Date, Time, Duration
- [ ] Booking Date field has date picker
- [ ] Minimum date is today
- [ ] Time field accepts HH:MM format
- [ ] Duration field accepts numbers 1-24
- [ ] "Book Slot" button is clickable

### Booking Creation Test
- [ ] Select an available slot
- [ ] Choose today's date
- [ ] Enter time (e.g., 10:00)
- [ ] Set duration (e.g., 2)
- [ ] Click "Book Slot"
- [ ] See success message
- [ ] See confirmation modal
- [ ] Modal shows: Slot Number, Date, Time, Duration
- [ ] Can close modal
- [ ] Slot now shows as red/booked in grid
- [ ] Slot disappears from dropdown
- [ ] Selected slot is cleared in form

### My Bookings Section
- [ ] "My Bookings" section is visible
- [ ] New booking appears as a card
- [ ] Card shows: Slot number (large), Status badge
- [ ] Card shows: Date, Time, Duration, Booked date
- [ ] Card has "Cancel" button if booking is active
- [ ] Can cancel a booking
- [ ] Cancelled booking shows "cancelled" status
- [ ] Cancelled bookings have no cancel button
- [ ] Slot becomes available again after cancellation

### UI Responsiveness
- [ ] Works on desktop (1920px width)
- [ ] Works on tablet (768px width)
- [ ] Works on mobile (480px width)
- [ ] Grid slots adjust for smaller screens
- [ ] Forms are readable on all screen sizes
- [ ] Buttons are clickable on mobile

## Backend API Testing

### Using Browser Console
```javascript
// Get token from localStorage
const token = localStorage.getItem('token');

// Test: Get all slots
fetch('http://localhost:5000/api/slots', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

### Using cURL (Terminal)
```bash
# Get slots
curl http://localhost:5000/api/slots \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return success: true and array of slots
```

### API Response Checks
- [ ] GET /api/slots returns 200 status
- [ ] Response includes all 12 slots
- [ ] Each slot has: _id, slotNumber, section, position, isBooked
- [ ] Booked slots have bookedBy value
- [ ] Available slots have bookedBy as null

## Database Verification

### MongoDB Console
```bash
mongosh
use parking-booking-system
```

- [ ] `db.users.find()` shows registered user(s)
- [ ] `db.slots.find()` shows 12 slots
- [ ] `db.bookings.find()` shows created booking(s)
- [ ] User password is hashed (starts with $2a$)
- [ ] Booking documents have all required fields

## Error Handling

### Test Error Scenarios
- [ ] Register with duplicate email shows error
- [ ] Login with wrong password shows error
- [ ] Book already booked slot shows error
- [ ] Missing required fields shows error
- [ ] Select slot not selected shows error
- [ ] Future date only works (past date shows error)
- [ ] Logout and back shows login page
- [ ] Direct access to dashboard without token redirects to login

## Performance Checks

- [ ] Page loads within 2 seconds
- [ ] Slots load within 1 second
- [ ] Booking confirmation shows within 1 second
- [ ] Cancellation completes within 1 second
- [ ] No console errors or warnings
- [ ] No infinite loops or hanging requests

## Security Checks

- [ ] Token is required for protected endpoints
- [ ] Invalid token returns 401 error
- [ ] Password is not visible in console/network
- [ ] Logout clears localStorage token
- [ ] After logout, cannot access dashboard without re-login
- [ ] Cannot access others' bookings (if multiple users)

## Multi-User Testing

- [ ] Open two browser windows (or incognito)
- [ ] Register different users in each
- [ ] User A books slot A1
- [ ] User B sees A1 as booked
- [ ] User B can book different slot (e.g., B1)
- [ ] Admin can see both bookings
- [ ] Users can only see their own bookings

## Final Checks

- [ ] All features working as expected
- [ ] No console errors in browser
- [ ] No errors in server terminal
- [ ] Application is responsive
- [ ] Styling is consistent
- [ ] All buttons and links work
- [ ] All forms validate correctly
- [ ] Database stores data correctly

## Known Working Features

✅ User Registration & Login
✅ Password Hashing & Security
✅ JWT Authentication
✅ Parking Slot Display
✅ Slot Availability Status
✅ Real-time Slot Updates
✅ Booking Creation
✅ Booking Confirmation Modal
✅ View My Bookings
✅ Cancel Bookings
✅ Admin Features (if admin user)
✅ Responsive Design
✅ Error Handling & Messages

## Troubleshooting Guide

### Server won't start
1. Is MongoDB running? (`mongod` in separate terminal)
2. Is port 5000 available? (`lsof -i:5000` on Mac/Linux)
3. Are dependencies installed? (`npm install` in backend)
4. Check .env file exists and is readable

### Cannot book slots
1. Is a slot selected in dropdown?
2. Is date today or future?
3. Is slot still available (green)?
4. Check browser console for errors
5. Check server terminal for errors

### Slots not loading
1. Refresh page (Ctrl+R or Cmd+R)
2. Check if slots initialized (might take a moment)
3. Verify backend is running
4. Check network tab in DevTools

### Cannot login/register
1. Verify server is running
2. Check email format is valid
3. Check password is 6+ characters
4. See if email already registered
5. Clear browser cache and try again

## Post-Verification

Once all checks pass:

- [ ] Mark the date as verified
- [ ] Note any issues encountered
- [ ] Document any customizations made
- [ ] Test again after any code changes
- [ ] Keep this checklist for reference

---

**Verification Date:** _______________

**Verified By:** _______________

**Status:** ☐ Fully Working ☐ Minor Issues ☐ Major Issues

**Notes:**
```
[Add any notes here]
```

---

🎉 **If all checks pass, your Smart Parking System is ready to use!**
