// components/BarChart.js

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ฟังก์ชันแปลงวันเป็นตัวย่อภาษาอังกฤษ
const getDayAbbreviation = (date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

// ฟังก์ชันแปลงเดือนเป็นตัวย่อภาษาอังกฤษ
const getMonthAbbreviation = (date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[date.getMonth()];
};

// ฟังก์ชันรวมค่า (Aggregate) ตาม key
const aggregateData = (data, key) => {
  if (!Array.isArray(data)) return []; // ตรวจสอบว่า data เป็น array หรือไม่
  return data.reduce((acc, cur) => {
    const existing = acc.find((item) => item[key] === cur[key]);
    if (existing) {
      existing.kw += cur.kw; // รวมค่า kw
    } else {
      acc.push({ [key]: cur[key], kw: cur.kw });
    }
    return acc;
  }, []);
};

const BarChartComponent = ({ data, type = "hour" }) => {
  // ตรวจสอบ data ก่อนแปลง
  if (!data?.timestamp || !data?.kw || data.timestamp.length !== data.kw.length) {
    return <p>ไม่มีข้อมูลสำหรับแสดงผล</p>;
  }

  // ตรวจสอบและแปลง timestamp ตามประเภท
  const rawData = data.timestamp.map((time, index) => {
    const date = new Date(time);
    return {
      timestamp: time,
      kw: data.kw[index],
      hour: String(date.getHours()).padStart(2, "0"), // "00" ถึง "23"
      day: getDayAbbreviation(date), // "Sun" ถึง "Sat"
      month: getMonthAbbreviation(date), // "Jan" ถึง "Dec"
    };
  });

  // เลือก dataKey สำหรับแกน X
  const xAxisKey = {
    hour: "hour",
    day: "day",
    month: "month",
  }[type] || "hour";

  // รวมข้อมูลตามประเภท
  const chartData = aggregateData(rawData, xAxisKey);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          angle={0}
          textAnchor="center"
          fontSize={10}
          interval={0}
          height={100}
        />
        <YAxis />
        <Tooltip />
        <Legend layout="horizontal" align="center" verticalAlign="top" wrapperStyle={{ marginBottom: 20 }} />
        <Bar dataKey="kw" fill="#4bc0c0" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
