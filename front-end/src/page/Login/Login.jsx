import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import quangcao from "~/assets/images/quangcao.png"
import grocery from "~/assets/icon/grocerymart.svg"
import google from "~/assets/icon/google.svg"
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginAPI } from "~/services/AuthService";
const cx = classNames.bind(styles);
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setAsDefaultCard, setSetAsDefaultCard] = useState(false);
  // const navigate = useNavigate(); // Sử dụng hook để chuyển trang
  const navigate = useNavigate('')
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setAsDefaultCard === false) {
      alert("please check")
      return;
    }
    try {
      const response = await LoginAPI(email,password);
      if (response && response.data) {
        const { statusCode, status, error } = response.data;
        if (statusCode === 201 && status === "success") {
          console.log('Thông tin hợp lệ:', response);
          setTimeout(() => {
          }, 1050);
          navigate("/");
        }
        else if (statusCode === 401 && status === "error") {
          
            console.log('Account is not  active:', response);
            setTimeout(() => {
              alert(response.data?.message);
            }, 1050);
          
        } else if (statusCode === 400 && error === "Bad Request") {
          console.log('password must be longer than or equal to 6 characters:', response);
          setTimeout(() => {
            alert(response.data?.message);
          }, 1050)
        } else {
          console.log('Trạng thái không xác định:', response);
          setTimeout(() => {
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
          }, 1050);
        }

      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đăng nhập không thành công. Vui lòng thử lại.';
      
      setTimeout(() => {
        alert(errorMessage);
      }, 1050)
      console.error('Đăng nhập thất bại:', err.response?.data || err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
return (
  <div className={cx("grid lg:grid-cols-11 max-sm:grid-cols-1  min-h-screen ")}>
    {loading && (
      <>
        <div className={cx("overlay")}></div> {/* Hiển thị overlay khi đang loading */}
        <div className={cx("spinner")}></div> {/* Hiển thị spinner khi đang loading */}
      </>
    )}
    <div className={cx("lg:col-span-5 flex items-center justify-center   ")}>
      <div className={cx("title-2")}>
        <img src={quangcao} alt="Illustration" className={cx("w-full max-w-[422px] max-h-[261]   ")} />
        <h2>The best of luxury brand values, high quality products, and innovative services</h2>
      </div>

    </div>
    <div className={cx("lg:col-span-6 flex flex-col items-center justify-center  ")}>
      <div className={cx("container justify-center")}>
        <div className={cx("max-w-[400px]  w-full mx-auto text-center left ")}>
          <div className={cx("top-name")}>
            <h1><img src={grocery} alt="Logo" className={cx("mb-6")} />grocerymart</h1>
          </div>
          <div className={cx("title-1")}>
            <h1 className={cx(" font-bold mb-6")}>Sign Up</h1>
            <h3>Let’s create your account and  Shop like a pro and save money.</h3>
          </div>
          <form onSubmit={handleSubmit}>
            
            <input type="email"
              placeholder="Email"
              className={cx("w-full mb-6 p-4 border rounded-md")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input type="password"
              placeholder="Password"
              className={cx("w-full mb-6 p-4 border rounded-md")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

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
              <a href="https://chatgpt.com/c/66fdfaf9-cb74-8011-89ff-236369702781" className={cx("text-blue-500")}>Recovery Password</a>
            </div>
            <button className={cx("w-full bg-yellow-500 text-white py-4 rounded-md mb-6")}>Sign Up</button>
            <button className={cx("w-full border py-4 rounded-md mb-6 flex justify-center items-center")}>
              <img src={google} alt="Gmail" className={cx("mr-2")} />
              Sign in with Gmail
            </button>
          </form>
          <div className={cx("bot-title")}>
            <p className={cx("text-sm mt-6  ")}>
              <span>You have an account yet?</span>
              <Link to="/register" className={cx("text-blue-500")}>Sign In</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div >


);
};

