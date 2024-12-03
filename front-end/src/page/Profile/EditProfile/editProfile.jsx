import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { updateInfoUser } from "~/services/UserCurrentService";
import { getItemWithExpiration } from "~/services/localStorage";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast, ToastContainer } from "react-toastify";
import { updateUserInfo } from "~/redux/features/UserInfor/User_InforSlice";
import classNames from "classnames/bind";
import styles from "./EditProfile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loading from "~/components/Loading/Loading";

const cx = classNames.bind(styles);

function EditProfile() {
    const userInformation = useSelector((state) => state.userInfo.userInformation);
    const [name, setName] = useState(userInformation?.fullName || "");
    const [address, setAddress] = useState(userInformation?.address1 || userInformation?.address2 || "");
    const [phone, setPhone] = useState(userInformation?.phoneNumber || "");
    const [avatar, setAvatar] = useState(userInformation?.avatar || "");
    const isloading = useSelector((state) => state.userInfo.loading);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log(userInformation)

    const handleBtnUpdate = async () => {
        const dataToUpdate = {
            fullName: name ? String(name) : undefined,
            phoneNumber: phone ? String(phone) : undefined,
            address1: address ? String(address) : undefined
        };
        try {
            const response = await updateInfoUser(
                dataToUpdate.fullName,
                dataToUpdate.phoneNumber,
                dataToUpdate.address1,
                dataToUpdate.avatar,
            );
            if (response && response.data) {
                dispatch(updateUserInfo(dataToUpdate));
                toast.success(response.data.message || "Cập nhật thành công");
                navigate("/profile");
            } else {
                toast.error("Phản hồi từ server không hợp lệ.");
            }
        } catch (error) {
            if (error.status === 400) {
                toast.error('yêu cầu nhập đúng số điện thoại');
            }
            else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
            }
        }
        console.log("Data to update:", dataToUpdate);
    };
    return (
        <div className={cx("content shadow-lg p-2")}>
            {isloading ? (<div className="h-full w-full flex justify-center items-center">
                <Loading />
            </div>) : (
                <div className={cx("container")}>
                    <Link to="/profile">
                        <div className={cx("title")}>
                            <FontAwesomeIcon icon={faArrowLeft} className={cx("btn_gear")} />
                            <div className={cx("header_name font-roboto text-2xl")}>Thông tin cá nhân</div>
                        </div>
                    </Link>
                    <ul className={cx("list_profile")}>
                        <li className={cx("item w-full flex items-center")}>
                            <label htmlFor="phone1" className="block text-sm font-medium text-gray-700 mb-1 mr-4 w-[150px]">
                                Họ tên
                            </label>
                            <input type="text" className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                value={name} onChange={(e) => setName(e.target.value)} />

                        </li>
                        <li className={cx("item w-full flex items-center")}>
                            <label htmlFor="phone1" className="block text-sm font-medium text-gray-700 mb-1 mr-4 w-[150px]">
                                Địa chỉ nhận hàng
                            </label>
                            <input type="text" className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                value={address} onChange={(e) => setAddress(e.target.value)} />
                        </li>
                        <li className={cx("item w-full flex items-center")}>
                            <label htmlFor="phone1" className="block text-sm font-medium text-gray-700 mb-1 mr-4 w-[150px]">
                                Số điện thoại
                            </label>
                            <input type="tel" className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </li>
                    </ul>
                </div>
            )}
            <div className={cx("save py-5")}>
                {/* <Link to="/profile">
                    <button className={cx("btn_cancel")}>Thoát</button>
                </Link> */}
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleBtnUpdate}>Lưu</button>
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

export default EditProfile;
