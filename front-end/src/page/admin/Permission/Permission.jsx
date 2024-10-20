import classNames from "classnames/bind";
import styles from "./Permission.module.scss";

const cx = classNames.bind(styles);
export const Permission = () => {
  return (
    <div className={cx("max-w-screen-2xl  mx-auto px-4 md:px-8")}>
      Permission welcome
    </div>
  );
};
