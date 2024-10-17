import classNames from "classnames/bind";
import styles from "./DashboardLayout.module.scss";
import SidebarAdmin from "../components/SidebarAdmin/SidebarAdmin";


const cx = classNames.bind(styles);
function DashboardLayout({children}) {
  return (
    <div className={cx("max-w-screen mx-auto  max-sm:p-5 text-center")}>
      <div className="grid grid-cols-11">
          <div className="col-span-2">
            <SidebarAdmin/>
          </div>
          <div className="col-span-9">
            <div className="">header</div>
            <div className="">content</div>
          </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
