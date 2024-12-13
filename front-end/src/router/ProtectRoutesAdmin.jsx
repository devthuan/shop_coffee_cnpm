import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getItemWithExpiration } from "~/services/localStorage";

export const ProtectRoutesAdmin = ({ children }) => {
  const navigate = useNavigate();

  const isLogin = getItemWithExpiration("token") || null;
  const role = getItemWithExpiration("role") || null;

  useEffect(() => {
    if (!isLogin) {
      toast.warning("Bạn cần đăng nhập trước khi truy cập trang này.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else if (role === "USER" || role === null) {
      navigate("/unauthorized");
    }
  }, [isLogin]);

  // Nếu người dùng đã đăng nhập, hiển thị children
  return isLogin ? <div>{children}</div> : null; // Trả về null trong khi điều hướng
};

export const ProtectRoutesByRole = ({ children, requiredPermission }) => {
  const navigate = useNavigate();
  const permissions = getItemWithExpiration("permissions")?.map(
    (item) => item.functions.codeName
  );
  const isLogin = getItemWithExpiration("token");

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    } else if (!permissions.includes(requiredPermission)) {
      <h1>Bạn không có quyển truy cập trang này</h1>;
      navigate("/unauthorized");
    }
  }, [isLogin, permissions, requiredPermission, navigate]);

  return <>{children}</>;
};
