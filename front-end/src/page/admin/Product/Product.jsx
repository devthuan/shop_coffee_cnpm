import classNames from "classnames/bind";
import { useEffect } from "react";
import { useState } from "react";
// import styles from "./Template.module.scss";
import { ModalAddProduct } from "./ModalAddProduct";
import { ModalEditProduct } from "./ModalEditProduct";
import { Pagination } from "~/components/Pagination/Pagination";
import { GetAllProduct, DeleteProduct } from "~/services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { HandleApiError } from "~/Utils/HandleApiError";
import { ToastContainer, toast } from "react-toastify";
import {
  initDataProduct,
  deleteProduct,
} from "~/redux/features/Products/productsSlice";

// const cx = classNames.bind(styles);
export const Product = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productss.data);
  const total = useSelector((state) => state.productss.total);
  const totalPage = useSelector((state) => state.productss.totalPage);
  const currentPage = useSelector((state) => state.productss.currentPage);
  const limit = useSelector((state) => state.productss.limit);
  const isLoading = useSelector((state) => state.productss.isLoading);
  const [sortOption, setSortOption] = useState("");

  const [optionLimit, setOptionLimit] = useState({
    currentPage: 1,
    limit: 10,
  });

  const listOptionSorts = [
    { value: "createdAt_ASC", label: "sắp xếp theo ngày tạo tăng dần" },
    { value: "createdAt_DESC", label: "sắp xếp theo ngày tạo giảm dần" },
  ];

  const handleSort = async (e) => {
    setSortOption(e);
    fetchProducts(e); // Pass both sort and filter options
  };

  const fetchProducts = async (sortOption) => {
    let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;

    const sortOptionsMap = {
      createdAt_ASC: "&sortBy=createdAt&sortOrder=ASC",
      createdAt_DESC: "&sortBy=createdAt&sortOrder=DESC",
    };

    if (sortOptionsMap[sortOption]) {
      queryParams += sortOptionsMap[sortOption];
    }

    const result = await GetAllProduct(queryParams);
    dispatch(initDataProduct(result.data));
  };

  const [selectSearch, setSelectedSearch] = useState(0);
  const [search, setSearch] = useState("");

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

  const handleDeleteProduct = async (id) => {
    try {
      const response = await DeleteProduct(id);
      console.log(response);
      if (response && response.status === 200) {
        dispatch(deleteProduct({ id }));
        toast.success("Xoá sản phẩm thành công.");
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
    const response = await GetAllProduct(queryParams);
    if (response && response.status === 200) {
      dispatch(initDataProduct(response.data));
    }
  };
  // Array chứa danh sách tiêu đề bảng
  const tableTitles = [
    "Id",
    "Tên sản phẩm",
    "Loại sản phẩm",
    "Số thuộc tính",
    "Mô tả",
    "Ngày tạo",
    "Hành động",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let queryParams = `limit=${optionLimit.limit}&page=${optionLimit.currentPage}`;
        if (search) {
          queryParams += `&search=${search}`;
        }
        const response = await GetAllProduct(queryParams);
        if (response && response.status === 200) {
          dispatch(initDataProduct(response.data));
        }
      } catch (error) {
        if (error.request) {
          dispatch(
            initDataProduct({ error: "Không có phản hồi từ server..." })
          );
        }
        const result = HandleApiError(error);
        result
          ? toast.error(result)
          : toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    };

    fetchData();
  }, [optionLimit.currentPage, optionLimit.limit]);

  return (
    <div className="max-w-full mx-auto px-4 ">
      {/* box title */}
      <div className="w-full flex justify-center py-3">
        <h3 className="text-3xl my-4">Quản lý Sản phẩm</h3>
      </div>

      {/* box button  */}
      <div className="flex items-start justify-between ">
        <div className="flex gap-x-3">
          {/* box filter */}
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
          <ModalAddProduct />
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
            {products &&
              products.length > 0 &&
              products.map((product, idx) => (
                <tr key={idx}>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {product.id?.slice(0, 8)} ...
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap flex items-center">
                    {product.images.length > 0 && (
                      <img
                        width="40px"
                        src={product.images[0].urlImage}
                        alt=""
                      />
                    )}
                    <span className="ml-3">
                      {product.name.slice(0, 25)} ...
                    </span>
                  </td>

                  <td className="pr-6 py-4 whitespace-nowrap">
                    {product.category.name}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {product.productAttributes.length}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {product.description} ...
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {new Date(product.createdAt).toLocaleString()}
                  </td>
                  <td className="text-right px-6 whitespace-nowrap">
                    <div className="max-w-5 flex justify-center items-center">
                      <p className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <ModalEditProduct data={product} />
                      </p>
                      <p
                        // để tham số rỗng ở đầu khi khi onlick vào mới chạy hàm handleDeletedProduct
                        onClick={() => handleDeleteProduct(product.id)}
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
        onPageChange={handlePageChange} // truyền các trị tương ứng với biến
        onLimitChange={handleLimitChange} // truyền các trị tương ứng với biến
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
