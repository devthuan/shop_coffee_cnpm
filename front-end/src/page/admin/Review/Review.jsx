import classNames from "classnames/bind";
import { useEffect } from "react";
import { useState } from "react";
import Swal from 'sweetalert2'; // Import SweetAlert2
// import styles from "./Template.module.scss";
import { ModalAddReview } from "./ModalAddReview";
import { ModalEditReview } from "./ModalEditReview";
import { Pagination } from "~/components/Pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { HandleApiError } from "~/Utils/HandleApiError";
import { ToastContainer, toast } from "react-toastify";

import { GetAllDiscount, DeleteDiscount } from "~/services/DiscountService";

import { DeleteReview, GetAllReview } from "~/services/ReviewService";
import { initDataReview, deleteReview } from "~/redux/features/Reviews/reviewsSlice";

import {
  initDataDiscount,
  deleteDiscount,
} from "~/redux/features/Discounts/discountsSlice";
// const cx = classNames.bind(styles);
export const Review = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.data);

  const total = useSelector((state) => state.reviews.total);
  const totalPage = useSelector((state) => state.reviews.totalPage);
  const currentPage = useSelector((state) => state.reviews.currentPage);
  const limit = useSelector((state) => state.reviews.limit);
  const isLoading = useSelector((state) => state.reviews.isLoading);
  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });

  const [selectSearch, setSelectedSearch] = useState(0);
  const [search, setSearch] = useState("");
  // biến chứa danh sách nội dung của bảng

  const fetchData = async () => {
    let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
    if (search) {
      queryParams += `&search=${search}`;
    }
    const response = await GetAllReview(queryParams);
    console.log(response);
    if (response && response.status === 200) {
      dispatch(initDataReview(response.data));
    }
  };

  useEffect(() => {
    fetchData();
  }, [optionLimit.currentPage, optionLimit.limit]);

  const handlePaginate = (page) => {
    setOptionLimit((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleLimitAttribute = (limit) => {
    setOptionLimit((prev) => ({
      limit: limit,
      currentPage: 1,
    }));
  };

  const handleDeleteReview = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa nhận xét này?',
        icon: 'warning',
        showCancelButton: true,  // Hiển thị nút hủy
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      });

      if (result.isConfirmed) {
        const response = await DeleteReview(id);
        if (response && response.status === 200) {
          if (reviews.length - 1 < optionLimit.limit) {
            fetchData();
          }
        }
      }
    } catch (error) {
      const result = HandleApiError(error);
      console.log(result);
      if (result) {
        toast.error(result.message);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  const handleSearch = async () => {
    let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}&search=${search}`;
    const response = await GetAllDiscount(queryParams);
    if (response && response.status === 200) {
      dispatch(initDataDiscount(response.data));
    }
  };
  // Array chứa danh sách tiêu đề bảng
  const tableTitles = [
    "ID",
    // "Sản phẩm",
    "Rating",
    "Comment",
    "Created At",
    "Updated At"
  ];

  return (
    <div className="max-w-full mx-auto px-4 ">
      {/* box title */}
      <div className="w-full flex justify-center py-3">
        <h3>Review</h3>
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
            <select
              onChange={(e) => setSelectedSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
            >
              <option value="0">Id</option>
              <option value="1">Name</option>
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
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                type="text"
                value={search}
                placeholder="Search"
                className="w-72 max-w-md py-2 pl-12 pr-4 text-sm text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* box button create */}
        <div className="mt-3 md:mt-0">
          {/* import modal create */}
          <ModalAddReview />
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
            {reviews &&
              reviews?.length > 0 &&
              reviews?.map((review, idx) => (
                <tr key={idx}>
                  <td className="pr-6 py-4 whitespace-nowrap">{review.id}</td>
                  {/* <td className="pr-6 py-4 whitespace-nowrap">
                    {review.name}
                  </td> */}
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {review.rating}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {review.comment}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleString()}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {new Date(review.updatedAt).toLocaleString()}
                  </td>

                  <td className="text-right px-6 whitespace-nowrap">
                    <div className="max-w-5 flex justify-center items-center">
                      <p className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <ModalEditReview data={review} />
                      </p>
                      <p
                        // để tham số rỗng ở đầu khi khi onlick vào mới chạy hàm handleDeletedProduct
                        onClick={() => handleDeleteReview(review.id)}
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
        totalItems={total} // truyền các trị tương ứng với biến
        current={currentPage} // truyền các trị tương ứng với biến
        totalPage={totalPage} // truyền các trị tương ứng với biến
        limit={limit} // truyền các trị tương ứng với biến
        onPageChange={handlePaginate} // truyền các trị tương ứng với biến
        onLimitChange={handleLimitAttribute} // truyền các trị tương ứng với biến
      />
    </div>
  );
};
