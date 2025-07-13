import express from 'express';
import {
  updateProfile,
  addToWishlist,
  removeFromWishlist,
  getUserActivity
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile (name, email, etc.)
 * @access  Private
 */
router.put('/profile', protect, updateProfile);

/**
 * @route   POST /api/user/wishlist/add
 * @desc    Add a product to the user's wishlist
 * @access  Private
 * @body    { productId }
 */
router.post('/wishlist/add', protect, addToWishlist);

/**
 * @route   POST /api/user/wishlist/remove
 * @desc    Remove a product from the user's wishlist
 * @access  Private
 * @body    { productId }
 */
router.post('/wishlist/remove', protect, removeFromWishlist);

/**
 * @route   GET /api/user/activity
 * @desc    Get user profile, wishlist, orders, transactions, cart
 * @access  Private
 */
router.get('/activity', protect, getUserActivity);

export default router;
