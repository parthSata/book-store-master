// frontend/src/pages/CreateBooks.jsx
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const CreateBooks = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveBook = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("publishYear", publishYear);

    if (image) {
      formData.append("image", image);
    }
    console.log("Form data:", formData);
    console.log("Title:", title);
    console.log("Author:", author);
    console.log("Publish Year:", publishYear);
    console.log("Image:", image);
    console.log("Image file:", image ? image.name : "No image selected");
    console.log("formData", formData);

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoading(false);
      enqueueSnackbar("Book Created successfully", { variant: "success" });
      navigate("/");
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
      <div className="flex flex-col border-2 border-sky-400Vite-500 rounded-xl w-full max-w-lg p-6 mx-auto bg-white shadow-lg transform hover:scale-105 transition-transform duration-300">
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
    </div>
  );
};

export default CreateBooks;
