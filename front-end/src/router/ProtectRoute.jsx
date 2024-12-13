import React from "react";
import { Navigate } from "react-router-dom";
import { getItemWithExpiration } from "~/services/localStorage";

// Define the ProtectedRoute component
const ProtectedRoute = (props) => {
  const isLogin = getItemWithExpiration("token") || null;
  if (!isLogin) {
    alert("Bạn cần đăng nhập để sử dụng chức năng này !");
    return <Navigate to="/" />;
  } else {
    return <>{props.children}</>;
  }
};

export default ProtectedRoute;
