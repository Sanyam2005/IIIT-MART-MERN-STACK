import React, { useState } from 'react';
import {FaComments, FaShoppingCart, FaBars, FaTimes, FaUser, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import SupportChat from './SupportChat';
import { useNavigate } from 'react-router-dom';
function Navbar() {
    const baseURL = import.meta.env.VITE_API_URL;
    const Navigate=useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [username, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${baseURL}/user`, { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [baseURL]);
    const handleLogout = async () => {
        console.log('Logging out...');
        try {
            await axios.post(`${baseURL}/logout`, {}, { withCredentials: true });
            
            Navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
    };
    const [isChatOpen, setIsChatOpen] = useState(false);
    return (
        <>
            {/* Main Navbar */}
            <nav className="fixed top-0 left-0 w-full p-3 bg-gray-900 flex justify-between items-center z-10 shadow-lg">
                <div className="flex items-center">
                    <Link to="/home" className="text-2xl md:pl-16 text-white font-extrabold hover:text-red-300 transition-colors">
                    IIIT MART
                    </Link>
                </div>
                
                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-10">
                    <li>
                        <Link to="/home" className="text-white text-lg hover:text-red-400 transition-colors">Home</Link>
                    </li>
                    <li>
                        <Link to="/buy" className="text-white text-lg hover:text-red-400 transition-colors">Buy</Link>
                    </li>
                    <li>
                        <Link to="/orders/pending" className="text-white text-lg hover:text-red-400 transition-colors">My Orders</Link>
                    </li>
                    <li>
                        <Link to="/seller" className="text-white text-lg hover:text-red-400 transition-colors">Sell</Link>
                    </li>
                </ul>

                {/* Desktop Cart and Profile */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/cart" className="relative group">
                        <FaShoppingCart className="text-white text-2xl hover:text-red-400 transition-colors" />
                       
                    </Link>
                   
                   
                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button 
                            className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                <FaUser className="text-lg" />
                            </div>
                            <span className="text-lg">{username}</span>
                            <FaChevronDown className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20">
                                <Link to="/home" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white">
                                    Profile Settings
                                </Link>
                               
                                <div className="border-t border-gray-700"></div>
                                <button
                                    onClick={handleLogout}
                                    
                                    className="block w-full text-left px-4  py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={toggleMenu} className="md:hidden text-white hover:text-red-400 transition-colors">
                    {isMenuOpen ? <FaTimes className="text-2xl hidden" /> : <FaBars className="text-2xl" />}
                </button>
            </nav>

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-full md:hidden transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } z-20`}>
                <div className="h-full w-72 bg-gray-900 p-6 shadow-lg">
                    {/* Sidebar Header */}
                    <div className="flex justify-between items-center mb-8">
                        <Link to="/home" className="text-2xl font-bold text-red-400" onClick={toggleMenu}>CampusCart</Link>
                        <button onClick={toggleMenu} className="text-white hover:text-red-400 transition-colors">
                            <FaTimes className="text-2xl" />
                        </button>
                    </div>

                    {/* User Profile Section in Sidebar */}
                    <div className="mb-8 p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <FaUser className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="text-white text-xl">{username}</h3>
                               
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Navigation */}
                    <div className="space-y-4">
                        <Link to="/home" className="flex items-center space-x-2 text-xl  text-white hover:text-red-400 transition-colors py-2" onClick={toggleMenu}>
                            Home
                        </Link>
                        <Link to="/buy" className="flex items-center space-x-2 text-xl text-white hover:text-red-400 transition-colors py-2" onClick={toggleMenu}>
                            Buy
                        </Link>
                        <Link to="/orders/pending" className="flex items-center space-x-2 text-xl text-white hover:text-red-400 transition-colors py-2" onClick={toggleMenu}>
                            My orders
                        </Link>
                        <Link to="/cart" className="flex items-center space-x-2 text-xl text-white hover:text-red-400 transition-colors py-2" onClick={toggleMenu}>
                            Cart <FaShoppingCart className="ml-2" />
                           
                        </Link>
                        
                        <Link to="/seller" className="flex items-center space-x-2 text-xl text-white hover:text-red-400 transition-colors py-2" onClick={toggleMenu}>
                            Sell
                        </Link>
                       
                    </div>

                    {/* Sidebar Footer */}
                    <div className="absolute bottom-8 left-6 right-6">
                        <div className="border-t border-gray-700 pt-4">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    toggleMenu();
                                }}
                                className="flex items-center text-xl space-x-2 text-red-400 hover:text-red-300 transition-colors w-full"
                            >
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

               
            </div>
           {/* Floating Chat Support Button */}
           <button 
                onClick={() => setIsChatOpen(!isChatOpen)} 
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
            >
                <FaComments className="text-2xl" />
            </button>

            {/* Chat Support */}
            {isChatOpen && <SupportChat isOpenFromNavbar={isChatOpen} onClose={() => setIsChatOpen(false)} />}
        
        </>
    );
}

export default Navbar;