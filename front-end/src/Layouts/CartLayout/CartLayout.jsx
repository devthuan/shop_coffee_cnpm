import classNames from "classnames/bind";
import styles from "./CartLayout.module.scss";
import Header from "~/Layouts/components/Header/Header";
import ArrowRightIcon from "~/assets/icon/arrow_right.svg";
import { Navigate, NavLink } from "react-router-dom";

const cx = classNames.bind(styles);
function CartLayout({ children }) {
  return (
    <div className={cx("max-w-[1280px] mx-auto max-sm:p-5 text-center")}>
      <div className={cx("grid lg:grid-cols-1  mb-7")}>
        <Header />
      </div>
      <div
        className={cx(
          " w-11/12 grid  lg:gap-y-[30px] max-sm:gap-y-[20px]  mx-auto"
        )}
      >
        <div className={cx("")}>
          <div className="w-full h-16 pl-5 pr-[725px] py-5 bg-white rounded-[10px] shadow flex-col justify-start items-start gap-2.5 inline-flex">
            <div className="h-6 flex-col justify-start items-start gap-5 flex">
              <div className="justify-start items-start gap-5 inline-flex">
                <div className="justify-start items-center gap-2 flex">
                  <div className=" text-base font-medium font-['Gordita'] leading-normal">
                    <NavLink to={"/"}>Trang chủ</NavLink>
                  </div>
                  <div className="w-6 h-6 justify-center items-center flex">
                    <div className="w-6 h-6 py-[5px] justify-center items-center inline-flex">
                      <img src={ArrowRightIcon} alt="" srcset="" />
                    </div>
                  </div>
                </div>
                <div className="justify-start items-center gap-2 flex">
                  <div className=" text-base font-medium font-['Gordita'] leading-normal">
                    Giỏ hàng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default CartLayout;
