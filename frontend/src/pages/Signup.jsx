// frontend/src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:3000/users/signup", {
        username,
        password,
        role: "user", // Default role is 'user'
      });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data.message || "Error during signup");
      console.log(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="flex flex-col border-2 border-sky-500 rounded-xl w-full max-w-md p-6 bg-white shadow-lg transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 animate__animated animate__fadeInDown">
          Sign Up
        </h1>
        <div className="my-4">
          <label className="text-xl text-gray-600">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
          />
        </div>
        <div className="my-4">
          <label className="text-xl text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
          />
        </div>
        <button
          className="p-3 bg-sky-500 text-white rounded-lg mt-4 hover:bg-sky-600 transform hover:scale-110 transition-all duration-300"
          onClick={handleSignup}
        >
          Sign Up
        </button>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-sky-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
