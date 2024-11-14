import classNames from "classnames/bind";
import styles from "./Account.module.scss";
import { useEffect, useMemo, useState } from "react";
import { GetAllAccountAPI, LockAccountAPI } from "~/services/AccountService";
import {
  clearDataAccount,
  initDataAccount,
  updateStatusAccount,
} from "~/redux/features/Accounts/accountsSilce";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "~/components/Pagination/Pagination";
import ModelAddAccount from "./ModelAddAccount";
import ModelEditAccount from "./ModelEditAccount";
import Loading from "~/components/Loading/Loading";
import { HandleApiError } from "~/Utils/HandleApiError";
import { ProtectRoutesByRole } from "~/router/ProtectRoutesAdmin";

const cx = classNames.bind(styles);
export const Account = () => {
  const dispatch = useDispatch();
  const accountsData = useSelector((state) => state.accounts.data);
  const isLoading = useSelector((state) => state.accounts.loading);
  const isError = useSelector((state) => state.accounts.error);
  const total = useSelector((state) => state.accounts.total);
  const currentPage = useSelector((state) => state.accounts.currentPage);
  const totalPage = useSelector((state) => state.accounts.totalPage);
  const limit = useSelector((state) => state.accounts.limit);
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");

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
      value: "filter_status_active",
      label: "Lọc theo status active",
    },
    {
      value: "filter_status_blocked",
      label: "Lọc theo status block",
    },
    {
      value: "filter_role_admin",
      label: "Lọc theo quyền admin",
    },
    {
      value: "filter_role_user",
      label: "Lọc theo quyền người dùng",
    },
  ];

  const titleColumn = [
    "Tài khoản",
    "Số dư",
    "IP",
    "Đăng nhập",
    "Trạng thái",
    "Quyền",
    "ngày tạo",
    "Đăng nhập cuối",
    "Hành động",
  ];
  const handleSearch = async (e) => {
    try {
      let queryParams = `search=${e}&limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
      const result = await GetAllAccountAPI(queryParams);
      dispatch(initDataAccount(result.data));
    } catch (error) {
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleLockAccount = async (account) => {
    try {
      const response = await LockAccountAPI(account.id);
      console.log(response);
      if (response && response.data) {
        const { statusCode, status, message } = response.data;
        if (statusCode === 200) {
          // update data in redux
          dispatch(
            updateStatusAccount({
              id: account.id,
              status: !account.isActive,
            })
          );
          toast.success(message);
        }
      }
    } catch (error) {
      console.log(error);
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

  const handleLimitChange = (newLimit) => {
    setOptionLimit((prevData) => ({
      ...prevData,
      limit: newLimit,
      currentPage: 1,
    }));
  };

  const handleSort = async (e) => {
    setSortOption(e);
    fetchAccounts(e, filterOption); // Pass both sort and filter options
  };

  const handleFilter = async (e) => {
    setFilterOption(e);
    fetchAccounts(sortOption, e); // Pass both sort and filter options
  };

  const fetchAccounts = async (sortOption, filterOption) => {
    let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;

    const sortOptionsMap = {
      createdAt_ASC: "&sortBy=createdAt&sortOrder=ASC",
      createdAt_DESC: "&sortBy=createdAt&sortOrder=DESC",
    };

    const filterOptionsMap = {
      all: "",
      isActive_true: "&isActive=true",
      filter_status_active: "&isActive=true",
      isActive_false: "&isActive=false",
      filter_status_blocked: "&isActive=false",
      filter_role_admin: "&role=ADMIN",
      filter_role_user: "&role=USER",
    };
    if (sortOptionsMap[sortOption]) {
      queryParams += sortOptionsMap[sortOption];
    }

    if (filterOptionsMap[filterOption]) {
      queryParams += filterOptionsMap[filterOption];
    }
    const result = await GetAllAccountAPI(queryParams);
    dispatch(initDataAccount(result.data));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call here
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await GetAllAccountAPI(queryParams);
        if (response.status === 200 && response.data.data) {
          dispatch(initDataAccount(response.data));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initDataAccount({ error: message }));
        }
      }
    };

    dispatch(clearDataAccount());

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
        <div className="mx-auto  md:pr-5">
          <h3 className="w-full text-center mt-3">Quản lý tài khoản </h3>

          {isLoading ? (
            // absolute inset-0 flex justify-center items-center
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end mt-7">
                <div className="flex justify-start items-end">
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
                        handleSort(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
                    >
                      {listOptionSorts &&
                        listOptionSorts.length > 0 &&
                        listOptionSorts.map((item) => {
                          return (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  <div className=" ">
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
                          placeholder="Tìm kiếm ..."
                          className="w-full py-1 pl-12 pr-4 text-[18px] text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                        />
                      </div>
                    </form>
                  </div>

                  <div className="relative w-50 ">
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

                <div className="">
                  <ModelAddAccount />
                </div>
              </div>

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
                    {accountsData?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="flex items-center gap-x-3 py-3 px-2 whitespace-nowrap">
                          <img
                            src={
                              item.userInformation?.avatar
                                ? item.userInformation?.avatar
                                : "https://randomuser.me/api/portraits/men/86.jpg"
                            }
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <span className="block text-gray-700 text-sm font-medium">
                              {item.userName}
                            </span>
                            <span className="block text-gray-700 text-xs">
                              {item.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.balance}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.ip}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.typeLogin}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap ">
                          <span
                            className={`px-3 py-2 rounded-full font-semibold text-xs ${
                              item.isActive
                                ? "text-green-600 bg-green-50"
                                : "text-red-600 bg-red-50"
                            }`}
                          >
                            {item.isActive ? "active" : "blocked"}
                          </span>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.role.name}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {new Date(item.lastLogin).toLocaleString()}
                        </td>
                        <td className=" px-2 py-4 whitespace-nowrap ">
                          <div className="flex">
                            <div>
                              <ProtectRoutesByRole
                                requiredPermission={"UPDATE_ACCOUNT"}
                                children={<ModelEditAccount data={item} />}
                              />
                            </div>
                            <div
                              onClick={() => handleLockAccount(item)}
                              className="py-2  px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >
                              {item.isActive ? "khoá" : "mở"}
                            </div>
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
