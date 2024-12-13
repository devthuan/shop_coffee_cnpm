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
} from "recharts";
import {
  initDataBillings,
  initError,
} from "~/redux/features/Statistical/statisticalSlice";
import { GetStatisticalBillsAPI } from "~/services/StatisticalService";
import { HandleApiError } from "~/Utils/HandleApiError";

export const DashedLinesChartOrder = () => {
  const dispatch = useDispatch();
  const dataBillings = useSelector((state) => state.statistical.dataBillings);

  const data = [
    {
      name: "Page A",
      pending: 4000,
      success: 2400,
      failed: 2400,
    },
    {
      name: "Page B",
      pending: 3000,
      success: 1398,
      failed: 2210,
    },
    {
      name: "Page C",
      pending: 2000,
      success: 9800,
      failed: 2290,
    },
    {
      name: "Page D",
      pending: 2780,
      success: 1000,
      failed: 2000,
    },
    {
      name: "Page E",
      pending: 1890,
      success: 4800,
      failed: 2181,
    },
    {
      name: "Page F",
      pending: 2390,
      success: 3800,
      failed: 2500,
    },
    {
      name: "Page G",
      pending: 3490,
      success: 4300,
      failed: 2100,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let startDate = "2024-10-1";
        let endDate = "2024-10-30";
        const response = await GetStatisticalBillsAPI(startDate, endDate);
        if (response && response.status === 201) {
          console.log(response);
          dispatch(initDataBillings({ data: response.data }));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initError({ error: message }));
        }
      }
    };
    if (!dataBillings || dataBillings.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400} margin="auto">
      <LineChart
        data={dataBillings}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pending"
          stroke="#eab308" // Yellow color for "pending" activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="success"
          stroke="#22c55e" // Green color for "success"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="failed"
          stroke="#ef4444" // Red color for "failed"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="cancelled"
          stroke="#9ca3af" // Gray color for "cancelled"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="delivery"
          stroke="#3b82f6" // Blue color for "delivery"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
