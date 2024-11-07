import classNames from "classnames/bind";
import styles from "./Receipt.module.scss";
import { ReceiptModalCreate } from "./ReceiptModalCreate";
import { ReceiptModelEdit, TemplateModelEdit } from "./ReceiptModelEdit";
import { Pagination } from "~/components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDataReceipt,
  initDataDetail,
  initDataReceipt,
} from "~/redux/features/Receipts/receiptsSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
import {
  GetAllReceiptAPI,
  GetDetailReceiptAPI,
} from "~/services/ReceiptServer";
import { toast, ToastContainer } from "react-toastify";
import Loading from "~/components/Loading/Loading";

import { GetAllDiscount, DeleteDiscount } from "~/services/DiscountService";
import { initDataDiscount, deleteDiscount } from "~/redux/features/Discounts/discountsSlice";

// import { GetAllReceipt } from "~/services/ReceiptService";
// import { initDataReceipt } from "~/redux/features/Receipts/receiptsSlice";
// const cx = classNames.bind(styles);
// import { GetAllReceipt } from "~/services/ReceiptService";

const cx = classNames.bind(styles);
export const Receipt = () => {
  const dispatch = useDispatch();
  const dataImportReceipts = useSelector((state) => state.receipts.data);
  const isLoading = useSelector((state) => state.receipts.loading);
  const isError = useSelector((state) => state.receipts.error);
  const total = useSelector((state) => state.receipts.total);
  const currentPage = useSelector((state) => state.receipts.currentPage);
  const totalPage = useSelector((state) => state.receipts.totalPage);
  const limit = useSelector((state) => state.receipts.limit);
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const listOptionSorts = [
    { value: "createdAt_ASC", label: "sắp xếp theo ngày tạo tăng dần" },
    { value: "createdAt_DESC", label: "sắp xếp theo ngày tạo giảm dần" },
    { value: "total_ASC", label: "sắp xếp tổng giá trị tăng dần" },
    { value: "total_DESC", label: "sắp xếp tổng giá trị giảm dần" },
  ];
  const listOptionFilters = [
    {
      value: "all",
      label: "Tất cả",
    },
    {
      value: "filter_pending",
      label: "Lọc theo trạng thái pending",
    },
    {
      value: "filter_approved",
      label: "Lọc theo trạng thái approved",
    },
    {
      value: "filter_rejected",
      label: "Lọc theo trạng thái rejected",
    },
  ];

  const fetchReceipt = async () => {
    try {
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;

        if (sortOption === "createdAt_ASC") {
          queryParams += `&sortBy=createdAt&sortOrder=ASC`;
        } else if (sortOption === "createdAt_DESC") {
          queryParams += `&sortBy=createdAt&sortOrder=DESC`;
        } else if (sortOption === "total_ASC") {
          queryParams += `&sortBy=totalAmount&sortOrder=ASC`;
        } else if (sortOption === "total_DESC") {
          queryParams += `&sortBy=totalAmount&sortOrder=DESC`;
        }

        if (filterOption === "filter_pending") {
          queryParams += `&status=pending`;
        } else if (filterOption === "filter_approved") {
          queryParams += `&status=approved`;
        } else if (filterOption === "filter_rejected") {
          queryParams += `&status=rejected`;
        } else if (filterOption === "all") {
          queryParams += ``;
        }

        const result = await GetAllReceiptAPI(queryParams);
        dispatch(initDataReceipt(result.data));
    } catch (error) {
       const result = HandleApiError(error);
       result
         ? toast.error(result)
         : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  
  };

  const handleFilter = (e) => {
    setFilterOption(e);
  };

  const handleSort = (e) => {
    setSortOption(e);
  };

  const handleSearch = async (e) => {
    try {
      let queryParams = `search=${e}&limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
      const result = await GetAllReceiptAPI(queryParams);

      dispatch(initDataReceipt(result.data));
    } catch (error) {
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

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

  useEffect(() => {
    dispatch(clearDataReceipt());
    setTimeout(() => {
      fetchReceipt();
    }, 800);
 
  }, [sortOption, filterOption, optionLimit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await GetAllReceiptAPI(queryParams);
        if (response.data && response.status === 200) {
          dispatch(initDataReceipt(response.data));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initDataReceipt({ error: message }));
        }
      }
    };

    setTimeout(() => {
      fetchData();
    }, 800);
  }, [optionLimit.limit, optionLimit.currentPage]);

  // Array chứa danh sách tiêu đề bảng
  const tableTitles = [
    "ID",
    "Người tạo",
    "Nhà cung cấp",
    "Tổng",
    "Trạng thái",
    "Ngày tạo",
    "Hành động",
  ];

  return (
    <>
      {isError ? (
        <div className="relative w-full h-full flex justify-center items-center">
          {isError}
        </div>
      ) : (
        <div className="max-w-full mx-auto px-4 ">
          {/* box title */}
          <div className="w-full flex justify-center py-3">
            <h3 className="text-3xl my-4">Quản lý phiếu nhập</h3>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : (
            <>
              {/* box button  */}
              <div className="flex items-start justify-between ">
                <div className="flex gap-x-3">
                  {/* box sort */}
                  <div className="relative w-60 max-w-full ">
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
                      onChange={(e) => handleSort(e.target.value)}
                      value={sortOption}
                      className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
                    >
                      {listOptionSorts &&
                        listOptionSorts.map((item) => {
                          return (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  {/* box input search */}
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
                        placeholder="Search"
                        className="w-72 max-w-md py-2 pl-12 pr-4 text-sm text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                      />
                    </div>
                  </div>
                  {/* box filter */}
                  <div className="relative w-60 max-w-full ">
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
                      onChange={(e) => handleFilter(e.target.value)}
                      value={filterOption}
                      className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
                    >
                      {listOptionFilters &&
                        listOptionFilters.map((item) => {
                          return (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>

                {/* box button create */}
                <div className="mt-3 md:mt-0">
                  {/* import modal create */}
                  <ReceiptModalCreate />
                </div>
              </div>

              {/* Table */}
              <div className="mt-4  h-max overflow-auto">
                <table className="w-full table-auto text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      {tableTitles &&
                        tableTitles.length > 0 &&
                        tableTitles.map((item, index) => {
                          return (
                            <th key={index} className="py-3 pr-6">
                              {item}
                            </th>
                          );
                        })}
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 divide-y">
                    {dataImportReceipts &&
                      dataImportReceipts.map((item, idx) => (
                        <tr key={idx}>
                          <td className="pr-6 py-4 whitespace-nowrap ">
                            {item.id.slice(0, 8)} ...
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item?.account?.email}
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item?.supplier?.name}
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item.totalAmount}
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-2 rounded-full font-semibold text-xs ${
                                item.status === "approved"
                                  ? "text-green-600 bg-green-50"
                                  : item.status === "pending"
                                  ? "text-yellow-600 bg-yellow-50"
                                  : "text-red-600 bg-red-50"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleString()}
                          </td>
                          <td className="text-right px-6 whitespace-nowrap">
                            <div className="max-w-5 flex justify-center items-center">
                              <p className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <ReceiptModelEdit data={item} />
                              </p>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {isLoading ? (
            ""
          ) : (
            <Pagination
              totalItems={total}
              current={currentPage}
              totalPage={totalPage}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}

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
