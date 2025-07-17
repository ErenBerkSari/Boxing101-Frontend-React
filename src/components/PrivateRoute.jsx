import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, user, authIsLoading } = useSelector((state) => state.auth);
  console.log("[PrivateRoute] isLoggedIn:", isLoggedIn, "user:", user, "authIsLoading:", authIsLoading);
  if (authIsLoading) {
    return <Loader/>;
  }
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute; 