import classNames from "classnames/bind";
import style from "./ContentSidebar.module.scss";
import item_cf from "~/assets/images/item_sp.svg"
const cx = classNames.bind(style);
function ContentSaidbar() {
  return <div className={cx("warpper")}>
            <div className={cx("title")}> Categories</div>
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
                <li  className={cx("item")}>
                    <p className={cx("item_name")}>Starburk</p>
                    <img src={item_cf} className={cx("item_img")}/>
                </li>
             
                
              
            
            </ul>
        </div>;
}

export default ContentSaidbar;
