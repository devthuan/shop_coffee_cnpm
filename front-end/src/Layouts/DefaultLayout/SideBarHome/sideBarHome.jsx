import classNames from "classnames/bind";
import style from "./SidebarHome.module.scss";
import item_cf from "src/assets/images/item_sp.svg"
import { useEffect, useState } from "react";
import { DetailProduct, ListProduct } from "~/services/ProductService";
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setLoading, setError } from 'src/redux/features/PoductSlice'; 
const cx = classNames.bind(style);

function SidebarHome() {
    useEffect(() => {
        const fetchProductId = async () => {
                const response = await ListProduct();
                console.log(response.data);
                
        };
    
        fetchProductId();
    }, []);
    return (
        <div className={cx("wrapper")}>
            <div className={cx("title")}>Categories</div>
            <ul className={cx("list_product")}>
                {/* {data && data.length > 0 && data.map((item, i) => (
                    <li key={i} className={cx("item")}>
                        <p className={cx("item_name")}>{item.name}</p>
                        <img src={item.imageUrl} className={cx("item_img")} alt={item.name} />
                    </li>
                ))} */}
            </ul>
        </div>
    );
}
export default SidebarHome;
