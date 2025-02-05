import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper,
  IconButton,
  useTheme
} from '@mui/material';
import Navbar from '../components/Navbar';
import VertNav from '../components/VertNav';
import CartItem from '../components/cartItem';
import { FaTrashAlt } from 'react-icons/fa';
import {
  ShoppingBag,
  AttachMoney,
  TrendingUp,
  People,
  MoreVert
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import axios from 'axios';

const SellerDashboard = () => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const baseURL = import.meta.env.VITE_API_URL;
  const handleRemove = async (productId) => {
    try {
      await axios.post(`${baseURL}/api/remove-product`, { productId }, { withCredentials: true });
      setSellerProducts(sellerProducts.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const handlePriceChange = async (productId, newPrice) => {
    try {
      const response = await axios.post(`${baseURL}/api/update-product-price`, { productId, newPrice }, { withCredentials: true });
      setSellerProducts(sellerProducts.map(product => product._id === productId ? response.data : product));
    } catch (error) {
      console.error('Error updating product price:', error);
    }
  };
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricsResponse = await axios.get(`${baseURL}/api/metrics`, { withCredentials: true });
        setMetrics(metricsResponse.data);

        const monthlyRevenueResponse = await axios.get(`${baseURL}/api/monthly-revenue`, { withCredentials: true });
        setMonthlyRevenue(monthlyRevenueResponse.data);

        const orderStatusResponse = await axios.get(`${baseURL}/api/order-status`, { withCredentials: true });
        setOrderStatusData(orderStatusResponse.data.map(status => ({
          name: status._id,
          value: status.count
        })));

        

        const sellerProductsResponse = await axios.get(`${baseURL}/api/seller-products`, { withCredentials: true });
        setSellerProducts(sellerProductsResponse.data);
        console.log(sellerProductsResponse.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  const COLORS = [theme.palette.success.main, theme.palette.warning.main, theme.palette.primary.main];

  const MetricCard = ({ title, value, icon: Icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {typeof value === 'number' && title.includes('Revenue') ? `₹${value.toLocaleString()}` : value}
            </Typography>
          </Box>
          <Box sx={{ 
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon sx={{ fontSize: 32, color: `${color}.main` }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Navbar />
      <div className="w-full md:flex mt-20 mb-32">
        <VertNav />
        <Container sx={{ mt: 4, mb: 4 }}>
          {/* Metrics Grid */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Total Orders"
                value={metrics.totalOrders}
                icon={ShoppingBag}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Total Revenue"
                value={metrics.totalRevenue}
                icon={AttachMoney}
                color="success"
              />
            </Grid>
          
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Number Of Customers"
                value={metrics.activeCustomers}
                icon={People}
                color="error"
              />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} >
            {/* Revenue Trend */}
            <Grid item xs={12} lg={7}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Revenue Trend</Typography>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id.month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke={theme.palette.primary.main} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Order Status */}
            <Grid item xs={12} lg={5}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Order Status</Typography>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

          

            <div className="w-full p-4 bg-white mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Products Sold by You</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {sellerProducts.map(product => (
          <div 
            key={product._id} 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
          >
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Image Container */}
                <div className="w-full sm:w-32 h-32 rounded-lg bg-gray-50 p-2 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain rounded"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 w-full sm:w-auto">
                      <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
                      <p className="text-sm text-gray-500 hidden sm:block">Product ID: {product._id}</p>
                    </div>

                    {/* Price Input Section */}
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-gray-600 font-medium sm:mr-2">
                        Change Price
                      </label>
                      <div className="relative w-full sm:w-36">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹                     
                        </span>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => handlePriceChange(product._id, e.target.value)}
                          className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default SellerDashboard;