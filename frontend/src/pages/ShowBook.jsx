// frontend/src/pages/ShowBook.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:3000/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBook(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <BackButton />
      <h1 className="text-4xl font-bold text-gray-800 my-6 animate__animated animate__fadeInDown">
        Book Details
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-500 rounded-xl w-full max-w-lg p-6 mx-auto bg-white shadow-lg">
          {book.image && (
            <img
              src={`http://localhost:3000${book.image}`}
              alt={book.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={(e) => console.log('Image load error:', e)}
            />
          )}
          <h2 className="text-2xl font-semibold text-gray-800">{book.title}</h2>
          <p className="text-gray-600">Author: {book.author}</p>
          <p className="text-gray-600">Publish Year: {book.publishYear}</p>
        </div>
      )}
    </div>
  );
};

export default ShowBook;