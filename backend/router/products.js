const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products — List all (optional pagination)
router.get("/api/products", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  try {
    const [products, total] = await Promise.all([
      Product.find({}).skip(skip).limit(limit).populate("department"),
      Product.countDocuments({}),
    ]);

    // res.json(products);
    res.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET /api/products/:id — Get by ID
router.get('/api/products/:id', async (req, res) => {

  try {
    const product = await Product.findOne({ id: req.params.id })
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    // res.json(product);

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
