import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import About from './pages/About'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
import Placeorder from './pages/Placeorder'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ProductListing from './pages/ProductListing'
import { Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserDashboard from './pages/UserDashboard'

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 overflow-x-hidden">
      <Navbar/>
      <SearchBar/>
      <main className="relative min-h-screen">
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] text-white pb-20">
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
            theme="dark"
          />
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/collection' element={<Collection/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/contact' element={<Contact/>} />
            <Route path='/product/:productId' element={<Product/>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/orders' element={<Orders/>} />
            <Route path='/place-order' element={<Placeorder/>} />
            <Route path='/product-listing' element={<ProductListing/>} />
            <Route path='/dashboard' element={<UserDashboard/>} />
            <Route path="*" element={<Navigate to="/" replace />}/>
          </Routes>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default App
