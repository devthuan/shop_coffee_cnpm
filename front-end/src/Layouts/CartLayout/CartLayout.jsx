import classNames from "classnames/bind";
import styles from "./CartLayout.module.scss";


const cx = classNames.bind(styles);
function CartLayout({children}) {
  return (
    <div className={cx("max-w-[1280px] mx-auto max-sm:p-5 text-center")}>
      <div className={cx("grid lg:grid-cols-1  mb-7")}>header</div>
      <div className={cx("md:hidden grid lg:grid-cols-1  mb-7")}>search</div>
      <div
        className={cx(
          " w-11/12 grid  lg:gap-y-[30px] max-sm:gap-y-[20px]  mx-auto"
        )}
      >
        <div className={cx("")}>filter</div>
          {children}
      </div>
      <div className={cx("grid grid-cols-1 mt-7")}>footer</div>
    </div>
  );
}

export default CartLayout;
