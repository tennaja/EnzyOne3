import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

const getMonthAbbreviation = (date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[date.getMonth()];
};

const getDayAbbreviation = (date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

const aggregateData = (data, key, valueKeys) => {
  if (!Array.isArray(data)) return [];
  return data.reduce((acc, cur) => {
    const existing = acc.find((item) => item[key] === cur[key]);
    if (existing) {
      valueKeys.forEach((k) => {
        existing[k] += cur[k];
      });
    } else {
      const newItem = { [key]: cur[key] };
      valueKeys.forEach((k) => {
        newItem[k] = cur[k];
      });
      acc.push(newItem);
    }
    return acc;
  }, []);
};

const BarChartComponent = ({
  data,
  type = "hour",
  timestampKey = "timestamp",
  valueKeys = ["kwh"],
  yAxisLabel = "kwh",
}) => {
  const [barProps, setBarProps] = useState({});
  const [hover, setHover] = useState(null);
  const [zoomDomain, setZoomDomain] = useState(null);
  const [refAreaLeft, setRefAreaLeft] = useState(null);
  const [refAreaRight, setRefAreaRight] = useState(null);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    const initialBarProps = {};
    valueKeys.forEach((key) => {
      initialBarProps[key] = true;
    });
    setBarProps(initialBarProps);
    setZoomDomain(null);
    setChartKey((prevKey) => prevKey + 1);
  }, [data, valueKeys]);

  if (
    !data?.[timestampKey] ||
    !Array.isArray(data[timestampKey]) ||
    data[timestampKey].length === 0
  ) {
    return <p>ไม่มีข้อมูลสำหรับแสดงผล</p>;
  }

  const rawData = data.timestamp.map((time, index) => {
    // ใช้ `new Date(time)` โดยตรงเพราะเวลามีรูปแบบที่รองรับอยู่แล้ว
    const date = new Date(time); // time เป็น "2025/03/20 00:00:00"
  
    // ตรวจสอบการแปลงว่าเป็นวันที่ที่ถูกต้องหรือไม่
    if (isNaN(date)) {
      console.error(`Invalid Date format: ${time}`);
      return {}; // ถ้าแปลงไม่สำเร็จ จะข้ามรายการนั้นไป
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const dayAbbreviation = getDayAbbreviation(date); // เช่น Mon, Tue
  
    // สร้างผลลัพธ์เบื้องต้น
    const result = {
      fullTime: `${year}/${month}/${day} ${hour}:00`, // รูปแบบสำหรับ hour
      day: `${dayAbbreviation} ${year}/${month}/${day}`, // รูปแบบสำหรับ day
      month: `${year}/${month}`, // รูปแบบสำหรับ month
    };
  
    // ใช้ valueKeys เพื่อเพิ่มข้อมูลใน result
    valueKeys.forEach((key) => {
      result[key] = data[key]?.[index] ?? 0; // ใช้ค่าใน data หรือ 0 ถ้าไม่มี
    });
  
    return result;
  });
  
  
  
  
  

  const xAxisKey = {
    hour: "fullTime",
    day: "day",
    month: "month",
  }[type] || "fullTime";
  console.log("xAxisKey:", xAxisKey);

  let chartData = aggregateData(rawData, xAxisKey, valueKeys);

  if (zoomDomain) {
    chartData = chartData.filter(
      (d) => d[xAxisKey] >= zoomDomain[0] && d[xAxisKey] <= zoomDomain[1]
    );
  }

  const selectBar = (e) => {
    setBarProps((prev) => ({
      ...prev,
      [e.dataKey]: !prev[e.dataKey],
    }));
  };

  const handleLegendMouseEnter = (e) => {
    setHover(e.dataKey);
  };

  const handleLegendMouseLeave = () => {
    setHover(null);
  };

  const handleMouseDown = (e) => {
    if (e?.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setRefAreaRight(null);
    }
  };

  const handleMouseMove = (e) => {
    if (refAreaLeft && e?.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp = () => {
    if (refAreaLeft && refAreaRight && refAreaLeft !== refAreaRight) {
      setZoomDomain([refAreaLeft, refAreaRight].sort());
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const zoomOut = () => {
    setZoomDomain(null);
  };

  return (
    <div style={{ position: "relative", textAlign: "left" }}>
  <div
    style={{
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 10,
    }}
  >
    <button
      onClick={zoomOut}
      className="border-2 border-gray-400 rounded-lg px-3 py-1"
    >
      Zoom Out
    </button>
  </div>

  <ResponsiveContainer
    width="100%"
    height={400}
    style={{ backgroundColor: "#f0f0f0", borderRadius: "10px" }}
  >
    <BarChart
      key={chartKey}
      data={chartData}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      margin={{ top: 50, left: 30 }}
    >
      <CartesianGrid horizontal={true} vertical={false} />
      <XAxis
        dataKey={xAxisKey}
        angle={-45}
        textAnchor="end"
        fontSize={10}
        interval={0}
        height={80}
        allowDataOverflow={true}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        label={{
          value: yAxisLabel,
          position: "top",
          offset: 30,
          angle: 0,
          dx: -50,
          dy: -20,
          style: {
            textAnchor: "start",
            fontSize: 17,
            fontWeight: "bold",
          },
        }}
      />
      <Tooltip />
      <Legend
        layout="horizontal"
        align="center"
        verticalAlign="top"
        wrapperStyle={{ marginBottom: 20 }}
        onClick={selectBar}
        onMouseOver={handleLegendMouseEnter}
        onMouseOut={handleLegendMouseLeave}
      />
      {valueKeys.map((key) => (
        <Bar
          key={key}
          dataKey={key}
          fill="#4bc0c0"
          name={key}
          opacity={hover === key || !hover ? 1 : 0.5}
          hide={barProps[key] === false}
        />
      ))}
      {refAreaLeft && refAreaRight ? (
        <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="gray" />
      ) : null}
    </BarChart>
  </ResponsiveContainer>
</div>


  );
};

export default BarChartComponent;
