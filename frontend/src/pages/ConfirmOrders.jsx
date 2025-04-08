// frontend/src/pages/ConfirmOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";

const ConfirmOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/orders/confirmed", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setOrders(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 animate__animated animate__fadeInDown">
        Confirmed Orders
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
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3">{order.userId.username}</td>
                <td className="p-3">{order.bookId.title}</td>
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
