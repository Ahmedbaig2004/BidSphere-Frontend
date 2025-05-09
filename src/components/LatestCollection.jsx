import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';
import Title from './Title.jsx';
import ProductItem from './ProductItem.jsx';
import ProductDrawer from './ProductDrawer.jsx';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="py-16 relative">
      <div className="text-center mb-12">
        <Title text1="LATEST" text2="BIDS" />
        <p className="max-w-2xl mx-auto mt-4 text-sm text-white/70">
          Discover the most recent items attracting attention. These listings have just received bids and are heating up fast — don't miss your chance to make a move!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {latestProducts.map((item, index) => (
          <div
            key={index}
            onMouseEnter={() => handleMouseEnterProduct(item)}
            onMouseLeave={handleMouseLeaveProduct}
            className="relative"
          >
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          </div>
        ))}
      </div>
      
      <AnimatePresence>
        {hoveredProduct && isDrawerVisible && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-screen z-50 overflow-hidden"
            onMouseEnter={handleDrawerEnter}
            onMouseLeave={handleDrawerLeave}
            style={{ maxWidth: '100vw' }}
          >
            <div className="h-full w-80 backdrop-blur-lg bg-white/10 border-l border-white/20 shadow-2xl overflow-y-auto">
              <div className="sticky top-0 right-0 w-full p-4 bg-white/10 backdrop-blur-lg border-b border-white/20">
                <button
                  onClick={() => setIsDrawerVisible(false)}
                  className="float-right p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ProductDrawer product={hoveredProduct} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LatestCollection;