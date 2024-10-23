import classNames from "classnames/bind";
import styles from "./Product.module.scss";

const cx = classNames.bind(styles);
export const Product = () => {
  return (
    <div className="">
      <div className={cx("mb-7")}>
        <div className={cx("grid lg:grid-cols-11 max-sm:gap-7 ")}>
          <div className={cx("lg:col-span-5")}>image product</div>
          <div className={cx("lg:col-span-6")}>information product</div>
        </div>
      </div>
      <div className={cx("review mt-7")}>
        <div
          className={cx("grid lg:grid-cols-9 max-sm:grid-cols-4 grid-rows-1")}
        >
          <div className={cx("")}>option 1</div>
          <div className={cx("")}>option 2</div>
          <div className={cx("")}>option 3</div>
          <div className={cx("")}>option 4</div>
        </div>
        <div className={cx("my-7")}>title</div>
        <div className={cx("grid lg:grid-cols-3 gap-7 max-sm:grid-cols-1  ")}>
          <div className={cx("")}>review 1</div>
          <div className={cx("")}>review 1</div>
          <div className={cx("")}>review 1</div>
        </div>
      </div>
    </div>
  );
};
