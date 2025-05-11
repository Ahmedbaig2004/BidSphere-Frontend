import React from 'react'
import assets from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-8 shadow-xl'>
      <h2 className='text-2xl font-bold text-white mb-6 text-center'>Our Auction Policies</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Bidding Policy */}
        <div className='flex flex-col items-center backdrop-blur-lg bg-blue-900/10 p-6 rounded-xl border border-blue-800/20 hover:border-blue-400/30 transition-all duration-300 hover:bg-blue-900/20'>
          <div className='w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-5'>
            <img src={assets.exchange_icon} className='w-8 h-8' alt="Bidding Policy" />
          </div>
          <p className='font-semibold text-blue-300 mb-2'>Secure Bidding Process</p>
          <p className='text-blue-200 text-sm text-center'>All bids are binding and secure with our blockchain verification system</p>
        </div>
        
        {/* Quality Assurance */}
        <div className='flex flex-col items-center backdrop-blur-lg bg-blue-900/10 p-6 rounded-xl border border-blue-800/20 hover:border-blue-400/30 transition-all duration-300 hover:bg-blue-900/20'>
          <div className='w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-5'>
            <img src={assets.quality_icon} className='w-8 h-8' alt="Quality Assurance" />
          </div>
          <p className='font-semibold text-blue-300 mb-2'>Item Authenticity</p>
          <p className='text-blue-200 text-sm text-center'>All items are verified and authenticated before listing</p>
        </div>
        
        {/* Customer Support */}
        <div className='flex flex-col items-center backdrop-blur-lg bg-blue-900/10 p-6 rounded-xl border border-blue-800/20 hover:border-blue-400/30 transition-all duration-300 hover:bg-blue-900/20'>
          <div className='w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-5'>
            <img src={assets.support_img} className='w-8 h-8' alt="Customer Support" />
          </div>
          <p className='font-semibold text-blue-300 mb-2'>24/7 Auction Support</p>
          <p className='text-blue-200 text-sm text-center'>Our team is available 24/7 to assist with any auction-related inquiries</p>
        </div>
      </div>
      
      {/* Additional policies section */}
      <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='backdrop-blur-lg bg-blue-900/10 p-6 rounded-xl border border-blue-800/20'>
          <h3 className='text-lg font-medium text-white mb-3'>Payment & Escrow</h3>
          <ul className='space-y-2 text-blue-200 text-sm'>
            <li className='flex items-start'>
              <span className='text-blue-400 mr-2'>•</span>
              <span>Secure escrow system protects both buyers and sellers</span>
            </li>
           
            
          </ul>
        </div>
        
    
      </div>
      
    
     
    </div>
  )
}

export default OurPolicy
