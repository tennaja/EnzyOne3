import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';

const getMonthAbbreviation = (date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[date.getMonth()];
};

const getDayAbbreviation = (date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

const aggregateData = (data, key) => {
  if (!Array.isArray(data)) return [];
  return data.reduce((acc, cur) => {
    const existing = acc.find((item) => item[key] === cur[key]);
    if (existing) {
      existing.kw += cur.kw;
    } else {
      acc.push({ [key]: cur[key], kw: cur.kw });
    }
    return acc;
  }, []);
};

const BarChartComponent = ({ data, type = "hour" }) => {
  const [barProps, setBarProps] = useState({
    kw: true,
    hover: null,
  });
  const [zoomDomain, setZoomDomain] = useState(null);
  const [refAreaLeft, setRefAreaLeft] = useState(null);
  const [refAreaRight, setRefAreaRight] = useState(null);

  if (!data?.timestamp || !data?.kw || data.timestamp.length !== data.kw.length) {
    return <p>ไม่มีข้อมูลสำหรับแสดงผล</p>;
  }

  const rawData = data.timestamp.map((time, index) => {
    const date = new Date(time);
    return {
      fullTime: `${String(date.getDate()).padStart(2, "0")}-${getMonthAbbreviation(date)}-${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:00`,
      day: `${getDayAbbreviation(date)} ${String(date.getDate()).padStart(2, "0")}-${getMonthAbbreviation(date)}-${date.getFullYear()}`,
      month: `${getMonthAbbreviation(date)} ${date.getFullYear()}`,
      hour: `${String(date.getHours()).padStart(2, "0")}:00`,
      kw: data.kw[index],
    };
  });

  const xAxisKey = {
    hour: "fullTime",
    day: "day",
    month: "month"
  }[type] || "fullTime";

  let chartData = aggregateData(rawData, xAxisKey);

  if (zoomDomain) {
    chartData = chartData.filter(d => d[xAxisKey] >= zoomDomain[0] && d[xAxisKey] <= zoomDomain[1]);
  }

  const selectBar = (e) => {
    setBarProps({
      ...barProps,
      [e.dataKey]: !barProps[e.dataKey],
      hover: null,
    });
  };

  const handleLegendMouseEnter = (e) => {
    setBarProps({
      ...barProps,
      hover: e.dataKey,
    });
  };

  const handleLegendMouseLeave = () => {
    setBarProps({
      ...barProps,
      hover: null,
    });
  };

  const handleMouseDown = (e) => {
    if (e && e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setRefAreaRight(null);
    }
  };

  const handleMouseMove = (e) => {
    if (refAreaLeft && e && e.activeLabel) {
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
    <div style={{ textAlign: 'left' }}>
      <button onClick={zoomOut} style={{ marginBottom: 10 }} className="border-2 border-gray-400 rounded-lg p-1">Zoom Out</button>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={chartData}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey} 
            angle={-45} 
            textAnchor="end" 
            fontSize={10} 
            interval={0} 
            height={80} 
            allowDataOverflow={true}
          />
          <YAxis />
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
          {barProps.kw !== undefined && (
            <Bar 
              dataKey="kw" 
              fill="#4bc0c0" 
              name="Kilowatt (kw)" 
              opacity={barProps.hover === 'kw' || !barProps.hover ? 1 : 0.6} 
              hide={barProps.kw === false} 
            />
          )}
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="gray" />
          ) : null}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
