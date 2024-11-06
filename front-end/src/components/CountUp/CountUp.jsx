import React, { useState, useEffect } from "react";

const CountUp = ({ end, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = end / (duration / 50); // Tính khoảng tăng dựa trên thời gian và giá trị kết thúc

    const counter = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount + increment >= end) {
          clearInterval(counter);
          return end;
        }
        return prevCount + increment;
      });
    }, 50); // Mỗi 50ms tăng giá trị

    return () => clearInterval(counter);
  }, [end, duration]);

  return <div className="">{Math.round(count).toLocaleString()}</div>;
};

export default CountUp;
