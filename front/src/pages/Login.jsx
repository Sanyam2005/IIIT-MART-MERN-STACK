import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mylogo from "../assets/4.jpeg";
import ReCAPTCHA from "react-google-recaptcha";
function Login() {
  const baseURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [username, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  axios.defaults.withCredentials = true;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/login`,{
          username: formData.username,
          password: formData.password,
          recaptchaToken});
          setLoading(false);
      if (response.data.message === "Login successful") {
        navigate("/home");
      } else {
        setErrorMessage(response.data.message || "An error occurred.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form data:", error);
      setErrorMessage(error.response.data.message || "An error occurred.");
    }
  };
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };
  const handleCASLogin = (e) => {
    e.preventDefault();

    axios
      .get(`${baseURL}/cas/login`)
      .then((res) => {
        console.log(res.data.loginUrl);
        window.location.href = res.data.loginUrl;
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response.data.message);
        setErrorMessage(err.response.data.message || "An error occurred.");
      });
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${baseURL}/check-auth`, { withCredentials: true });
            setUser(response.data);
            if (response.data) {
                navigate('/home');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    fetchUserDetails();
}, [baseURL, navigate]);
  // const handleCASLogin = async () => {
  //   try {
  //     const response = await axios.get(`${baseURL}/cas/login`);
  //     if (response.data) {
  //       console.log(response.data);
  //     window.location.href=response.data;
  //     } else {
  //       setErrorMessage(response.data.message || "An error occurred.");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form data:", error);
  //     setErrorMessage("Error submitting form data.");
  //   }
  // };

  return (
    <div>
         <nav className="fixed top-0 left-0 w-full p-4 bg-gray-900 flex flex-col md:flex-row justify-between items-center z-10">
                  <div className="  grid grid-cols-1 md:grid-cols-1 space-x-24 mb-4 md:mb-0">
                  <Link to="/home" className="text-2xl text-center font-bold text-white md:px-16 md:mb-0">Welcome To IIIT Mart</Link>
                  
                  </div>
                 
                  
              </nav>
   
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12 lg:px-8">
     
      <div className="flex w-full max-w-7xl space-y-8 ">
        {/* Welcome Image */}
        <div className="hidden lg:block w-1/2  ">
            <img
                className="object-cover max-w-lg w-full h-full"
                src={mylogo}
                alt="Welcome to IIIT Mart"
            />         
        </div>
        {/* Login Form */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 mx-2 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Username"
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
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </div>
            </div>
            <ReCAPTCHA
                sitekey="6LdZfMoqAAAAAJGy8ncLRfRZb9coT0j2jBTlQsRe"
                onChange={handleRecaptchaChange}
              />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="mt-2 text-center text-sm text-gray-600">
                Don't Have An Account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  SIGN UP
                </Link>
              </p>
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-700 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleCASLogin}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
              >
                <span className="sr-only">Login With CAS</span>
                CAS Login
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;
