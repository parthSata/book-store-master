// frontend/src/pages/Admin.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 animate__animated animate__fadeInDown">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-300"
        >
          Logout
        </button>
      </div>
      <nav className="mb-6">
        <Link
          to="/orders"
          className="mr-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-110 transition-all duration-300"
        >
          Orders
        </Link>
        <Link
          to="/books/create"
          className="mr-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-110 transition-all duration-300"
        >
          Create Book
        </Link>
        <Link
          to="/confirm-orders"
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-110 transition-all duration-300"
        >
          Confirm Orders
        </Link>
      </nav>
      <div className="text-center">
        <p className="text-xl text-gray-600">
          Welcome to the Admin Dashboard. Select an option above.
        </p>
      </div>
    </div>
  );
};

export default Admin;
