import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";
import {
  initDataImportReceipt,
  initError,
} from "~/redux/features/Statistical/statisticalSlice";
import { GetStatisticalImportReceiptAPI } from "~/services/StatisticalService";
import { HandleApiError } from "~/Utils/HandleApiError";

export const DashedBarsChartImportReceipt = () => {
  const dispatch = useDispatch();
  const dataImportReceipt = useSelector(
    (state) => state.statistical.dataImportReceipt
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        let startDate = "2024-10-1";
        let endDate = "2024-11-30";
        const response = await GetStatisticalImportReceiptAPI(
          startDate,
          endDate
        );
        if (response && response.status === 201) {
          console.log(response);
          dispatch(initDataImportReceipt({ data: response.data }));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initError({ error: message }));
        }
      }
    };
    if (!dataImportReceipt || dataImportReceipt.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400} margin="auto">
      <BarChart
        width={500}
        height={300}
        data={dataImportReceipt}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="Tổng"
          fill="#FF9800" // Green for Revenue
          activeBar={<Rectangle stroke="#FF9800" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
