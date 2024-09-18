import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "~/assets/images/logo.svg";
import ThemeToggle from "~/components/Layout/components/ThemeToggle";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);
function Header() {
  return (
    <header className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("logo")}>
          <img src={logo} alt="Logo" className={cx("logo_icon")} />
          <div className={cx("title")}>grocerymart</div>
        </div>
        <div className={cx("header_btn")}>
          <Link to="./register" className={cx("btn_login_text")}>log in</Link>
          <button className={cx("btn_dark_light")}> <ThemeToggle/></button>
        </div>
      </div>
    </header>
  );
}

export default Header;
