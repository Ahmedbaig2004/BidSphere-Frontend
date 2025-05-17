import React, { useEffect, useContext } from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import Product from './pages/Product'
import Login from './pages/Login'
import Register from './pages/Register'
import Auctions from './pages/Auctions'

import Placeorder from './pages/Placeorder'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ProductListing from './pages/ProductListing'
import { Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserDashboard from './pages/UserDashboard'
import EmailVerification from './pages/EmailVerification'
import EmailVerificationPending from './pages/EmailVerificationPending'
import ResendVerification from './pages/ResendVerification'
import PrivacyPolicy from './pages/PrivacyPolicy'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import { ThemeContext } from './context/ThemeContext'

const App = () => {
  // Handle redirects for base path issues
  useEffect(() => {
    const currentPath = window.location.pathname;
    const shouldBeOnBasePath = !currentPath.startsWith('/bidsphere') && 
                               process.env.NODE_ENV === 'production';
    
    // If we're in production and not on the base path, redirect
    if (shouldBeOnBasePath && currentPath !== '/') {
      window.location.href = `/bidsphere${currentPath}`;
    } else if (shouldBeOnBasePath && currentPath === '/') {
      window.location.href = '/bidsphere/';
    }
  }, []);

  const { isLightTheme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen overflow-x-hidden ${isLightTheme 
      ? 'bg-sky-100' 
      : 'bg-gradient-to-br from-blue-900 via-black to-blue-900'}`}>
      <Navbar/>
      <SearchBar/>
      <main  className="relative min-h-screen mt-[40px]">
        <div className={`px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20 ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={isLightTheme ? "light" : "dark"}
          />
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/contact' element={<Contact/>} />
            <Route path='/product/:productId' element={<Product/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
          
            <Route path='/place-order' element={<Placeorder/>} />
            <Route path='/product-listing' element={<ProductListing/>} />
            <Route path='/auctions' element={<Auctions/>} />
            <Route path='/dashboard' element={<UserDashboard/>} />
            <Route path='/verify-email' element={<EmailVerification/>} />
            <Route path='/verify-email-pending' element={<EmailVerificationPending/>} />
            <Route path='/resend-verification' element={<ResendVerification/>} />
            <Route path='/privacy-policy' element={<PrivacyPolicy/>} />
            <Route path='/admin-dashboard' element={<AdminDashboard/>} />
            <Route path='/admin-login' element={<AdminLogin/>} />
            <Route path="*" element={<Navigate to="/" replace />}/>
          </Routes>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default App
