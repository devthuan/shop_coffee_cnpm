import classNames from "classnames/bind";
import styles from "./Account.module.scss";
import { useEffect, useState } from "react";
import { GetAllAccountAPI } from "~/services/AuthService";
import { initDataAccount } from "~/redux/features/Accounts/accountsSilce";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "~/components/Pagination/Pagination";
import ModelAddAccount from "./ModelAddAccount";

const cx = classNames.bind(styles);
export const Account = () => {
  const dispatch = useDispatch();
  const accountsData = useSelector((state) => state.accounts.data);
  const total = useSelector((state) => state.accounts.total);
  const currentPage = useSelector((state) => state.accounts.currentPage);
  const totalPage = useSelector((state) => state.accounts.totalPage);
  const limit = useSelector((state) => state.accounts.limit);
  const [search, setSearch] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });

  const filterItems = [
    { value: "sắp xếp theo ngày tạo", label: "sắp xếp theo ngày tạo" },
    { value: "Product designer", label: "Product designer" },
    { value: "Front-end developer", label: "Front-end developer" },
    { value: "Laravel engineer", label: "Laravel engineer" },
    { value: "Open source manager", label: "Open source manager" },
  ];

  const titleColumn = [
    "Username",
    "Balance",
    "IP",
    "Type Login",
    "Status",
    "Role",
    "Created At",
    "Last login",
    "",
  ];

  const handleSearch = async (e) => {
    try {
      const result = await GetAllAccountAPI("search=" + e);
      console.log(result.data.data);
      setSearch(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

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
      currentPage: 1, // reset to first page when limit changes
    }));
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
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, optionLimit.limit, optionLimit.currentPage]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
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
          <div className="relative w-52 ">
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
            
              <ModelAddAccount />
          </div>
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
            {search
              ? search?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="flex items-center gap-x-3 py-3 px-2 whitespace-nowrap">
                      <img
                        src={
                          item.userInformation[0]?.avatar
                            ? item.userInformation[0]?.avatar
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
                    <td className="px-2 py-4 whitespace-nowrap">{item.ip}</td>
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
                    <td className="text-right px-2 whitespace-nowrap">
                      <a
                        href="#"
                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                      >
                        Edit
                      </a>
                      <button
                        href="#"
                        className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                      >
                        Lock
                      </button>
                    </td>
                  </tr>
                ))
              : accountsData?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="flex items-center gap-x-3 py-3 px-2 whitespace-nowrap">
                      <img
                        src={
                          item.userInformation[0]?.avatar
                            ? item.userInformation[0]?.avatar
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
                    <td className="px-2 py-4 whitespace-nowrap">{item.ip}</td>
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
                    <td className="text-right px-2 whitespace-nowrap">
                      <a
                        href="#"
                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                      >
                        Edit
                      </a>
                      <button
                        href="#"
                        className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                      >
                        Lock
                      </button>
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

      {/* {isOpenModal ?  : ""} */}
    </div>
  );
};
