// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/books", {
        headers: { Authorization: `Bearer ${token}` }, // Add token for consistency
      })
      .then((response) => {
        setBooks(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add to cart");
      window.location.href = "/login";
      return;
    }
    try {
      await axios.post(
        "http://localhost:3000/cart",
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Book added to cart!");
    } catch (error) {
      alert("Error adding to cart");
      console.log(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 animate__animated animate__fadeInDown">
          Books List
        </h1>
        <div>
          <Link
            to="/cart"
            className="p-3 bg-yellow-500 text-white rounded-lg mr-4 hover:bg-yellow-600 transform hover:scale-110 transition-all duration-300"
          >
            View Cart
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="border-2 border-sky-500 rounded-xl p-4 bg-white shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              {book.image && (
                <img
                  src={`http://localhost:3000${book.image}`}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => console.log("Image load error:", e)} // Debug image issues
                />
              )}
              <h2 className="text-xl font-semibold text-gray-800">
                {book.title}
              </h2>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-600">Publish Year: {book.publishYear}</p>
              <div className="flex justify-between mt-4">
                <Link
                  to={`/books/details/${book._id}`}
                  className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transform hover:scale-110 transition-all duration-300"
                >
                  View
                </Link>
                <button
                  onClick={() => handleAddToCart(book._id)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-110 transition-all duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
