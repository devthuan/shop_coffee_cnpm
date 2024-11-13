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
  initDataRevenue,
  initError,
} from "~/redux/features/Statistical/statisticalSlice";
import { GetStatisticalRevenueAPI } from "~/services/StatisticalService";
import { HandleApiError } from "~/Utils/HandleApiError";

export const DashedBarsChart = () => {
  const dispatch = useDispatch();
  const dataRevenue = useSelector((state) => state.statistical.dataRevenue);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let startDate = "2024-10-1";
        let endDate = "2024-10-30";
        const response = await GetStatisticalRevenueAPI(startDate, endDate);
        if (response && response.status === 201) {
          console.log(response);
          dispatch(initDataRevenue({ data: response.data }));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initError({ error: message }));
        }
      }
    };
    if (!dataRevenue || dataRevenue.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400} margin="auto">
      <BarChart
        width={500}
        height={300}
        data={dataRevenue}
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
          dataKey="totalRevenue"
          fill="#FF9800" // Green for Revenue
          activeBar={<Rectangle stroke="#FF9800" />}
        />
        <Bar
          dataKey="totalExpense"
          fill="#F44336" // Red for Expense
          activeBar={<Rectangle stroke="#F44336" />}
        />
        <Bar
          dataKey="totalProfit"
          fill="#4CAF50" // Orange for Profit
          activeBar={<Rectangle stroke="#4CAF50" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
