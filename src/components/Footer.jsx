import React from 'react'
import assets from '../assets/assets'

const Footer = () => {
  return (
    <div className='dark:bg-gray-900 dark:text-white'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
        <div >
            <img src={assets.bidsphere} className='w-[340px] pb-5' alt="" />
            <p className='w-full md:w-2/3 text-white  dark:text-white'>BidSphere is Pakistan’s first blockchain-based bidding platform, designed to bring a new level of trust, security, and transparency to online auctions. BidSphere is more than just an auction site — it’s a community where trust meets technology.
            </p>
        </div>
        <div>
            <p className='text-xl text-gray-400 font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-white  dark:text-white '>
                <li>HOME</li>
                <li>ABOUT US</li>
                <li>DELIVERY</li>
                <li>PRIVACY POLICY</li>
            </ul>
        </div>
        <div>
            <p className='text-xl  text-gray-400 font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1  text-white  dark:text-white '>
                <li>+92-123-456-7900</li>
                <li>forever@gmail.com</li>
            </ul>
        </div>
      </div>
      <div><hr />
      <p className='py-5 text-sm text-white text-center'>
        COPYRIGHT 2025@ forever.com - All Rights Reserved</p></div>
    </div>
  )
}

export default Footer
