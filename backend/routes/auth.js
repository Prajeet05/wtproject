// Authentication Routes - Register and Login
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';

// List of allowed admin emails
const ALLOWED_ADMINS = [
  'prajeetv@gmail.com',
  'adithyansa@gmail.com',
  'gokulshankark@gmail.com'
];

/**
 * Check if email is allowed to be admin
 */
const isAllowedAdmin = (email) => {
  return ALLOWED_ADMINS.includes(email.toLowerCase());
};

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user (explicitly NOT an admin)
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: false  // Always ensure new registrations are regular users
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: false },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and get password field (which is normally hidden)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify admin status - only allowed emails can be admin
    const userIsAdmin = isAllowedAdmin(user.email) && user.isAdmin;

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: userIsAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: userIsAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
});

/**
 * POST /api/auth/setup-admins
 * Setup three admin users (internal use only)
 */
router.post('/setup-admins', async (req, res) => {
  try {
    // Remove all existing admin users
    await User.deleteMany({ isAdmin: true });

    // Create three new admin users
    const adminEmails = [
      'prajeetv@gmail.com',
      'adithyansa@gmail.com',
      'gokulshankark@gmail.com'
    ];

    const createdAdmins = [];
    const password = '123456';

    for (const email of adminEmails) {
      // Extract name from email
      const name = email.split('@')[0].replace(/[0-9]/g, '').toUpperCase();

      // Check if user already exists (non-admin)
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        // Update to admin
        existingUser.isAdmin = true;
        await existingUser.save();
        createdAdmins.push({
          name: existingUser.name,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin,
          status: 'Updated to Admin'
        });
      } else {
        // Create new admin user
        const user = await User.create({
          name,
          email,
          password,
          isAdmin: true
        });

        createdAdmins.push({
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          status: 'Created'
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Admin users setup completed',
      admins: createdAdmins
    });
  } catch (error) {
    console.error('Setup admins error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to setup admin users'
    });
  }
});

module.exports = router;
