import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import classNames from "classnames/bind";
import styles from "./EditProfile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loading from "~/components/Loading/Loading";
import { ChangePasswordAPI } from "~/services/AuthService";
import { removeToken } from "~/services/localStorage";
const cx = classNames.bind(styles);

function ChangePassword() {
  const emailAccount = useSelector((state) => state.userInfo.email);
  console.log(emailAccount);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isloading = useSelector((state) => state.userInfo.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBtnUpdate = async () => {
    try {
      const informationChangePassword = {
        email: emailAccount,
        oldPassword: password,
        newPassword: newPassword,
        newPasswordConfirm: confirmPassword,
      };
      console.log(informationChangePassword);
      const response = await ChangePasswordAPI(informationChangePassword);
      if (response && response.status === 201) {
        toast.success(
          "Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại để tiếp tục mua hàng"
        );
        setTimeout(() => {
          removeToken();
          navigate("/");
        }, 2500);
      }
    } catch (error) {
      if (error.status === 400) {
        toast.error(error);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    }
  };
  return (
    <div className={cx("content shadow-lg p-2")}>
      {isloading ? (
        <div className="h-full w-full flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className={cx("container")}>
          <Link to="/profile">
            <div className={cx("title")}>
              <FontAwesomeIcon icon={faArrowLeft} className={cx("btn_gear")} />
              <div className={cx("header_name font-roboto text-2xl")}>
                Đổi mật khẩu
              </div>
            </div>
          </Link>
          <ul className={cx("list_profile")}>
            <li className="w-full mb-4 flex items-center">
              <label
                htmlFor="phone1"
                className="block text-sm font-medium text-gray-700 mb-1 mr-4 w-[120px]"
              >
                Mật khẩu hiện tại
              </label>
              <input
                id="phone1"
                type="text"
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </li>
            <li className="w-full mb-4 flex items-center">
              <label
                htmlFor="phone1"
                className="block text-sm font-medium text-gray-700 mb-1 mr-4 w-[120px]"
              >
                Mật khẩu mới
              </label>
              <input
                id="phone1"
                type="text"
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </li>
            <li className="w-full mb-4 flex items-center">
              <label
                htmlFor="phone2"
                className="block text-sm font-medium text-gray-700 mb-1 mr-4 w-[120px]"
              >
                Xác nhận Mật khẩu mới
              </label>
              <input
                id="phone2"
                type="text"
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
              />
            </li>
          </ul>
        </div>
      )}
      <div className={cx("save p-5")}>
        {/* <Link to="/profile">
                    <button className={cx("btn_cancel")}>Thoát</button>
                </Link> */}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          onClick={handleBtnUpdate}
        >
          Đổi mật khẩu
        </button>
      </div>
      <ToastContainer
        className="text-base"
        fontSize="10px"
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
}

export default ChangePassword;
