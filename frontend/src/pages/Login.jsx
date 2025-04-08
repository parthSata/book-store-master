// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert("Invalid credentials");
      console.log(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="flex flex-col border-2 border-sky-500 rounded-xl w-full max-w-md p-6 bg-white shadow-lg transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 animate__animated animate__fadeInDown">
          Login
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
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-sky-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
