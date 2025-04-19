import React, { useContext, useState } from 'react'
import assets from '../assets/assets.js'
import { Link,NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.jsx';
import DarkModeToggle from './DarkModeToggle.jsx';
const Navbar = () => {
  const[visible,setVisible]=useState(false);
  const {setshowsearch,getcartsize} = useContext(ShopContext)
  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to='/'><img src={assets.bidsphere} className='w-36' alt="" /></Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700 dark:text-white '>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
            <p>HOME</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden dark:text-white dark:bg-gray-100  '/>
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
            <p>COLLECTION</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden dark:text-white dark:bg-gray-100 '/>

        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
            <p>ABOUT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden dark:text-white dark:bg-gray-100'/>

        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
            <p>CONTACT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden dark:text-white dark:bg-gray-100xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'/>

        </NavLink>
      </ul>
      <div className='flex items-center gap-6'>
        <img onClick={()=>setshowsearch(true)} src={assets.search_icon} className='w-5 cursor-pointer ' alt="" />
        <div className='group relative'>
          <img src={assets.profile_icon} className='w-5' alt="" />
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-1'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded dark:text-white'>
              <p className='cursor-pointer hover:text-black'>My Profile</p>
              <p className='cursor-pointer hover:text-black'>Orders</p>
              <p className='cursor-pointer hover:text-black'>LogOut</p>
            </div>
          </div>
          
        </div>
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5'alt="" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px] dark:text-white'>{getcartsize()}</p>

          </Link>
          <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />

      </div>
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ?'w-full' : 'w-0'} dark:text-white`}>
          <div className='flex flex-col text-gray-600 dark:text-white dark:bg-gray-900'>
            <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
              <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
              <p>Back</p>
            </div>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
            <NavLink onClick={()=>setVisible(false)}className='py-2 pl-6 border 'to='/collection'>COLLECTION</NavLink>
            <NavLink onClick={()=>setVisible(false)}className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
            <NavLink onClick={()=>setVisible(false)}className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>

          </div>
      </div>
      <DarkModeToggle/>
    </div>
  )
}

export default Navbar
