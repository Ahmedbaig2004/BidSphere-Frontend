import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const ProductItem = ({item, name, id, image, price, category, subCategory}) => {
    const {currency} = useContext(ShopContext);
    const { isLightTheme } = useContext(ThemeContext);
    const location = useLocation();
    
    // Get current path to determine if we're on the collection page
    const isAuctionPage = location.pathname === '/auctions';
    
    // Create state to pass with Link navigation
    const linkState = isAuctionPage ? { 
      category: category || '',
      subCategory: subCategory || '' 
    } : {};

  return (
    <div className={`group backdrop-blur-lg ${isLightTheme ? 'bg-white/50 border-gray-300' : 'bg-white/10 border-white/20'} rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-2xl ${isLightTheme ? 'hover:shadow-blue-300/30' : 'hover:shadow-blue-500/20'}`}>
      <Link to={`/product/${id}`} state={linkState} className="block">
        <div className="relative overflow-hidden aspect-square">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={image}
            alt={name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      <div className="p-4">
        <h3 className={`${isLightTheme ? 'text-gray-800' : 'text-white'} font-medium mb-2 line-clamp-2`}>{name}</h3>
        <div className="flex items-center justify-between">
          <p className={`${isLightTheme ? 'text-blue-700' : 'text-blue-300'} font-semibold`}>{currency} {price}</p>
          <Link
            to={`/product/${id}`}
            state={linkState}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            Place Bid
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductItem
