// backend/routes/authRoutes.js
import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Signup route
router.post('/signup', register);

// Login route
router.post('/login', login);

// Profile route (protected)
router.get('/profile', protect, getProfile);

export default router;
