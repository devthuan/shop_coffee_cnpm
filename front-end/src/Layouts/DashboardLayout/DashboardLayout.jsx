import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./DashboardLayout.module.scss";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderAdmin from "../components/HeaderAdmin/HeaderAdmin";
const cx = classNames.bind(styles);
function DashboardLayout({ children }) {
  return (
    <div className="dashboard grid grid-cols-12 gap-x-4 ">
      <div className="max-w-full md:col-span-2 ">
        <Sidebar />
      </div>
      <div className="col-span-10 w-full">
        <HeaderAdmin />
        <div className="dashboard h-5/6">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
