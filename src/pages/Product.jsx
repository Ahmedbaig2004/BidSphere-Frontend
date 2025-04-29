import  { useState,useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const {productId}=useParams();
  const[productdata,setproductdata]=useState()
  const {products,currency,addtocart}=useContext(ShopContext)
  const [image,setimage]=useState('')
  

  const fetchproductdata= async ()=>{
    products.map((item)=>{
      if(item._id===productId)
      {
        setproductdata(item)
        setimage(item.image[0])
        return null
      }

    })
  } 
  useEffect(()=>{
      fetchproductdata();
      

  },[products,productId])
 
  return productdata? (
    <div className=' border-t-2 pt-10 transition-opacity ease-in duration-500'>
      {/* {product data} */}
        <div className='flex gap-12 flex-col sm:flex-row'>
          {/* {product images} */}
          <div className='flex flex-1 flex-col-reverse gap-3 sm:flex-row'>

            <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full sm:w-[18.7%] '>
              {
              productdata.image.map((item,index)=>(
                  <img onClick={()=>setimage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
             
            </div>
            <div className='w-full sm:w-[80%]'>
              <img src={image} className='w-full h-auto' alt="" />
            </div>
          </div>
          <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productdata.name}</h1>
            <div className='flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
            </div>
            <p className='mt-5 text-3xl font-medium'>{currency}{productdata.price}</p>
            <p className='mt-5 text=gray-500 md:-4/5 '>{productdata.description}</p>
            
            <button onClick={()=>addtocart(productdata._id)}className='bg-black text-white px-8 my-4 py-5 text-sm active:bg-gray-700'>PLACE BID</button>
            <hr className='mt-8 sm:w-4/5' />
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% original</p>
              <p>Cash on delivery is available on this product</p>
              <p>Easy return and exchange policy within 7 days</p>
            </div>
          </div>

        </div>
        {/* {product description} */}
        <div className='mt-20'>
          <div className='flex'>
            <b className='border px-5 py-3 text-sm'>Description</b>
          

          </div>
          <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi nobis vero quam rem!</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat magnam cupiditate exercitationem voluptas asperiores eveniet officiis ab optio omnis delectus, officia, eaque deserunt dicta magni aspernatur et perferendis consectetur numquam illo cum minus minima. Ut cumque doloremque hic facere perferendis. Quo temporibus rerum exercitationem corrupti!</p>
          </div>
        </div>
        {/* {display related products} */}
        <div>
          <RelatedProducts category={productdata.category} subcategory={productdata.subcategory} ></RelatedProducts>
          
        </div>
    </div>
  ): <div className='opacity-0'></div>
}

export default Product
