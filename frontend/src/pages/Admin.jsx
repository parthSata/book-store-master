import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { useSnackbar } from "notistack";

const Admin = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalUsers: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || user.role !== "admin") {
      enqueueSnackbar("Admin access required. Please log in as admin.", { variant: "error" });
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [navigate, enqueueSnackbar]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all data concurrently
      const [booksResponse, ordersResponse, confirmedOrdersResponse, usersResponse] = await Promise.all([
        axios.get("http://localhost:3000/books", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: { data: [] } })), // Fallback for books
        axios.get("http://localhost:3000/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: { data: [] } })), // Fallback for pending orders
        axios.get("http://localhost:3000/orders/confirmed", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: { data: [] } })), // Fallback for confirmed orders
        axios.get("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: { data: [] } })), // Fallback for users
      ]);

      // Update stats
      setStats({
        totalBooks: booksResponse.data.data.length || 0,
        pendingOrders: ordersResponse.data.data.length || 0,
        confirmedOrders: confirmedOrdersResponse.data.data.length || 0,
        totalUsers: usersResponse.data.data.length || 0,
      });

      // Get the 5 most recent books
      const sortedBooks = (booksResponse.data.data || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBooks(sortedBooks);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to load dashboard data. Please try again.");
      enqueueSnackbar("Error fetching dashboard data", { variant: "error" });
      console.log(error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    enqueueSnackbar("Logged out successfully", { variant: "success" });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Menu</h2>
        <nav className="space-y-2">
          <Link
            to="/books/create"
            className="block p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Create Book
          </Link>
          <Link
            to="/orders"
            className="block p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Manage Orders
          </Link>
          <Link
            to="/confirm-orders"
            className="block p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Confirmed Orders
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 animate__animated animate__fadeInDown">
            Welcome, {user.username || "Admin"}
          </h1>
          <button
            onClick={handleLogout}
            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-700">Total Books</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalBooks}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-700">Pending Orders</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-700">Confirmed Orders</h3>
                <p className="text-3xl font-bold text-green-600">{stats.confirmedOrders}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
              </div>
            </div>

            {/* Recent Books */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Recently Added Books</h2>
              {recentBooks.length === 0 ? (
                <p className="text-gray-600">No books added yet.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-left">Author</th>
                      <th className="p-3 text-left">Year</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBooks.map((book) => (
                      <tr key={book._id} className="border-b">
                        <td className="p-3">{book.title}</td>
                        <td className="p-3">{book.author}</td>
                        <td className="p-3">{book.publishYear}</td>
                        <td className="p-3">
                          <Link
                            to={`/books/edit/${book._id}`}
                            className="text-yellow-500 hover:underline mr-2"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/books/delete/${book._id}`}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;