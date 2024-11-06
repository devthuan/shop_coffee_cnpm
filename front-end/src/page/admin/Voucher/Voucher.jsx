import classNames from "classnames/bind";
import styles from "./Voucher.module.scss";
import { useEffect, useMemo, useState } from "react";
import { GetAllVoucher, GetVoucherById, RecoverVoucher, UseVoucher, DeleteVoucher } from "~/services/VoucherService";
import {
  clearDataVoucher,
  initDataVoucher,
  updateStatusVoucher,
  removeVoucher,
  setLoading,
  updateVoucher,
  deleteVoucher,

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
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const listOptionSorts = [
    { value: "createdAt_ASC", label: "Sắp xếp theo ngày tạo tăng dần" },
    { value: "createdAt_DESC", label: "Sắp xếp theo ngày tạo giảm dần" },
    { value: "updatedAt_ASC", label: "Sắp xếp theo ngày cập nhật tăng dần" },
    { value: "updatedAt_DESC", label: "Sắp xếp theo ngày cập nhật giảm dần" },
  ];
  const listOptionFilters = [
    {
      value: "filter_status_active",
      label: "Lọc theo trạng thái active",
    },
    {
      value: "filter_status_blocked",
      label: "Lọc theo trạng thái blocked",
    },
    {
      value: "filter_expired",
      label: "Lọc theo trạng thái hết hạn",
    },

  ];
  const titleColumn = [
    "name",
    "code",
    "value",
    "quantity",
    "description",
    "startDate",
    "endDate",
    "status",
    "operations",
  ];
  const handleSearch = async (e) => {
    try {
      let queryParams = `search=${e}&limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
      const result = await GetAllVoucher(queryParams);
      dispatch(initDataVoucher(result.data));
    } catch (error) {
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };
  const handleDeleteVoucher = async (voucher) => {
    // Ngăn chặn nhấp chuột trong khi đang xử lý
    dispatch(Loading(true))
    try {
      // Gọi API để xóa voucher
      const response = await DeleteVoucher(voucher.id);
      console.log(response); // Ghi nhật ký phản hồi từ API
      // Kiểm tra phản hồi từ API
      if (response && response.status === 200) {
        const { statusCode, status, message } = response.data;
        
          // Hiển thị thông báo thành công
          toast.success(message         
         );
          // Cập nhật danh sách voucher trong Redux để loại bỏ voucher
          dispatch(removeVoucher(voucher.id)); // Sử dụng action removeVoucher đã định nghĩa

        } 
      }
     catch (error) {
      console.log("Lỗi khi gọi API:", error);
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");      
    }
  };
  // const handleRecoverVoucher = async (voucherId) => {
  //   try {
  //     // Gọi API để khôi phục voucher
  //     const response = await RecoverVoucher(voucherId); // Bạn cần định nghĩa RecoverVoucher tương ứng
  //     console.log(response);
  //     if (response && response.data) {
  //       const { statusCode, status, message } = response.data;

  //       if (statusCode === 200) {
  //         // Cập nhật danh sách voucher trong Redux để thêm lại voucher
  //         dispatch(updateStatusVoucher({ id: voucherId, status: true })); // Nếu cần, bạn có thể cập nhật thêm thông tin
  //         toast.success(message);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     const result = HandleApiError(error);
  //     result
  //       ? toast.error(result)
  //       : toast.error("Có lỗi xảy ra, vui lòng thử lại");
  //   } finally {
  //     isLoading(false);
  //   }
  // };

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
    if (sortOption === "createdAt_ASC") {
      queryParams += `&sortBy=createdAt&sortOrder=ASC`;
    } else if (sortOption === "createdAt_DESC") {
      queryParams += `&sortBy=createdAt&sortOrder=DESC`;
    }
    if (
      filterOption === "isActive_true" ||
      filterOption === "filter_status_active"
    ) {
      queryParams += `&isActive=true`;
    } else if (
      filterOption === "isActive_false" ||
      filterOption === "filter_status_blocked"
    ) {
      queryParams += `&isActive=false`;
      // } else if (filterOption === "filter_role_admin") {
      //   queryParams += `&role=ADMIN`;
      // } else if (filterOption === "filter_role_user") {
      //   queryParams += `&role=USER`;
    }

    const result = await GetVoucherById(queryParams);
    dispatch(initDataVoucher(result.data));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call here
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        const response = await GetAllVoucher(queryParams);
        if (response.status === 200 && response.data.data) {
          dispatch(initDataVoucher(response.data));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initDataVoucher({ error: message }));
        }
      }
    };

    dispatch(clearDataVoucher());

    setTimeout(() => {
      fetchData();
    }, 800);
  }, [optionLimit.limit, optionLimit.currentPage]);


  const handleUse = async (voucher) => {
    try {
      console.log("Using voucher ID:", voucher.id); // Kiểm tra ID voucher
      if (!voucher.id) {
        throw new Error("Voucher ID is undefined or invalid");
      }

      const response = await UseVoucher(voucher.id);
      console.log("Response from UseVoucher:", response);

      if (response && response.data) {
        const { statusCode, status, message } = response.data;

        if (statusCode === 200) {
          // update data in redux
          dispatch(
            updateStatusVoucher({
              id: voucher.id,
              status: voucher.isActive,
            })
          );
          toast.success(message);
        }
      } else {
        toast.error("Voucher update failed with no response data.");
      }
    } catch (error) {
      console.log("Error occurred while using voucher:", error);
      const result = HandleApiError(error);
      result
        ? toast.error(result)
        : toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

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
                              {item.name}
                            </span>
                            {/* <span className="block text-gray-700 text-xs">
                              {item.code}
                            </span> */}
                          </div>
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
                            className={`px-3 py-2 rounded-full font-semibold text-xs ${item.isActive
                              ? "text-green-600 bg-green-50"
                              : "text-red-600 bg-red-50"
                              }`}
                          >
                            {item.isActive ? "activate" : "expire"}
                          </span>
                        </td>
                        <td className=" px-2 py-4 whitespace-nowrap ">
                          <div className="flex">
                            <div>
                              <ModelEditVoucher data={item} />
                            </div>
                            {/* <div
                              onClick={() => handleRecover(item)}
                              className="py-2  px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >
                              {item.isActive ? "Khóa" : "Áp Dụng"}
                            </div> */}
                            <div
                              onClick={() => handleUse(item)}
                              className="py-2 px-3 font-medium text-blue-600 hover:text-blue-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >
                              Sử Dụng
                            </div>
                            <div

                              onClick={() => handleDeleteVoucher(item)}
                              className="py-2 px-3 font-medium text-blue-600 hover:text-blue-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >Xóa

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


