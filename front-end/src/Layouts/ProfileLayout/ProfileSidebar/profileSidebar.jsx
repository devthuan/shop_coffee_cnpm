import classNames from "classnames/bind";
import styles from "./ProfileSidebar.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faCircle, faCircleExclamation, faCircleInfo, faDownload, faEnvelope, faGift, faHeart, faInfo, faLocation, faLocationDot, faSchoolCircleExclamation, faShield, faShieldHalved, faUser } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles)

function ProfileSidebar() {


    const id = useSelector((state) => state.userInfo.id)
    const createdAt = useSelector((state) => state.userInfo.createdAt)
    const updatedAt = useSelector((state) => state.userInfo.updatedAt)
    const userName = useSelector((state) => state.userInfo.userName)
    const email = useSelector((state) => state.userInfo.email)
    const balance = useSelector((state) => state.userInfo.balance);
    const ip = useSelector((state) => state.userInfo.ip);
    const device = useSelector((state) => state.userInfo.device);
    const typeLogin = useSelector((state) => state.userInfo.typeLogin);
    const isActive = useSelector((state) => state.userInfo.isActive);
    const lastLogin = useSelector((state) => state.userInfo.lastLogin);
    const userInformation = useSelector((state) => state.userInfo.userInformation);
    const isError = useSelector((state) => state.userInfo.error);
    const isloading = useSelector((state) => state.userInfo.loading);

    return (<div className={cx("wrapper")}>
        <div className={cx("avatar")}>
            <div className={cx("avatar_content")}>
                {userInformation?.avatar ? <img src={userInformation?.avatar} className={cx("img_user")} /> : <FontAwesomeIcon icon={faUser} className={cx("img_user")} />}
                <div className={cx("name_user")}>{userInformation?.fullName}</div>
                <div className={cx("register_login")}>
                    <div className={cx("register_login_text")}>ngày đăng kí:</div>
                    <div className={cx("register_login_date")}>{createdAt}</div>
                </div>
            </div>
        </div>
        <div className={cx("list")}>
            <ul className={cx("list_container")}>
                <li className={cx("list_item")}>
                    <ul className={cx("list_item_container")}>
                        quản lý
                        <Link to="/profile/editProfile">
                            <li className={cx("list_item_item")}>
                                <FontAwesomeIcon icon={faUser} className={cx("item_icon")} />
                                <div className={cx("item_text")}>chỉnh sửa thông tin cá nhân</div>
                            </li>
                        </Link>
                        <Link to="/profile/changePassword">
                            <li className={cx("list_item_item")}>
                                <FontAwesomeIcon icon={faUser} className={cx("item_icon")} />
                                <div className={cx("item_text")}>Đổi mật khẩu</div>
                            </li>
                        </Link>
                    </ul>
                </li>
                <li className={cx("list_item")}>
                    <ul className={cx("list_item_container")}>
                        Các mục của tôi
                        <Link to="/profile/favoriteUser">
                            <li className={cx("list_item_item")}>
                                <FontAwesomeIcon icon={faHeart} className={cx("item_icon")} />
                                <div className={cx("item_text")}>yêu thích</div>
                            </li>
                        </Link>
                        <Link to="/profile/billAccount">
                            <li className={cx("list_item_item")}>
                                <FontAwesomeIcon icon={faCartPlus} className={cx("item_icon")} />
                                <div className={cx("item_text")}>đã mua</div>
                            </li>
                        </Link>
                    </ul>
                </li>
                <li className={cx("list_item")}>
                    <ul className={cx("list_item_container")}>
                        Quản lý
                        <Link to="/admin">
                            <li className={cx("list_item_item")}>
                                <FontAwesomeIcon icon={faUser} className={cx("item_icon")} />
                                <div className={cx("item_text")}>Trang quản lý</div>
                            </li>
                        </Link>
                    </ul>
                </li>
            </ul>
        </div>
    </div>);
}
export default ProfileSidebar;