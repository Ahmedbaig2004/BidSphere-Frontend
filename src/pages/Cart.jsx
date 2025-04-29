import  { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title.jsx';
import assets from '../assets/assets';
import CartTotal from '../components/CartTotal.jsx';

const Cart = () => {
  const { products, currency, cartItems, updatequantity } = useContext(ShopContext);
  const [cartdata, setcartdata] = useState([]);

  useEffect(() => {
    let tempData = [];
    // Since cartItems is now { productId: quantity }
    for (const productId in cartItems) {
      if (cartItems[productId] > 0) {
        tempData.push({
          _id: productId,
          quantity: cartItems[productId]
        });
      }
    }
    setcartdata(tempData);
  }, [cartItems]);

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'BID'} />
      </div>
      
      <div>
        {cartdata.map((item, index) => {
          const productdata = products.find((product) => product._id === item._id);
          return (
            <div 
              key={index} 
              className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
            >
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productdata.image[0]} alt={productdata.name} />
                <div>
                  <p className='text-xs sm:text-lg font-medium dark:text-white'>{productdata.name}</p>
                  <div className='flex items-center gap-5 mt-2 dark:text-white'>
                    <p>{currency}{productdata.price}</p>
                  </div>
                </div>
              </div>
              <input 
                onChange={(e) => updatequantity(item._id, Number(e.target.value))} 
                className='border max-w-10 sm:max-w-12 px-1 sm:px-2 py-1' 
                type="number" 
                min={1} 
                defaultValue={item.quantity} 
              />
              <img 
                onClick={() => updatequantity(item._id, 0)} 
                className="w-4 mr-4 sm:w-5 cursor-pointer" 
                src={assets.bin_icon} 
                alt="Remove Item" 
              />
            </div>
          );
        })}
      </div>
      
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
        </div>
      </div>
    </div>
  );
};

export default Cart;
