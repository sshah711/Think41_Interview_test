const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  retail_price: { type: Number, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  sku: { type: String, required: true },
  distribution_center_id: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
