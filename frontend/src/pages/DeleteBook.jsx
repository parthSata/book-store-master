// frontend/src/pages/DeleteBook.jsx
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteBook = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || user.role !== "admin") {
      setLoading(false);
      enqueueSnackbar("Admin access required. Please log in as admin.", { variant: "error" });
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      enqueueSnackbar('Book Deleted Successfully', { variant: 'success' });
      navigate('/admin'); // Redirect to admin page after success
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401 || error.response?.status === 403) {
        enqueueSnackbar("Unauthorized. Please log in as admin.", { variant: "error" });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        enqueueSnackbar("Error deleting book: " + (error.response?.data?.message || "Unknown error"), { variant: "error" });
        console.log(error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <BackButton />
      <h1 className="text-4xl font-bold text-center text-gray-800 my-6 animate__animated animate__fadeInDown">
        Delete Book
      </h1>
      {loading ? <Spinner /> : ''}
      <div className="flex flex-col items-center border-2 border-sky-500 rounded-xl w-full max-w-lg p-8 mx-auto bg-white shadow-lg transform hover:scale-105 transition-transform duration-300">
        <h3 className="text-2xl text-gray-800 mb-6">
          Are you sure you want to delete this book?
        </h3>
        <button
          className="p-4 bg-red-600 text-white rounded-lg w-full hover:bg-red-700 transform hover:scale-110 transition-all duration-300"
          onClick={handleDeleteBook}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;