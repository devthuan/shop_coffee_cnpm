import { ToastContainer, toast } from "react-toastify";

export const HandleApiError = (err) => {
  if (err.response) {
    const { statusCode, error, message } = err.response.data;

    // Xử lý lỗi do response từ server
    const status = err?.response?.status;
    switch (status) {
      case 400 || statusCode === 400:
        return Array.isArray(message)
          ? toast.error(message[0])
          : toast.error(message) ||
              toast.error("Bad request, please check your data.");
      // break;
      case 401 || statusCode === 401:
        return {
          status: "error",
          message: "Unauthorized | Không được phép, vui lòng đăng nhập lại.",
        };
      // break;
      case 403 || statusCode === 401:
        return {
          status: "error",
          message: "Forbidden | bạn không có quyền.",
        };
      // break;
      case 404 || statusCode === 401:
        return Array.isArray(message)
          ? toast.error(message[0])
          : toast.error(message) || toast.error("Resource not found.");
      // break;
      case 500 || statusCode === 401:
        return Array.isArray(message)
          ? toast.error(message[0])
          : toast.error(message) ||
              toast.error("Server error, please try again later.");
      // break;
      default:
        return {
          status: "error",
          message: "Đã xảy ra lỗi không mong muốn.",
        };
    }
  } else if (err.request) {
    // Xử lý lỗi do không nhận được response từ server
    return {
      status: "error",
      message: "Không có phản hồi từ server",
    };
  } else {
    // Xử lý lỗi khi cấu hình request sai
    return {
      status: "error",
      message: "Lỗi thiết lập yêu cầu.",
    };
  }
};
