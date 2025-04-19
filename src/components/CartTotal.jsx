import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title.jsx';


const CartTotal = () => {
    const {currency,deliveryfee,getcarttotal} = useContext(ShopContext);
    
    return (
        <div className='w-full'>
          <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTALS'} />
          </div>
      
          <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
              <p>Subtotal</p>
              <p>{currency} {getcarttotal()}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
              <p>Shipping Fee</p>
              <p>{currency} {deliveryfee}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
              <b>Total</b>
              <b>{currency} {getcarttotal() === 0 ? 0 : getcarttotal() + deliveryfee}</b>
            </div>
          </div>
        </div>
      );
      
}

export default CartTotal

