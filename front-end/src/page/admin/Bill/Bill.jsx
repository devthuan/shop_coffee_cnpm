import classNames from "classnames/bind";
import styles from "./Bill.module.scss";
import { useSelector } from "react-redux";
import Loading from "~/components/Loading/Loading";
import { useEffect, useState } from "react";
import { GetAllBillAPI } from "~/services/BillService";
import { clearDataBill, initDataBill } from "~/redux/features/Bill/billSilice";
import { useDispatch } from "react-redux";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast, ToastContainer } from "react-toastify";
import ModelEditBill from "~/page/admin/Bill/ModelEditBills";
import { Pagination } from "~/components/Pagination/Pagination";
const cx = classNames.bind(styles);
export const Bill = () => {
  const dispatch = useDispatch();

  const BillsData = useSelector((state) => state.bill.data)
  const total = useSelector((state) => state.bill.total)
  const currentPage = useSelector((state) => state.bill.currentPage)
  const totalPage = useSelector((state) => state.bill.totalPage)
  const limit = useSelector((state) => state.bill.limit)

  const isError = useSelector((state) => state.bill.error);
  const isLoading = false;

  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
});

  const filterItems = [
    { value: "createdAt_ASC", label: "sắp xếp theo ngày tạo tăng dần" },
    { value: "createdAt_DESC", label: "sắp xếp theo ngày tạo giảm dần" },
  ];


  
  const titleColumn = [
    "Username",
    "deliverPhone",
    "deliverAddress",
    "total",
    "totalDiscount",
    "totalPayment",
    "status",
    "shippingMethod",
    "createdAt",
    "updatedAt",
    "note",
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
    const fetchDataBill= async () => {
        try {
            let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
            const response = await GetAllBillAPI(queryParams)
            dispatch(initDataBill(response.data))
        } catch (error) {
            if (error.request) {
                dispatch(initDataBill({ error: "không có phản hồi từ server..." }));
            }
            const result = HandleApiError(error);
            result ? toast.error(result) : toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
    }
    dispatch(clearDataBill());

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

  return (
    <>
      {isError ? (
        <div className="w-full h-full flex justify-center items-center">
          {isError}
        </div>
      ) : (
        <div className="mx-auto  md:pr-5">
          <div className=" ">
            <div className="flex justify-center ">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="max-w-xl w-full px-4 mx-auto mt-5"
              >
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
                    className="w-full py-1 pl-12 pr-4 text-[18px] text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </form>
            </div>
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
              <div className="">
                {/* <ModelAddAccount /> */}
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
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.fullName}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.deliverPhone}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.deliverAddress}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.total}
                      </td>
                     
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.totalDiscount}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.totalPayment}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.status}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.shippingMethod}
                      </td>

                      <td className="px-2 py-4 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                      {new Date(item.updatedAt).toLocaleString() || ""}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        {item.note}
                      </td>
                    
                      <td className="px-2 py-4 whitespace-nowrap">
                        <div>
                            <ModelEditBill data={item} />
                          </div>
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
