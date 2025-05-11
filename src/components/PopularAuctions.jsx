import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';
import Title from './Title.jsx';
import ProductItem from './ProductItem.jsx';
import ProductDrawer from './ProductDrawer.jsx';
import { Link } from 'react-router-dom';

const PopularAuctions = () => {
  const { currency } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isDrawerHovered, setIsDrawerHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const drawerTimer = useRef(null);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://150.136.175.145:2278/api/listing/homepage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch homepage data');
      }

      const data = await response.json();
      if (data && data.popularListings && Array.isArray(data.popularListings)) {
        setBestSeller(data.popularListings);
      } else {
        setBestSeller([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching homepage data:', err);
      setError('Unable to load popular listings. Please try again later.');
      setBestSeller([]);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={'POPULAR'} text2={'AUCTIONS'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-white/70">
          Explore the most sought-after listings with the highest number of bids. These trending items are in high demand — join the competition before they're gone!
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          <p className="mt-2 text-white">Loading popular listings...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-400">{error}</p>
        </div>
      ) : bestSeller.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-white">No popular listings available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {bestSeller.map((item, index) => (
            <div
              key={item.listingId || `popular-${index}`}
              onMouseEnter={() => handleMouseEnterProduct(item)}
              onMouseLeave={handleMouseLeaveProduct}
              className="relative pb-10" // Added padding bottom to make room for consistent button placement
            >
              <ProductItem
                item={item}
                id={item.listingId}
                image={item.mainImageId ? `http://150.136.175.145:2280/cdn/${item.mainImageId}.png` : '/placeholder.svg'}
                name={item.product ? item.product.name : 'Unnamed Product'}
                price={item.startingPrice || 0}
                category={item.product ? item.product.category : ''}
                subCategory={item.product ? item.product.subCategory : ''}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Drawer with improved styling */}
      {hoveredProduct && isDrawerVisible && (
        <div
          className="fixed top-0 right-0 h-full z-50"
          onMouseEnter={handleDrawerEnter}
          onMouseLeave={handleDrawerLeave}
        >
          <div className="h-full w-72 backdrop-blur-lg bg-white/10 border-l border-white/20 shadow-2xl overflow-y-auto">
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
        </div>
      )}
    </div>
  );
};

export default PopularAuctions;