import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";

import Header from "~/components/Layout/components/Header";
import Sidebar from "~/components/Layout/components/Sidebar";
import Content from "~/components/Layout/components/Content";
import ContentSaidbar from "~/components/Layout/DefaultLayout/ContentSidebar";
import ContentMain from "~/components/Layout/DefaultLayout/ContentMain";
const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
  return (
    <div className={cx("wrapper")}>
      <Header />
      <div className={cx("container")}>
        <Sidebar>{children}</Sidebar>
        <Content><ContentSaidbar /><ContentMain /></Content>
      </div>
    </div>
  );
}

export default DefaultLayout;
