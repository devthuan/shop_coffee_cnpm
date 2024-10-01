import classNames from "classnames/bind";
import styles from "./Filter.module.scss";

const cx = classNames.bind(styles);
function Filter() {
  return (
    <div className={cx("wrapper")}>
      Filter
    </div>
  );
}

export default Filter;
