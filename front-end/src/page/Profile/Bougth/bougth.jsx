import classNames from "classnames/bind";
import styles from "./bougth.module.scss"
import { getFavoriteUser } from "~/services/FavoriteSevice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
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
import BillDetails from "~/page/Profile/Bougth/BillDetails";


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
  const [showBillDetails, setShowBillDetails] = useState(null);
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

  const filterItems = [
    { value: "createdAt_ASC", label: "sắp xếp theo ngày tạo tăng dần" },
    { value: "createdAt_DESC", label: "sắp xếp theo ngày tạo giảm dần" },
  ];

  const titleColumn = [
    "tên người nhận",
    "giá thanh toán",
    "trạng thái",
    "ngày mua",
    "note",
    "hành động"
  ];
  const handleToggleDetail = (id) => {
    setShowBillDetails(id)
  }


  const handleToggleBill = (e) => {
    setShowBillDetails(null);
  };


  return (<div className={cx("wrapper")}>
    {showBillDetails && (
      <BillDetails
        billsID={showBillDetails}
        handleClickToggle={handleToggleBill}
      />
    )}
    {isloading ? (<div className="h-full w-full flex justify-center items-center">
      <Loading />
    </div>) : (

      <div className={cx("container")}>
        <div className="mx-auto  md:pr-5">
          <div className=" ">
            <div className="flex justify-between mt-7">
              <div className="relative w-72 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-400 right-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <select
                  className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
                >
                  {filterItems &&
                    filterItems.length > 0 &&
                    filterItems.map((item) => {
                      return (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>
          {isloading ? (
            <div className="h-full w-full flex justify-center items-center">
              <Loading />
            </div>
          ) : (
            <div className="mt-5 shadow-sm border rounded-lg overflow-x-auto">
              <table className="w-full table-auto text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                  <tr>
                    {titleColumn &&
                      titleColumn.length > 0 &&
                      titleColumn.map((item) => {
                        return (
                          <th key={item} className="py-3 px-2">
                            {item}
                          </th>
                        );
                      })}
                  </tr>
                </thead>

                <tbody className="text-gray-600 divide-y">
                  {BillAccountData?.map((item, idx) => (
                    <tr key={idx}>

                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.fullName}
                      </td>

                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.totalPayment}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-2 rounded-full font-semibold text-xs ${item.status === "success"
                            ? "text-green-600 bg-green-50"
                            : item.status === "pending"
                              ? "text-yellow-600 bg-yellow-50"
                              : item.status === "delivery"
                                ? "text-orange-400 bg-red-50"
                                : "text-red-600 bg-red-50"
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.createdAt}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.note}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-blue-500 hover:underline cursor-pointer" onClick={() => handleToggleDetail(item.id)}>
                        chi tiết
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>



        <div className={cx("footer")}>
          <Pagination
            totalItems={total}
            current={currentPage}
            totalPage={totalPage}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
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
        </div>
      </div>
    )}
  </div>);
}

export default Bougth;