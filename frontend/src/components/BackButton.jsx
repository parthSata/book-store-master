import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsArrowLeft } from 'react-icons/bs'


const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Check if the current route is an admin route
    const adminRoutes = [
      "/books/create",
      "/books/edit",
      "/books/delete",
      "/admin",
      "/orders",
      "/confirm-orders",
    ];
    const isAdminRoute = adminRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    if (isAdminRoute) {
      // Redirect to admin dashboard for admin routes
      navigate("/admin");
    } else {
      // For non-admin routes, go back to home or previous page
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
    >
      <BsArrowLeft className="text-2xl" />
    </button>
  );
};

export default BackButton;
