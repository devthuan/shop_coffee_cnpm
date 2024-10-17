import classNames from "classnames/bind";
import styles from "./ProfileLayout.module.scss";
import SideBar from "./SideBar/SideBar";

const cx = classNames.bind(styles);

function ProfileLayout({children}) {
  return (
    <div className={cx("max-w-[1280px] mx-auto text-center")}>
      <div className={cx("mb-7")}>header</div>
      <div className={cx("md:hidden grid lg:grid-cols-1 my-5")}>search</div>

      <div
        className={cx(
          "w-11/12 mx-auto grid lg:grid-cols-12 max-sm:grid-cols-1 gap-7"
        )}
      >
        <div className="lg:col-span-3 grid gap-y-7">
          {/* <div className="">avatar</div>
          <div className="">list</div> */}
          <SideBar/>
        </div>
        <div className="lg:col-span-9 p-7">{children}</div>
      </div>
      <div className={cx("mt-7")}>footer</div>
    </div>
  );
}

export default ProfileLayout;
