import classNames from "classnames/bind";
import styles from "./Login.module.scss";

import quangcao from "~/assets/images/quangcao.png";
import grocery from "~/assets/icon/grocerymart.svg";
import google from "~/assets/icon/google.svg";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { LoginAPI, LoginWithGoogleAPI } from "~/services/AuthService";
import { useDispatch } from "react-redux";
import {
  initDataPermission,
  setLogin,
  // setError
} from "~/redux/features/AuthSlice/authSlice";
import { setItemWithExpiration } from "~/services/localStorage";
import { HandleApiError } from "~/Utils/HandleApiError";
import { jwtDecode } from "jwt-decode";

import { GetAllPermissionByRoleAPI } from "~/services/PermissionService";
import validator from "validator"; // Thư viện để kiểm tra định dạng email
import { Tooltip } from "react-tooltip";
const cx = classNames.bind(styles);
export const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setAsDefaultCard, setSetAsDefaultCard] = useState(false);
  const navigate = useNavigate("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isFocused, setIsFocused] = useState("");
  const [isValid, setIsValid] = useState(false);
  const passwordLengthValid = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setAsDefaultCard === false) {
      alert("please check");
      return;
    }
    try {
      const response = await LoginAPI(email, password);
      if (response && response.data) {
        console.log(response.data);
        const { statusCode, status, message, data } = response.data;
        // xử lý trường hợp thành công
        if (statusCode === 200 && status === "success") {
          const accessToken = data.accessToken;

          // giai ma token
          const { id, email, role, username } = jwtDecode(accessToken);

          // Lưu access token vào Redux store
          dispatch(
            setLogin({
              token: accessToken,
              email: email,
            })
          );
          setItemWithExpiration("role", role, 2);
          setItemWithExpiration("token", accessToken, 2);
          setItemWithExpiration("email", email, 2);

          const responsePermission = await GetAllPermissionByRoleAPI(role);
          // lưu quyền vào Redux store
          if (responsePermission && responsePermission.data) {
            console.log(responsePermission.data);
            dispatch(initDataPermission(responsePermission.data.data));

            setItemWithExpiration(
              "permissions",
              responsePermission.data.data,
              22
            );
            // lưu access token vào local storage
            toast.success("Đăng nhập thành công.");
            setTimeout(() => {
              navigate("/");
            }, 1500);
          }
        } else if (statusCode === 401 && status === "error") {
          setError(message);
        }
      }
    } catch (err) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        setError(message);
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleFocus = () => setIsFocused(true);
  // Hàm xử lý khi input mất focus
  const handleBlur = () => setIsFocused(false);
  const validateEmail = (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setIsValid(regex.test(value));
  };

  const handleLoginWithGoogle = async () => {
    const popup = window.open(
      "http://localhost:8080/api/v1/auth/google",
      "_blank",
      "width=500,height=600"
    );

    // Lắng nghe token trả về từ popup
    window.addEventListener("message", async (event) => {
      // Nhận token từ message
      const token = event.data.token;

      if (token) {
        console.log("Token received from popup:", token);
        localStorage.setItem("authToken", token); // Lưu token

        // Giải mã token
        const { id, email, role, username } = jwtDecode(token);

        // Lưu access token vào Redux store
        dispatch(
          setLogin({
            token: token,
            email: email,
          })
        );
        setItemWithExpiration("role", role, 2);
        setItemWithExpiration("token", token, 2);
        setItemWithExpiration("email", email, 2);

        // Lấy quyền từ API theo role
        const responsePermission = await GetAllPermissionByRoleAPI(role);

        // Lưu quyền vào Redux store
        if (responsePermission && responsePermission.data) {
          console.log(responsePermission.data);
          dispatch(initDataPermission(responsePermission.data.data));

          setItemWithExpiration(
            "permissions",
            responsePermission.data.data,
            22
          );

          // Lưu access token vào local storage
          toast.success("Đăng nhập thành công.");
          setTimeout(() => {
            navigate("/"); // Chuyển hướng về trang chủ
          }, 1500);
        }
      }
    });
  };

  return (
    <div
      className={cx("grid lg:grid-cols-11 max-sm:grid-cols-1  min-h-screen ")}
    >
      {loading && (
        <>
          <div className={cx("overlay")}></div>{" "}
          {/* Hiển thị overlay khi đang loading */}
          <div className={cx("spinner")}></div>{" "}
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
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="example@gmail.com" // Sử dụng placeholder động
                  className={cx(
                    "w-full mb-6 p-4 border rounded-md text-base outline-none transition-all duration-300 ease-in-out",
                    {
                      "border-green-500 text-green-700": isValid,
                      "border-red-600 text-red-600": !isValid && isFocused,
                      "border-gray-300 text-gray-700":
                        email.length === 0 && !isFocused, // Đảm bảo màu mặc định khi chưa nhập
                    }
                  )}
                  value={email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <span
                  className="absolute left-0 top-0 text-gray-400 pointer-events-none transition-all duration-300 ease-in-out"
                  // style={{
                  //   zIndex: 1,
                  //   whiteSpace: "nowrap", // Đảm bảo placeholder không bị ngắt dòng
                  //   opacity: email.indexOf('@') === -1 || email.length < 5 ? 1 : 0, // Chỉ hiển thị khi chưa đủ email
                  //   paddingLeft: email.includes("@") ? `${email.length * 8}px` : '0', // Căn chỉnh đúng vị trí sau '@'
                  //   paddingTop: '12px', // Đảm bảo gợi ý nằm cùng hàng với input
                  // }}
                >
                  {/* {createPlaceholder(email)} */}
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  className={cx(
                    "w-full mb-6 p-4 border rounded-md text-base outline-none transition-all duration-300 ease-in-out ",
                    {
                      "border-gray-300": password.length === 0, // Màu xám khi chưa nhập gì
                      "border-red-500":
                        password.length > 0 && password.length < 6, // Màu đỏ khi chưa đủ 6 ký tự
                      "border-green-500": passwordLengthValid, // Màu xanh khi đủ 6 ký tự
                    }
                  )}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error ? (
                  <p className="text-xl mb-2 text-red-600">{error}</p>
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
                    Đồng ý tất cả điều khoản
                  </label>
                  <a
                    href="/recoverypass"
                    className={cx("text-blue-500")}
                  >
                    Recovery Password
                  </a>
                </div>
                <button
                  className={cx(
                    "w-full bg-yellow-500 text-white py-4 rounded-md mb-6"
                  )}
                >
                  Sign Up
                </button>
              </div>
            </form>
            <button
              onClick={() => handleLoginWithGoogle()}
              className={cx(
                "w-full border py-4 rounded-md mb-6 flex justify-center items-center"
              )}
            >
              <img src={google} alt="Gmail" className={cx("mr-2")} />
              Sign in with Gmail
            </button>
            <div className={cx("bot-title")}>
              <p className={cx("text-sm mt-6  ")}>
                <span>You have an account yet?</span>
                <Link to="/register" className={cx("text-blue-500")}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
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
