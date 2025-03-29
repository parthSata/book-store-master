// frontend/src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data.data);
      } catch (error) {
        alert("Error fetching cart");
        console.log(error);
      }
    };
    fetchCart();
  }, [navigate]);

  const handlePlaceOrder = async (bookId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:3000/orders",
        { bookId, paymentMethod: "COD" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      setCartItems(cartItems.filter((item) => item.bookId._id !== bookId));
    } catch (error) {
      alert("Error placing order");
      console.log(error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold text-center text-gray-800 my-6 animate__animated animate__fadeInDown">
        Your Cart
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-sky-500 text-white">
              <th className="py-3 px-4 text-left">Book</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-gray-100 transition-colors duration-300"
              >
                <td className="py-3 px-4">{item.bookId.title}</td>
                <td className="py-3 px-4">{item.quantity}</td>
                <td className="py-3 px-4">
                  <button
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-110 transition-all duration-300"
                    onClick={() => handlePlaceOrder(item.bookId._id)}
                  >
                    Place Order (COD)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cart;
