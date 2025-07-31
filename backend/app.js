const mongoose = require('mongoose');
const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');
const productsRoute = require('./router/products');
const departmentRoutes = require('./router/departments');
// const flagFile = './import.json';

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());

app.use(express.json());

// Routes
app.use('/', productsRoute);
app.use('/', departmentRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
        importCSV();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//  function checkImportFlag() {
//   if (fs.existsSync(flagFile)) {
//     const flagData = JSON.parse(fs.readFileSync(flagFile, 'utf8'));

//     if (flagData.productsImported) {
//       console.log('Products already imported. Skipping.');
//       mongoose.connection.close();
//       return;
//     }
//   }
// }

function importCSV() {
  const results = [];
  const departmentsMap = new Map();
  let count = 0;

  fs.createReadStream('./products.csv')
    .pipe(csv())
    .on('data', (data) => {
      count++;
      const deptName = data.department.trim();
      if (!departmentsMap.has(deptName)) {
        departmentsMap.set(deptName, null); // placeholder for ObjectId
      }
      results.push({
        id: Number(data.id),
        cost: Number(data.cost),
        category: data.category,
        name: data.name,
        brand: data.brand,
        retail_price: Number(data.retail_price),
        department: deptName,
        sku: data.sku,
        distribution_center_id: Number(data.distribution_center_id),
      });
    })
    .on('end', async () => {
      try {
        for (let [deptName] of departmentsMap) {
          const dept = await Department.findOneAndUpdate(
            { name: deptName },
            { name: deptName },
            { upsert: true, new: true }
          );
          departmentsMap.set(deptName, dept._id);
        }

        const updatedProducts = results.map(p => ({
          ...p,
          department: departmentsMap.get(p.department),
        }));

        console.log('Inserting products:', updatedProducts.length);
        await Product.insertMany(updatedProducts, { ordered: false });
        console.log('Products imported successfully!');
      } catch (err) {
        console.error('Import error:', err.message);
      }
    });
}


app.get('/api/products', async (req, res) => {
    try {
        // Use pagination to avoid sending all 30k records at once
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find({}).skip(skip).limit(limit).populate('department'),
            Product.countDocuments({})
        ]);

        res.json({
            products,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Error fetching product' });
  }
} );

app.get('/api/departments', async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

app.get('/api/departments/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    console.error('Error fetching department:', err);
    res.status(500).json({ message: 'Error fetching department' });
  }
});

app.get('/api/departments/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ department: req.params.id }).populate('department');
    res.json(products);
  } catch (err) {
    console.error('Error fetching products for department:', err);
    res.status(500).json({ message: 'Error fetching products for department' });
  }
});

