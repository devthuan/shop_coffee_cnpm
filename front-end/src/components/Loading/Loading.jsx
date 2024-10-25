import classNames from "classnames/bind";
import styles from "./Loading.module.scss";
import React from "react";

const cx = classNames.bind(styles);
const Loading = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className={cx("spinner")}></div>
    </div>
  );
};

export default Loading;
