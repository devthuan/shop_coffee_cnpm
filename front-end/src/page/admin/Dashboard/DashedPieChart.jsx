import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import {
  initDataProducts,
  initError,
} from "~/redux/features/Statistical/statisticalSlice";
import { GetStatisticalProductsAPI } from "~/services/StatisticalService";
import { HandleApiError } from "~/Utils/HandleApiError";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    totalQuantity,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${totalQuantity} Lượt bán`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const DashedPieChart = () => {
  const dispatch = useDispatch();
  const dataProducts = useSelector((state) => state.statistical.dataProducts);
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        let startDate = "2024-10-1";
        let endDate = "2024-10-30";
        const response = await GetStatisticalProductsAPI(startDate, endDate);
        if (response && response.status === 201) {
          console.log(response);
          dispatch(initDataProducts({ data: response.data }));
        }
      } catch (error) {
        const { message, status } = HandleApiError(error);
        if (status === "error") {
          dispatch(initError({ error: message }));
        }
      }
    };
    if (!dataProducts || dataProducts.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <div className="flex items-center justify-center ">
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={dataProducts}
            cx="50%" // Đặt cx là 50% của chiều rộng của ResponsiveContainer
            cy="50%" // Đặt cy là 50% của chiều cao của ResponsiveContainer
            innerRadius={110}
            outerRadius={200}
            fill="#8884d8"
            dataKey="totalQuantity"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
