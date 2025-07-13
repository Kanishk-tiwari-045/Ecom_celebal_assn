import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/user/cart - Get current user's cart
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.product');
    if (!user) return res.status(404).json({ success: false, message: 'User not found', cart: [] });
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch cart', cart: [] });
  }
});

// POST /api/user/cart - Add item to cart
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, selectedOptions = {} } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID required' });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const existing = user.cart.find(
      item =>
        item.product.toString() === productId &&
        JSON.stringify(item.selectedOptions || {}) === JSON.stringify(selectedOptions || {})
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, selectedOptions });
    }

    await user.save();
    const populated = await user.populate('cart.product');
    res.json({ success: true, cart: populated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add to cart', cart: [] });
  }
});

// PUT /api/user/cart - Update quantity
router.put('/', protect, async (req, res) => {
  try {
    const { cartId, quantity } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const item = user.cart.id(cartId);
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });

    if (quantity > 0) {
      item.quantity = quantity;
    } else {
      item.remove();
    }

    await user.save();
    const populated = await user.populate('cart.product');
    res.json({ success: true, cart: populated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update cart', cart: [] });
  }
});

// DELETE /api/user/cart - Remove item or clear cart
router.delete('/', protect, async (req, res) => {
  try {
    const { cartId } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (cartId) {
      user.cart = user.cart.filter(item => item._id.toString() !== cartId);
    } else {
      user.cart = [];
    }

    await user.save();
    const populated = await user.populate('cart.product');
    res.json({ success: true, cart: populated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update cart', cart: [] });
  }
});

export default router;
