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

  const rawData = data[timestampKey].map((time, index) => {
    const date = new Date(time);
    const item = {
      fullTime: `${String(date.getDate()).padStart(2, "0")}-${getMonthAbbreviation(date)}-${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:00`,
      day: `${getDayAbbreviation(date)} ${String(date.getDate()).padStart(2, "0")}-${getMonthAbbreviation(date)}-${date.getFullYear()}`,
      month: `${getMonthAbbreviation(date)} ${date.getFullYear()}`,
      hour: `${String(date.getHours()).padStart(2, "0")}:00`,
    };
    valueKeys.forEach((k) => {
      item[k] = data[k]?.[index] ?? 0;
    });
    return item;
  });

  const xAxisKey = {
    hour: "fullTime",
    day: "day",
    month: "month",
  }[type] || "fullTime";

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
    <div style={{ textAlign: "left" }}>
      <button onClick={zoomOut} className="border-2 border-gray-400 rounded-lg p-1 mb-6">
        Zoom Out
      </button>
      <ResponsiveContainer width="100%" height={400} style={{ backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
        <BarChart
          key={chartKey}
          data={chartData}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          margin={{ top: 50 , left: 30}} // เพิ่ม margin ด้านบน, ขวา, ซ้าย, ล่าง
        >
          {/* strokeDasharray="3 3" */}
          <CartesianGrid  horizontal={true} vertical={false} /> 
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
    value: valueKeys[0],
    position: 'top',
    offset: 30,
    angle: 0,
    dx: -50,
    dy: -20,
    style: {
      textAnchor: 'start',
      fontSize: 17,
      fontWeight: 'bold',
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
