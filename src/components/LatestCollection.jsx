import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';
import Title from './Title.jsx';
import ProductItem from './ProductItem.jsx';
import ProductDrawer from './ProductDrawer.jsx';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isDrawerHovered, setIsDrawerHovered] = useState(false);
  const drawerTimer = useRef(null);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (drawerTimer.current) {
        clearTimeout(drawerTimer.current);
      }
    };
  }, []);

  const handleMouseEnterProduct = (item) => {
    clearTimeout(drawerTimer.current);
    setHoveredProduct(item);
    setIsDrawerVisible(true);
  };

  const handleMouseLeaveProduct = () => {
    drawerTimer.current = setTimeout(() => {
      if (!isDrawerHovered) {
        setIsDrawerVisible(false);
        setHoveredProduct(null);
      }
    }, 300); // delay so drawer doesn't flicker
  };

  const handleDrawerEnter = () => {
    clearTimeout(drawerTimer.current);
    setIsDrawerHovered(true);
  };

  const handleDrawerLeave = () => {
    setIsDrawerHovered(false);
    setIsDrawerVisible(false);
    setHoveredProduct(null);
  };

  return (
    <div>
      <div className="my-10">
        <div className="text-center py-3 text-3xl">
          <Title text1={'LATEST'} text2={'BIDS'} />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-white">
          Discover the most recent items attracting attention. These listings have just received bids and are heating up fast — don’t miss your chance to make a move!
        </p>
          
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <div
            key={index}
            onMouseEnter={() => handleMouseEnterProduct(item)}
            onMouseLeave={handleMouseLeaveProduct}
            className="relative pb-10" // Added padding bottom to make room for consistent button placement
          >
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
            <div className="absolute bottom-0 left-0 w-full flex justify-center">
              <button className="bg-black text-white px-4 py-2 text-xs rounded-md border-2 border-indigo-600 hover:bg-gray-800 w-4/5">
                PLACE BID
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Drawer with improved styling */}
      {hoveredProduct && isDrawerVisible && (
        <div
          className="fixed top-0 right-0 h-full z-50"
          onMouseEnter={handleDrawerEnter}
          onMouseLeave={handleDrawerLeave}
        >
          <div className="h-full w-72 bg-white dark:bg-[#161b22] shadow-lg border-l border-gray-300 dark:border-gray-700">
            <ProductDrawer product={hoveredProduct} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestCollection;