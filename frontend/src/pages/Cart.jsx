// frontend/src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCartItems(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handlePlaceOrder = async (bookId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:3000/orders",
        { bookId },
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
      <h1 className="text-4xl font-bold text-gray-800 mb-6 animate__animated animate__fadeInDown">
        Your Cart
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="border-2 border-sky-500 rounded-xl p-4 bg-white shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {item.bookId.title}
              </h2>
              <p className="text-gray-600">Author: {item.bookId.author}</p>
              <button
                onClick={() => handlePlaceOrder(item.bookId._id)}
                className="p-2 bg-green-500 text-white rounded-lg mt-4 w-full hover:bg-green-600 transform hover:scale-110 transition-all duration-300"
              >
                Place Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
