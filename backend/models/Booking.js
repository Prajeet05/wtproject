// Booking Model - stores all parking slot bookings
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: [true, 'Slot ID is required']
  },
  slotNumber: {
    type: String,
    required: true
    // Store slot number for easier reference
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  bookingTime: {
    type: String,
    required: [true, 'Booking time is required']
    // Format: HH:MM (24-hour format)
  },
  duration: {
    type: Number,
    default: 1
    // Duration in hours
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
