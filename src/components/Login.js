import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // Modern alternative for history

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle login logic here
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const json = await response.json();  // Await the response before using it
      console.log(json);

      if (response.ok) {
        localStorage.setItem("token", json.token);
        navigate('/'); // Redirect after login
      } else {
        console.log(json.error);  // Handle errors returned from the server
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center text-white p-8">
        <div className="text-center">
          <img
            src="https://via.placeholder.com/300"
            alt="App Preview"
            className="rounded-lg shadow-lg mb-6"
          />
          <h2 className="text-2xl font-semibold">Simplifying Rentals, Start to Finish</h2>
          <p className="mt-2">From browsing to moving in, every step is streamlined for you.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-4">Hello Again!</h2>
          <p className="text-gray-500 text-center mb-6">Welcome back! You've been missed.</p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700">EMAIL</label>
              <input 
                type="email" 
                name="email"  // Add name attribute
                className="w-full p-3 border rounded-lg mt-1" 
                placeholder="Enter your email" 
                value={credentials.email} // Bind value
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-gray-700">PASSWORD</label>
              <input 
                type="password" 
                name="password"  // Add name attribute
                className="w-full p-3 border rounded-lg mt-1" 
                placeholder="Enter your password" 
                value={credentials.password} // Bind value
                onChange={handleChange} 
              />
              <a href="/" className="text-blue-500 text-sm mt-1 inline-block">Forgot your password?</a>
            </div>
            
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">Log In</button>
          </form>
          
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          
          <button className="w-full flex items-center justify-center border py-2 rounded-lg mb-2 hover:bg-gray-100">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5 mr-2" /> Sign in with Google
          </button>
          <button className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100">
            <img src="https://www.svgrepo.com/show/303151/apple-logo.svg" alt="Apple" className="w-5 h-5 mr-2" /> Sign in with Apple
          </button>
          
          <p className="text-center mt-4 text-gray-600">
            Don’t have an account? <a href="/register" className="text-blue-500">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
