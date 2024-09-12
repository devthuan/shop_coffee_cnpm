import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);
function Sidebar({ children }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        Sidebar
        {children}
      </div>
    </div>
  );
}

export default Sidebar;
