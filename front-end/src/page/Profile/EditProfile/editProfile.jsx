import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { updateInfoUser } from "~/services/UserCurrentService";
import { getItemWithExpiration } from "~/services/localStorage";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast } from "react-toastify";
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


    const handleBtnUpdate = async () => {
        const dataToUpdate = {
            fullName: name ? String(name) : undefined,
            phoneNumber: phone ? String(phone) : undefined,
            avatar: avatar ? String(avatar) :"/",
            address1: address ? String(address) : undefined
        };
    
        try {
            // Gọi API cập nhật thông tin người dùng
            const response = await updateInfoUser(
                dataToUpdate.fullName, 
                dataToUpdate.phoneNumber, 
                dataToUpdate.address1,
                dataToUpdate.avatar, 
            );
            // Kiểm tra phản hồi từ API
            if (response && response.data) {
                dispatch(updateUserInfo(dataToUpdate));
                toast.success(response.data.message || "Cập nhật thành công");
                navigate("/profile");  // Điều hướng về trang hồ sơ
            } else {
                toast.error("Phản hồi từ server không hợp lệ.");
            }
        } catch (error) {
            const { message, statusCode } = error.response?.data || {};
            if (statusCode === 400 && message === "Account not found") {
                toast.error("Tài khoản không tồn tại. Vui lòng kiểm tra lại thông tin.");
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
            }
        }
        console.log("Data to update:", dataToUpdate); 
    };
    return (
        <div className={cx("content")}>
              {isloading ? (<div className="h-full w-full flex justify-center items-center">
            <Loading />
          </div>) : (
            <div className={cx("container")}>
                <Link to="/profile">
                    <div className={cx("title")}>
                        <FontAwesomeIcon icon={faArrowLeft} className={cx("btn_gear")} />
                        <div className={cx("header_name")}>Thông tin cá nhân</div>
                    </div>
                </Link>
                <ul className={cx("list_profile")}>
                    <li className={cx("item")}>
                        <div className={cx("item_name")}>Họ tên</div>
                        <input type="text" className={cx("item_input")} value={name} onChange={(e) => setName(e.target.value)} />
                    </li>
                    <li className={cx("item")}>
                        <div className={cx("item_name")}>avatar</div>
                        <input type="test('should first', () => { second })" className={cx("item_input")} value={avatar} onChange={(e) => setAvatar(e.target.value)} />
                    </li>
                    <li className={cx("item")}>
                        <div className={cx("item_name")}>Địa chỉ</div>
                        <input type="text" className={cx("item_input")} value={address} onChange={(e) => setAddress(e.target.value)} />
                    </li>
                    <li className={cx("item")}>
                        <div className={cx("item_name")}>Số điện thoại</div>
                        <input type="tel" className={cx("item_input")} value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </li>
                </ul>
            </div>
          )}
            <div className={cx("save")}>
                <Link to="/profile">
                    <button className={cx("btn_cancel")}>Thoát</button>
                </Link>
                <button className={cx("btn_save")} onClick={handleBtnUpdate}>Lưu</button>
            </div>
     
        </div>
          
    );
}

export default EditProfile;
