import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  return isLoggedIn && user?.role === "admin" ? children : <Navigate to="/" replace />;
};

export default AdminRoute; 