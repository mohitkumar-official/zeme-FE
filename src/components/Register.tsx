import React, { useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormData = {
  role: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyAddress: string;
  apartmentUnit: string;
  bio: string;
  licenseNumber: string;
};

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "RENTER"; // Default to "RENTER" if role not found
  const [formData, setFormData] = useState<FormData>({
    role: role,  // Add role to formData
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyAddress: "",
    apartmentUnit: "",
    bio: "",
    licenseNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate(); // For navigation after successful registration

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the whole formData
      });

      const json = await response.json();  // Await the response before using it
      console.log(json);

      if (response.ok) {
        toast.success("Login successful! 🎉", {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.setItem("token", json.token);
        localStorage.setItem("user", JSON.stringify(json.user));
        navigate('/'); // Redirect after registration
      } else {
        toast.error(json.error || "Something went wrong. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const isAgent = role === "agent";
  const isLandlord = role === "landlord";
  const showBusinessFields = isAgent || isLandlord;

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 to-purple-900 items-center justify-center text-white p-8">
        <div className="text-center max-w-lg">
          <h2 className="text-3xl font-semibold mb-4">Your Next Home Awaits</h2>
          <p className="text-lg mb-8">From aspiration to address in a few clicks.</p>
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
            alt="Modern apartment interior"
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-white">
        <div className="p-8">
          <a href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </a>

          <div className="max-w-2xl mx-auto w-full">
            <h2 className="text-3xl font-bold mb-2">Register as {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</h2>
            <p className="text-gray-600 mb-8">Fill in your information to create an account</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter First Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter Middle Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter Phone Number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter Email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              {showBusinessFields && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Company Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter Company Name"
                        required={showBusinessFields}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        License Number<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter License Number"
                        required={showBusinessFields}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company Address<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter Company Address"
                      required={showBusinessFields}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Apartment, Suite, Unit, etc.
                    </label>
                    <input
                      type="text"
                      name="apartmentUnit"
                      value={formData.apartmentUnit}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter Apartment, Suite, Unit, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us about yourself or your company..."
                    />
                  </div>
                </div>
              )}

              {/* Password Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter Password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Create Account
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
