// frontend/src/pages/CreateBooks.jsx
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const CreateBooks = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3000/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSaveBook = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("publishYear", publishYear);
    if (image) {
      formData.append("image", image);
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:3000/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      enqueueSnackbar("Book Created successfully", { variant: "success" });
      setTitle("");
      setAuthor("");
      setPublishYear("");
      setImage(null);
      fetchBooks(); // Refresh book list
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Error", { variant: "error" });
      console.log(error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <BackButton />
      <h1 className="text-4xl font-bold text-center text-gray-800 my-6 animate__animated animate__fadeInDown">
        Create Book
      </h1>
      {loading && <Spinner />}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-full max-w-lg p-6 mx-auto bg-white shadow-lg transform hover:scale-105 transition-transform duration-300">
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
          onClick={handleSaveBook}
        >
          Save
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Created Books</h2>
        {loading ? (
          <Spinner />
        ) : (
          <table className="w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Author</th>
                <th className="p-3 text-left">Year</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-b">
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3">{book.publishYear}</td>
                  <td className="p-3">
                    <Link
                      to={`/books/edit/${book._id}`}
                      className="mr-2 text-yellow-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/books/delete/${book._id}`}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CreateBooks;
