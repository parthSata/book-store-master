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
    if (!token) {
      alert("Please log in to view your cart.");
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:3000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCartItems(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(
          "Error fetching cart:",
          error.response?.data || error.message
        );
        setLoading(false);
      });
  }, [navigate]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:3000/cart/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(
        cartItems.map((item) =>
          item._id === itemId ? response.data.data : item
        )
      );
    } catch (error) {
      alert(
        "Error updating quantity: " +
          (error.response?.data.message || error.message)
      );
    }
  };

  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item._id !== itemId));
      alert("Item removed from cart!");
    } catch (error) {
      alert(
        "Error removing item: " +
          (error.response?.data.message || error.message)
      );
    }
  };

  const handlePlaceOrder = async (bookId, quantity) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "http://localhost:3000/orders",
        { bookId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      setCartItems(cartItems.filter((item) => item.bookId?._id !== bookId));
    } catch (error) {
      alert(
        "Error placing order: " +
          (error.response?.data.message || error.message)
      );
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 animate__animated animate__fadeInDown">
        Your Cart
      </h1>
      {loading ? (
        <Spinner />
      ) : cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="border-2 border-sky-500 rounded-xl p-4 bg-white shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {item.bookId ? item.bookId.title : "Unknown Book"}
              </h2>
              <p className="text-gray-600">
                Author: {item.bookId ? item.bookId.author : "Unknown"}
              </p>
              <div className="flex items-center mt-4 space-x-2">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity - 1)
                  }
                  className="px-3 py-1 bg-gray-300 rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item._id, parseInt(e.target.value) || 1)
                  }
                  className="w-16 text-center border-y-2 border-x-0 border-sky-500 focus:outline-none"
                  min="1"
                />
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity + 1)
                  }
                  className="px-3 py-1 bg-gray-300 rounded-r-lg hover:bg-gray-400"
                >
                  +
                </button>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handlePlaceOrder(item.bookId?._id, item.quantity)}
                  className="flex-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
                  disabled={!item.bookId}
                >
                  Place Order
                </button>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="flex-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;