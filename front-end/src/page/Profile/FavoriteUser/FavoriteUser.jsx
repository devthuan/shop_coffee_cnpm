import classNames from "classnames/bind";
import styles from "./FavoriteUser.module.scss"
import { DelFavoriteUser, getFavoriteUser } from "~/services/FavoriteSevice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearDataFavoriteUser, deleteFavorite, initDataFavoriteUser } from "~/redux/features/FavoriteUser/favoriteUserSlice";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCartShopping, faMinus } from "@fortawesome/free-solid-svg-icons";
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

  console.log(FavoriteUserData)
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

  // xử lí nut xoá item 
  const handleClickDel = async (idProduct) => {
     try {
      const response = await DelFavoriteUser(idProduct)
      if (response) {
        dispatch(deleteFavorite({ id: idProduct }));
        toast.success("Đã xoá sản phẩm khỏi yêu thích");
      }
     } catch (error) {
        const { message, status } = HandleApiError(error);
        console.log(message)
     }
  }

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
          <div className={cx("header_name")}>Danh sách yêu thích</div>
          <div className={cx("header_disc")}>{FavoriteUserData.length} sản phẩm</div>
        </div>

        <ul className={cx("list_product")}>
          {FavoriteUserData.map((item) => (
            <li className={cx("item_product")}>
              <img src={img} className={cx("item_img")} />
              <div className={cx("item_info")}>
                <div className={cx("info_name")}>
                  {item?.products?.name}
                </div>
                <div className={cx("info_under")}>
                {/* <div className={cx("info_price")}>$47.00</div> */}          
                  <div className={cx("info_desc")}>{item?.products?.description}</div>
                </div>
              </div>
            <div className={cx("action_btn")}>
                {/* <button>
                  <FontAwesomeIcon icon={faCartShopping} />
                </button> */}
                <button className={cx("btn_delete")} onClick={()=>handleClickDel(item?.id)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
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
    <ToastContainer
        className="text-base"
        fontSize="10px"
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
  </div>);
}

export default FavoriteUser;