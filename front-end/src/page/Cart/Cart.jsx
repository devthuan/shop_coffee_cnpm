import classNames from "classnames/bind";
import styles from "./Cart.module.scss";

const cx = classNames.bind(styles);
export const Cart = () => {
  return (
    <div
      className={cx(
        "grid lg:grid-cols-12 lg:gap-x-[30px] max-sm:gap-y-[20px] "
      )}
    >
      <div className={cx("lg:col-span-8")}>product</div>
      <div className={cx("lg:col-span-4")}>checkout</div>
    </div>
  );
};
