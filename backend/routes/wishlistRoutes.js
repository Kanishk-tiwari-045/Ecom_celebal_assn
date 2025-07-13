import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/user/wishlist - Get wishlist for current user
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('wishlist');
    if (!user) return res.status(404).json({ success: false, message: 'User not found', wishlist: [] });
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist', wishlist: [] });
  }
});

// POST /api/user/wishlist - Add product to wishlist
router.post('/', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID required' });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.wishlist.includes(productId)) {
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      user.wishlist.push(productId);
      await user.save();
    }
    const populated = await user.populate('wishlist');
    res.json({ success: true, wishlist: populated.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add to wishlist', wishlist: [] });
  }
});

// DELETE /api/user/wishlist - Remove product or clear wishlist
router.delete('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found', wishlist: [] });

    if (req.body && req.body.productId) {
      user.wishlist = user.wishlist.filter(
        id => id.toString() !== req.body.productId
      );
    } else {
      user.wishlist = [];
    }
    await user.save();
    const populated = await user.populate('wishlist');
    res.json({ success: true, wishlist: populated.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update wishlist', wishlist: [] });
  }
});

export default router;
