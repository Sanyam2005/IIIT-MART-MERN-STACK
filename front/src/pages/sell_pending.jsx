import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SellerItemPending from '../components/sellerItemPending';
import Footer from '../components/Footer';
import VertNav from '../components/VertNav';

const PendingRequests = () => {
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
                    const response = await axios.get(`${baseURL}/sell/pending`, {
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
              <VertNav />
                <div className="w-full max-w-7xl  mx-auto px-4 md:px-16 mt-8 text-gray-600 text-base">
                    <div>
                        <h1 className="text-2xl  text-center md:text-start font-bold mb-4">Pending Orders</h1>
                        <div className="flex flex-col md:flex-row justify-between space-x-20 mt-7">
                            <div className="w-full md:w-2/3">
                                
                                <div>
                                    {pendingOrders.length > 0 ? (
                                        pendingOrders.map((order) => (
                                            <SellerItemPending key={order._id} order={order}  />
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
  
  export default PendingRequests;
  