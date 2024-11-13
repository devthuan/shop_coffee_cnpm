import classNames from "classnames/bind";
import styles from "./CartLayout.module.scss";
import Header from "~/Layouts/components/Header/Header";


const cx = classNames.bind(styles);
function CartLayout({children}) {
  return (
    <div className={cx("max-w-[1280px] mx-auto max-sm:p-5 text-center")}>
      <div className={cx("grid lg:grid-cols-1  mb-7")}><Header/></div>
      <div
        className={cx(
          " w-11/12 grid  lg:gap-y-[30px] max-sm:gap-y-[20px]  mx-auto"
        )}
      >
        <div className={cx("")}>filter</div>
          {children}
      </div>
      
    </div>
  );
}

export default CartLayout;
