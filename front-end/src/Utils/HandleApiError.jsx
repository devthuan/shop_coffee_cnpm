export const HandleApiError = (err) => {
  if (err.response) {
    const { statusCode, error, message } = err.response.data;

    // Xử lý lỗi do response từ server
    const status = err?.response?.status;
    switch (status) {
      case 400 || statusCode === 400:
        return Array.isArray(message)
          ? message[0]
          : message || "Bad request, please check your data.";
      // break;
      case 401 || statusCode === 401:
        return Array.isArray(message)
          ? message[0]
          : message || "Unauthorized, please login again.";
      // break;
      case 403 || statusCode === 401:
        return Array.isArray(message)
          ? message[0]
          : message || "Forbidden, you do not have permission.";
      // break;
      case 404 || statusCode === 401:
        return Array.isArray(message)
          ? message[0]
          : message || "Resource not found.";
      // break;
      case 500 || statusCode === 401:
        return Array.isArray(message)
          ? message[0]
          : message || "Server error, please try again later.";
      // break;
      default:
        return "Đã xảy ra lỗi không mong muốn.";
    }
  } else if (err.request) {
    // Xử lý lỗi do không nhận được response từ server
    return "Không có phản hồi từ server";
  } else {
    // Xử lý lỗi khi cấu hình request sai
    return "Request setup error.";
  }
};
