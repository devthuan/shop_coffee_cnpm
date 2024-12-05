import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "~/assets/images/logo.svg";
import ThemeToggle from "~/Layouts/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCartShopping,
  faUser,
  faBars,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import SideBarHeader from "~/Layouts/components/Header/SideBarHeader/SideBarHeader";
import InputSearch from "~/Layouts/components/Header/InputSearch/inputSearch";
import { useDispatch, useSelector } from "react-redux";
import { getItemWithExpiration, removeToken } from "~/services/localStorage";
import { toast } from "react-toastify";
import { GetCartOfUser } from "~/services/CartService";
import { initCart } from "~/redux/features/cart/cartSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { Notification } from "~/Layouts/components/HeaderAdmin/Notification";

const cx = classNames.bind(styles);

function Header() {
  const dispatch = useDispatch();
  const isLoginToken = getItemWithExpiration("token") || null;

  const carts = useSelector((state) => state.cart.data);

  const [isLogin, setIsLogin] = useState(false);
  const [imgUser, setImgUser] = useState();
  const [sideBarHeader, setSideBarHeader] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getItemWithExpiration("token");
      setIsLogin(!!token);
    };
    checkLoginStatus();
  }, []);

  const handleCLickSearch = () => {
    setToggleSearch(!toggleSearch);
  };

  const handleClickToggle = () => {
    setSideBarHeader(!sideBarHeader);
  };

  const handleLogOut = () => {
    removeToken();
    setIsLogin(false);
    toast.success("Đăng xuất thành công.");
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {

       if (!isLoginToken) {
         return;
       }

      try {


        const response = await GetCartOfUser();
        console.log(response.data);
        if (response.status === 200 && response.data) {
          dispatch(initCart(response.data));
        }
      } catch (error) {
        if (error.request) {
          dispatch(initCart({ error: "Không có phản hồi từ server..." }));
        }
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <header className={cx("wrapper", "sm:h-[110px] h-[82px]")}>
      {sideBarHeader && (
        <div className={cx("sidebarheader", "sm:hidden")}>
          <SideBarHeader handleClickToggle={handleClickToggle} />
        </div>
      )}
      {toggleSearch && <InputSearch handleCLickSearch={handleCLickSearch} />}
      <div className={cx("container")}>
        <FontAwesomeIcon
          icon={faBars}
          className={cx("icon_bars", "sm:hidden")}
          onClick={handleClickToggle}
        />
        <Link to="/" className={cx("logo")}>
          <img src={logo} alt="Logo" className={cx("logo_icon")} />
          <div className={cx("title")}>grocerymart</div>
        </Link>
        <div className={cx("element_right")}>
          {!isLogin ? (
            <div className={cx("header_btn")}>
              <Link to="/login" className={cx("btn_login_text")}>
                Log in
              </Link>
            </div>
          ) : (
           

            <div className={cx("content")}>
               <Notification />

              <div className={cx("btn_search")} onClick={handleCLickSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>

              <Link to="/cart" className={cx("btn_cart", "relative")}>
                <FontAwesomeIcon icon={faCartShopping} />
                <div className="absolute -top-[10px] -right-[10px] w-[25px] h-[25px] p-1 rounded-full bg-red-500 text-white flex justify-center items-center">
                  {carts ? (carts.length > 99 ? "99+" : carts.length) : 0}
                </div>
              </Link>
              <Link to="/profile">
                {imgUser ? (
                  <img src={imgUser} alt="User" />
                ) : (
                  <FontAwesomeIcon icon={faUser} className={cx("img_user")} />
                )}
              </Link>
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className={cx("log_out")}
                onClick={handleLogOut}
              />
            </div>
          )}
        </div>
        <Link to="/profile" className={cx("sm:hidden")}>
          <FontAwesomeIcon icon={faUser} className={cx("img_user")} />
        </Link>
      </div>
    </header>
  );
}

export default Header;
