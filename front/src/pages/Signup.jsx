import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mylogo from "../assets/4.jpeg";

function Signup() {
  const baseURL = import.meta.env.VITE_API_URL; // Replace with your backend URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation logic -uncomment the below code to validate email
            // if (!formData.email.endsWith('@iiit.ac.in')) {
            //     setErrorMessage('Email must be an IIIT email address.');
            //     return;
            // }
            try {
                const response = await axios.post(`${baseURL}/signup`, formData);
                console.log('Form data submitted:', response.data);
                if(response.data.message === 'Signup successful'){
                navigate('/login');
                }
                else{
                    setErrorMessage(response.data.message || 'An error occurred.');
                }
                // Handle successful login here (e.g., redirect to another page)
            } catch (error) {
                console.error('Error submitting form data:', error);
                setErrorMessage(response.data.message || 'An error occurred.');
  };
}

  return (
      <div>
    <nav className="fixed top-0 left-0 w-full p-4 bg-gray-900 flex flex-col md:flex-row justify-between items-center z-10">
            <div className="  grid grid-cols-2 md:grid-cols-1 space-x-24 mb-4 md:mb-0">
            <Link to="/home" className="text-2xl text-center font-bold text-white md:px-16 md:mb-0">Welcome To IIIT Mart</Link>
            
            </div>
            
            
        </nav>
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12 lg:px-8">
      <div className="flex w-full max-w-7xl space-y-8">
        {/* Welcome Image */}
        <div className="hidden lg:block w-1/2">
          <img
            className="h-full w-full max-w-lg object-cover"
            src={mylogo} // Replace with your welcome image URL
            alt="Welcome to IIIT MART"
          />
        </div>
        {/* Signup Form */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
           
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Log in
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="First Name"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="relative block w-full border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Last Name"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email ID"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="contactNumber" className="sr-only">
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  required
                  className="relative block w-full border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Contact Number"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder=" Password"
                  onChange={handleChange}
                />
              </div>
            </div>
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-700 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Signup;
