import classNames from "classnames/bind";
import styles from "./Content.module.scss";

const cx = classNames.bind(styles);
function Content({ children }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        {children}
      </div>
    </div>
  );
}

export default Content;
