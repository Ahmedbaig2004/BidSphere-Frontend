import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({item,name,id,image,price}) => {
    const {currency}=useContext(ShopContext);

  return (
    <div className="group backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
      <Link to={`/product/${id}`} className="block">
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
        <h3 className="text-white font-medium mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-blue-300 font-semibold">{currency} {price}</p>
          <Link
            to={`/product/${id}`}
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
