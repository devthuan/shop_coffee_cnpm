import { useSelector } from "react-redux";
import Loading from "~/components/Loading/Loading";
import { useEffect, useState } from "react";
import { GetAllBillAPI } from "~/services/BillService";
import {
  clearDataBill,
  initDataBill,
  initErrorBill,
} from "~/redux/features/Bill/billSilice";
import { useDispatch } from "react-redux";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast, ToastContainer } from "react-toastify";
import { Pagination } from "~/components/Pagination/Pagination";
import { BillDetails } from "./BillDetails";
export const Bill = () => {
  const dispatch = useDispatch();
  const BillsData = useSelector((state) => state.bill.data);
  const total = useSelector((state) => state.bill.total);
  const currentPage = useSelector((state) => state.bill.currentPage);
  const totalPage = useSelector((state) => state.bill.totalPage);
  const limit = useSelector((state) => state.bill.limit);

  const isError = useSelector((state) => state.bill.error);
  const isLoading = false;
  const [showBillDetails, setShowBillDetails] = useState(null);
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });
  const listStatus = {
    pending: "Đang xử lý",
    delivery: "Đang giao hàng",
    success: "Thành công",
    failed: "Thất bại",
    cancelled: "Huỷ",
  };

  const filterItems = [
    { value: "createdAt_ASC", label: "sắp xếp theo ngày tạo tăng dần" },
    { value: "createdAt_DESC", label: "sắp xếp theo ngày tạo giảm dần" },
  ];

  const titleColumn = [
    "id",
    "Người đặt",
    "Số điện thoại nhận hàng",
    "Tổng đơn hàng",
    "Trạng thái",
    "Cập nhật cuối",
    "Ngày đặt",

    "Hành động",
  ];
  const handleFilter = async (e) => {
    if (e === "createdAt_ASC") {
      let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}&sortBy=createdAt&sortOrder=ASC`;
      const result = await GetAllBillAPI(queryParams);
      dispatch(initDataBill(result.data));
    } else if (e === "createdAt_DESC") {
      let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}&sortBy=createdAt&sortOrder=DESC`;
      const result = await GetAllBillAPI(queryParams);
      dispatch(initDataBill(result.data));
    }
  };

  const handleSearch = async (e) => {
    try {
      let queryParams = `search=${e}&limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
      const result = await GetAllBillAPI(queryParams);
      dispatch(initDataBill(result.data));
    } catch (error) {
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  useEffect(() => {
    const fetchDataBill = async () => {
      try {
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await GetAllBillAPI(queryParams);
        dispatch(initDataBill(response.data));
      } catch (error) {
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");

        dispatch(initErrorBill({ error: result.message }));
      }
    };

    const timeoutId = setTimeout(() => {
      fetchDataBill();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [optionLimit, dispatch]);

  // Callback function to update currentPage
  const handlePageChange = (newPage) => {
    setOptionLimit((prevData) => ({
      ...prevData,
      currentPage: newPage,
    }));
  };

  // Callback function to update limit
  const handleLimitChange = (newLimit) => {
    setOptionLimit((prevData) => ({
      ...prevData,
      limit: newLimit,
      currentPage: 1,
    }));
  };

  // show bill details
  const handleClickIDBill = (id) => {
    setShowBillDetails(id);
  };
  const handleToggleBill = (e) => {
    setShowBillDetails(null);
  };

  return (
    <>
      {/* {showBillDetails && (
        <BillDetails
          billsID={showBillDetails}
          handleClickToggle={handleToggleBill}
        />
      )} */}
      {isError ? (
        <div className="w-full h-full flex justify-center items-center">
          {isError}
        </div>
      ) : (
        <div className="mx-auto  md:pr-5">
          <div className="w-full flex justify-center py-3">
            <h3 className="text-3xl my-4">Quản lý đơn hàng</h3>
          </div>
          <div className=" ">
            <div className="flex justify-start gap-x-7 mt-7">
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
                  onChange={(e) => {
                    handleFilter(e.target.value);
                  }}
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
              <div className="max-w-lg">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    onChange={(e) => handleSearch(e.target.value)}
                    type="text"
                    placeholder="Tìm kiếm"
                    className="w-72 max-w-md py-2 pl-12 pr-4 text-sm text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </div>

            </div>
          </div>
          {isLoading ? (
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
                  {BillsData?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-2 py-4 whitespace-nowrap w-[20px] ">
                        {item.id.slice(0, 8)} ...
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.fullName}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.deliverPhone}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.total}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-2 rounded-full font-semibold text-xs ${
                            item.status === "success"
                              ? "text-green-600 bg-green-50"
                              : item.status === "pending"
                              ? "text-yellow-600 bg-yellow-50"
                              : item.status === "delivery"
                              ? "text-blue-400 bg-blue-50"
                              : item.status === "cancelled"
                              ? "text-gray-600 bg-gray-50"
                              : "text-red-600 bg-red-50"
                          }`}
                        >
                          {listStatus[item.status]}
                        </span>
                      </td>

                      <td className="px-2 py-4 whitespace-nowrap">
                        {new Date(item.updatedAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td
                        className="px-2 py-4 whitespace-nowrap text-blue-500 hover:underline cursor-pointer"
                        onClick={() => handleClickIDBill(item.id)}
                      >
                        {/* chi tiết */}
                        <BillDetails data={item} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
      )}
    </>
  );
};
