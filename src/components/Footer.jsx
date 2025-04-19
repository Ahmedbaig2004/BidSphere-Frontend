import React from 'react'
import assets from '../assets/assets'

const Footer = () => {
  return (
    <div className='dark:bg-gray-900 dark:text-white'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
        <div >
            <img src={assets.bidsphere} className='w-[340px] pb-5' alt="" />
            <p className='w-full md:w-2/3 text-gray-600  dark:text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur quasi sunt quae tempore sint quos molestias voluptatum alias blanditiis? Eius sed repellat deserunt ullam quia? Nulla minima molestias officia, ipsam cumque iste enim repellendus!
            </p>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600  dark:text-white '>
                <li>HOME</li>
                <li>ABOUT US</li>
                <li>DELIVERY</li>
                <li>PRIVACY POLICY</li>
            </ul>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1  text-gray-600  dark:text-white '>
                <li>+92-123-456-7900</li>
                <li>forever@gmail.com</li>
            </ul>
        </div>
      </div>
      <div><hr />
      <p className='py-5 text-sm text-center'>
        COPYRIGHT 2025@ forever.com - All Rights Reserved</p></div>
    </div>
  )
}

export default Footer
