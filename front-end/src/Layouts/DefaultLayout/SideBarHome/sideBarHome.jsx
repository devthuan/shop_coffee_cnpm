import classNames from "classnames/bind";
import style from "./SidebarHome.module.scss";
import { useEffect, useState } from "react";
import { getALLProducts } from "~/services/ProductService";
import { useDispatch, useSelector } from 'react-redux';
import { initDataProduct, clearDataProduct } from '~/redux/features/Product/PoductSlice';
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast } from "react-toastify";
import { getAllCategories } from "~/services/Categories";
import { clearDataCatagories, initDataCatagories } from "~/redux/features/Categories/categoriesSlice";
import Loading from "~/components/Loading/Loading";
const cx = classNames.bind(style);

function SidebarHome() {
    const dispatch = useDispatch();
    const catagoriesData = useSelector((state) => state.catagories.data);
    const isLoading = useSelector((state) => state.catagories.loading);
    const isError = useSelector((state) => state.catagories.error);
    const [optionLimit, setOptionLimit] = useState({
        currentPage: 1,
        limit: 10,
    });
    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
                const response = await getAllCategories(queryParams);
                dispatch(initDataCatagories(response.data));
            } catch (error) {
                if (error.request) {
                    dispatch(initDataCatagories({ error: "không có phản hồi từ server..." }));
                }
                const result = HandleApiError(error);
                result ? toast.error(result) : toast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        };

        dispatch(clearDataCatagories());

        const timeoutId = setTimeout(() => {
            fetchAllCategories();
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [optionLimit, dispatch]);

    
    return (
        <div className={cx("wrapper")}>
            <div className={cx("title")}>Categories</div>
            {isLoading ? (<div className="h-full w-full flex justify-center items-center">
              <Loading />
            </div>): (<ul className = { cx("list_product") }>
                {catagoriesData && catagoriesData.length > 0 && catagoriesData.map((item, i) => {
                    return (<li key={i} className={cx("item")}>
                <p className={cx("item_name")}>{item.name}</p>
                {/* <img src={item.images[0]?.urlImage} className={cx("item_img")} alt={item.name} /> */}
            </li>)
                }

                )}
        </ul>)
}
        </div >
    );
}
export default SidebarHome;
