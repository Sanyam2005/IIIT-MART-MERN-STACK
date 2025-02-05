import { useState } from 'react'

import './App.css'
import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/home.jsx"
import Cart from "./pages/Cart.jsx"
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Buy from './pages/Buy'
import ProductForm from './pages/sell.jsx'
import PendingOrders from './pages/orders.jsx'
import PendingRequests from './pages/sell_pending.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import BuyHistory from './pages/buy_history.jsx'
import SellHistory from './pages/sell_history.jsx'
import ProductPage from './pages/ProductPage.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import IIITMartLandingPage from './pages/landing.jsx'
function App() {

  

  return (
    <>
  
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/buy" element={<Buy />}></Route>
        <Route path="/orders/pending" element={<PendingOrders />}></Route>
        <Route path="/sell" element={<ProductForm />}></Route>
        <Route path="/buy/:productId" element={<ProductPage />} />
        <Route path="/sell/pending" element={<PendingRequests/>}></Route>
        <Route path="/sell/completed" element={<SellHistory/>}></Route>
        <Route path="/orders/completed" element={<BuyHistory />}></Route>
        <Route path="/" element={<IIITMartLandingPage/>} />
        <Route path="/seller" element={<SellerDashboard />}></Route>
      </Routes>
    </Router>

     
    </>
  )
}

export default App
