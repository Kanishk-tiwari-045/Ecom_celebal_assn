import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products?search=&category=&brand=&sort=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { search, category, brand, sort = 'featured', page = 1, limit = 20 } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption = { salePrice: 1, price: 1 };
        break;
      case 'price-high':
        sortOption = { salePrice: -1, price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = {}; // Featured or default order
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', products: [] });
  }
});

// GET /api/products/:slugOrId
router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let product = null;

    // Try to find by slug first, then by ObjectId
    product = await Product.findOne({ slug: slugOrId });
    if (!product && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slugOrId);
    }

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

export default router;
