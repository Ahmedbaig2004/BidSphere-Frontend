import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import assets from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {
    const {search,setsearch,showsearch,setshowsearch}=useContext(ShopContext)
    const location=useLocation();
    const [visible,setVisible]=useState(false);
    useEffect(()=>{
        if(showsearch && location.pathname.includes('collection'))
        {
            setVisible(true);
        }
        else{
            setVisible(false);
        }
    }
,[location,showsearch])
  return (showsearch && visible) ? (
    <div className='border-b-4 border-t-4 border-l-4 border-r-4 bg-gray-50 text-center  dark:text-white dark:bg-gray-900'>
        <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 dark:border-white'>
        <input value={search} onChange={(e)=>setsearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm' type="text" placeholder='search' name="" id="" />
        <img className='w-4' src={assets.search_icon} alt="" />

        </div>
    
            <img onClick={()=>setshowsearch(false)} className='inline cursor-pointer w-3'src={assets.cross_icon} alt="" />
        

      
    </div>
  ):null
}

export default SearchBar
