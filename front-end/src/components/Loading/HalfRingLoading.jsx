import classNames from "classnames/bind";
import styles from "./HalfRingLoading.module.scss";
import React from "react";

const cx = classNames.bind(styles);

const HalfRingLoading = () => {
  return (
    <div class={cx("spinner")}></div>
  )
}

export default HalfRingLoading