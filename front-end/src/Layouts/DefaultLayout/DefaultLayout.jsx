import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";

const cx = classNames.bind(styles);

function DefaultLayout({children}) {
  return (
    <div className={cx(" max-w-[1280px] mx-auto max-sm:p-5 text-center")}>
      <div className="grid grid-cols-1">header</div>
      <div className={cx("lg:w-11/12 grid grid-cols-12 gap-x-7  mx-auto")}>
        <div className={cx("lg:col-span-3 max-sm:col-span-12 ")}>sidebar</div>
        <div className={cx("lg:col-span-9 max-sm:col-span-12")}>
          <div className={cx("w-full grid grid-cols-1 grid-rows-2")}>
            <div className={cx("")}>banner</div>
            <div className={cx("")}>{children}</div>
          </div>
        </div>
      </div>
      <footer className={cx("footer w-full")}>Footer</footer>
    </div>
  );
}

export default DefaultLayout;
