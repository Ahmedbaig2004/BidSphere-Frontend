import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import assets from '../assets/assets'
import { ThemeContext } from '../context/ThemeContext'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isLightTheme } = useContext(ThemeContext);
  
  return (
    <footer className={isLightTheme 
      ? 'bg-gradient-to-t from-sky-200 to-white text-gray-800' 
      : 'bg-gradient-to-t from-gray-900 to-blue-900/50 text-white'
    }>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Company Info */}
          <div>
            <img src={`${isLightTheme?assets.bidsphereblack:assets.bidsphere}`} className='w-[240px] h-auto mb-5 -mt-5 ' alt="BidSphere Logo" />
            <p className={isLightTheme ? 'text-gray-700 text-sm leading-relaxed' : 'text-blue-100 text-sm leading-relaxed'}>
              BidSphere is Pakistan's first blockchain-based bidding platform, bringing trust, security, and transparency to online auctions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-xl font-semibold ${isLightTheme ? 'text-gray-800 border-gray-300' : 'text-blue-300 border-blue-700/30'} pb-2 mb-4 border-b`}>Quick Links</h3>
            <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
              <Link to="/" className={isLightTheme ? 'text-gray-700 hover:text-gray-900 transition-colors' : 'text-blue-100 hover:text-blue-300 transition-colors'}>
                Home
              </Link>
              <Link to="/about" className={isLightTheme ? 'text-gray-700 hover:text-gray-900 transition-colors' : 'text-blue-100 hover:text-blue-300 transition-colors'}>
                About Us
              </Link>
              <Link to="/auctions" className={isLightTheme ? 'text-gray-700 hover:text-gray-900 transition-colors' : 'text-blue-100 hover:text-blue-300 transition-colors'}>
                Auctions
              </Link>
              <Link to="/contact" className={isLightTheme ? 'text-gray-700 hover:text-gray-900 transition-colors' : 'text-blue-100 hover:text-blue-300 transition-colors'}>
                Contact Us
              </Link>
              <Link to="/privacy-policy" className={isLightTheme ? 'text-gray-700 hover:text-gray-900 transition-colors' : 'text-blue-100 hover:text-blue-300 transition-colors'}>
                Policies
              </Link>
              <Link to="/admin-login" className={isLightTheme ? 'text-gray-700 hover:text-gray-900 transition-colors' : 'text-blue-100 hover:text-blue-300 transition-colors'}>
                Admin
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-xl font-semibold ${isLightTheme ? 'text-gray-800 border-gray-300' : 'text-blue-300 border-blue-700/30'} pb-2 mb-4 border-b`}>Contact Us</h3>
            <div className='space-y-3'>
              <p className={isLightTheme ? 'text-gray-700' : 'text-blue-100'}>+92-123-456-7900</p>
              <p className={isLightTheme ? 'text-gray-700' : 'text-blue-100'}>support@bidsphere.com</p>
              <p className={isLightTheme ? 'text-gray-700' : 'text-blue-100'}>
                Plaza 12, Blue Area,<br />
                Islamabad, Pakistan
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={`mt-12 border-t ${isLightTheme ? 'border-gray-300' : 'border-blue-700/30'} pt-6 text-center`}>
          <p className={`text-sm ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>
            © {currentYear} BidSphere. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
