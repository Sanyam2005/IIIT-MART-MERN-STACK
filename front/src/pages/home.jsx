import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import Footer from "../components/Footer";
import ProfileCard from "../components/profileCard"; 
const Home = () => {
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        College: '',
        contactNumber: '',
        password: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleGeneralChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const baseURL = import.meta.env.VITE_API_URL;

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveGeneral = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.contactNumber) {
            setSnackbar({
                open: true,
                message: 'Please fill out all required fields.',
                severity: 'error'
            });
            return;
        }

        try {
            await axios.post(`${baseURL}/home`, formData, {
                withCredentials: true,
            });
            setSnackbar({
                open: true,
                message: 'General information updated successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error("Error updating general information:", error);
            setSnackbar({
                open: true,
                message: 'Error updating general information.',
                severity: 'error'
            });
        }
    };

    const handleSavePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setSnackbar({
                open: true,
                message: 'New password and confirmation do not match!',
                severity: 'error'
            });
            return;
        }
        try {
            await axios.post(`${baseURL}/change-password`, passwordData, {
                withCredentials: true,
            });
            setSnackbar({
                open: true,
                message: 'Password updated successfully!',
                severity: 'success'
            });
        } catch (error) {
            if (error.response.status === 400) {
                setSnackbar({
                    open: true,
                    message: 'Incorrect current password',
                    severity: 'error'
                });
            } else {
                console.error("Error updating password:", error);
                setSnackbar({
                    open: true,
                    message: 'Error updating password.',
                    severity: 'error'
                });
            }
        }
    };
 
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await axios.get(`${baseURL}/check-auth`, {
                    withCredentials: true,
                });
                if (response.data.message !== 'Login successful') {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error verifying authentication:", error);
                navigate('/login');
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${baseURL}/home`, {
                    withCredentials: true,
                });
                setFormData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        verifyAuth().then(fetchUserData);
    }, [baseURL, navigate]);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Navbar />
            
            <div className="container mx-auto md:p-6 mt-20 mb-28">
               

                {/* Profile Card */}
                <ProfileCard userData={formData} />
                

                {/* Settings Options */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="grid md:grid-cols-12">
                        {/* Sidebar Navigation */}
                        <div className="col-span-3 border-r border-gray-200 hidden md:block">
                            <div className="flex flex-col space-y-4 p-4">
                                <button
                                    className="text-left px-4 py-2 bg-gray-100 text-blue-600 rounded-lg font-medium"
                                    onClick={() =>
                                        document
                                            .getElementById("account-general")
                                            .scrollIntoView({ behavior: "smooth" })
                                    }
                                >
                                    Edit Profile
                                </button>
                                <button
                                    className="text-left px-4 py-2 bg-gray-100 text-blue-600 rounded-lg"
                                    onClick={() =>
                                        document
                                            .getElementById("account-change-password")
                                            .scrollIntoView({ behavior: "smooth" })
                                    }
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="col-span-9 p-6">
                            {/* General Info Edit */}
                            <div id="account-general" className="mb-10">
                                <h5 className="text-lg font-semibold mb-4">Edit Profile</h5>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleGeneralChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleGeneralChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            College
                                        </label>
                                        <input
                                            type="text"
                                            name="College"
                                            value={formData.College}
                                            onChange={handleGeneralChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Contact Number
                                        </label>
                                        <input
                                            type="phone"
                                            name="contactNumber"
                                            required
                                            value={formData.contactNumber}
                                            onChange={handleGeneralChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Age
                                        </label>
                                        <input
                                            type="text"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleGeneralChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="text-right mt-4">
                                    <button
                                        onClick={handleSaveGeneral}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>

                            {/* Change Password */}
                            <div id="account-change-password">
                                <h5 className="text-lg font-semibold mb-4">Change Password</h5>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="text-right mt-4">
                                    <button
                                        onClick={handleSavePassword}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <Footer />
        </>
    );
};

export default Home;
