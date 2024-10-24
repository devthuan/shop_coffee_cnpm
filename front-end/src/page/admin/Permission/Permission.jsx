import classNames from "classnames/bind";
import styles from "./Permission.module.scss";

import { useEffect, useMemo, useState } from "react";
import { LockAccountAPI } from "~/services/AccountService";
import { GetAllRole } from "~/services/PermissionService";

import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "~/components/Pagination/Pagination";
import ModelAddAccount from "./ModelAddAccount";
import ModelEditAccount from "./ModelEditRole";
import Loading from "~/components/Loading/Loading";
import { HandleApiError } from "~/Utils/HandleApiError";
import { clearDataRole, initDataRole } from "~/redux/features/Roles/rolesSilce";

const cx = classNames.bind(styles);
export const Permission = () => {
  const dataRole = useSelector((item) => item.roles.data);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.roles?.loading);
  const isError = useSelector((state) => state.roles?.error);
  const total = useSelector((state) => state.roles?.total);
  const currentPage = useSelector((state) => state.roles?.currentPage);
  const totalPage = useSelector((state) => state.roles?.totalPage);
  const limit = useSelector((state) => state.roles?.limit);
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });

  const filterItems = [
    { value: "createdAt_ASC", label: "sắp xếp theo ngày tạo tăng dần" },
    { value: "createdAt_DESC", label: "sắp xếp theo ngày tạo giảm dần" },
    
  ];

  const titleColumn = [
    "Id",
    "Tên role",
    "codeName",
    "Status",
    "updated At",
    "createdAt At",
    "",
  ];

  const handleSearch = async (e) => {
    try {
      let queryParams = `search=${e}&limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
      const result = await GetAllRole(queryParams);

      dispatch(initDataRole(result.data));
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        dispatch(initDataRole({ error: message }));
      }
    }
  };

  const handleSorts = async(e) => {
    let queryParams = "";
    if (e === "createdAt_ASC") {
      queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}&sortBy=createdAt&sortOrder=ASC`;
    } else if (e === "createdAt_DESC") {
      queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}&sortBy=createdAt&sortOrder=DESC`;
    } else if (e === "isActive_true") {
      queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}&isActive=true`;
    } else if (e === "isActive_false") {
      queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}&isActive=false`;
    }
    const result = await GetAllRole(queryParams);
    dispatch(initDataRole(result.data));
  }



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
    const fetchAPI = async () => {
      try {
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await GetAllRole(queryParams);
        if (response && response.data && response.status === 200) {
          dispatch(initDataRole(response.data));
        }
      } catch (error) {
        console.log(error);
         const { message, status } = HandleApiError(error);
         if (status === "error") {
           dispatch(initDataRole({ error: message }));
         }
      }
    };

    dispatch(clearDataRole());


    // if (dataRole.length === 0) {
      setTimeout(() => {
        fetchAPI();
      }, 700);
    // }
  }, [optionLimit.limit, optionLimit.currentPage]);

  return (
    <>
      {isError ? (
        <div className="w-full h-full flex justify-center items-center">
          {isError}
        </div>
      ) : (
        <div className="mx-auto  md:pr-5">
          <div className=" ">
            <div className="flex justify-center mt-4">
              <h3>Quản lý quyền</h3>
            </div>
            <div className="flex justify-between mt-7">
              <div className="flex ">
                <div className="relative w-auto min-w-fit px-5  ">
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
                      handleSorts(e.target.value);
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
                <div className="max-w-xl w-full px-4 mx-auto ">
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
                </div>
              </div>
              <div className="">
                <ModelAddAccount />
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
                  {dataRole &&
                    dataRole.length > 0 &&
                    dataRole?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.codeName}
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
                          {new Date(item.updatedAt).toLocaleString()}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td className=" px-2 py-4 whitespace-nowrap ">
                          <div className="flex">
                            <div>
                              <ModelEditAccount data={item} />
                            </div>
                            {/* <div
                              // onClick={() => handleLockAccount(item)}
                              className="py-2  px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                            >
                              {item.isActive ? "lock" : "unlock"}
                            </div> */}
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
