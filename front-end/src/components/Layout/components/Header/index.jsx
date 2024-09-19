import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "~/assets/images/logo.svg";
import ThemeToggle from "~/components/Layout/components/ThemeToggle";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);
function Header() {
  const [Login, setLogin] = useState(false)
  return (
    <header className={cx("wrapper")}>
      <div className={cx("container")}>
        <Link to={'/'} className={cx("logo")}>
          <img src={logo} alt="Logo" className={cx("logo_icon")} />
          <div className={cx("title")}>grocerymart</div>
        </Link>
        {Login ? <div className={cx("header_btn")}>
          <Link to="./register" className={cx("btn_login_text")}>log in</Link>
          <ThemeToggle />
        </div> : <div className={cx("content")} >
          <div className={cx("btn_search")}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
          <Link to={'/cart'} className={cx("btn_cart")}>
            <FontAwesomeIcon icon={faCartShopping} />
          </Link>
          <Link to={'/profile'} className={cx("img_user")}>
            <FontAwesomeIcon icon={faUser} />
          </Link>
          <ThemeToggle />
        </div>}

      </div>
    </header>
  );
}

export default Header;
