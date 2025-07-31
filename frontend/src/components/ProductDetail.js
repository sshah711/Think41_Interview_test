import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error || !product) return <p>Product not found.</p>;

  return (
    <div className="container">
      <Link to="/">← Back to List</Link>
      <h2>{product.name}</h2>
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>Department:</strong> {product.department}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Cost:</strong> ₹{product.cost}</p>
      <p><strong>Retail Price:</strong> ₹{product.retail_price}</p>
      <p><strong>SKU:</strong> {product.sku}</p>
    </div>
  );
}

export default ProductDetail;
