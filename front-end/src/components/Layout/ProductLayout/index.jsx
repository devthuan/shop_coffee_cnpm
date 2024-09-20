import classNames from "classnames/bind";
import styles from "./ProductLayout.module.scss";
import Header from "~/components/Layout/components/Header";
import Content from "~/components/Layout/components/Content";
import Filter from "~/components/Layout/components/Filter";

const cx = classNames.bind(styles);
function ProductLayout() {
  return (
    <div className={cx("wrapper")}>
      <Header />
      <Filter />
      <div className={cx("container")}>
        <Content></Content>
      </div>
    </div>
  );
}

export default ProductLayout;
