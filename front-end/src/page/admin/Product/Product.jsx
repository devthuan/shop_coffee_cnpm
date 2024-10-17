import classNames from "classnames/bind";
import styles from "./Product.module.scss";

const cx = classNames.bind(styles);
export const Product = () => {
  return <div className={cx("")}>Product welcome</div>;
};
