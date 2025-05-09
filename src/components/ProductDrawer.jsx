import React from 'react';

const ProductDrawer = ({ product }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center p-6 text-black dark:text-white">
      <img src={product.image[0]} alt={product.name} className="w-full h-40 object-contain rounded mb-4" />
      <h2 className="text-lg font-semibold text-center text-blue-200">{product.name}</h2>
      <p className="text-sm mt-2 text-white text-center">{product.description?.slice(0, 80)}...</p>
      <p className="text-xl font-bold mt-4 text-blue-200" >${product.price}</p>
      <div className="mt-4 text-xs text-center text-gray-500">
        <p>Category: {product.category}</p>
        <p>Subcategory: {product.subCategory}</p>
      </div>
    </div>
  );
};

export default ProductDrawer;
