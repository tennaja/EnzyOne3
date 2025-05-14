'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Brush, // เพิ่มการนำเข้า Brush
} from 'recharts';

export default function RevenueBarChart({ history }) {
  // แปลงข้อมูลให้เหมาะกับ Recharts
  const data = history?.timestamp?.map((dateStr, index) => ({
    date: dateStr, // ใช้วันที่เต็ม เช่น '2025/05/01'
    revenue: history.revenue[index],
  })) || [];

  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            angle={-45} 
            textAnchor="end" 
            height={70} 
            tick={{ fontSize: 10 }} 
            interval={0}
          />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <Bar dataKey="revenue" fill="#a855f7" name="Revenue" />

          {/* สัญลักษณ์ ฿ ด้านบนแกน Y */}
          <text
            x={70}
            y={18}
            fill="currentColor"
            className="text-black dark:text-white"
            fontSize={20}
            fontWeight="bold"
          >
            ฿
          </text>

          {/* เพิ่ม Brush สำหรับเลือกช่วงเวลา */}
          <Brush 
            dataKey="date" 
            height={30} 
            stroke="#8884d8"
            startIndex={0} 
            endIndex={data.length - 1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
