import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound"; // don't forget to import this
import Home from "./components/Home/Home";
import Products from "./components/AdminPanel/Products/Products";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;