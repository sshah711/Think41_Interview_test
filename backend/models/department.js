const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model('Department', departmentSchema);
