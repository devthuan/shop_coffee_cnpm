import classNames from "classnames/bind";
import styles from "./SidebarAdmin.module.scss";
import logo from "~/assets/images/logo.svg";
import ThemeToggle from "~/Layouts/components/ThemeToggle";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);
function SidebarAdmin() {
  const [Login, setLogin] = useState(false)
  return (
    <div class="relative   h-screen flex-col rounded-xl   bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
        <div className="h-[50px] text-center align-center ">Wellcome</div>
        <div className="grid grid-rows-5 space-y-5">
          <div className="row-span-1">
            <div className="flex space-x-2 ml-2">
              <div className="">
                <img src={faMagnifyingGlass} alt="" srcset="" />
              </div>
              <div className="text-s">Dashboard</div>
            </div>
            </div>
          <div className="">a</div>
          <div className="">a</div>
          <div className="">a</div>
          <div className="">a</div>
        </div>
    </div>
  );
}

export default SidebarAdmin;
