import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import ThemeToggle from "~/components/Layout/components/ThemeToggle";

const cx = classNames.bind(styles);
function Header() {
  return (
    <header className={cx("wrapper")}>
      <div className={cx("container")}>
        
      </div>
    </header>
  );
}

export default Header;
