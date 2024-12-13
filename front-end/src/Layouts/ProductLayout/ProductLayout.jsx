import classNames from "classnames/bind";
import styles from "./ProductLayout.module.scss";
import Header from "~/Layouts/components/Header/Header";
import Filter from "~/Layouts/components/Filter";
import ArrowRightIcon from "~/assets/icon/arrow_right.svg";
import { NavLink } from "react-router-dom";

const cx = classNames.bind(styles);

function ProductLayout({ children }) {
  return (
    <div className={cx("max-w-[1280px] mx-auto text-center")}>
      <div className={cx("")}>
        <Header />
      </div>
      <div className={cx("w-11/12 mx-auto")}>
        {/* <div className={cx("md:hidden grid lg:grid-cols-1 my-7")}>search</div> */}
        <div className={cx("my-7 ")}>
          <div className="w-full h-16 pl-5 pr-[725px] py-5 bg-[#f6f6f6] rounded-[10px] shadow flex-col justify-start items-start gap-2.5 inline-flex">
            <div className="h-6 flex-col justify-start items-start gap-5 flex">
              <div className="justify-start items-start gap-5 inline-flex">
                <div className="justify-start items-center gap-2 flex">
                  <NavLink to={"/"}>
                    <div className=" text-base font-medium font-['Gordita'] leading-normal">
                      Trang chủ
                    </div>
                  </NavLink>
                  <div className="w-6 h-6 justify-center items-center flex">
                    <div className="w-6 h-6 py-[5px] justify-center items-center inline-flex">
                      <img src={ArrowRightIcon} alt="" srcset="" />
                    </div>
                  </div>
                </div>
                <div className="justify-start items-center gap-2 flex">
                  <div className=" text-base font-medium font-['Gordita'] leading-normal">
                    Chi tiết sản phẩm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">{children}</div>
      </div>
    </div>
  );
}

export default ProductLayout;
