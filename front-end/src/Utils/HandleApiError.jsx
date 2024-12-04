// import { ToastContainer, toast } from "react-toastify";

// export const HandleApiError = (err) => {
//   if (err.response) {
//     const { statusCode, error, message } = err.response.data;
//     // Xử lý lỗi do response từ server
//     const status = err?.response?.status;
//     switch (status) {
//       case 400 || statusCode === 400:
//         return Array.isArray(message) && message.length > 1
//           ? toast.error(message[0])
//           : toast.error(message) ||
//               toast.error("Bad request, please check your data.");
//       // break;
//       case 401 || statusCode === 401:
//         return {
//           status: "error",
//           message: "Unauthorized | Không được phép, vui lòng đăng nhập lại.",
//         };
//       // break;
//       case 403 || statusCode === 401:
//         return {
//           status: "error",
//           message: "Forbidden | bạn không có quyền.",
//         };
//       // break;
//       case 404 || statusCode === 401:
//         return Array.isArray(message) && message.length > 1
//           ? toast.error(message[0])
//           : toast.error(message) || toast.error("Resource not found.");
//       // break;
//       case 500 || statusCode === 401:
//         return Array.isArray(message) && message.length > 1
//           ? toast.error(message[0])
//           : toast.error(message) ||
//               toast.error("Server error, please try again later.");
//       // break;
//       default:
//         return {
//           status: "error",
//           message: "Đã xảy ra lỗi không mong muốn.",
//         };
//     }
//   } else if (err.request) {
//     // Xử lý lỗi do không nhận được response từ server
//     return {
//       status: "error",
//       message: "Không có phản hồi từ server",
//     };
//   } else {
//     // Xử lý lỗi khi cấu hình request sai
//     return {
//       status: "error",
//       message: "Lỗi thiết lập yêu cầu.",
//     };
//   }
// };

import { ToastContainer, toast } from "react-toastify";

export const HandleApiError = (err) => {
  if (err.response) {
    const {
      status,
      data: { statusCode, message },
    } = err.response;

    // Default error message if no message is provided
    const defaultErrorMessage = "Đã xảy ra lỗi không mong muốn.";

    // Define a message depending on status or statusCode
    const getErrorMessage = () => {
      if (Array.isArray(message)) {
        return message[0]; // Use the first message if it's an array
      }
      return message || defaultErrorMessage;
    };

    // Handle different HTTP status codes
    switch (status || statusCode) {
      case 400:
        toast.error(
          getErrorMessage() || "Bad request, please check your data."
        );
        break;
      case 401:
        toast.error(
          getErrorMessage() ||
            "Unauthorized | Không được phép, vui lòng đăng nhập lại."
        );
        break;
      case 403:
        toast.error(getErrorMessage() || "Forbidden | bạn không có quyền.");
        break;
      case 404:
        toast.error(getErrorMessage() || "Resource not found.");
        break;
      case 500:
        toast.error(
          getErrorMessage() || "Server error, please try again later."
        );
        break;
      default:
        toast.error(getErrorMessage());
    }
  } else if (err.request) {
    // If no response from server
    toast.error("Không có phản hồi từ server");
  } else {
    // Error setting up the request
    toast.error("Lỗi thiết lập yêu cầu.");
  }
};
