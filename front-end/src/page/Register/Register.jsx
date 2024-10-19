import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import quangcao from "~/assets/images/quangcao.png";
import grocery from "~/assets/icon/grocerymart.svg";
import google from "~/assets/icon/google.svg";
import { ToastContainer, toast } from "react-toastify";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RegisAPI } from "~/services/AuthService";
import VerifyOtp from "./VerifyOtp";
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);
export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setAsDefaultCard, setSetAsDefaultCard] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageError, setMessageError] = useState("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (setAsDefaultCard === false) {
      alert("please check");
      return;
    }
    setLoading(true);
    try {
      const response = await RegisAPI(
        email,
        username,
        password,
        confirmPassword
      );

      console.log("Response từ API đăng ký:", response);

      if (response && response.data) {
        const { statusCode, status, message } = response.data;

        // Xử lý trường hợp thành công
        if (statusCode === 201 && status === "success") {
          setShowOtpModal(true);
        }
        // xử lý email or username tồn tại
        if (statusCode === 400 && status === "error") {
          setMessageError(message);
        }
      }
    } catch (err) {
      const { statusCode, error, message } = err.response.data;
      if (statusCode === 400) {
        setMessageError(message[0]);
      }

      if (err.status === 500) {
        setMessageError("Server đang bận. Vui lòng thử lại sau.");
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div
      className={cx("grid lg:grid-cols-11 max-sm:grid-cols-1  min-h-screen ")}
    >
      {loading && (
        <>
          <div className={cx("overlay")}></div>{" "}
          {/* Hiển thị overlay khi đang loading */}
          <div className={cx("spinner")}>
            <div className={cx("blob blob-0")}></div>
          </div>{" "}
          {/* Hiển thị spinner khi đang loading */}
        </>
      )}
      <div className={cx("lg:col-span-5 flex items-center justify-center   ")}>
        <div className={cx("title-2")}>
          <img
            src={quangcao}
            alt="Illustration"
            className={cx("w-full max-w-[422px] max-h-[261]   ")}
          />
          <h2>
            The best of luxury brand values, high quality products, and
            innovative services
          </h2>
        </div>
      </div>
      <div
        className={cx(
          "lg:col-span-6 flex flex-col items-center justify-center  "
        )}
      >
        <div className={cx("container justify-center")}>
          <div
            className={cx("max-w-[400px]  w-full mx-auto text-center left ")}
          >
            <div className={cx("top-name")}>
              <h1>
                <img src={grocery} alt="Logo" className={cx("mb-6")} />
                grocerymart
              </h1>
            </div>
            <div className={cx("title-1")}>
              <h1 className={cx(" font-bold mb-6")}>Sign Up</h1>
              <h3>
                Let’s create your account and Shop like a pro and save money.
              </h3>
            </div>
            {/* <form> */}
            <input
              type="email"
              placeholder="Email"
              className={cx("w-full mb-6 p-4 border rounded-md")}
              // value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="username"
              placeholder="UserName"
              className={cx("w-full mb-6 p-4 border rounded-md")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className={cx("w-full mb-6 p-4 border rounded-md")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="ConfirmPassword"
              className={cx("w-full mb-6 p-4 border rounded-md")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {/* in lỗi ra màn hình */}
            {messageError ? (
              <p className="text-red-600 text-[20px]">{messageError}</p>
            ) : (
              ""
            )}

            <div className={cx("flex justify-between items-center mb-6")}>
              <label className={cx("flex items-center")}>
                <input
                  type="checkbox"
                  className={cx("mr-2 ")}
                  checked={setAsDefaultCard}
                  onChange={(e) => setSetAsDefaultCard(e.target.checked)}
                />
                Set as default card
              </label>
              <a
                href="https://chatgpt.com/c/66fdfaf9-cb74-8011-89ff-236369702781"
                className={cx("text-blue-500")}
              >
                Recovery Password
              </a>
            </div>
            <button
              className={cx(
                "w-full bg-yellow-500 text-white py-4 rounded-md mb-6"
              )}
              onClick={() => handleSubmit()}
            >
              Sign Up
            </button>
            <button
              className={cx(
                "w-full border py-4 rounded-md mb-6 flex justify-center items-center"
              )}
            >
              <img src={google} alt="Gmail" className={cx("mr-2")} />
              Sign in with Gmail
            </button>
            {/* </form> */}

            <div className={cx("bot-title")}>
              <p className={cx("text-sm mt-6  ")}>
                <span>You have an account yet?</span>
                <Link to="/login" className={cx("text-blue-500")}>
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <VerifyOtp
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        emailClient={email}
      />
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
