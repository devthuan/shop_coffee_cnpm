import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Define the ProtectedRoute component
const ProtectedRoute = (props) => {
  const checkLogin = useSelector((state) => state.auth.isLoggedIn);

  if (!checkLogin) {
    alert("You need Login !");
    return <Navigate to="/" />;
  } else {
    return <>{props.children}</>;
  }
};

export default ProtectedRoute;
