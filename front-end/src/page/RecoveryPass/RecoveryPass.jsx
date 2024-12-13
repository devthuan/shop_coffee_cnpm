import classNames from "classnames/bind";
import grocery from "~/assets/icon/grocerymart.svg";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RecoverPass } from "~/services/AuthService";
import { ToastContainer, toast, useToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./RecoveryPass.module.scss";
const cx = classNames.bind(styles);
export const RecoveryPass = () => {
  const location = useLocation();
  const [messageError, setMessageError] = useState("");
  const { email } = location.state || {}; // Lấy email từ state
  const [emailInput, setEmailInput] = useState(email || "");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const handleResendPass = async () => {
    if (emailInput?.trim() === "") {
      alert("Email không được để trống.");
      return;
    }
    if (processing) {
      return;
    }

    setProcessing(true);

    try {
      const response = await RecoverPass(emailInput);
      if (response && response.data) {
        const { statusCode, status, message, error } = response.data;
        console.log(response.data);
        if (statusCode === 200 && status === "success") {
          setMessageError(message);
          toast.success("Mật khẩu mới đã được gửi đến email.");
          setProcessing(false);
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          setProcessing(false);
        }
      }
    } catch (error) {
      const { statusCode, status, message } = error?.response?.data;
      console.log(error.response);

      if (statusCode === 404 && status === "error") {
        setMessageError(message);
      }
      if (statusCode === 400 && error === "Bad Request") {
        setMessageError(message);
      }
      if (error.response && error.response.status === 500) {
        setMessageError("Server đang bận. Vui lòng thử lại sau.");
        toast.error("Server đang bận. Vui lòng thử lại sau.");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };
  return (
    <div
      className={cx(
        "flex flex-col items-center justify-center min-h-screen p-4"
      )}
    >
      <div className="border border-solid border-gray-300 rounded-lg shadow-lg p-6 max-w-md w-full bg-white transition-transform duration-300 transform hover:scale-105">
        <h1 className="text-2xl font-bold mb-4 flex justify-center">
          <img
            src={grocery}
            alt="Logo"
            className="h-10  mb-2 justify-center gap-5 "
          />
          grocerymart
        </h1>
        <h2 className="text-2xl font-bold mb-4">Đặt lại tài khoản của bạn</h2>
        <p className="mb-6">
          Vui lòng nhập email hoặc số di động để đặt lại tài khoản của bạn.
        </p>
        {messageError && (
          <p className="text-red-600 text-[20px] mb-4">{messageError}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          className={cx("w-full mb-6 p-4 border rounded-md")}
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          required
        />
        <div className="flex space-x-4">
          <button className="bg-gray-300 text-black rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-150">
            Hủy
          </button>
          <button
            className="bg-yellow-500 text-white rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-150"
            onClick={() => handleResendPass()}
          >
            {!processing ? "Đặt lại" : "Đang xử lý..."}
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
