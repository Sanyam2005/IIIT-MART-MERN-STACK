import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const baseURL = import.meta.env.VITE_API_URL;

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseURL}/buy/${productId}`);
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          setAlert({
            show: true,
            type: 'error',
            message: 'Error fetching product details'
          });
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setAlert({
          show: true,
          type: 'error',
          message: 'Unable to fetch product details. Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, baseURL]);

  const handleAdd = async (e, product) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseURL}/cart/add`,
        { productId: product._id },
        { withCredentials: true }
      );

      const messages = {
        'Product added to cart': { type: 'success', message: 'Product successfully added to cart' },
        'Product already exists': { type: 'warning', message: 'Product is already in your cart' },
        'Sellers cannot buy their own products': { type: 'error', message: 'You cannot add your own product to cart' },
        default: { type: 'error', message: 'Error adding product to cart' }
      };

      const alertConfig = messages[response.data.message] || messages.default;
      setAlert({ show: true, ...alertConfig });

    } catch (error) {
      console.error('Error adding product to cart:', error);
      setAlert({
        show: true,
        type: 'error',
        message: error.response.data.message || 'An error occurred'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-32 pb-28">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-12">
          {/* Product Image */}
          <div className="w-full sm:w-1/2 flex justify-center items-start">
            <img
              className="w-auto h-auto max-h-96 object-contain rounded-lg shadow-lg"
              src={product.image}
              alt={product.name}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col space-y-6">
            <h1 className="font-medium text-3xl text-gray-900">{product.name}</h1>
            
            <p className="text-4xl font-semibold text-gray-900">
              Rs. {product.price.toLocaleString()}
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <button
              onClick={(e) => handleAdd(e, product)}
              className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-md
                text-sm font-medium transition-colors duration-200
                hover:bg-gray-800 active:bg-gray-700 focus:outline-none
                focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              ADD TO CART
            </button>

            <hr className="border-gray-200" />

            {/* Seller Details */}
            <div className="space-y-2">
              <h2 className="font-medium text-gray-900">SELLER DETAILS</h2>
              <div className="text-gray-600 space-y-1">
                <p>Name: {product.seller_id.firstName} {product.seller_id.lastName}</p>
                <p>Email: {product.seller_id.email}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Bottom Alert */}
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

export default ProductPage;