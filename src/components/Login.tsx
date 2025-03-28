import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleLoginButton from './GoogleLoginButton';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasProcessedCode = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !hasProcessedCode.current) {
      hasProcessedCode.current = true;
      handleGoogleCallback(code);
    }
  }, [searchParams]);

  const handleGoogleCallback = async (code: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
         // Show success message
         toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
        });

        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Wait a moment for the toast to be visible before redirecting
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        toast.error(data.error || "Google login failed!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      toast.error("Failed to authenticate with Google", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      const json = await response.json();
      console.log(json);

      if (response.ok) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
        });

        localStorage.setItem("token", json.token);
        localStorage.setItem("user", JSON.stringify(json.user));
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(json.error || "Invalid credentials!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                name="email"
                className="w-full p-3 border rounded-lg mt-1"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">PASSWORD</label>
              <input
                type="password"
                name="password"
                className="w-full p-3 border rounded-lg mt-1"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                autoComplete="off"
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

          <div className="space-y-3">
            <GoogleLoginButton />
          </div>

          <p className="text-center mt-4 text-gray-600">
            Don't have an account? <button onClick={() => navigate('/register')} className="text-blue-500">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
