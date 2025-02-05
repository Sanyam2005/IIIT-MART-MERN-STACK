import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OrderItem from '../components/orderItem';
import Footer from '../components/Footer';


const PendingOrders = () => {
    const baseURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [pendingOrders, setPendingOrders] = useState([]);
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get(`${baseURL}/check-auth`)
            .then(response => {
                
                if (response.data.message !== 'Login successful') {
                    navigate('/login');
                }
                const { seller_id } = response.data;
               
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                navigate('/login');
            });
            const fetchPendingOrders = async () => {
                try {
                    const response = await axios.get(`${baseURL}/orders/pending`, {
                        withCredentials: true
                    });
                    setPendingOrders(response.data.orders || []);
                    console.log('Pending orders:', response.data.orders);
                } catch (error) {
                    console.error('Error fetching pending orders:', error);
                }
            };
            
            fetchPendingOrders();
    }, [navigate,baseURL]);
    
    
    return (
        <>
            <Navbar />
            <div className="w-full md:flex mt-20 mb-32">
                <div className="flex  mr-4 flex-col gap-4 md:w-1/6 pl-4 md:border-r">
                    <h1 className="text-2xl text-gray-950 font-bold mb-4">MY ORDERS</h1>
                    <Link to="/orders/pending" className="flex items-center gap-3 border border-gray-300 px-2 py-2 mr-1 rounded-l active">
                        Pending Orders
                    </Link>
                    <Link to="/orders/completed" className="flex items-center gap-3 border border-gray-300 px-2 py-2 mr-1 rounded-l active">
                        Completed Orders
                    </Link>
                </div>
                <div className="w-full border-t-4 md:border-t-0 mt-8 md:ml-32 my-6 text-gray-600 text-base">
                    <div>
                        <h1 className="text-2xl pt-4  text-center md:text-start font-bold mb-4">Pending Orders</h1>
                        <div className="flex flex-col md:flex-row justify-between space-x-20 mt-7">
                            <div className="w-full md:w-2/3">
                                
                                <div>
                                    {pendingOrders.length > 0 ? (
                                        pendingOrders.map((order) => (
                                            <OrderItem key={order._id} order={order}  />
                                        ))
                                    ) : (
                                        <p className="md:h-72">No pending orders found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
  };
  
  export default PendingOrders;
  