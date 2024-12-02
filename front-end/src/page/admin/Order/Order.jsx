import { TemplateModelCreate } from "./TemplateModelCreate";
import { OrderModelEdit } from "./OrderModelEdit";
import { Pagination } from "~/components/Pagination/Pagination";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBillAPI } from "~/services/BillService";
import { HandleApiError } from "~/Utils/HandleApiError";
import { initDataBill } from "~/redux/features/Bill/billSilice";

export const Order = () => {
  const dispatch = useDispatch();
  const dataRedux = useSelector((state) => state.bill.data);
  const BillsData = dataRedux.filter((item) => item.status === "pending");
  const total = useSelector((state) => state.bill.total);
  const currentPage = useSelector((state) => state.bill.currentPage);
  const totalPage = useSelector((state) => state.bill.totalPage);
  const limit = useSelector((state) => state.bill.limit);

  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });

  // biến chứa danh sách nội dung của bảng
  const tableItems = [
    {
      name: "Solo learn app",
      date: "Oct 9, 2023",
      status: "Active",
      price: "$35.000",
      plan: "Monthly subscription",
    },
    {
      name: "Window wrapper",
      date: "Oct 12, 2023",
      status: "Active",
      price: "$12.000",
      plan: "Monthly subscription",
    },
    {
      name: "Unity loroin",
      date: "Oct 22, 2023",
      status: "Archived",
      price: "$20.000",
      plan: "Annually subscription",
    },
    {
      name: "Background remover",
      date: "Jan 5, 2023",
      status: "Active",
      price: "$5.000",
      plan: "Monthly subscription",
    },
    {
      name: "Colon tiger",
      date: "Jan 6, 2023",
      status: "Active",
      price: "$9.000",
      plan: "Annually subscription",
    },
  ];
  // Array chứa danh sách tiêu đề bảng
  const tableTitles = [
    "id",
    "Họ và tên",
    "SĐT",
    "Tổng hoá đơn",
    "Trạng thái",
    "Ngày đặt hàng",
    "Hành động",
  ];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call here
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await GetAllBillAPI(queryParams);
        if (response.status === 200 && response.data.data) {
          dispatch(initDataBill(response.data));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initDataBill({ error: message }));
        }
      }
    };

    setTimeout(() => {
      fetchData();
    }, 800);
  }, [optionLimit.limit, optionLimit.currentPage]);

  return (
    <div className="max-w-full mx-auto px-4 ">
      {/* box title */}
      <div className="w-full flex justify-center py-3">
        <h3 className="text-3xl my-4">Quản lý đơn hàng</h3>
      </div>

      {/* box button  */}
      <div className="flex items-start justify-between ">
        <div className="flex gap-x-3">
          {/* box filter */}
          <div className="relative w-52 max-w-full ">
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
            <select className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
              <option>Project manager</option>
              <option>Software engineer</option>
              <option>IT manager</option>
              <option>UI / UX designer</option>
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
                type="text"
                placeholder="Search"
                className="w-72 max-w-md py-2 pl-12 pr-4 text-sm text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
              />
            </div>
          </div>
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
            {BillsData?.map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 py-4 whitespace-nowrap w-[20px] ">
                  {item.id.slice(0, 8)} ...
                </td>
                <td className="px-2 py-4 whitespace-nowrap">{item.fullName}</td>
                <td className="px-2 py-4 whitespace-nowrap">
                  {item.deliverPhone}
                </td>
                <td className="px-2 py-4 whitespace-nowrap">{item.total}</td>
                <td className="px-2 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-2 rounded-full font-semibold text-xs ${
                      item.status === "success"
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
                <td className="pr-6 py-4 whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleString()}
                </td>

                <td
                  className="px-2 py-4 whitespace-nowrap text-blue-500 hover:underline cursor-pointer"
                  // onClick={() => handleClickIDBill(item.id)}
                >
                  <OrderModelEdit data={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  );
};
