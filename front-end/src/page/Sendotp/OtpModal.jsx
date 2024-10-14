import React, { useState } from 'react';
import './OtpModal.module.scss'; // Thêm file CSS cho styling nếu cần
import classNames from "classnames/bind";
import styles from "./OtpModal.module.scss";
// import { Navigate } from "react-router-dom";
const cx = classNames.bind(styles);
const OtpModal = ({ isOpen, onClose, onSubmit, otpError }) => {
    
    const[otp,setOtp] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!otp) {
            alert('Vui lòng nhập mã OTP.');
            return;
        }
        onSubmit(otp);
    };
    if (!isOpen) return null; // Không render modal nếu không mở
    return (
        <div className={cx("otp-modal-overlay")}>
            <div className={cx("otp-modal-content")}>
                <h2>Nhập mã OTP</h2>
                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Mã OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    {otpError && <p style={{ color: 'red' }}>{otpError}</p>}
                    <div className={cx("but")}>
                        <button type="submit">Xác nhận</button>
                        </div>
                        <div className={cx("but-2")}>
                        <button type="button" onClick={onClose}>Đóng
                        </button>
                        </div>
                </form>
            </div>
        </div>
    );
};

export default OtpModal;