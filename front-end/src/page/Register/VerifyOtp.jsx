import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import { SendOTPAPI, VerifyOTPAPI } from "~/services/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const cx = classNames.bind(styles);
export const VerifyOtp = ({ isOpen, onClose, emailClient }) => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(60);
  const fieldsRef = useRef();
  const [state, setState] = useState({
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: "",
  });

  // count down
  useEffect(() => {
    if (seconds > 0) {
      const timerId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [seconds]);

  // di chuyển các trường input khi nhập otp
  const inputFocus = (e) => {
    const elements = fieldsRef.current.children;
    const dataIndex = +e.target.getAttribute("data-index");
    if (e.key === "Delete" || e.key === "Backspace") {
      const next = dataIndex - 1;
      if (next > -1) {
        elements[next].focus();
      }
    } else {
      const next = dataIndex + 1;
      if (
        next < elements.length &&
        e.target.value !== " " &&
        e.target.value !== "" &&
        e.key.length === 1
      ) {
        elements[next].focus();
      }
    }
  };

  // hàm lấy dữ liệu các ô input
  const handleChange = (e, codeNumber) => {
    const value = e.target.value;
    setState({ ...state, [codeNumber]: value.slice(value.length - 1) });
  };

  // hàm xử lý verify otp
  const handleSubmit = async () => {
    if (
      state.code1 &&
      state.code2 &&
      state.code3 &&
      state.code4 &&
      state.code5 &&
      state.code6
    ) {
      const otp =
        state.code1 +
        state.code2 +
        state.code3 +
        state.code4 +
        state.code5 +
        state.code6;
      const response = await VerifyOTPAPI(emailClient, otp);
      console.log("Response từ API verify OTP:", response.data);
      if (response && response.data) {
        const { statusCode, status, message } = response.data;

        // xử lý trường hợp thành công
        if (statusCode === 200) {
          toast.success(message);
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
        // xử lý mã otp sai hoặc không tồn tại
        if (statusCode === 400 && status === "fail") {
          toast.error(message);
        }
      }
      try {
      } catch (err) {
        const { statusCode, error, message } = err.response.data;

        if (statusCode === 400) {
          toast.error(message[0]);
        }
        if (err.status === 500) {
          toast.error("Server đang bận. Vui lòng thử lại sau.");
        }
      }
    } else {
      toast.error("Vui lòng nhập đầy đủ mã OTP.");
    }
  };

  // hàm xử lý gửi lại mã otp
  const handleResendOTP = async () => {
    setSeconds(60);
    try {
      const response = await SendOTPAPI(emailClient);
      if (response && response.data) {
        const { statusCode, status, message } = response.data;
        if (statusCode === 200 && status === "success") {
          toast.success("Mã OTP mới đã được gửi đến email.");
        }
      }
    } catch (error) {
      if (error.status === 500) {
        toast.error("Server đang bận. Vui lòng thử lại sau.");
      }
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (!isOpen) return null; // Không render modal nếu không mở

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="h-4xl bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <main className=" flex flex-col items-center justify-center px-4">
          <div className="max-w-sm w-full text-gray-600 space-y-14">
            <div className="text-center pb-8">
              <div className="mt-5">
                <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                  Verify OTP
                </h3>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center ">
              <label className="text-gray-600">Verification code</label>
              <div ref={fieldsRef} className="mt-2 flex items-center gap-x-2">
                <input
                  type="text"
                  data-index="0"
                  placeholder="0"
                  value={state.code1}
                  className="w-12 h-12 rounded-lg border focus:border-indigo-600 outline-none text-center text-2xl"
                  onChange={(e) => handleChange(e, "code1")}
                  onKeyUp={inputFocus}
                />
                <input
                  type="text"
                  data-index="1"
                  placeholder="0"
                  value={state.code2}
                  className="w-12 h-12 rounded-lg border focus:border-indigo-600 outline-none text-center text-2xl"
                  onChange={(e) => handleChange(e, "code2")}
                  onKeyUp={inputFocus}
                />
                <input
                  type="text"
                  data-index="2"
                  placeholder="0"
                  value={state.code3}
                  className="w-12 h-12 rounded-lg border focus:border-indigo-600 outline-none text-center text-2xl"
                  onChange={(e) => handleChange(e, "code3")}
                  onKeyUp={inputFocus}
                />
                <input
                  type="text"
                  data-index="3"
                  placeholder="0"
                  value={state.code4}
                  className="w-12 h-12 rounded-lg border focus:border-indigo-600 outline-none text-center text-2xl"
                  onChange={(e) => handleChange(e, "code4")}
                  onKeyUp={inputFocus}
                />
                <input
                  type="text"
                  data-index="4"
                  placeholder="0"
                  value={state.code5}
                  className="w-12 h-12 rounded-lg border focus:border-indigo-600 outline-none text-center text-2xl"
                  onChange={(e) => handleChange(e, "code5")}
                  onKeyUp={inputFocus}
                />
                <input
                  type="text"
                  data-index="5"
                  placeholder="0"
                  value={state.code6}
                  className="w-12 h-12 rounded-lg border focus:border-indigo-600 outline-none text-center text-2xl"
                  onChange={(e) => handleChange(e, "code6")}
                  onKeyUp={inputFocus}
                />
              </div>
            </div>
            <div className="w-full grid grid-rows-2 gap-x-20 ">
              <div className=""></div>
              <div className="grid grid-cols-2 gap-x-20">
                {seconds !== 0 ? (
                  <button className="cursor-not-allowed px-4 py-2 text-base text-white bg-indigo-600 rounded-lg duration-150 hover:bg-indigo-700 active:shadow-lg">
                    Gửi lại sau {seconds}
                  </button>
                ) : (
                  <button
                    onClick={() => handleResendOTP()}
                    className="px-4 py-2 text-white bg-indigo-600 rounded-lg duration-150 hover:bg-indigo-700 active:shadow-lg"
                  >
                    Gửi lại
                  </button>
                )}
                <button
                  onClick={() => handleSubmit()}
                  className="px-4 py-2 text-md text-white bg-indigo-600 rounded-lg duration-150 hover:bg-indigo-700 active:shadow-lg"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default VerifyOtp;
