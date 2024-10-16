import classNames from "classnames/bind";
import styles from "./Attribute.module.scss";

const cx = classNames.bind(styles);
export const Attribute = () => {
  return <div className={cx("")}>Attribute welcome</div>;
};
