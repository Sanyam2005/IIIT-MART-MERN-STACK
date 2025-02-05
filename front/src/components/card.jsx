import React from 'react';

import { addtoCart } from '../redux/cartSlice';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
   // const dispatch = useDispatch();
   const ProductCard = ({ product }) => {
    const baseURL = import.meta.env.VITE_API_URL;

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const handleAdd = async (e, product) => {
        e.stopPropagation();
        e.preventDefault();
        
        try {
            const response = await axios.post(`${baseURL}/cart/add`, {
                productId: product._id,
            }, {
                withCredentials: true
            });
            if(response.data.message === 'Product added to cart'){
            console.log('Product added to cart:', response.data);
            setSnackbar({
                open: true,
                message: 'Product added to cart',
                severity: 'success'
            });
            }
            else if(response.data.message === 'Product already exists'){
                setSnackbar({
                    open: true,
                    message: 'Product already in Cart',
                    severity: 'info'
                });

            }
            else{
                console.log('Error adding product to cart:', response.data);
                setSnackbar({
                    open: true,
                    message: 'Error adding product to cart',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            setSnackbar({
                open: true,
                message: error.response.data.message || 'An error occurred',
                severity: 'error'
            });
        }
    };
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    return (
        <div className=" product-card border p-4 rounded border-transform transition-transform duration-300 hover:scale-105">
             <Link to={`/buy/${product._id}`}>
             <Snackbar
                open={snackbar.open}
                autoHideDuration={1500}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <img src={product.image} alt={product.name} className="product-image w-full h-40 md:h-56 object-contain mb-1 rounded" />
            
            <div className="product-details">
                <h2 className="product-name text-lg font-bold">{product.name}</h2>
                <p className="product-price text-gray-800 font-semibold">Rs. {product.price}</p>
            </div>
            </Link>
            <button onClick={(e) => handleAdd(e, product)} className="add-to-cart-button w-full bg-gray-700 font-bold text-white py-2 px-4 rounded mt-4">
                Add to Cart
                
            </button>
           
        </div>
    )
};

export default ProductCard;