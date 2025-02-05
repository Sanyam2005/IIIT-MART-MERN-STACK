import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BookIcon from '@mui/icons-material/Book';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CodeIcon from '@mui/icons-material/Code';
import img2 from '../assets/2.jpeg';
import { useEffect } from 'react';
import img from '../assets/3.jpeg';
import { useNavigate } from 'react-router-dom';
const IIITMartLandingPage = () => {
  const [activeSection, setActiveSection] = useState('home');

  const features = [
    { 
      icon: <ShoppingCartIcon sx={{ fontSize: 60, color: 'white' }} />, 
      title: "Buy & Sell Platform", 
      description: "Seamless marketplace for IIIT Hyderabad students to trade items" 
    },
    { 
      icon: <BookIcon sx={{ fontSize: 60, color: 'white' }} />, 
      title: "Lite Asset Model", 
      description: "We focus on the essentials to keep the platform fast and efficient" 
    },
    { 
      icon: <HandshakeIcon sx={{ fontSize: 60, color: 'white' }} />, 
      title: "Safe Transactions", 
      description: "Secure, campus-verified trading network" 
    }
  ];
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 shadow-lg fixed top-0 w-full z-50">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-md mr-3">IIIT</span>
            MART
          </div>
          <div className="space-x-2 md:space-x-4">
            <button 
              className="bg-transparent border border-white text-white px-2 md:px-4 py-2 rounded-md hover:bg-white hover:text-gray-900 transition duration-300"
              onClick={() => {handleLogin();}}
            >
              Login
            </button>
            <button 
              className="bg-blue-600 text-white px-2 md:px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              onClick={() => {handleSignup();}}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 md:pt-24 pb-16 bg-white">
        <div className="container mx-auto max-w-6xl flex items-center md:space-x-12">
          <div className="md:w-1/2 ">
            <img 
              src={img} 
              alt="IIIT MART Marketplace" 
              className="rounded-xl hidden md:block shadow-2xl transform transition hover:scale-105 duration-300"
            />
          </div>
          <div className="w-full pl-4 md:w-1/2 space-y-6">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Welcome to <span className="text-blue-600">IIIT MART</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your comprehensive campus marketplace for seamless buying, selling, and connecting with fellow students.
            </p>
            <div>
              <button 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg text-lg font-semibold"
                onClick={() => {handleLogin();}}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Carousel */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">How IIIT MART Works</h2>
          <Carousel 
            showThumbs={false} 
            autoPlay 
            infiniteLoop 
            interval={1000}
          >
            {features.map((feature, index) => (
              <div key={index} className="p-8 text-center text-white">
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300 max-w-xl mx-auto">{feature.description}</p>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* About Developer */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold mb-12">About the Developer</h2>
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg">
              <div className="flex justify-center mb-6">
                <CodeIcon sx={{ fontSize: 64, color: '#1E40AF' }} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">IIIT Hyderabad Student Project</h3>
              <p className="text-gray-600 leading-relaxed">
                IIIT MART is a platform created by Sanyam Agrawal, an undergraduate student at IIIT Hyderabad, designed to streamline campus commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-400">&copy; 2025 IIIT MART. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default IIITMartLandingPage;