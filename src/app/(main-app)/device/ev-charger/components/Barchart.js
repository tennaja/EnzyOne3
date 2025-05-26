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

const formatData = (data, valueKeys, decimalPlaces = 2) => {
  return data.map((item) => {
    const formattedItem = { ...item };
    valueKeys.forEach((key) => {
      if (formattedItem[key] !== undefined) {
        formattedItem[key] = key === "session"
          ? Math.floor(formattedItem[key])
          : Number(formattedItem[key].toFixed(decimalPlaces));
      }
    });
    return formattedItem;
  });
};

const BarChartComponent = ({
  data,
  type = "day",
  timestampKey = "timestamp",
  valueKeys = ["kwh"],
  yAxisLabel = "kwh",
  legendLabels = {},
  decimalPlaces = 2,
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
    const date = new Date(time);
    if (isNaN(date)) {
      console.error(`Invalid Date format: ${time}`);
      return {};
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");

    const result = {
      fullTime: `${year}/${month}/${day} ${hour}:00`,
      day: `${year}/${month}/${day}`,
      month: `${year}/${month}`,
    };

    valueKeys.forEach((key) => {
      result[key] = data[key]?.[index] ?? 0;
    });

    return result;
  });

  const formattedData = formatData(rawData, valueKeys, decimalPlaces);
  const xAxisKey = { hour: "fullTime", day: "day", month: "month" }[type] || "fullTime";
  let chartData = aggregateData(formattedData, xAxisKey, valueKeys);

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

  const handleLegendMouseEnter = (e) => setHover(e.dataKey);
  const handleLegendMouseLeave = () => setHover(null);
  const handleMouseDown = (e) => setRefAreaLeft(e?.activeLabel || null);
  const handleMouseMove = (e) => refAreaLeft && setRefAreaRight(e?.activeLabel || null);
  const handleMouseUp = () => {
    if (refAreaLeft && refAreaRight && refAreaLeft !== refAreaRight) {
      setZoomDomain([refAreaLeft, refAreaRight].sort());
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };
  const zoomOut = () => setZoomDomain(null);

  const formatTruncatedDecimal = (value, decimals = 2, key = "") => {
    if (key === "session") {
      return Math.floor(value);
    }
    const factor = Math.pow(10, decimals);
    const truncated = Math.floor(value * factor) / factor;
    return truncated.toFixed(decimals);
  };

  const isSessionType = valueKeys.includes("session");

  const yValues = chartData
  .map((d) => d["session"])
  .filter((v) => typeof v === "number" && !isNaN(v));

const min = 0;
let max = Math.max(...yValues, 0);
if (max === 0) max = 2;

const domain = [min, Math.ceil(max)]; // domain ชัดเจน

// สร้าง ticks ตามที่คุยไว้ก่อนหน้านี้
let yAxisTicks;
const maxTicks = 20;
if (max <= maxTicks) {
  yAxisTicks = [];
  for (let i = min; i <= max; i++) yAxisTicks.push(i);
} else {
  const step = Math.ceil(max / maxTicks);
  yAxisTicks = [];
  for (let i = min; i <= max; i += step) yAxisTicks.push(i);
  if (yAxisTicks[yAxisTicks.length - 1] !== max) yAxisTicks.push(max);
}

  


  return (
    <div style={{ position: "relative", textAlign: "left" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
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
        className="bg-[#f0f0f0] dark:bg-slate-900 dark:text-black rounded-lg"
      >
        <BarChart
          key={chartKey}
          data={chartData}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          margin={{ top: 50, left: 30 }}
          maxBarSize={30}
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
  ticks={isSessionType ? yAxisTicks : undefined}
  domain={isSessionType ? domain : undefined}
  tickFormatter={(value) =>
    isSessionType ? value.toString() : formatTruncatedDecimal(value, decimalPlaces)
  }

/>


          <Tooltip
            formatter={(value, name) => [
              formatTruncatedDecimal(value, decimalPlaces, name),
              name,
            ]}
          />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="top"
            wrapperStyle={{ marginBottom: 20 }}
            onMouseOver={handleLegendMouseEnter}
            onMouseOut={handleLegendMouseLeave}
            onClick={selectBar}
          />
          {valueKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill="#4bc0c0"
              name={legendLabels[key] || key}
              opacity={hover === key || !hover ? 1 : 0.5}
              hide={barProps[key] === false}
            />
          ))}
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
              fill="gray"
            />
          ) : null}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
