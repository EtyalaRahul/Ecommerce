import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import Home from "./components/Home/Home";
import Products from "./components/AdminPanel/Products/Products";
import Cart from "./components/Cart/Cart"; // ✅ import Cart

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Panel */}
        <Route path="/admin" element={<Products />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Home (Protected) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Cart (Protected) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
