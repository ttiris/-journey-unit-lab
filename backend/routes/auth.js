import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 10);

  // Create user
  const user = new User({
    email,
    username,
    password_hash: hashedPassword
  });

  await user.save();

  // Generate token
  const token = jwt.sign(
    { _id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      _id: user._id,
      email: user.email,
      username: user.username
    }
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token
  const token = jwt.sign(
    { _id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      email: user.email,
      username: user.username
    }
  });
}));

import { verifyToken } from '../middleware/authMiddleware.js';

// Get current user
router.get('/me', verifyToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password_hash');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
}));

export default router;
