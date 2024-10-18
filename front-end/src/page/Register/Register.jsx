import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import quangcao from "~/assets/images/quangcao.png"
import grocery from "~/assets/icon/grocerymart.svg"
import google from "~/assets/icon/google.svg"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisAPI } from "~/services/AuthService";
import { SendOTPAPI } from "~/services/AuthService";
import { VerifyOTPAPI } from "~/services/AuthService";
import OtpModal from "../OtpModal/OtpModal";
import { useNavigate } from 'react-router-dom';
import { setItemWithExpiration } from "~/services/localStorage";
import { setToken } from "~/redux/features/product-demo/authSlice";
const cx = classNames.bind(styles);
export const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setAsDefaultCard, setSetAsDefaultCard] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (setAsDefaultCard === false) {
      alert("please check")
      return;
    }
    setLoading(true);
    try {
      const response = await RegisAPI(email, username, password, confirmPassword);
      console.log('Response từ API đăng ký:', response);
      if (response && response.data) {
        const { statusCode, status, error, isActive } = response.data;
        console.log('Dữ liệu phản hồi:', response.data);

        if (statusCode === 201 && status === "success") {
          console.log('Thông tin hợp lệ:', response);
          setTimeout(() => {
            setShowOtpModal(true)
          }, 1050);
          await SendOTPAPI(email);
          console.log('OTP đã được gửi đến email');
        }

        else if (statusCode === 400 && status === "error") {
          if (isActive) {
            console.log('Tồn tại tài khoản:', response);
            setTimeout(() => {
              alert(response.data?.message);

            }, 1050);
          } else if (!isActive) {
            console.log('Tài khoản chưa xác thực OTP:', response);
            setTimeout(() => {
              alert(response.data?.message);
              setShowOtpModal(true);
            }, 1050);
            await SendOTPAPI(email);
            console.log('OTP đã được gửi lại đến email');
          }
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
          throw new Error("Dữ liệu phản hồi từ API không hợp lệ hoặc thiếu");
        }

      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đăng ký không thành công. Vui lòng thử lại.';

      setTimeout(() => {
        alert(errorMessage);
      }, 1050)
      console.error('Đăng ký thất bại:', err.response?.data || err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
 

  const verifyOtp = async (otp) => {
    
    try {
      const response = await VerifyOTPAPI(email, otp);
      console.log("Response từ API verify OTP:", response);

      if (response && response.data) {
        const { statusCode, status, error, token } = response.data;
        console.log("Token từ API:", token);
        if (!token) {
          console.error("Token không tồn tại trong phản hồi:", response.data);
          alert("Có lỗi xảy ra, vui lòng thử lại.");
          return;
        }
        console.log("Token từ API:", token);

        if (statusCode === 200 && status === "success") {
         
          console.log("Mã OTP hợp lệ:", response);
          const token = response.data.token;
          setItemWithExpiration("token", token, 1);
          setToken(token); // Lưu token vào Redux
          alert(response.data?.message || "Mã OTP hợp lệ!");
          setShowOtpModal(false);
          setEmail('');
          setUsername('');
          setPassword('');
          setConfirmPassword('');
          navigate("/login");
        } else if (statusCode === 400 && status === "fail") {
          console.log("Mã OTP không hợp lệ:", response);
          setTimeout(() => {
            alert(response.data?.message || "Mã OTP không hợp lệ.");
          }, 1050);
        }
        else if (statusCode === 400 && error === "Bad Request") {
          console.log("otp must be longer than or equal to 6 characters:", response);
          setTimeout(() => {
            alert(response.data?.message || "Mã OTP không hợp lệ.");
          }, 1050);

        }
        else {
          console.log("Trạng thái không xác định:", response);
          alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      alert(errorMessage); // Hiển thị thông báo lỗi
      console.error("Mã OTP không hợp lệ:", err.response?.data || err.message);
    }
  };
  const resetErrors = () => {
    // Reset tất cả các lỗi trước khi thực hiện đăng ký lại
    setLoading(false);
    setShowOtpModal(false);
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };
  return (
    <div className={cx("grid lg:grid-cols-11 max-sm:grid-cols-1  min-h-screen ")}>
      {loading && (
        <>
          <div className={cx("overlay")}></div> {/* Hiển thị overlay khi đang loading */}
          <div className={cx("spinner")}>
            <div className={cx("blob blob-0")}></div></div> {/* Hiển thị spinner khi đang loading */}
        </>
      )}
      <div className={cx("lg:col-span-5 flex items-center justify-center   ")}>
        <div className={cx("title-2")}>

          <img src={quangcao} alt="Illustration" className={cx("w-full max-w-[422px] max-h-[261]   ")} />
          <h2>The best of luxury brand values, high quality products, and innovative services</h2>
        </div>
      </div>
      <div className={cx("lg:col-span-6 flex flex-col items-center justify-center  ")}>\
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
              <input type="username"
                placeholder="UserName"
                className={cx("w-full mb-6 p-4 border rounded-md")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input type="password"
                placeholder="Password"
                className={cx("w-full mb-6 p-4 border rounded-md")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input type="password"
                placeholder="ConfirmPassword"
                className={cx("w-full mb-6 p-4 border rounded-md")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <Link to="/login" className={cx("text-blue-500")}>Login</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSubmit={verifyOtp}



      />
    </div >
  );
};

