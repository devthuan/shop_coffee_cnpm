import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCartShopping,
  faMoneyBill,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { DashedBarsChart } from "./DashedBarsChart";
import { DashedLinesChartOrder } from "./DashedLinesChartOrder";
import CountUp from "~/components/CountUp/CountUp";
import { DashboardPieChart, DashedPieChart } from "./DashedPieChart";
import { useEffect, useState } from "react";
import {
  GetStatisticalAPI,
  GetStatisticalBillsAPI,
  GetStatisticalImportReceiptAPI,
  GetStatisticalProductsAPI,
  GetStatisticalRevenueAPI,
} from "~/services/StatisticalService";
import { useDispatch, useSelector } from "react-redux";
import {
  initDataBillings,
  initDataImportReceipt,
  initDataProducts,
  initDataRevenue,
  initDataStatistical,
  initError,
} from "~/redux/features/Statistical/statisticalSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
import { DashedBarsChartImportReceipt } from "./DashedBarsChartImportReceipt";
const cx = classNames.bind(styles);
export const Dashboard = () => {
  const dispatch = useDispatch();
  const totalRevenue = useSelector((state) => state.statistical.totalRevenue);
  const totalBills = useSelector((state) => state.statistical.totalBills);
  const totalProduct = useSelector((state) => state.statistical.totalProduct);
  const totalAccount = useSelector((state) => state.statistical.totalAccount);

  const [dateStatistical, setDateStatistical] = useState({
    startDate: "",
    endDate: "",
  });
  const [dateBill, setDateBill] = useState({ startDate: "", endDate: "" });
  const [dateImport, setDateImport] = useState({ startDate: "", endDate: "" });
  const [dateProduct, setDateProduct] = useState({
    startDate: "",
    endDate: "",
  });

  const [chooseDateStatistical, setChooseDateStatistical] = useState({
    startDate: "",
    endDate: "",
  });
  const [chooseDateBill, setChooseDateBill] = useState({
    startDate: "",
    endDate: "",
  });
  const [chooseDateImport, setChooseDateImport] = useState({
    startDate: "",
    endDate: "",
  });
  const [chooseDateProduct, setChooseDateProduct] = useState({
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (type, field, value) => {
    switch (type) {
      case "statistical":
        setDateStatistical((prev) => ({ ...prev, [field]: value }));
        break;
      case "bill":
        setDateBill((prev) => ({ ...prev, [field]: value }));
        break;
      case "importReceipt":
        setDateImport((prev) => ({ ...prev, [field]: value }));
        break;
      case "product":
        setDateProduct((prev) => ({ ...prev, [field]: value }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = (title) => {
    switch (title) {
      case "statistical":
        setChooseDateStatistical(dateStatistical);
        fetchingData(
          dateStatistical.startDate,
          dateStatistical.endDate,
          GetStatisticalRevenueAPI,
          initDataRevenue
        );
        break;
      case "bill":
        setChooseDateBill(dateBill);
        fetchingData(
          dateBill.startDate,
          dateBill.endDate,
          GetStatisticalBillsAPI,
          initDataBillings
        );
        break;
      case "importReceipt":
        setChooseDateImport(dateImport);
        fetchingData(
          dateImport.startDate,
          dateImport.endDate,
          GetStatisticalImportReceiptAPI,
          initDataImportReceipt
        );
        break;
      case "product":
        setChooseDateProduct(dateProduct);
        fetchingData(
          dateProduct.startDate,
          dateProduct.endDate,
          GetStatisticalProductsAPI,
          initDataProducts
        );
        break;
      default:
        break;
    }
  };

  const fetchingData = async (startDate, endDate, CallBack, dataRedux) => {
    try {
      const response = await CallBack(startDate, endDate);
      if (response && response.status === 201) {
        console.log(response);
        dispatch(dataRedux({ data: response.data }));
      }
    } catch (error) {
      const { message, status } = HandleApiError(error);
      if (status === "error") {
        dispatch(initError({ error: message }));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetStatisticalAPI();
        if (response && response.status === 200) {
          dispatch(initDataStatistical(response.data));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initError({ error: message }));
        }
      }
    };
    if (!totalRevenue || !totalBills || !totalProduct || !totalAccount) {
      fetchData();
    }
  }, []);

  return (
    <div className={cx("w-full mx-auto")}>
      {/* box 3 item */}
      <div className="w-11/12 mx-auto grid grid-cols-4 gap-5 mt-5">
        <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <FontAwesomeIcon className="size-10 px-5" icon={faMoneyBill} />
          <div class="flex flex-col w-full justify-between p-4 leading-normal">
            <h3 class="mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Tổng lợi nhuận
            </h3>
            <p>
              <CountUp end={totalRevenue ? totalRevenue : 0} duration={2000} />
            </p>
          </div>
        </div>

        <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <FontAwesomeIcon className="size-10 px-5" icon={faCartShopping} />
          <div class="flex flex-col w-full justify-between p-4 leading-normal">
            <h3 class="mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Tổng số đơn hàng
            </h3>
            <p>
              <CountUp end={totalAccount ? totalAccount : 0} duration={2000} />
            </p>
          </div>
        </div>

        <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <FontAwesomeIcon className="size-10 px-5" icon={faBox} />
          <div class="flex flex-col w-full justify-between p-4 leading-normal">
            <h3 class="mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Tổng số sản phẩm
            </h3>
            <p>
              <CountUp end={totalBills ? totalBills : 0} duration={2000} />
            </p>
          </div>
        </div>
        <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <FontAwesomeIcon className="size-10 px-5" icon={faUser} />
          <div class="flex flex-col w-full justify-between p-4 leading-normal">
            <h3 class="mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Tổng số người dùng
            </h3>
            <p>
              <CountUp end={totalProduct ? totalProduct : 0} duration={2000} />
            </p>
          </div>
        </div>
      </div>

      {/* box chart statistical profit */}
      <div className="mt-5 w-full pr-10 mx-auto  ">
        <div className="flex justify-start items-center gap-x-5">
          <div className="">
            <h3 className="my-5">Thống kê doanh thu:</h3>
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <h3 className="w-32">Từ ngày: </h3>
            <input
              onChange={(e) =>
                handleInputChange("statistical", "startDate", e.target.value)
              }
              type="date"
              placeholder="Enter your email"
              className="w-full pl-4 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <h3 className="w-32">Đến ngày: </h3>
            <input
              onChange={(e) =>
                handleInputChange("statistical", "endDate", e.target.value)
              }
              type="date"
              placeholder="Enter your email"
              className="w-full pl-4 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <button
              onClick={() => handleSubmit("statistical")}
              className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg duration-150 hover:bg-indigo-500 active:bg-indigo-700"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="">
          <DashedBarsChart />
        </div>
      </div>
      {/* box chart statistical order*/}
      <div className="mt-5 w-full pr-10 mx-auto">
        <div className="flex justify-start items-center gap-x-5">
          <div className="">
            <h3 className="my-5">Thống kê số lượng hoá đơn:</h3>
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <h3 className="w-32">Từ ngày: </h3>
            <input
              onChange={(e) =>
                handleInputChange("bill", "startDate", e.target.value)
              }
              type="date"
              placeholder="Enter your email"
              className="w-full pl-4 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <h3 className="w-32">Đến ngày: </h3>
            <input
              onChange={(e) =>
                handleInputChange("bill", "endDate", e.target.value)
              }
              type="date"
              placeholder="Enter your email"
              className="w-full pl-4 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <button
              onClick={() => handleSubmit("bill")}
              className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg duration-150 hover:bg-indigo-500 active:bg-indigo-700"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
        <DashedLinesChartOrder />
      </div>
      {/* box chart statistical import receipt*/}
      <div className="mt-5 w-full pr-10 mx-auto">
        <div className="flex justify-start items-center gap-x-5">
          <div className="">
            <h3 className="my-5">Thống kê nhập hàng:</h3>
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <h3 className="w-32">Từ ngày: </h3>
            <input
              onChange={(e) =>
                handleInputChange("importReceipt", "startDate", e.target.value)
              }
              type="date"
              placeholder="Enter your email"
              className="w-full pl-4 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <h3 className="w-32">Đến ngày: </h3>
            <input
              onChange={(e) =>
                handleInputChange("importReceipt", "endDate", e.target.value)
              }
              type="date"
              placeholder="Enter your email"
              className="w-full pl-4 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <button
              onClick={() => handleSubmit("importReceipt")}
              className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg duration-150 hover:bg-indigo-500 active:bg-indigo-700"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
        <DashedBarsChartImportReceipt />
      </div>

      {/* box chart statistical product*/}
      <div className="mt-5 w-full pr-10 mx-auto">
        <div className="flex justify-start items-center gap-x-5">
          <div className="">
            <h3 className="my-5">Thống kê doanh số lượng bán theo sản phẩm:</h3>
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <h3 className="w-32">Từ ngày: </h3>
            <input
              onChange={(e) =>
                handleInputChange("product", "startDate", e.target.value)
              }
              type="date"
              placeholder="Enter your email"
              className="w-full pl-4 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <h3 className="w-32">Đến ngày: </h3>
            <input
              onChange={(e) =>
                handleInputChange("product", "endDate", e.target.value)
              }
              type="date"
              placeholder="Enter your email"
              className="w-full pl-4 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div className="relative max-w-xs flex justify-start items-center">
            <button
              onClick={() => handleSubmit("product")}
              className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg duration-150 hover:bg-indigo-500 active:bg-indigo-700"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
        <DashedPieChart />
      </div>
    </div>
  );
};
