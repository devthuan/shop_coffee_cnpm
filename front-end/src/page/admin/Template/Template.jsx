import classNames from "classnames/bind";
import styles from "./Template.module.scss";
import { TemplateModelCreate } from "./TemplateModelCreate";
import { TemplateModelEdit } from "./TemplateModelEdit";
import { Pagination } from "~/components/Pagination/Pagination";

const cx = classNames.bind(styles);
export const Template = () => {
  // biến chứa danh sách nội dung của bảng
  const tableItems = [
    {
      name: "Solo learn app",
      date: "Oct 9, 2023",
      status: "Active",
      price: "$35.000",
      plan: "Monthly subscription",
    },
    {
      name: "Window wrapper",
      date: "Oct 12, 2023",
      status: "Active",
      price: "$12.000",
      plan: "Monthly subscription",
    },
    {
      name: "Unity loroin",
      date: "Oct 22, 2023",
      status: "Archived",
      price: "$20.000",
      plan: "Annually subscription",
    },
    {
      name: "Background remover",
      date: "Jan 5, 2023",
      status: "Active",
      price: "$5.000",
      plan: "Monthly subscription",
    },
    {
      name: "Colon tiger",
      date: "Jan 6, 2023",
      status: "Active",
      price: "$9.000",
      plan: "Annually subscription",
    },
  ];
  // Array chứa danh sách tiêu đề bảng
  const tableTitles = ["name", "date", "status", "Purchase", "price", "Action"];

  return (
    <div className="max-w-full mx-auto px-4 ">
      {/* box title */}
      <div className="w-full flex justify-center py-3">
        <h3>Title</h3>
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
            <select className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
              <option>Project manager</option>
              <option>Software engineer</option>
              <option>IT manager</option>
              <option>UI / UX designer</option>
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
                type="text"
                placeholder="Search"
                className="w-72 max-w-md py-2 pl-12 pr-4 text-sm text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* box button create */}
        <div className="mt-3 md:mt-0">
          <TemplateModelCreate />
          {/* <p className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
            Create
          </p> */}
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
            {tableItems.map((item, idx) => (
              <tr key={idx}>
                <td className="pr-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.date}</td>
                <td className="pr-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-2 rounded-full font-semibold text-xs ${
                      item.status === "Active"
                        ? "text-green-600 bg-green-50"
                        : "text-red-600 bg-blue-50"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.plan}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.price}</td>
                <td className="text-right px-6 whitespace-nowrap">
                  <div className="max-w-5 flex justify-center items-center">
                    <p className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <TemplateModelEdit />
                    </p>
                    <p className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg cursor-pointer">
                      Delete
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          <Pagination
            totalItems={1} // truyền các trị tương ứng với biến
            current={1} // truyền các trị tương ứng với biến
            totalPage={1} // truyền các trị tương ứng với biến
            limit={1} // truyền các trị tương ứng với biến
            onPageChange={1} // truyền các trị tương ứng với biến
            onLimitChange={1} // truyền các trị tương ứng với biến
          />
    </div>
  );
};
