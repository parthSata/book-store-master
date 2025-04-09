// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateBook from "./pages/CreateBooks";
import ShowBook from "./pages/ShowBook";
import EditBook from "./pages/EditBook";
import DeleteBook from "./pages/DeleteBook";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders"; // New
import ConfirmOrders from "./pages/ConfirmOrders"; // New
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (

    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* User Routes (Authenticated) */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/books/details/:id" element={<ShowBook />} />{" "}
        {/* Public for users */}
      </Route>

      {/* Admin Routes (Authenticated + Admin Role) */}
      <Route element={<PrivateRoute isAdminRoute={true} />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/books/create" element={<CreateBook />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
        <Route path="/books/delete/:id" element={<DeleteBook />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/confirm-orders" element={<ConfirmOrders />} />
      </Route>
    </Routes>
  );
};

export default App;
