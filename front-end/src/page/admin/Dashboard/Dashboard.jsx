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
import { useEffect } from "react";
import { GetStatisticalAPI } from "~/services/StatisticalService";
import { useDispatch, useSelector } from "react-redux";
import {
  initDataStatistical,
  initError,
} from "~/redux/features/Statistical/statisticalSlice";
import { HandleApiError } from "~/Utils/HandleApiError";
const cx = classNames.bind(styles);
export const Dashboard = () => {
  const dispatch = useDispatch();
  const totalRevenue = useSelector((state) => state.statistical.totalRevenue);
  const totalBills = useSelector((state) => state.statistical.totalBills);
  const totalProduct = useSelector((state) => state.statistical.totalProduct);
  const totalAccount = useSelector((state) => state.statistical.totalAccount);

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
              <CountUp end={totalBills ? totalBills : 0} duration={2000} />
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
              <CountUp end={totalProduct ? totalProduct : 0} duration={2000} />
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
              <CountUp end={totalAccount ? totalAccount : 0} duration={2000} />
            </p>
          </div>
        </div>
      </div>

      {/* box chart statistical profit */}
      <div className="mt-5 w-full pr-10 mx-auto">
        <h3 className="my-5">Thống kê doanh thu:</h3>
        <DashedBarsChart />
      </div>
      {/* box chart statistical order*/}
      <div className="mt-5 w-full pr-10 mx-auto">
        <h3 className="my-5">Thống kê số lượng hoá đơn:</h3>
        <DashedLinesChartOrder />
      </div>

      {/* box chart statistical product*/}
      <div className="mt-5 w-full pr-10 mx-auto">
        <h3 className="my-5">Thống kê doanh số lượng bán theo sản phẩm:</h3>
        <DashedPieChart />
      </div>
    </div>
  );
};
