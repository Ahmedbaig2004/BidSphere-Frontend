import React from 'react'
import { Link } from 'react-router-dom'
import assets from '../assets/assets'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className='bg-gradient-to-t from-gray-900 to-blue-900/50 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Company Info */}
          <div>
            <img src={assets.bidsphere} className='w-[240px] h-auto mb-5 -mt-5 ' alt="BidSphere Logo" />
            <p className='text-blue-100 text-sm leading-relaxed'>
              BidSphere is Pakistan's first blockchain-based bidding platform, bringing trust, security, and transparency to online auctions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-xl font-semibold text-blue-300 pb-2 mb-4 border-b border-blue-700/30'>Quick Links</h3>
            <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
              <Link to="/" className='text-blue-100 hover:text-blue-300 transition-colors'>
                Home
              </Link>
              <Link to="/about" className='text-blue-100 hover:text-blue-300 transition-colors'>
                About Us
              </Link>
              <Link to="/auctions" className='text-blue-100 hover:text-blue-300 transition-colors'>
                Auctions
              </Link>
              <Link to="/contact" className='text-blue-100 hover:text-blue-300 transition-colors'>
                Contact Us
              </Link>
              <Link to="/privacy-policy" className='text-blue-100 hover:text-blue-300 transition-colors'>
                Policies
              </Link>
              <Link to="/orders" className='text-blue-100 hover:text-blue-300 transition-colors'>
                Orders
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='text-xl font-semibold text-blue-300 pb-2 mb-4 border-b border-blue-700/30'>Contact Us</h3>
            <div className='space-y-3'>
              <p className='text-blue-100'>+92-123-456-7900</p>
              <p className='text-blue-100'>support@bidsphere.com</p>
              <p className='text-blue-100'>
                Plaza 12, Blue Area,<br />
                Islamabad, Pakistan
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-12 border-t border-blue-700/30 pt-6 text-center'>
          <p className='text-sm text-blue-200'>
            © {currentYear} BidSphere. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
