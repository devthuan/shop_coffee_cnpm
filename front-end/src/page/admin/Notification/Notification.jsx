import classNames from "classnames/bind";
import styles from "./Notification.module.scss";
import { NotificationModelCreate } from "./NotificationModelCreate";
import { NotificationModelEdit } from "./NotificationModelEdit";
import { Pagination } from "~/components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteNotificationAPI,
  GetAllNotificationAPI,
} from "~/services/NotificationServer";
import {
  clearDataNotification,
  initDataNotification,
  removeNotification,
} from "~/redux/features/Notifications/NotificationsSilce";
import { HandleApiError } from "~/Utils/HandleApiError";
import Loading from "~/components/Loading/Loading";
import { ToastContainer } from "react-toastify";

const cx = classNames.bind(styles);
export const Notification = () => {
  const dispatch = useDispatch();
  const dataNofication = useSelector((state) => state.notifications.data);
  const isLoading = useSelector((state) => state.notifications.loading);
  const isError = useSelector((state) => state.notifications.error);
  const total = useSelector((state) => state.notifications.total);
  const currentPage = useSelector((state) => state.notifications.currentPage);
  const totalPage = useSelector((state) => state.notifications.totalPage);
  const limit = useSelector((state) => state.notifications.limit);

  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });

  // Array chứa danh sách tiêu đề bảng
  const tableTitles = [
    "ID",
    "Người tạo",
    "Gửi đến",
    "Tiêu đề",
    "Ngày tạo",
    "Ngày cập nhật",
    "Hành động",
  ];

  const listOptionSorts = [
    { value: "createdAt_ASC", label: "sắp xếp theo ngày tạo tăng dần" },
    { value: "createdAt_DESC", label: "sắp xếp theo ngày tạo giảm dần" },
  ];

  const listOptionFilters = [
    {
      value: "all",
      label: "Tất cả",
    },
    {
      value: "filter_type_send_all",
      label: "Lọc theo Gửi đến tất cả",
    },
    {
      value: "filter_type_send_supplier",
      label: "Lọc theo Gửi đến Nhà cung cấp",
    },
    {
      value: "filter_type_send_admin",
      label: "Lọc theo Gửi đến Admin",
    },
    {
      value: "filter_role_support_client",
      label: "Lọc theo quyền Chăm sóc khách hàng",
    },
    {
      value: "filter_role_manage_warehouse",
      label: "Lọc theo quyền Quản lý kho",
    },
    {
      value: "filter_role_staff_sales",
      label: "Lọc theo quyền Nhân viên bán hàng",
    },
    {
      value: "filter_role_staff_manage_product",
      label: "Lọc theo quyền Quản lý sản phẩm",
    },
  ];

  const handlePageChange = (newPage) => {
    setOptionLimit((prevData) => ({
      ...prevData,
      currentPage: newPage,
    }));
  };

  const handleLimitChange = (newLimit) => {
    setOptionLimit((prevData) => ({
      ...prevData,
      limit: newLimit,
      currentPage: 1,
    }));
  };

  const handleSort = async (e) => {
    setSortOption(e);
    fetchNotification(e, filterOption); // Pass both sort and filter options
  };

  const handleFilter = async (e) => {
    setFilterOption(e);
    fetchNotification(sortOption, e); // Pass both sort and filter options
  };

  const handleSearch = async (e) => {
    try {
      let queryParams = `search=${e}&limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
      const result = await GetAllNotificationAPI(queryParams);
      dispatch(initDataNotification(result.data));
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        dispatch(initDataNotification({ error: message }));
      }
    }
  };

  const fetchNotification = async (sortOption, filterOption) => {
    let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;

    if (sortOption === "createdAt_ASC") {
      queryParams += `&sortBy=createdAt&sortOrder=ASC`;
    } else if (sortOption === "createdAt_DESC") {
      queryParams += `&sortBy=createdAt&sortOrder=DESC`;
    }

    const queryParamsMap = {
      all: "",
      filter_type_send_all: "&typeSend=all",
      filter_type_send_supplier: "&typeSend=Nhà cung cấp",
      filter_type_send_admin: "&typeSend=Admin",
      filter_role_support_client: "&typeSend=Chăm sóc khách hàng",
      filter_role_manage_warehouse: "&typeSend=Quản lý kho",
      filter_role_staff_sales: "&typeSend=Nhân viên bán hàng",
      filter_role_staff_manage_product: "&typeSend=Quản lý sản phẩm",
    };

    if (queryParamsMap[filterOption]) {
      queryParams += queryParamsMap[filterOption];
    }

    const result = await GetAllNotificationAPI(queryParams);
    dispatch(initDataNotification(result.data));
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await DeleteNotificationAPI(id);
      if (response && response.status === 200) {
        dispatch(removeNotification({ id }));
        handleDeleteItem(id);
      } else {
        const { message, status } = HandleApiError(response);
        if (status === "error") {
          dispatch(initDataNotification({ error: message }));
        }
      }
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        dispatch(initDataNotification({ error: message }));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call here
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await GetAllNotificationAPI(queryParams);
        if (response.status === 200 && response.data.data) {
          dispatch(initDataNotification(response.data));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initDataNotification({ error: message }));
        }
      }
    };


    setTimeout(() => {
      fetchData();
    }, 800);
  }, [optionLimit.limit, optionLimit.currentPage]);

  return (
    <>
      {isError ? (
        <div className="w-full h-full flex justify-center items-center">
          {isError}
        </div>
      ) : (
        <div className="max-w-full mx-auto px-4 ">
          {/* box title */}
          <div className="w-full flex justify-center py-3">
            <h3 className="text-3xl my-4">Quản lý thông báo</h3>
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
                      onChange={(e) => {
                        handleSort(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
                    >
                      {listOptionSorts.map((item) => {
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
                        placeholder="Tìm kiếm"
                        className="w-72 max-w-md py-2 pl-12 pr-4 text-sm text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                      />
                    </div>
                  </div>

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
                      {listOptionFilters &&
                        listOptionFilters.length > 0 &&
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
                  <NotificationModelCreate />
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
                    {dataNofication &&
                      dataNofication.map((item, idx) => (
                        <tr key={idx}>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item.id.slice(0, 8)} ...
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item?.account?.email}
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item.typeSend === "all" ? "Tất cả" : item.typeSend}
                          </td>

                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item.title}
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleString()}
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {new Date(item.updatedAt).toLocaleString()}
                          </td>
                          <td className="text-right px-6 whitespace-nowrap">
                            <div className="max-w-5 flex justify-center items-center">
                              <p className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <NotificationModelEdit data={item} />
                              </p>
                              <p
                                onClick={() => handleDeleteItem(item.id)}
                                className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer"
                              >
                                Xoá
                              </p>
                            </div>
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
            </>
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
