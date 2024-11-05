import classNames from "classnames/bind";
import styles from "./ContentHome.module.scss";
import icon_under from "~/assets/images/icon_img_main.svg";
import icon_2 from "~/assets/images/icon_2.png";
import icon_3 from "~/assets/images/icon_3.png";
import img_product from "~/assets/images/img_product.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getALLProducts } from "~/services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDataProduct,
  initDataProduct,
} from "~/redux/features/Product/PoductSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast } from "react-toastify";
import { Pagination } from "~/components/Pagination/Pagination";
import Loading from "~/components/Loading/Loading";
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);
function ContentHome() {

    const dispatch = useDispatch();
    const ProductsData = useSelector((state) => state.products.data) || []
    const total = useSelector((state) => state.products.total)
    const currentPage = useSelector((state) => state.products.currentPage)
    const totalPage = useSelector((state) => state.products.totalPage)
    const limit = useSelector((state) => state.products.limit)
    const isloading = useSelector((state) => state.products.loading);
    const isError = useSelector((state) => state.products.error);
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchDataProduct = async () => {
      try {
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await getALLProducts(queryParams);
        dispatch(initDataProduct(response.data));
      } catch (error) {
        if (error.request) {
          dispatch(
            initDataProduct({ error: "không có phản hồi từ server..." })
          );
        }
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    };
    dispatch(clearDataProduct());

    const timeoutId = setTimeout(() => {
      fetchDataProduct();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [optionLimit, dispatch]);
  // Callback function to update limit

  // Callback function to update currentPage
  const handlePageChange = (newPage) => {
    setOptionLimit((prevData) => ({
      ...prevData,
      currentPage: newPage,
    }));
  };
  // Callback function to update limit
  const handleLimitChange = (newlimit) => {
    setOptionLimit((prevData) => ({
      ...prevData,
      limit: newlimit,
      currentPage: 1,
    }));
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("background")}>
        <div className={cx("title")}>ORDER YOUR FAVORITE COFFEE</div>
        <div className={cx("photo")}>
          <div className={cx("photo_1")}>
            {" "}
            <img src={icon_under} />
          </div>
          <div className={cx("photo_2")}>
            {" "}
            <img src={icon_2} />
          </div>
          <div className={cx("photo_3")}>
            {" "}
            <img src={icon_3} />
          </div>
        </div>
      </div>
      <div className={cx("info_product")}>
        <div className={cx("info_product_title")}>Total LavAzza 1320</div>
        {/* <div className={cx('info_product_filter')}>
                <p className={cx('info_product_filter_title')}>filter</p>
                <FontAwesomeIcon icon={faFilter} className={cx('filter')} />
            </div> */}
      </div>

      {isloading ? (
        <div className="h-full w-full flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <ul className={cx("list_product")}>
          {ProductsData &&
            ProductsData.map((item, i) => {
              return (
                <li
                  onClick={() => nagivate(`/product/${item.id}`)}
                  className={cx("item_product")}
                  key={i}
                >
                  <div className={cx("img_product")}>
                    <img src={item.images[0]?.urlImage || img_product} />
                  </div>
                  <div className={cx("name_product")}>{item.name}</div>
                  <div className={cx("lazada")}>{item.description}</div>
                  <div className={cx("img_price")}>
                    {item.productAttributes[0]?.sellPrice || 0}
                  </div>
                </li>
              );
            })}
        </ul>
      )}

      <div className={cx("footer")}>
        {/* <ul className={cx('list_pages')}>
                <li className={cx('number_page')}>
                    <button className={cx('btn_pages')}>1</button>
                </li>
                <li className={cx('number_page')}>
                    <button className={cx('btn_pages')}>2</button>
                </li>
            </ul>
             */}
        <Pagination
          totalItems={total}
          current={currentPage}
          totalPage={totalPage}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </div>
  );
}

export default ContentHome;
