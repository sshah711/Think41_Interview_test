
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        }
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <Link
            to={`/products/${product.id}`}
            key={product.id}
            className="block border rounded p-4 shadow hover:bg-gray-100"
          >
            {/* <h3 className="font-semibold">{product.name}</h3>
            <p>₹{product.retail_price}</p>
            <p className="text-sm text-gray-500">{product.brand}</p> */}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
