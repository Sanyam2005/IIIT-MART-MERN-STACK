import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OrderItemCompleted from '../components/orderItemCompleted';
import Footer from '../components/Footer';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import CompletedOrderItem from '../components/Completed';

const BuyHistory = () => {
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
                    const response = await axios.get(`${baseURL}/orders/completed`, {
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
                <div className="w-full border-t-4 md:border-t-0 md:ml-32 mt-8 my-6 text-gray-600 text-base">
                    <div>
                        <h1 className="text-2xl  pt-4 text-center md:text-start font-bold mb-4">Completed Orders</h1>
                        <div className="flex flex-col md:flex-row justify-between space-x-20 mt-7">
                            <div className="w-full md:w-2/3">
                                
                                <div>
                                    {pendingOrders.length > 0 ? (
                                        pendingOrders.map((order) => (
                                            <CompletedOrderItem key={order._id} order={order} isSeller={false} />
                                        ))
                                    ) : (
                                        <p className="md:h-72">No Completed orders found.</p>
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
  
  export default BuyHistory;
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import OrderItemCompleted from '../components/orderItemCompleted';
// import Footer from '../components/Footer';
// import { Grid, Card, CardContent, Typography } from '@mui/material';

// const BuyHistory = () => {
//     const baseURL = import.meta.env.VITE_API_URL;
//     const navigate = useNavigate();
//     const [completedOrders, setCompletedOrders] = useState([]);
//     const [totalAmount, setTotalAmount] = useState(0);
//     const [totalItems, setTotalItems] = useState(0);

//     axios.defaults.withCredentials = true;

//     useEffect(() => {
//         axios.get(`${baseURL}/check-auth`)
//             .then(response => {
//                 if (response.data.message !== 'Login successful') {
//                     navigate('/login');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//                 navigate('/login');
//             });

//         const fetchCompletedOrders = async () => {
//             try {
//                 const response = await axios.get(`${baseURL}/orders/completed`, {
//                     withCredentials: true
//                 });
//                 const orders = response.data.orders || [];
//                 setCompletedOrders(orders);

//                 // Calculate total amount and total items
//                 const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
//                 const totalItems = orders.length;

//                 setTotalAmount(totalAmount);
//                 setTotalItems(totalItems);
//             } catch (error) {
//                 console.error('Error fetching completed orders:', error);
//             }
//         };

//         fetchCompletedOrders();
//     }, [navigate, baseURL]);

//     return (
//         <>
//             <Navbar />
//             <div className="w-full md:flex mt-36 md:mt-32 mb-24">
//                 <div className="flex mr-4 flex-col gap-4 md:w-1/6 pl-4 md:border-r">
//                     <h1 className="text-2xl text-gray-950 font-bold mb-4">MY ORDERS</h1>
//                     <Link to="/orders/pending" className="flex items-center gap-3 border border-gray-300 px-2 py-2 mr-1 rounded-l active">
//                         Pending Orders
//                     </Link>
//                     <Link to="/orders/completed" className="flex items-center gap-3 border border-gray-300 px-2 py-2 mr-1 rounded-l active">
//                         Completed Orders
//                     </Link>
//                 </div>
//                 <div className="w-full border-t-4 md:border-t-0 md:ml-32 my-6 text-gray-600 text-base">
//                     <div>
//                         <h1 className="text-2xl text-center md:text-start font-bold mb-4">Completed Orders</h1>
//                         <Grid container spacing={3} className="mb-6 ">
//                             <Grid item xs={12} sm={4}>
//                                 <Card>
//                                     <CardContent>
//                                         <Typography variant="h5" component="div">
//                                             Total Orders Completed
//                                         </Typography>
//                                         <Typography variant="h4" component="div">
//                                             {totalItems}
//                                         </Typography>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                             <Grid item xs={12} sm={4}>
//                                 <Card>
//                                     <CardContent>
//                                         <Typography variant="h5" component="div">
//                                             Total Amount Spent
//                                         </Typography>
//                                         <Typography variant="h4" component="div">
//                                             Rs. {totalAmount}
//                                         </Typography>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                             <Grid item xs={12} sm={4}>
//                                 <Card>
//                                     <CardContent>
//                                         <Typography variant="h5" component="div">
//                                             No of Items Bought
//                                         </Typography>
//                                         <Typography variant="h4" component="div">
//                                             {totalItems}
//                                         </Typography>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
                            
//                         </Grid>
//                         <div className="flex flex-col md:flex-row justify-between space-x-20 mt-7">
//                             <div className="w-full md:w-2/3">
//                                 <div>
//                                     {completedOrders.length > 0 ? (
//                                         completedOrders.map((order) => (
//                                             <OrderItemCompleted key={order._id} order={order} />
//                                         ))
//                                     ) : (
//                                         <p>No Completed orders found.</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default BuyHistory;