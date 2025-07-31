const express = require("express");
const router = express.Router();
const Department = require("../models/department");
const Product = require("../models/Product");

// GET /api/departments - List all departments with product count
router.get("/api/departments", async (req, res) => {
  try {
    const departments = await Department.find({});

    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/departments/:id - Get department details by ID
router.get("/api/departments/:id", async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department)
      return res.status(404).json({ message: "Department not found" });

    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/departments/:id/products - Get all products in department
router.get("/api/departments/:id/products", async (req, res) => {
  try {
    const products = await Product.find({ department: req.params.id }).populate(
      "department"
    );
    res.json({ department: department.name, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
