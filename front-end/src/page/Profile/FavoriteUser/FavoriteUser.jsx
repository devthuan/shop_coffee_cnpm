import classNames from "classnames/bind";
import styles from "./FavoriteUser.module.scss"
import { getFavoriteUser } from "~/services/FavoriteSevice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearDataFavoriteUser, initDataFavoriteUser } from "~/redux/features/FavoriteUser/favoriteUserSlice";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import item_cf from "~/assets/images/item_cf.png"
import { Pagination } from "~/components/Pagination/Pagination";
import Loading from "~/components/Loading/Loading";


const cx = classNames.bind(styles)
function FavoriteUser() {
  
  const dispatch = useDispatch();
  const FavoriteUserData = useSelector((state) => state.favoriteUser.data) || []
  const total = useSelector((state) => state.favoriteUser.total)
  const currentPage = useSelector((state) => state.favoriteUser.currentPage)
  const totalPage = useSelector((state) => state.favoriteUser.totalPage)
  const limit = useSelector((state) => state.favoriteUser.limit)
  const isloading = useSelector((state) => state.favoriteUser.loading);
  const isError = useSelector((state) => state.favoriteUser.error);
  const img = useSelector((state) => state.favoriteUser.data?.products?.images) || item_cf;
  
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });
  
  useEffect(() => {
    const fetchDataFavoriteUser = async () => {
      try {
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await getFavoriteUser(queryParams);

        dispatch(initDataFavoriteUser(response.data));
      } catch (error) {
        if (error.request) {
          dispatch(
            initDataFavoriteUser({ error: "không có phản hồi từ server..." })
          );
        }
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    };
    dispatch(clearDataFavoriteUser());


    const timeoutId = setTimeout(() => {
      fetchDataFavoriteUser()
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

  return (<div className={cx("wrapper")}>
    {isloading ? (<div className="h-full w-full flex justify-center items-center">
      <Loading />
    </div>) : (
      <div className={cx("container")}>
        <div className={cx("header_title")}>
          <Link to="/profile">
            <div className={cx("title")}>
              <FontAwesomeIcon icon={faArrowLeft} className={cx("btn_gear")} />
            </div>
          </Link>
          <div className={cx("header_name")}>Lists</div>
          <div className={cx("header_disc")}>2 items - Primary</div>
        </div>

        <ul className={cx("list_product")}>
          {FavoriteUserData.map((item, i) => (
            <li className={cx("item_product")}>
              <img src={img} className={cx("item_img")} />
              <div className={cx("item_info")}>
                <div className={cx("info_name")}>
                  {item?.products?.name}
                </div>
                <div className={cx("info_under")}>
                  {/* <div className={cx("info_price")}>$47.00</div>
                <button className={cx("add_to_card")}>Add to cart</button> */}
                  <div className={cx("info_desc")}>{item?.products?.description}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
    <div className={cx("footer")}>
      <Pagination
        totalItems={total}
        current={currentPage}
        totalPage={totalPage}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  </div>);
}

export default FavoriteUser;