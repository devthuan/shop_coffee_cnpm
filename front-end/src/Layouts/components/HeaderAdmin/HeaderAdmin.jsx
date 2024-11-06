import classNames from "classnames/bind";
import styles from "./HeaderAdmin.module.scss";
import logo from "~/assets/images/logo.svg";
import ThemeToggle from "~/Layouts/components/ThemeToggle";
import { useState } from "react";
import { Notification } from "./Notification";

const cx = classNames.bind(styles);
function HeaderAdmin() {
  const [Login, setLogin] = useState(false);
  return (
    <div className=" w-full mx-auto px-2 md:px-4 ">
      <div className="items-start justify-between py-2 border-b md:flex">
        <div>
          <h3 className="text-gray-800 text-2xl font-bold">Analytics</h3>
        </div>
        <div className="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
              />
            </svg> */}
            <Notification />
          <ThemeToggle />
          <div className="block px-4 py-2 mt-3 text-center text-gray-700 duration-150 font-medium rounded-lg border hover:bg-gray-50 active:bg-gray-100 sm:mt-0 md:text-sm">
            Back to home
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
