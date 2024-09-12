import classNames from "classnames/bind";
import styles from "./CartLayout.module.scss";
import Header from "~/components/Layout/components/Header";
import Filter from "~/components/Layout/components/Filter";
import Content from "~/components/Layout/components/Content";
import Sidebar from "~/components/Layout/components/Sidebar";

const cx = classNames.bind(styles);
function CartLayout() {
  return (
    <div className={cx("wrapper")}>
        <Header/>
        <Filter/>
      <div className={cx("container")}>
        <Content></Content>
        <Sidebar></Sidebar>
      </div>
    </div>
  );
}

export default CartLayout;
