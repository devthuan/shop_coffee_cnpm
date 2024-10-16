import classNames from "classnames/bind";
import styles from "./DashboardLayout.module.scss";

const cx = classNames.bind(styles);
function DashboardLayout({ children }) {
  return (
    <div className={cx(" max-w-screen mx-auto p-1 max-sm:p-5 text-center")}>
      <div className="grid grid-cols-12">
        <div className="col-span-3">as</div>
        <div className="col-span-1">
          <div className="row">header</div>
          <div className="row">content</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
