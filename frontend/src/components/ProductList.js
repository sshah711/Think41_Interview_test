import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Failed to load products.</p>;

  return (
    <div className="container">
      <h1>All Products</h1>
      <div className="grid">
        {products.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="card">
            <h3>{product.name}</h3>
            <p>₹{product.retail_price}</p>
            <p><strong>{product.brand}</strong></p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
