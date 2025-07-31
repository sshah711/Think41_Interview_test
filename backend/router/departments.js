const express = require('express');
const router = express.Router();
const Department = require('../models/department');

router.get('/', async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error loading departments' });
  }
});

module.exports = router;
