import classNames from "classnames/bind";
import style from "./SidebarHome.module.scss";
import item_cf from "src/assets/images/item_sp.svg"
import { useState } from "react";
const cx = classNames.bind(style);
function SidebarHome() {
    const [listProduct, setListProduct] = useState([{
        name: "Starburk",
        img: item_cf
    },

])


    return <div className={cx("wrapper")}>
        <div className={cx("title")}>Categories</div>
        <ul className={cx("list_product")}>
            {/* <li  className={cx("item")}>
                    <p className={cx("item_name")}>Starburk</p>
                    <img src={item_cf} className={cx("item_img")}/>
                </li> */}
            {listProduct.map((item, i) => {
                return (<li className={cx("item")}>
                    <p className={cx("item_name")}>{item.name}</p>
                    <img src={item.img} className={cx("item_img")} />
                </li>)
            })}

        </ul>
    </div>;
}

export default SidebarHome;