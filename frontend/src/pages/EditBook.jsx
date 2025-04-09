// frontend/src/pages/EditBook.jsx
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const EditBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        enqueueSnackbar("Please log in to edit a book", { variant: "warning" });
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthor(response.data.data.author);
        setPublishYear(response.data.data.publishYear);
        setTitle(response.data.data.title);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          enqueueSnackbar("Session expired. Please log in again.", { variant: "error" });
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          enqueueSnackbar("Error fetching book details", { variant: "error" });
          console.log(error.response?.data || error.message);
        }
      }
    };
    fetchData();
  }, [id, enqueueSnackbar, navigate]);

  const handleEditBook = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('publishYear', publishYear);
    if (image) {
      formData.append('image', image);
    }

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
      await axios.put(`http://localhost:3000/books/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      enqueueSnackbar('Book Edited Successfully', { variant: 'success' });
      navigate('/admin'); // Redirect to admin page after success
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401 || error.response?.status === 403) {
        enqueueSnackbar("Unauthorized. Please log in as admin.", { variant: "error" });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        enqueueSnackbar("Error editing book: " + (error.response?.data?.message || "Unknown error"), { variant: "error" });
        console.log(error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <BackButton />
      <h1 className="text-4xl font-bold text-center text-gray-800 my-6 animate__animated animate__fadeInDown">
        Edit Book
      </h1>
      {loading ? <Spinner /> : ''}
      <div className="flex flex-col border-2 border-sky-500 rounded-xl w-full max-w-lg p-6 mx-auto bg-white shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="my-4">
          <label className="text-xl text-gray-600">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
          />
        </div>
        <div className="my-4">
          <label className="text-xl text-gray-600">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
          />
        </div>
        <div className="my-4">
          <label className="text-xl text-gray-600">Publish Year</label>
          <input
            type="number"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
          />
        </div>
        <div className="my-4">
          <label className="text-xl text-gray-600">Book Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
          />
        </div>
        <button
          className="p-3 bg-sky-500 text-white rounded-lg m-8 hover:bg-sky-600 transform hover:scale-110 transition-all duration-300"
          onClick={handleEditBook}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditBook;