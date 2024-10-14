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
import OtpModal from "../Sendotp/OtpModal";
import { useNavigate } from 'react-router-dom';

// import { Navigate } from "react-router-dom";
const cx = classNames.bind(styles);
export const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setAsDefaultCard, setSetAsDefaultCard] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [otpError, setOtpError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (setAsDefaultCard === false) {
      alert("please check")
    }
    try {
      // Gọi API đăng ký với email và password
      const response = await RegisAPI(email, username, password, confirmPassword);
      console.log('Đăng ký thành công:', response);
      setError(null);
      setMessage('Đăng ký thành công')
      setLoading(true)
      await SendOTPAPI(email);
      console.log('OTP đã được gửi đến email');
      // Chuyển hướng hoặc xử lý sau khi đăng ký thành công
      setLoading(false)
      setShowOtpModal(true);
      
      

     

    } catch (err) {
      setLoading(false);
      console.error('Đăng ký thất bại:', err.response?.data || err.message);
      setError('Đăng ký không thành công. Vui lòng thử lại.');
      setMessage(null);
    }
  };

  const verifyOtp = async (otp) => {
    try {
      // Gọi API xác thực mã OTP
      const response = await VerifyOTPAPI(email, otp); // Giả sử bạn có hàm VerifyOTPAPI
      console.log('Mã OTP hợp lệ:', response);

      // Xử lý thành công (chuyển hướng hoặc thông báo)
      setShowOtpModal(false); // Đóng hộp thoại
      setOtpError(null); // Đặt lại giá trị OTP
      setTimeout(() => {
        navigate('/login');
        setLoading(true) // Thay đổi '/login' thành đường dẫn bạn muốn chuyển đến
      }, 2000);
    } catch (err) {
      console.error('Mã OTP không hợp lệ:', err.response?.data || err.message);
      setOtpError('Mã OTP không hợp lệ. Vui lòng thử lại.');
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

              {error && <p style={{ color: 'red' }}>{error}</p>}
              {message && <p style={{ color: 'red' }}>{message}</p>}
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
              otpError={otpError}
             
            />
    </div >
    
  );
};

