import express from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new order (protected)
router.post('/', protect, async (req, res) => {
  try {
    await createOrder(req, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// Get all orders for the logged-in user (protected, with optional pagination)
router.get('/', protect, async (req, res) => {
  try {
    await getUserOrders(req, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get a single order by ID (protected, only if the order belongs to the user)
router.get('/:id', protect, async (req, res) => {
  try {
    await getOrderById(req, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

export default router;
