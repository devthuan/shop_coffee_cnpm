import classNames from "classnames/bind";
import styles from "./HeaderAdmin.module.scss";
import logo from "~/assets/images/logo.svg";
import ThemeToggle from "~/Layouts/components/ThemeToggle";
import { useState } from "react";
import { Notification } from "./Notification";
import { Navigate, NavLink, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
function HeaderAdmin() {
  const useNagivate = useNavigate();
  const [Login, setLogin] = useState(false);
  return (
    <div className=" w-full mx-auto px-2 md:px-4 ">
      <div className="items-start justify-between py-2 border-b md:flex">
        <div>
        </div>
        <div className="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
          <Notification />
          <div className="block px-4 py-2 mt-3 text-center text-gray-700 duration-150 font-medium rounded-lg border hover:bg-gray-50 active:bg-gray-100 sm:mt-0 md:text-sm">
            <NavLink to="/">Quay về trang người dùng</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
