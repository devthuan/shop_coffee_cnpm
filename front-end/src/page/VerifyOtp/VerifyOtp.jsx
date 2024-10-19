import React, { useState, useEffect } from 'react';
import classNames from "classnames/bind";
import styles from "./VerifyOtp.module.scss";
import grocery from "~/assets/icon/grocerymart.svg"
import { SendOTPAPI } from '~/services/AuthService';



// import { Navigate } from "react-router-dom";
const cx = classNames.bind(styles);
export const VerifyOtp = ({ isOpen, onClose, onSubmit, otpError }) => {

  const [otp, setOtp] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Để vô hiệu hóa nút gửi lại OTP
  const [email, setEmail] = useState('');

  useEffect(() => {
    let timer;

    if (timeRemaining > 0 && isOpen) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsOtpValid(false);
      setIsResendDisabled(false);
      alert('Mã OTP đã hết hiệu lực.');

    }
    return () => clearInterval(timer);
  }, [isOpen, timeRemaining]);
  const handleClose = () => {
    setOtp(''); // Xóa mã OTP
    setTimeRemaining(60); // Reset thời gian
    setIsOtpValid(true); // Kích hoạt lại OTP
    onClose(); // Gọi hàm onClose
  };

  const handleResendOtp = async () => {
    try {
      const response = await SendOTPAPI(email);
      if (response && response.data) {
        alert('Mã OTP mới đã được gửi đến email.');
        // await SendOTPAPI(email);
        setOtp(''); // Xóa mã OTP hiện tại
        setTimeRemaining(60); // Reset thời gian
        setIsOtpValid(true); // Kích hoạt lại OTP
        setIsResendDisabled(true); // Vô hiệu hóa nút gửi lại OTP cho đến khi có thời gian mới
      }
    } catch (error) {
      console.error("Lỗi khi gửi OTP:", error);
      alert('Có lỗi xảy ra khi gửi mã OTP.');
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp) {
      alert('Vui lòng nhập mã OTP.');
      return;
    }
    if (!isOtpValid) {
      alert('Mã OTP đã hết hiệu lực.');
      return;
    }
    onSubmit(otp);
  };

  if (!isOpen) return null; // Không render modal nếu không mở
  return (
    //       
    <div className={cx("otp-modal-overlay")}>
      <div className={cx("otp-modal-content")}>
        <div className={cx("top-title")}>
          {/* Logo and text are separated for better structure */}
          <img src={grocery} alt="Logo" className={cx("logo")} />
          <h1>grocerymart</h1>
        </div>
        <h2>Nhập mã OTP</h2>
        <p className={cx("timer")}>
          Thời gian còn lại: {timeRemaining}s
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          {otpError && <p style={{ color: 'red' }}>{otpError}</p>}

          <div className={cx("but")}>
            <button type="submit" >Xác nhận</button>
          </div>

          <div className={cx("but-2")}>
            <button type="button" onClick={handleClose}>Đóng</button>
          </div>
          <div className={cx("but-3")}>
            <button type="button"
              onClick={handleResendOtp}
              disabled={isResendDisabled}
            >

              Gửi Lại Mã</button>
          </div>
        </form>
      </div>
    </div>

  );
};
export default VerifyOtp;