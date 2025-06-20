import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ItemClient from "./pages/itemClient";
import ItemDetail from "./pages/itemDetail";
import Navbar from "./componets/navbar";
import Createitem from "./pages/craeteitem";
import Signup from "./componets/signup";
import Login from "./componets/Login";
import Hero from "./componets/hero";
import CartPage from "./pages/cartPage";
import About from "./componets/about";
import AdminLogin from "./componets/admin/adminLogin";
import Dashboard from "./componets/admin/dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [dark, setDark] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar
          dark={dark}
          setDark={setDark}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route
            path="/"
            element={<ItemClient selectedCategory={selectedCategory} />}
          />
          <Route path="/hero" element={<Hero />} />

          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/create" element={<Createitem />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
