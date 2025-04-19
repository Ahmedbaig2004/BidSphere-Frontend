import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import About from './pages/About'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Placeorder from './pages/Placeorder'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Home
const App = () => {
  return (
<div className='px-4 sm:px-[5vw] md:px-[7vw] lg:-px-[9vw] dark:text-white dark:bg-gray-900 '>
    <ToastContainer/>
    <Navbar/>
    <SearchBar/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/collection' element={<Collection/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route path='/product/:productId' element={<Product/>} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/orders' element={<Orders/>} />
      <Route path='/place-order' element={<Placeorder/>} />
      <Route path="*" element={<Navigate to="/" replace />}/>





    </Routes>
    <Footer/>
      
    </div>
  )
}

export default App
