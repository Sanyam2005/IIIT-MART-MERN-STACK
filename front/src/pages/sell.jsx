import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VertNav from '../components/VertNav';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ProductForm = () => {
  const initialProductState = {
    img: '',
    ProductName: '',
    ProductPrice: '',
    ProductDesc: '',
    ProductCategory: '',
    SellerID: ''
  };
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [ProductData, setProductData] = useState({
    img: '',
    ProductName: '',
    ProductPrice: '',
    ProductDesc: '',
    ProductCategory: '',
    SellerID: ''
  });

  useEffect(() => {
    axios.get(`${baseURL}/sell`)
      .then(response => {
        if (response.data.message !== 'Login successful') {
          navigate('/login');
        }
        const { seller_id } = response.data;
        setProductData(prevState => ({ ...prevState, SellerID: seller_id }));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        navigate('/login');
      });
  }, [navigate, baseURL]);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...ProductData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state

    const formData = new FormData();
    formData.append('img', image);
    formData.append('ProductName', ProductData.ProductName);
    formData.append('ProductPrice', ProductData.ProductPrice);
    formData.append('ProductDesc', ProductData.ProductDesc);
    formData.append('ProductCategory', ProductData.ProductCategory);
    formData.append('SellerID', ProductData.SellerID);

    try {
      const response = await axios.post(`${baseURL}/product/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.message === 'Product Added') {
        setErrorMessage('Product added successfully');
        // Reset form data
        setProductData(prevState => ({ ...initialProductState, SellerID: prevState.SellerID }));
        setImage(null);
        setImagePreview(null);
        
        // Reset form fields
        e.target.reset();
      } else {
        setErrorMessage('Error in adding product');
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
      setErrorMessage('Error submitting form data.');
    }finally {
      setIsLoading(false); // End loading state
  }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full md:flex mt-20 mb-20">
        <VertNav />
        
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Product</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="ProductName"
                  placeholder="Enter product name"
                  required
                  onChange={handlechange}
                  className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description
                </label>
                <textarea
                  name="ProductDesc"
                  rows="4"
                  placeholder="Describe your product"
                  required
                  onChange={handlechange}
                  className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                ></textarea>
              </div>

              {/* Category and Price Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Category
                  </label>
                  <select
                    name="ProductCategory"
                    required
                    onChange={handlechange}
                    className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  >
                    <option value="">Select Category</option>
                    <option value="Books">Books</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Stationary">Stationary</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="ProductPrice"
                      placeholder="0.00"
                      min="0"
                      required
                      onChange={handlechange}
                      className="w-full rounded-lg border-gray-300 border pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                  <div className="flex justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-48 w-48 object-cover rounded-lg" />
                    ) : (
                      <div className="text-center">
                        <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-500">Upload a product image</p>
                      </div>
                    )}
                  </div>
                  
                  <label className="mt-4 cursor-pointer">
                    <span className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition duration-150">
                      Choose Image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {errorMessage && (
                <div className={`p-4 rounded-lg ${
                  errorMessage.includes('successfully') 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ${
                    isLoading 
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Product...
                    </span>
                ) : (
                    'Add Product'
                )}
            </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductForm;