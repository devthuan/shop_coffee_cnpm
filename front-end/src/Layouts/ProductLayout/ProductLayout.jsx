import classNames from "classnames/bind";
import styles from "./ProductLayout.module.scss";
import Header from "~/Layouts/components/Header/Header";
import Filter from "~/Layouts/components/Filter";

const cx = classNames.bind(styles);

function ProductLayout({ children }) {
  return (
    <div className={cx("max-w-[1280px] mx-auto text-center")}>
      <div className={cx("")}><Header/></div>
      <div className={cx("w-11/12 mx-auto")}>
        {/* <div className={cx("md:hidden grid lg:grid-cols-1 my-7")}>search</div> */}
        <div className={cx("my-7 ")}></div>
        <div className="">{children}</div>
      </div>
    </div>
  );
}

export default ProductLayout;
