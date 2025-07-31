const mongoose = require('mongoose');
const Product = require('../models/Product');
const Department = require('../models/department');
require('dotenv').config();

async function Departments() {
  await mongoose.connect(process.env.MONGO_URI);

  const departments = await Product.distinct('department');
  for (const name of departments) {
    const exists = await Department.findOne({ name });
    if (!exists) {
      await Department.create({ name });
    }
  }

  const allDepartments = await Department.find();
  for (const product of await Product.find()) {
    const dept = allDepartments.find(d => d.name === product.department);
    if (dept) {
      await Product.updateOne({ _id: product._id }, { department: dept._id });
    }
  }

  mongoose.disconnect();
}

Departments();
