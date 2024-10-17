import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./DashboardLayout.module.scss";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderAdmin from "../components/HeaderAdmin/HeaderAdmin";
const cx = classNames.bind(styles);
function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-x-4">
      <div className="h-screen col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-10">
        <HeaderAdmin />
        <div className="">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
