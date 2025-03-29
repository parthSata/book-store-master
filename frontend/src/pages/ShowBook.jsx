// frontend/src/pages/ShowBook.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/books/${id}`);
        setBook(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        'http://localhost:3000/orders',
        { bookId: id, paymentMethod: 'COD' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Order placed successfully!');
    } catch (error) {
      alert('Error placing order');
      console.log(error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <BackButton />
      <h1 className="text-4xl font-bold text-center text-gray-800 my-6 animate__animated animate__fadeInDown">
        Show Book
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-500 rounded-xl w-full max-w-lg p-6 mx-auto bg-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          {book.image && (
            <div className="my-4">
              <img
                src={`http://localhost:3000${book.image}`}
                alt={book.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          <div className="my-4">
            <span className="text-xl text-gray-600">Id</span>
            <span className="ml-4">{book._id}</span>
          </div>
          <div className="my-4">
            <span className="text-xl text-gray-600">Title</span>
            <span className="ml-4">{book.title}</span>
          </div>
          <div className="my-4">
            <span className="text-xl text-gray-600">Author</span>
            <span className="ml-4">{book.author}</span>
            </div>
          <div className="my-4">
            <span className="text-xl text-gray-600">Publish Year</span>
            <span className="ml-4">{book.publishYear}</span>
          </div>
          <div className="my-4">
            <span className="text-xl text-gray-600">Create Time</span>
            <span className="ml-4">{new Date(book.createdAt).toString()}</span>
          </div>
          <div className="my-4">
            <span className="text-xl text-gray-600">Last Update Time</span>
            <span className="ml-4">{new Date(book.updatedAt).toString()}</span>
          </div>
          <button
            className="p-3 bg-green-500 text-white rounded-lg mt-4 hover:bg-green-600 transform hover:scale-110 transition-all duration-300"
            onClick={handleOrder}
          >
            Order (Cash on Delivery)
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowBook;