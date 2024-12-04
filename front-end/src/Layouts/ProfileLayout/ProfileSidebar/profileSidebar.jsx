import classNames from "classnames/bind";
import styles from "./ProfileSidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faCircle,
  faCircleExclamation,
  faCircleInfo,
  faDownload,
  faEnvelope,
  faGift,
  faHeart,
  faInfo,
  faLocation,
  faLocationDot,
  faSchoolCircleExclamation,
  faShield,
  faShieldHalved,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { BsHandbag } from "react-icons/bs";
import { IoBagCheckOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";

const cx = classNames.bind(styles);

function ProfileSidebar() {
  const id = useSelector((state) => state.userInfo.id);
  const createdAt = useSelector((state) => state.userInfo.createdAt);
  const updatedAt = useSelector((state) => state.userInfo.updatedAt);
  const userName = useSelector((state) => state.userInfo.userName);
  const email = useSelector((state) => state.userInfo.email);
  const balance = useSelector((state) => state.userInfo.balance);
  const ip = useSelector((state) => state.userInfo.ip);
  const device = useSelector((state) => state.userInfo.device);
  const typeLogin = useSelector((state) => state.userInfo.typeLogin);
  const isActive = useSelector((state) => state.userInfo.isActive);
  const lastLogin = useSelector((state) => state.userInfo.lastLogin);
  const userInformation = useSelector(
    (state) => state.userInfo.userInformation
  );
  const isError = useSelector((state) => state.userInfo.error);
  const isloading = useSelector((state) => state.userInfo.loading);

  return (
    <div className={cx("wrapper bg-white shadow-xl")}>
      <div className={cx("avatar bg-slate-500")}>
        <div className={cx("avatar_content")}>
          {userInformation?.avatar ? (
            <img src={userInformation?.avatar} className={cx("img_user")} />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
          <div
            className={cx("name_user text-white font-semibold pt-2 text-lg")}
          >
            {userInformation?.fullName}
          </div>
          <div className={cx("register_login flex items-center")}>
            <div className={cx("register_login_text font-normal text-white")}>
              userName :{" "}
            </div>
            <div
              className={cx("register_login_date font-normal text-white pl-2")}
            >
              {userName}
            </div>
          </div>
        </div>
      </div>
      <div className={cx("list")}>
        <ul className={cx("list_container")}>
          <li className={cx("list_item")}>
            <ul className={cx("list_item_container")}>
              <li className="text-[#1a162e] text-lg font-medium font-roboto leading-relaxed mb-2 ">
                Quản lý thông tin
              </li>
              <Link className={cx("mb-2")} to="/profile/editProfile">
                <li className={cx("list_item_item")}>
                  <CiUser size={23} color="#111" />
                  <div className="text-[#1a162e] text-[15px] font-normal font-mono leading-snug">
                    Thông tin cá nhân
                  </div>
                </li>
              </Link>
              <Link to="/profile/changePassword">
                <li className={cx("list_item_item")}>
                  <IoBagCheckOutline size={23} color="#666" />

                  <div className="text-[#1a162e] text-[15px] font-normal font-mono leading-snug">
                    Đổi mật khẩu
                  </div>
                </li>
              </Link>
            </ul>
          </li>
          <li className={cx("list_item")}>
            <ul className={cx("list_item_container")}>
              <li className="text-[#1a162e] text-lg font-medium font-roboto leading-relaxed mb-2 ">
                Các mục của tôi
              </li>
              <Link className="mb-2" to="/profile/favoriteUser">
                <li className={cx("list_item_item")}>
                  <CiHeart size={23} color="black" />

                  <div className="text-[#1a162e] text-[15px] font-normal font-mono leading-snug">
                    Yêu thích
                  </div>
                </li>
              </Link>
              <Link className="mb-2" to="/profile/billAccount">
                <li className={cx("list_item_item")}>
                  <BsHandbag size={23} color="#666" />
                  <div className="text-[#1a162e] text-[15px] font-normal font-mono leading-snug">
                    Đã mua
                  </div>
                </li>
              </Link>
            </ul>
          </li>
          <li className={cx("list_item")}>
            <ul className={cx("list_item_container")}>
              <li className="text-[#1a162e] text-lg font-medium font-roboto leading-relaxed mb-2 ">
                Quản lý
              </li>
              <Link to="/admin">
                <li className={cx("list_item_item")}>
                  <CiUser size={23} color="#111" />

                  <div className={cx("item_text")}>Trang quản lý</div>
                </li>
              </Link>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default ProfileSidebar;
