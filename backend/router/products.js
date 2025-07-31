const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET: List all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().limit(50);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
