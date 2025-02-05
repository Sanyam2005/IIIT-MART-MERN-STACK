import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import CartItem from '../components/cartItem';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const baseURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleCloseAlert = () => {
        setAlert({ ...alert, show: false });
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(`${baseURL}/check-auth`, {
                    withCredentials: true
                });
                if (response.data.message !== 'Login successful') {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                navigate('/login');
            }
        };

        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`${baseURL}/cart`, {
                    withCredentials: true
                });
                setCartItems(response.data.products);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setAlert({
                    show: true,
                    type: 'error',
                    message: 'Error loading cart items. Please try again.'
                });
            }
        };

        checkLoginStatus();
        fetchCartItems();
    }, [baseURL, navigate]);

    const handleRemove = (productId) => {
        setCartItems(cartItems.filter(item => item.productId._id !== productId));
        setAlert({
            show: true,
            type: 'success',
            message: 'Product removed from cart successfully'
        });
    };

    const handlePlaceOrder = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${baseURL}/order/place`, {
                products: cartItems.map(item => ({
                    productId: item.productId._id,
                    amount: item.productId.price,
                    sellerID: item.productId.seller_id
                }))
            }, {
                withCredentials: true
            });

            if (response.data.message === 'Orders placed successfully') {
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Orders placed successfully!'
                });
                setCartItems([]);
                // Delay navigation by 3 seconds
            } else {
                setAlert({
                    show: true,
                    type: 'error',
                    message: 'Error placing order. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error placing orders:', error);
            setAlert({
                show: true,
                type: 'error',
                message: 'Error placing order. Please try again later.'
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow container mx-auto py-8 px-4 lg:px-20 mt-36 md:px-16 md:mt-24 mb-20">
                {cartItems.length > 0 ? (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">My Cart</h1>
                        <div className="flex flex-col md:flex-row justify-between space-x-0 md:space-x-20 mt-7">
                            <div className="w-full md:w-2/3">
                                <div className="flex justify-between border-b items-center mb-4 font-bold text-sm">
                                    <h3>PRODUCTS</h3>
                                </div>
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <CartItem 
                                            key={item.productId._id} 
                                            product={item.productId} 
                                            onRemove={handleRemove} 
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div className="md:w-1/3 bg-white p-8 rounded-lg shadow-xl border mt-10 sticky top-24">
                                <h2 className="text-xl font-semibold mb-6">CHECKOUT</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between pb-4 border-b">
                                        <span className="text-gray-600">Total Items</span>
                                        <span className="font-medium">{cartItems.length}</span>
                                    </div>
                                    <div className="flex justify-between pb-4 border-b">
                                        <span className="text-gray-600">Total Price</span>
                                        <span className="font-medium">
                                            Rs. {cartItems.reduce((total, item) => total + item.productId.price, 0).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <form onSubmit={handlePlaceOrder}>
                                        <button className="w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-md
                                            transition-colors duration-200 hover:bg-gray-800 focus:outline-none 
                                            focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                                            Place Order
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="w-24 h-24 mb-8 text-gray-400">
                            {/* Shopping Cart Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                        <button 
                            onClick={() => navigate('/buy')}
                            className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium
                                transition-colors duration-200 hover:bg-gray-800 focus:outline-none 
                                focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </main>

            <Footer />

            <Snackbar 
                open={alert.show} 
                autoHideDuration={6000} 
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ bottom: { xs: '24px', sm: '24px' } }}
            >
                <Alert 
                    onClose={handleCloseAlert} 
                    severity={alert.type} 
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        maxWidth: '600px',
                        boxShadow: 3
                    }}
                >
                    <AlertTitle>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</AlertTitle>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Cart;