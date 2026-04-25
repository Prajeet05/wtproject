// Slots Routes - Get available slots
const express = require('express');
const Slot = require('../models/Slot');

const router = express.Router();

/**
 * POST /api/slots/initialize
 * Initialize parking slots (run once to populate database)
 */
router.post('/initialize', async (req, res) => {
  try {
    // Check if slots already exist
    const existingSlots = await Slot.countDocuments();
    if (existingSlots > 0) {
      return res.status(400).json({
        success: false,
        message: 'Slots already initialized'
      });
    }

    // Create slots: 5 sections (A, B, C, D, E) with 5 slots each = 25 total slots
    const slots = [];
    const sections = ['A', 'B', 'C', 'D', 'E'];

    sections.forEach(section => {
      for (let i = 1; i <= 5; i++) {
        slots.push({
          slotNumber: `${section}${i}`,
          section: section,
          position: i,
          isBooked: false
        });
      }
    });

    const insertedSlots = await Slot.insertMany(slots);

    res.status(201).json({
      success: true,
      message: `${insertedSlots.length} slots created successfully`,
      slots: insertedSlots
    });
  } catch (error) {
    console.error('Slot initialization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initialize slots'
    });
  }
});

/**
 * GET /api/slots
 * Get all parking slots with their status
 */
router.get('/', async (req, res) => {
  try {
    // Get all slots, sorted by section and position
    let slots = await Slot.find().sort({ section: 1, position: 1 });

    // If no slots exist or incorrect number of slots, reinitialize them
    if (slots.length === 0 || slots.length !== 25) {
      // Delete all existing slots
      await Slot.deleteMany({});

      const sections = ['A', 'B', 'C', 'D', 'E'];
      const newSlots = [];

      sections.forEach(section => {
        for (let i = 1; i <= 5; i++) {
          newSlots.push({
            slotNumber: `${section}${i}`,
            section: section,
            position: i,
            isBooked: false
          });
        }
      });

      const insertedSlots = await Slot.insertMany(newSlots);
      return res.status(200).json({
        success: true,
        message: 'Slots auto-initialized',
        slots: insertedSlots
      });
    }

    res.status(200).json({
      success: true,
      message: 'Slots retrieved successfully',
      slots: slots
    });
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve slots'
    });
  }
});

/**
 * GET /api/slots/all
 * Get all slots without filtering (alias for GET /)
 */
router.get('/all', async (req, res) => {
  try {
    const slots = await Slot.find().sort({ section: 1, position: 1 });

    res.status(200).json({
      success: true,
      message: 'All slots retrieved successfully',
      slots: slots
    });
  } catch (error) {
    console.error('Get all slots error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve all slots'
    });
  }
});

/**
 * POST /api/slots/book
 * Book a specific slot
 */
router.post('/book', async (req, res) => {
  try {
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({
        success: false,
        message: 'Slot ID is required'
      });
    }

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: 'Slot is already booked'
      });
    }

    // This endpoint just returns slot info; actual booking is handled by bookings route
    res.status(200).json({
      success: true,
      message: 'Slot is available for booking',
      slot: slot
    });
  } catch (error) {
    console.error('Book slot error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to book slot'
    });
  }
});

/**
 * POST /api/slots/reset
 * Reset all slots (admin only)
 */
router.post('/reset', async (req, res) => {
  try {
    // Reset all slots to available
    const result = await Slot.updateMany(
      {},
      { isBooked: false, bookedBy: null }
    );

    res.status(200).json({
      success: true,
      message: 'All slots reset successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Reset slots error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset slots'
    });
  }
});

/**
 * PUT /api/slots/:id
 * Update slot status
 */
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      { isBooked: status === 'booked' },
      { new: true }
    );

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Slot updated successfully',
      slot: slot
    });
  } catch (error) {
    console.error('Update slot error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update slot'
    });
  }
});

/**
 * GET /api/slots/:id
 * Get a specific slot by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    res.status(200).json({
      success: true,
      slot: slot
    });
  } catch (error) {
    console.error('Get slot error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve slot'
    });
  }
});

module.exports = router;
