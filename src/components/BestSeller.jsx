import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
const BestSeller =()=>{
    const {products} =useContext(ShopContext);
    const [BestSeller,setBestSeller]=useState([]);
    useEffect(()=>{
        const bestProducts = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProducts.slice(0,5));
        

    },[])

return(
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'POPULAR'} text2={'BIDS'}></Title>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600  dark:text-white'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique alias quasi necessitatibus accusamus autem, et nam sequi nobis. Nisi amet nesciunt, consequatur quis quam ex non voluptatum distinctio aliquam quibusdam. Minima necessitatibus quos dolore.</p>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
            BestSeller.map((item,index)=>(
                <ProductItem key={index} item={item._id} image={item.image} name={item.name} price={item.price} />
            ))
}
        </div>
      
    </div>
)
}


export default BestSeller
