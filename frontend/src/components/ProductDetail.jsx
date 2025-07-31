

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          setProduct(data?.data);
        }
      });
  }, [id]);

  if (!product) return <p className="p-6">Loading product...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto border rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p><strong>Brand:</strong> {product?.brand}</p>
      <p><strong>Category:</strong> {product?.category}</p>
      <p><strong>Cost:</strong> ₹{product?.cost}</p>
      <p><strong>Retail Price:</strong> ₹{product?.retail_price}</p>
      <p><strong>Department:</strong> {product?.department}</p>
      <p><strong>SKU:</strong> {product?.sku}</p>
      <p><strong>Distribution Center:</strong> {product?.distribution_center_id}</p>

      <Link to="/" className="inline-block mt-4 text-blue-500 underline">
        ← Back to Products
      </Link>
    </div>
  );
}

export default ProductDetail;
