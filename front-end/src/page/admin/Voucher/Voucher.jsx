import classNames from "classnames/bind";
import styles from "./Voucher.module.scss";
import { useEffect, useMemo, useState } from "react";
import {
  DeleteVoucher,
  GetVoucherByQuery,
  UpdateVoucher
} from "~/services/VoucherService";
import {
  clearDataVoucher,
  initDataVoucher,
  initErrorVoucher,
  removeVoucher,
  updateStatusVoucher
} from "~/redux/features/Vouchers/voucherSlice";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "~/components/Pagination/Pagination";
import ModelAddVoucher from "./ModelAddVoucher";
import ModelEditVoucher from "./ModelEditVoucher";
import Loading from "~/components/Loading/Loading";
import { HandleApiError } from "~/Utils/HandleApiError";

const cx = classNames.bind(styles);
export const Voucher = () => {
  const dispatch = useDispatch();
  const vouchersData = useSelector((state) => state.vouchers.data);
  const isLoading = useSelector((state) => state.vouchers.loading);
  const isError = useSelector((state) => state.vouchers.error);
  const total = useSelector((state) => state.vouchers.total);
  const currentPage = useSelector((state) => state.vouchers.currentPage);
  const totalPage = useSelector((state) => state.vouchers.totalPage);
  const limit = useSelector((state) => state.vouchers.limit);
  const isActive = useSelector((state) => state.vouchers.isActive);

  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const listOptionSorts = [
    {
      value: "createdAt_ASC",
      label: "Sắp xếp theo ngày tạo tăng dần"
    },
    {
      value: "createdAt_DESC",
      label: "Sắp xếp theo ngày tạo giảm dần"
    },

  ];
  const listOptionFilters = [
    {
      value: "filter_status_active",
      label: "Lọc theo trạng thái Còn hạn",
    },
    {
      value: "filter_status_expire",
      label: "Lọc theo trạng thái Hết hạn",
    },
  ];
  const titleColumn = [
    "Tên",
    "Mã",
    "Giá trị",
    "Số Lượng",
    "Mô tả",
    "Ngày bắt đầu",
    "Ngày kết thức",
    "Trạng thái",
    "Hành Động",
  ];
  const handleSearch = async (e) => {
    try {
      let queryParams = `search=${e}&limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
      const result = await GetVoucherByQuery(queryParams);
      dispatch(initDataVoucher(result.data));
    } catch (error) {
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };
  const handleDeleteVoucher = async (voucher) => {
    try {
      // Gọi API để xóa voucher
      const response = await DeleteVoucher(voucher.id);
      console.log(response); // Ghi nhật ký phản hồi từ API

      // Kiểm tra phản hồi từ API
      if (response && response.status === 200) {
        const { statusCode, status, message } = response.data;
        // Cập nhật danh sách voucher trong Redux để loại bỏ voucher
        dispatch(removeVoucher(voucher.id)); // Sử dụng action removeVoucher đã định nghĩa
        // Hiển thị thông báo thành công
        toast.success(message);
      }
    } catch (error) {
      console.log("Lỗi khi gọi API:", error);
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
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
      currentPage: 1,
    }));
  };
  const handleSort = async (e) => {
    setSortOption(e);
    fetchVouchers(e, filterOption); // Pass both sort and filter options
  };
  const handleFilter = async (e) => {
    setFilterOption(e);
    fetchVouchers(sortOption, e); // Pass both sort and filter options
  };
  const fetchVouchers = async (sortOption, filterOption) => {
    let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
    const sortOptionsMap = {
      createdAt_ASC: "&sortBy=createdAt&sortOrder=ASC",
      createdAt_DESC: "&sortBy=createdAt&sortOrder=DESC",
    };
    const filterOptionsMap = {
      all: "", // Tất cả các voucher
      filter_status_active: `&endDate[gte]=${new Date().toISOString()}`, // Voucher còn hạn
      filter_status_expired: `&endDate[lte]=${new Date().toISOString()}`, // Voucher hết hạn
    };
    const queryParamsx = [];  // Dùng mảng để thêm các tham số query một cách linh hoạt

    // Thêm các tham số lọc và sắp xếp vào queryParams
    if (sortOptionsMap[sortOption]) {
      queryParamsx.push(sortOptionsMap[sortOption]);
    }

    if (filterOptionsMap[filterOption]) {
      queryParamsx.push(filterOptionsMap[filterOption]);
    }

    // Kết nối các tham số query thành chuỗi
    const finalQueryParams = queryParamsx.join("&");

    console.log("Query Params: ", finalQueryParams);

    try {
      const result = await GetVoucherByQuery(finalQueryParams);
      dispatch(initDataVoucher(result.data));  // Lưu dữ liệu voucher vào state
    } catch (error) {
      // Xử lý lỗi
      console.error("Error fetching vouchers:", error.response ? error.response.data : error.message);
    }
  };  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call here
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await GetVoucherByQuery(queryParams);
        if (response && response.status === 200) {
          const { statusCode, status, message } = response.data;
          // Cập nhật danh sách voucher trong Redux để loại bỏ voucher
          dispatch(initDataVoucher(response.data));
          // Hiển thị thông báo thành công
        }
        // if (response.status === 200 && response.data.data) {
        //   dispatch(initDataVoucher(response.data));
        // }
      } catch (error) {
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");

          dispatch(initErrorVoucher({ error: result.message }));
      }
    };
    dispatch(clearDataVoucher());
    setTimeout(() => {
      fetchData();
    }, 500);
  }, [optionLimit.limit, optionLimit.currentPage]);
  return (
    <>
      {isError ? (
        <div className="w-full h-full flex justify-center items-center">
          {isError}
        </div>
      ) : (
        <div className="mx-auto  md:pr-5">
          <h3 className="w-full text-center mt-3">Quản lý Voucher </h3>
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
                  <ModelAddVoucher />
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
                    {vouchersData?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.value}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item.description}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {new Date(item.startDate).toLocaleString()}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {new Date(item.endDate).toLocaleString()}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap ">
                          <span
                            className={`px-3 py-2 rounded-full font-semibold text-xs ${new Date(item.endDate) > new Date()
                              ? "text-green-600 bg-green-50"
                              : "text-red-600 bg-red-50"
                              }`}
                          >
                            {new Date(item.endDate) > new Date() ? "Còn hạn" : "Hết hạn"}
                          </span>
                        </td>
                        <td className=" px-2 py-4 whitespace-nowrap ">
                          <div className="flex">
                            <div>
                              <ModelEditVoucher data={item}
                              />
                            </div>
                            <div
                              onClick={() => handleDeleteVoucher(item)}
                              className="py-2 px-3 font-medium text-blue-600 hover:text-blue-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >
                              Xóa
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
