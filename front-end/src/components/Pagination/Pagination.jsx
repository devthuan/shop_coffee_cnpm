import { useState, useEffect } from "react";

export const Pagination = ({
  totalItems,
  current,
  totalPage,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  const [pages, setPages] = useState(["1", "2", "3", , "...", "8", "9", "10"]);
  const [currentPage, setCurrentPage] = useState(current);
  const [optionLimit, setOptionLimit] = useState(limit);

  const filterItems = [
    { value: "10" },
    { value: "1" },
    { value: "2" },
    { value: "3" },
    { value: "15" },
    { value: "20" },
    { value: "25" },
    { value: "30" },
    { value: "40" },
    { value: "50" },
    { value: "100" },
  ];

  const generatePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const handlePreviousClick = () => {
    let page = parseInt(currentPage) - 1;
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleNextClick = () => {
    let page = parseInt(currentPage) + 1;
    setCurrentPage(page);
    onPageChange(page);
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setOptionLimit(e.target.value);
    if (onLimitChange) {
      onLimitChange(e.target.value); // Call parent's callback to update the limit
    }
  };
  // Cập nhật giá trị currentPage khi props thay đổi
  useEffect(() => {
    setCurrentPage(current);
  }, [current]);

  // Cập nhật limit khi props limit thay đổi
  useEffect(() => {
    setOptionLimit(limit);
  }, [limit]);

  return (
    <div className="max-w-screen-2xl mx-auto mt-5 px-4 text-gray-600 md:px-8">
      <div className="hidden justify-end text-sm md:flex gap-x-10">
        <div className="flex justify-center items-center gap-x-6">
          <div className="relative w-16 max-w-full mx-auto">
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
              onChange={(e) => handleLimitChange(e)}
              className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"
            >
              {filterItems &&
                filterItems.length > 0 &&
                filterItems.map((item) => {
                  return (
                    <option key={item.value} value={item.value}>
                      {item.value}
                    </option>
                  );
                })}
            </select>
          </div>
          <p>
            Showing {optionLimit * (currentPage - 1) + 1} -{" "}
            {Math.min(optionLimit * currentPage, totalItems)} of {totalItems}
          </p>
        </div>

        <div className="flex items-center gap-12" aria-label="Pagination">
          <p
            onClick={() => currentPage > 1 && handlePreviousClick()}
            className="hover:text-indigo-600 cursor-default px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50"
          >
            Previous
          </p>
          <ul className="flex items-center gap-1 ">
            Page {currentPage} of {totalPage}
          </ul>
          <p
            onClick={() => currentPage < totalPage && handleNextClick()}
            className="hover:text-indigo-600 cursor-default px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50"
          >
            Next
          </p>
        </div>
      </div>
    </div>
  );
};
