// frontend/src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3000/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleConfirm = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:3000/orders/${orderId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order confirmed!");
      fetchOrders();
    } catch (error) {
      alert("Error confirming order");
      console.log(error);
    }
  };

  const handleDelete = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Order deleted!");
      fetchOrders();
    } catch (error) {
      alert("Error deleting order");
      console.log(error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 animate__animated animate__fadeInDown">
        Orders
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Book</th>
              <th className="p-3 text-left">Payment Method</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3">{order.userId.username}</td>
                <td className="p-3">{order.bookId.title}</td>
                <td className="p-3">{order.paymentMethod}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleConfirm(order._id)}
                    className="mr-2 text-green-500 hover:underline"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
