import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/card';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';


function Buy() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_URL;
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [filters, setFilters] = useState({
        categories: {
            "Books": false,
            "Coolers": false,
            "Clothing": false,
            "Electronics": false,
            "Grocery": false,
            "Stationary": false,
            "Fashion": false,
            "Others": false,
        },
    });

    axios.defaults.withCredentials = true;
    
    useEffect(() => {
        axios.get(`${baseURL}/buy`)
            .then(response => {
                console.log(response.data);
                if (response.data.message !== 'Login successful') {
                    navigate('/login');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                navigate('/login');
            });
    }, [navigate, baseURL]);

    const handleCategoryChange = (category) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            categories: {
                ...prevFilters.categories,
                [category]: !prevFilters.categories[category],
            },
        }));
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(`${baseURL}/product/list`);
            console.log(response.data);
            if (response.data.message === 'All Products') {
                setProducts(response.data.allproducts); // Dispatch products to Redux store
                setFilteredProducts(response.data.allproducts);
            } else {
                alert('Error in fetching products');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProductsData();
    }, [baseURL]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        const selectedCategories = Object.keys(filters.categories).filter(category => filters.categories[category]);
        const filtered = products.filter(product => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        setFilteredProducts(filtered);
    }, [filters, searchQuery, products]);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    return (
        <div className="w-full grid grid-cols-1">
            <Navbar />
            {loading ? (
                 <div className="pt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-16">
                 {[...Array(8)].map((_, index) => (
                     <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                         {/* Image skeleton */}
                         <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                         
                         {/* Title skeleton */}
                         <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                         
                         {/* Price skeleton */}
                         <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                         
                         {/* Description skeleton */}
                         <div className="space-y-2">
                             <div className="h-3 bg-gray-200 rounded w-full"></div>
                             <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                         </div>
                         
                         {/* Button skeleton */}
                         <div className="h-8 bg-gray-200 rounded mt-4"></div>
                     </div>
                 ))}
             </div>
            ) : (
                <>
                    <div className="pt-20 pb-6">
                        <div className="relative max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 bg-white shadow-sm"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 sm:gap-10 pt-10 border-t md:mx-16 mb-28">
                        <div className="min-w-60">
                            <p className="my-2 text-xl flex items-center justify-center gap-2">
                                FILTERS 
                                <button className="md:hidden ml-2" onClick={toggleFilters}>
                                    {filtersVisible ? 'Hide' : 'Apply '}
                                </button>
                            </p>
                            <div className={`border border-gray-300 pl-5 py-3 mt-6 sm:block ${filtersVisible ? 'block' : 'hidden'} md:block`}>
                                <p className="mb-3 font-medium text-sm">CATEGORIES</p>
                                <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                                    {Object.keys(filters.categories).map((category) => (
                                        <p className="flex gap-2" key={category}>
                                            <input
                                                className="h-4 w-6"
                                                type="checkbox"
                                                checked={filters.categories[category]}
                                                onChange={() => handleCategoryChange(category)}
                                            />
                                            {category}
                                        </p>
                                    ))}
                                </div>
                            </div>   
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </>
            )}
            <Footer />
        </div>
    );
}

export default Buy;
