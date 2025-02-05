import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

const CartItem = ({ product,onRemove }) => {
    const baseURL = import.meta.env.VITE_API_URL;

    const handleRemove = async () => {
        try {
            const response = await axios.post(`${baseURL}/cart/remove`, {
                productId: product._id,
            }, {
                withCredentials: true
            });
            if (response.data.message === 'Product removed from cart') {
                onRemove(product._id);
            } else {
                console.error('Error removing product from cart:', response.data);
            }
        } catch (error) {
            console.error('Error removing product from cart:', error);
        }
    };
    return (
        <div className="cart-item flex justify-between items-center p-3 border-b">
            <div className="md:flex items-center gap-4">
             <img src={product.image} alt={product.name} className="w-16 h-16 object-contain rounded"/>
             <div className="flex-1 ml-3">
                <h4 className='text-lg font-semibold'>{product.name}</h4>
             </div>
            </div>
            
            <div className="flex items-center space-x-11">
                
                
                <p>Rs. {product.price}</p>
               <button onClick={handleRemove} className=" hover:text-red-700">
                    <FaTrashAlt />
               </button>
            </div>
        </div>
    );
};

export default CartItem;