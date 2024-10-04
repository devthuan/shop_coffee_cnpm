import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import Header from "~/Layouts/components/Header/Header";
import SidebarHome from "~/Layouts/DefaultLayout/SideBarHome/sideBarHome";

const cx = classNames.bind(styles);

function DefaultLayout({children}) {
  return (
    <div className={cx("max-w-[1280px] mx-auto text-center")}>
      <div className="grid grid-cols-1"><Header/></div>
      <div className={cx("lg:w-11/12 grid grid-cols-12 gap-x-7  mx-auto sm:mt-[30px]")}>
        <div className={cx("lg:col-span-3 max-sm:col-span-12 ")}><SidebarHome/></div>
        <div className={cx("lg:col-span-9 max-sm:col-span-12")}>
          <div className={cx("w-full grid grid-cols-1 grid-rows-2")}>
            <div className={cx("")}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
