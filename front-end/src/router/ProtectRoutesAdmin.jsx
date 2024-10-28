import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getItemWithExpiration } from "~/services/localStorage";

export const ProtectRoutesAdmin = ({ children }) => {
  const navigate = useNavigate();
  const permissions = getItemWithExpiration("permissions").map(
    (item) => item.functions.codeName
  );
  console.log(permissions);
  const isLogin = getItemWithExpiration("token");
  const role = getItemWithExpiration("role");

  useEffect(() => {
    if (!isLogin) {
      alert("Bạn cần phải đăng nhập trước khi sử dụng.");
      navigate("/login");
    } else if (role === "USER") {
      alert("Bạn không có quyền truy cập trang này.");
      navigate("/unauthorized"); // Trả về trang 403 nếu người dùng là CLIENT
    }
    // Nếu bạn muốn kiểm tra quyền, có thể thêm logic ở đây
  }, [isLogin]); // Theo dõi `isLogin` và `navigate`

  // Nếu người dùng đã đăng nhập, hiển thị children
  return isLogin ? <div>{children}</div> : null; // Trả về null trong khi điều hướng
};

export const ProtectRoutesByRole = ({ children, requiredPermission }) => {
  const navigate = useNavigate();
  const permissions = getItemWithExpiration("permissions") || []; // Giả sử permissions là một mảng các quyền
  const isLogin = getItemWithExpiration("token");

  useEffect(() => {
    if (!isLogin) {
      alert("You must be logged in");
      navigate("/login");
    } else if (!permissions.includes(requiredPermission)) {
      <h1>Bạn không có quyển truy cập trang này</h1>;
      navigate("/unauthorized");
    }
  }, [isLogin, permissions, requiredPermission, navigate]);

  return <>{children}</>; // Render children nếu người dùng đã đăng nhập và có quyền
};
