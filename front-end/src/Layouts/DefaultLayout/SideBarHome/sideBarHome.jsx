import classNames from "classnames/bind";
import style from "./SidebarHome.module.scss";
import item_cf from "src/assets/images/item_sp.svg"
const cx = classNames.bind(style);
function SidebarHome() {
  return <div className={cx("wrapper" )}>
            <div className={cx("title")}>Categories</div>
            <ul className={cx("list_product")}> 
               
                <li  className={cx("item")}>
                    <p className={cx("item_name")}>Starburk</p>
                    <img src={item_cf} className={cx("item_img")}/>
                </li>

                <li  className={cx("item")}>
                    <p className={cx("item_name")}>Starburk</p>
                    <img src={item_cf} className={cx("item_img")}/>
                </li>
              
             
                <li  className={cx("item")}>
                    <p className={cx("item_name")}>Starburk</p>
                    <img src={item_cf} className={cx("item_img")}/>
                </li>
                <li  className={cx("item")}>
                    <p className={cx("item_name")}>Starburk</p>
                    <img src={item_cf} className={cx("item_img")}/>
                </li>
                <li  className={cx("item")}>
                    <p className={cx("item_name")}>Starburk</p>
                    <img src={item_cf} className={cx("item_img")}/>
                </li>
                <li  className={cx("item")}>
                    <p className={cx("item_name")}>Starburk</p>
                    <img src={item_cf} className={cx("item_img")}/>
                </li>
              
                <li  className={cx("item")}>
                    <p className={cx("item_name")}>Starburk</p>
                    <img src={item_cf} className={cx("item_img")}/>
                </li>
              
                <li  className={cx("item")}>
                    <p className={cx("item_name")}>Starburk</p>
                    <img src={item_cf} className={cx("item_img")}/>
                </li>
              
             
              
            </ul>
        </div>;
}

export default SidebarHome;