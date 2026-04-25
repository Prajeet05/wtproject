// Bookings Routes - Create, get, and manage bookings
const express = require('express');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const jwt = require('jsonwebtoken');

const router = express.Router();

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';

/**
 * Middleware to verify JWT token
 */
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin || false;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * POST /api/bookings
 * Create a new booking
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { slotId, bookingDate, bookingTime, duration } = req.body;

    // Validation
    if (!slotId || !bookingDate || !bookingTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if slot exists
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    // Check if slot is already booked
    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: 'Slot is already booked'
      });
    }

    // Check if user already has a booking for this slot on the same date
    const existingBooking = await Booking.findOne({
      userId: req.userId,
      slotId: slotId,
      bookingDate: new Date(bookingDate),
      status: 'active'
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active booking for this slot on this date'
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.userId,
      slotId: slotId,
      slotNumber: slot.slotNumber,
      bookingDate: new Date(bookingDate),
      bookingTime: bookingTime,
      duration: duration || 1
    });

    // Update slot status
    slot.isBooked = true;
    slot.bookedBy = req.userId;
    await slot.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
});

/**
 * GET /api/bookings/user
 * Get current user's bookings
 */
router.get('/user', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('userId', 'name email')
      .populate('slotId', 'slotNumber section position isBooked')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User bookings retrieved successfully',
      bookings: bookings,
      total: bookings.length
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve user bookings'
    });
  }
});

/**
 * GET /api/bookings/all
 * Get all bookings (admin only)
 */
router.get('/all', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view all bookings'
      });
    }

    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('slotId', 'slotNumber section position isBooked')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All bookings retrieved successfully',
      bookings: bookings,
      total: bookings.length
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve all bookings'
    });
  }
});

/**
 * GET /api/bookings
 * Get bookings (all bookings for admin, user's bookings for regular users)
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    let query = {};

    // Regular users get only their bookings
    if (!req.isAdmin) {
      query.userId = req.userId;
    }

    // Get bookings with populated user and slot info
    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('slotId', 'slotNumber section position isBooked')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      bookings: bookings,
      total: bookings.length
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve bookings'
    });
  }
});

/**
 * GET /api/bookings/:id
 * Get a specific booking
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('slotId', 'slotNumber section position isBooked');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    if (!req.isAdmin && booking.userId._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve booking'
    });
  }
});

/**
 * DELETE /api/bookings/:id
 * Cancel a booking
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to cancel this booking
    if (!req.isAdmin && booking.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update slot status
    const slot = await Slot.findById(booking.slotId);
    if (slot) {
      slot.isBooked = false;
      slot.bookedBy = null;
      await slot.save();
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel booking'
    });
  }
});

/**
 * POST /api/bookings/:id/cancel
 * Cancel a booking (POST version for compatibility)
 */
router.post('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to cancel this booking
    if (!req.isAdmin && booking.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update slot status
    const slot = await Slot.findById(booking.slotId);
    if (slot) {
      slot.isBooked = false;
      slot.bookedBy = null;
      await slot.save();
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel booking'
    });
  }
});

module.exports = router;
