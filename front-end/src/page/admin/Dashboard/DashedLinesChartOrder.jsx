import React from "react";

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



export const DashedLinesChartOrder = () => {
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

  return (
    <ResponsiveContainer width="100%" height={400} margin="auto">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pending"
          stroke="#eab308"
          className="text-green-500"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="success" stroke="#22c55e" />
        <Line type="monotone" dataKey="failed" stroke="#ef4444" />
      </LineChart>
    </ResponsiveContainer>
  );
}

