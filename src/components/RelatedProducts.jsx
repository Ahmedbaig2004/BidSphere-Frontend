import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title.jsx'
import ProductItem from './ProductItem.jsx';

const RelatedProducts = ({category,subcategory}) => {
    const [relatedproducts,setrelatedproducts] =useState([]);
    const {products} = useContext(ShopContext);

    useEffect(()=>{
        if (products.length>0){
            let productcopy=products.slice()
            const filteredProducts = products
            .filter((item) => item.category === category)
            .filter((item) => item.subcategory === subcategory);
          setrelatedproducts(filteredProducts.slice(0, 5))
        }
        

    },[products])

  return (
    


    <div className='my-24'>
      <div className='text-center text-3xl py-2'> 
        <Title text1={'Related'} text2={'Products'}/>

      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {relatedproducts.map((item,index)=>(
          <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image}/>
        ))}
      </div>

      
    </div>
  )
}

export default RelatedProducts
