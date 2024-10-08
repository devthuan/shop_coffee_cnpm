import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "~/assets/images/logo.svg";
import ThemeToggle from "~/Layouts/components/ThemeToggle";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import SideBarHeader from "~/Layouts/components/Header/SideBarHeader/SideBarHeader";
import InputSearch from "~/Layouts/components/Header/InputSearch/inputSearch";


const cx = classNames.bind(styles);
function Header() {
  const [Login, setLogin] = useState(false)
  const [imgUser, setImgUser] = useState()
  const [sideBarHeader, setSideBarHeader] = useState(false)
  const [toggleSearch, setToggleSearch] = useState(false)


  const handleCLickSearch = () =>{
    setToggleSearch(!toggleSearch)
  }

  const handleClickToggle = () => {
    setSideBarHeader(!sideBarHeader)
  }
  return (
    <header className={cx("wrapper", "sm:h-[110px] h-[82px]")}>
      {sideBarHeader && <div className={cx("sidebarheader" , "sm:hidden")}><SideBarHeader handleClickToggle={handleClickToggle} /></div>}
      {toggleSearch && <InputSearch handleCLickSearch={handleCLickSearch} />}
      <div className={cx("container")}>
        <FontAwesomeIcon icon={faBars} className={cx("icon_bars", "sm:hidden")} onClick={handleClickToggle} />

        <Link to={'/'} className={cx("logo")}>
          <img src={logo} alt="Logo" className={cx("logo_icon")} />
          <div className={cx("title")}>grocerymart</div>
        </Link>
        <div className={cx("element_right")}>
          {Login ? <div className={cx("header_btn")}>
            <Link to="./register" className={cx("btn_login_text")}>log in</Link>
            <ThemeToggle />
          </div> : <div className={cx("content")} >
            <div className={cx("btn_search")} onClick={handleCLickSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <Link to={'/cart'} className={cx("btn_cart")}>
              <FontAwesomeIcon icon={faCartShopping} />
            </Link>

            <Link to={'/profile'}>
              {imgUser ? <img src={imgUser} /> : <FontAwesomeIcon icon={faUser} className={cx("img_user")} />}
            </Link>
            <ThemeToggle />
          </div>}
        </div>

        <Link to={'/profile'} className={cx("sm:hidden")}>
          <FontAwesomeIcon icon={faUser} className={cx("img_user")} />
        </Link>
      </div>
    </header>
  );
}
export default Header;
