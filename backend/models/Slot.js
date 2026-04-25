// Slot Model - represents parking slots
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: [true, 'Please provide a slot number'],
    unique: true,
    uppercase: true,
    trim: true
    // Format: A1, A2, B1, B2, C1, etc.
  },
  section: {
    type: String,
    required: true,
    uppercase: true
    // A, B, C sections
  },
  position: {
    type: Number,
    required: true
    // Position number within section
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Slot', slotSchema);
