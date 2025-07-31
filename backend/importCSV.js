const fs = require('fs');
const unzipper = require('unzipper');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// const zipPath = './archive.zip';
// const csvFileName = 'products.csv';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

// Step 1: Unzip and extract products.csv
function importCSV(){
fs.createReadStream('./data/products.csv') 
//   .pipe(unzipper.ParseOne('products.csv'))
  .pipe(csv())
  .on('data', async (row) => {
    try {
      await Product.create({
        id: row.id,
        cost: parseFloat(row.cost),
        category: row.category,
        name: row.name,
        brand: row.brand,
        retail_price: parseFloat(row['retail_price']),
        department: row.department,
        sku: row.sku,
        distribution_center_id: row.distribution_center_id
      });
    } catch (err) {
      console.error('Insert error:', err.message);
    }
  })
  .on('end', () => {
    console.log('CSV import complete.');
    mongoose.disconnect();
  });
}
