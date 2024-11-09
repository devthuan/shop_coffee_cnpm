import classNames from "classnames/bind";
import styles from "./Supplier.module.scss";
import {
  SupplierModelCreate,
  TemplateModelCreate,
} from "./SupplierModelCreate";
import { SupplierModelEdit, TemplateModelEdit } from "./SupplierModelEdit";
import { Pagination } from "~/components/Pagination/Pagination";
import { useEffect, useState } from "react";
import {
  DeleteSupplierAPI,
  GetAllSupplierAPI,
} from "~/services/SupplierService";
import {
  initDataSupplier,
  removeSupplier,
} from "~/redux/features/Suppliers/suppliersSlice";
import { useDispatch, useSelector } from "react-redux";
import { HandleApiError } from "~/Utils/HandleApiError";
import { toast, ToastContainer } from "react-toastify";
import Loading from "~/components/Loading/Loading";

const cx = classNames.bind(styles);
export const Supplier = () => {
  const dispatch = useDispatch();
  const dataSupplier = useSelector((state) => state.suppliers.data);
  const isLoading = useSelector((state) => state.suppliers.loading);
  const isError = useSelector((state) => state.suppliers.error);
  const total = useSelector((state) => state.suppliers.total);
  const currentPage = useSelector((state) => state.suppliers.currentPage);
  const totalPage = useSelector((state) => state.suppliers.totalPage);
  const limit = useSelector((state) => state.suppliers.limit);

  // Array chứa danh sách tiêu đề bảng
  const tableTitles = [
    "ID",
    "Tên nhà cung cấp",
    "Email",
    "Địa chỉ",
    "Số điện thoại",
    "Số sản phẩm",
    "Ngày tạo",
    "Hành động",
  ];

  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });
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

  const listOptionSorts = [
    { value: "createdAt_ASC", label: "sắp xếp theo ngày tạo tăng dần" },
    { value: "createdAt_DESC", label: "sắp xếp theo ngày tạo giảm dần" },
  ];

  const handleSort = async (e) => {
    setSortOption(e);
    fetchNotification(e, filterOption); // Pass both sort and filter options
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

    const result = await GetAllSupplierAPI(queryParams);
    dispatch(initDataSupplier(result.data));
  };

  const handleSearch = async (e) => {
    try {
      let queryParams = `search=${e}&limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
      const result = await GetAllSupplierAPI(queryParams);
      dispatch(initDataSupplier(result.data));
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        dispatch(initDataSupplier({ error: message }));
      }
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await DeleteSupplierAPI(id);
      if (response && response.status === 200) {
        dispatch(removeSupplier({ id }));
        toast.success("Xoá nhà cung cấp thành công");
      } else {
        const { message, status } = HandleApiError(response);
        if (status === "error") {
          dispatch(initDataSupplier({ error: message }));
        }
      }
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        dispatch(initDataSupplier({ error: message }));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call here
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await GetAllSupplierAPI(queryParams);
        if (response.status === 200 && response.data.data) {
          dispatch(initDataSupplier(response.data));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initDataSupplier({ error: message }));
        }
      }
    };

    setTimeout(() => {
      fetchData();
    }, 300);
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
            <h3 className="text-3xl my-4">Quản lý nhà cung cấp</h3>
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
                  {/* box filter */}
                  <div className="relative  w-60 max-w-full ">
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
                </div>

                {/* box button create */}
                <div className="mt-3 md:mt-0">
                  {/* import modal create */}
                  <SupplierModelCreate />
                </div>
              </div>

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
                    {dataSupplier &&
                      dataSupplier.map((item) => (
                        <tr key={item.id}>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item.id.slice(0, 8)} ...
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item.name}
                          </td>

                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item.email}
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item.address}
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item.phone}
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {item.detailSupplier.length}
                          </td>
                          <td className="pr-6 py-4 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleString()}
                          </td>
                          <td className="text-right px-6 whitespace-nowrap">
                            <div className="max-w-5 flex justify-center items-center">
                              <p className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <SupplierModelEdit data={item} />
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
        </div>
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
    </>
  );
};
