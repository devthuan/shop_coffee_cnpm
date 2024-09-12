import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";

import Header from "~/components/Layout/components/Header";
import Sidebar from "~/components/Layout/components/Sidebar";
import Content from "~/components/Layout/components/Content";
const cx = classNames.bind(styles);
function DefaultLayout() {
  return (
    <div className={cx("wrapper")}>
      <Header />
      <div className={cx("container")}>
        <Sidebar></Sidebar>
        <Content></Content>
      </div>
    </div>
  );
}

export default DefaultLayout;
