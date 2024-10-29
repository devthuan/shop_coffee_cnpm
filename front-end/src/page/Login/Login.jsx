import classNames from "classnames/bind";
import styles from "./Login.module.scss";

import quangcao from "~/assets/images/quangcao.png";
import grocery from "~/assets/icon/grocerymart.svg";
import google from "~/assets/icon/google.svg";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { LoginAPI } from "~/services/AuthService";
import { useDispatch } from "react-redux";
import {
  initDataPermission,
  setLogin,
} from "~/redux/features/AuthSlice/authSlice";
import { setItemWithExpiration } from "~/services/localStorage";
import { HandleApiError } from "~/Utils/HandleApiError";
import { jwtDecode } from "jwt-decode";
import { GetAllPermissionByRoleAPI } from "~/services/PermissionService";

const cx = classNames.bind(styles);
export const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setAsDefaultCard, setSetAsDefaultCard] = useState(false);
  const navigate = useNavigate("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
          const { id, email, role, username } = await jwtDecode(accessToken);

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
        dispatch(setError({ error: message }));
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
              <h3>
                Let’s create your account and Shop like a pro and save money.
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                className={cx("w-full mb-6 p-4 border rounded-md")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            </form>
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
