import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogClient from "./pages/BlogClient";
import BlogDetail from "./pages/BlogDetail";
import Navbar from "./componets/navbar";
import CreateBlog from "./pages/craeteblog";
import Signup from "./componets/signup";
import Login from "./componets/Login";
import Hero from "./componets/hero";
import CartPage from "./pages/cartPage";
import About from "./componets/about";

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

        <Routes>
          <Route
            path="/"
            element={<BlogClient selectedCategory={selectedCategory} />}
          />
          <Route path="/hero" element={<Hero />} />

          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
