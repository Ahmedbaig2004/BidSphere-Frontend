import React from 'react';

const ProductDrawer = ({ product }) => {
  // Safely extract image URL
  let imageUrl = '/placeholder.svg'; // Default placeholder
  
  // Check if product has mainImageId and use that
  if (product && product.mainImageId) {
    imageUrl = `http://150.136.175.145:2280/cdn/${product.mainImageId}.png`;
  }
  // Fallback to image array if it exists
  else if (product && product.image && Array.isArray(product.image) && product.image.length > 0) {
    imageUrl = product.image[0];
  }

  // Extract product name and other details safely
  const productName = product?.product?.name || product?.name || 'Unnamed Product';
  const productDescription = product?.description || product?.product?.description || 'No description available';
  const productPrice = product?.startingPrice || product?.price || 0;
  const category = product?.product?.category || product?.category || 'Uncategorized';
  const subCategory = product?.product?.subCategory || product?.subCategory || 'None';

  return (
    <div className="h-full flex flex-col justify-center items-center p-6 text-black dark:text-white">
      <img src={imageUrl} alt={productName} className="w-full h-40 object-contain rounded mb-4" />
      <h2 className="text-lg font-semibold text-center text-blue-200">{productName}</h2>
      <p className="text-sm mt-2 text-white text-center">{productDescription?.slice(0, 80)}...</p>
      <p className="text-xl font-bold mt-4 text-blue-200">${productPrice}</p>
      <div className="mt-4 text-xs text-center text-gray-500">
        <p>Category: {category}</p>
        <p>Subcategory: {subCategory}</p>
      </div>
    </div>
  );
};

export default ProductDrawer;
