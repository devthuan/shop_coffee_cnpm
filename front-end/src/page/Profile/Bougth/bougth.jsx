import classNames from "classnames/bind";
import styles from "./bougth.module.scss"
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
import { clearDataBillAccount, initDataBillAccount } from "~/redux/features/BillAccount/billAccountSlice";
import { GetBill_AccountAPI } from "~/services/BillService";


const cx = classNames.bind(styles)
function Bougth() {
  const dispatch = useDispatch();
  const BillAccountData = useSelector((state) => state.billAccount.data) || []
  const total = useSelector((state) => state.billAccount.total)
  const currentPage = useSelector((state) => state.billAccount.currentPage)
  const totalPage = useSelector((state) => state.billAccount.totalPage)
  const limit = useSelector((state) => state.billAccount.limit)
  const isloading = useSelector((state) => state.billAccount.loading);
  const isError = useSelector((state) => state.billAccount.error);
  const img = useSelector((state) => state.billAccount.data?.products?.images) || item_cf;
  const navigate = useNavigate();
 
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchDataBillAccount = async () => {
      try {
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await GetBill_AccountAPI(queryParams);

        dispatch(initDataBillAccount(response.data));
      } catch (error) {
        if (error.request) {
          dispatch(
            initDataBillAccount({ error: "không có phản hồi từ server..." })
          );
        }
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    };
    dispatch(clearDataBillAccount());


    const timeoutId = setTimeout(() => {
      fetchDataBillAccount()
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
          {BillAccountData.map((item, i) => (
            <li className={cx("item_product")}>
              <img src={img} className={cx("item_img")} />
              <div className={cx("item_info")}>
                <div className={cx("info_name")}>
                  {item?.products?.name}
                </div>
                <div className={cx("info_under")}>
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

export default Bougth;