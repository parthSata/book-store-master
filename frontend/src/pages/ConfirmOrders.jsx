import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const ConfirmOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to view confirmed orders.");
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:3000/orders/confirmed", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setOrders(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(
          "Error fetching confirmed orders:",
          error.response?.data || error.message
        );
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 animate__animated animate__fadeInDown">
        Confirmed Orders
      </h1>
      {loading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <p className="text-gray-600 text-center">
          No confirmed orders available.
        </p>
      ) : (
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Book</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3">
                  {order.userId ? order.userId.username : "Unknown User"}
                </td>
                <td className="p-3">
                  {order.bookId ? order.bookId.title : "Unknown Book"}
                </td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">{order.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConfirmOrders;