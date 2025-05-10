import React from 'react';

const ProductDrawer = ({ product }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center p-6 text-black dark:text-white">
      <img 
        src={product.mainImageId ? `http://150.136.175.145:2280/cdn/${product.mainImageId}.png` : '/placeholder.svg'} 
        alt={product.product?.name || 'Product'} 
        className="w-full h-40 object-contain rounded mb-4" 
      />
      <h2 className="text-lg font-semibold text-center text-blue-200">{product.product?.name || 'Unnamed Product'}</h2>
      <p className="text-sm mt-2 text-white text-center">{product.product?.description?.slice(0, 80) || 'No description available'}...</p>
      <p className="text-xl font-bold mt-4 text-blue-200">${product.startingPrice || 0}</p>
      <div className="mt-4 text-xs text-center text-gray-500">
        <p>Category: {product.product?.category || 'Uncategorized'}</p>
        <p>Subcategory: {product.product?.subCategory || 'None'}</p>
      </div>
    </div>
  );
};

export default ProductDrawer;
