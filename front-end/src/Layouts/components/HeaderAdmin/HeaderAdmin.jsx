import classNames from "classnames/bind";
import styles from "./HeaderAdmin.module.scss";
import logo from "~/assets/images/logo.svg";
import ThemeToggle from "~/Layouts/components/ThemeToggle";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);
function HeaderAdmin() {
  const [Login, setLogin] = useState(false)
  return (
    <div className="max-w-full mx-auto px-2 md:px-4">
      <div className="items-start justify-between py-2 border-b md:flex">
        <div>
          <h3 className="text-gray-800 text-2xl font-bold">Analytics</h3>
        </div>
        <div className="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
          <a
            href="#"
            className="block px-4 py-2 text-center text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
          >
            Notification
          </a>
          <a
            href="#"
            className="block px-4 py-2 mt-3 text-center text-gray-700 duration-150 font-medium rounded-lg border hover:bg-gray-50 active:bg-gray-100 sm:mt-0 md:text-sm"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
