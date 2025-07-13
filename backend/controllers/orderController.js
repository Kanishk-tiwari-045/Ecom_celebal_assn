import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Create a new order (after successful payment)
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingInfo,
      total,
      tax,
      shipping,
      discount,
      paymentStatus,
      paymentMethod,
      transactionId
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items.' });
    }

    // Check stock and decrement for each product
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      if (product.stockCount < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stockCount} left.`
        });
      }
      product.stockCount -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      user: req.user.userId,
      items,
      shippingInfo,
      total,
      tax,
      shipping,
      discount,
      paymentStatus,
      paymentMethod,
      transactionId
    });

    await order.save();

    // Update user's orders and transactions
    const user = await User.findById(req.user.userId);
    user.orders.push(order._id);
    user.transactions.push({
      orderId: order._id,
      amount: total,
      status: paymentStatus,
      paymentMethod,
      date: new Date()
    });
    // Clear user's cart after successful order
    user.cart = [];
    await user.save();

    res.status(201).json({ success: true, order, message: 'Order placed successfully.' });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get all orders for the logged-in user (with optional pagination)
export const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({ user: req.user.userId });

    res.json({
      success: true,
      orders,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get a single order by ID (must belong to user)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }
    res.json({ success: true, order });
  } catch (err) {
    console.error('Get order by ID error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
