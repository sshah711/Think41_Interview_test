const mongoose = requrire('mongoose');

const prductSchema= new mongoose.Schema({
  id: { type:String, unique: true },
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  retail_price: { type: String, required: true },
  department: { type: String, required: true },
  sku: { type: String, required: true },
  distribution_center_id: { type: String, required: true }
});

module.exports = mongoose.model('Product', prductSchema);