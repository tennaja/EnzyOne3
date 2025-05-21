'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from 'recharts';

function getTextWidth(text, font = '12px Arial') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  return context.measureText(text).width;
}

export default function RevenueBarChart({ history }) {
  if (!history?.timestamp?.length || !history?.revenue?.length) {
    return (
      <div
        style={{
          width: '100%',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          color: '#888',
          borderRadius: 12,
          border: '1px solid #ddd',
        }}
      >
        No data available
      </div>
    );
  }

  // แปลงข้อมูลให้เหมาะกับ Recharts
  const data =
    history?.timestamp?.map((dateStr, index) => ({
      date: dateStr,
      revenue: history.revenue[index],
    })) || [];

  // หาค่า maxY (max revenue)
  const maxY = Math.max(...(history.revenue || [0]));

  // State สำหรับ marginLeft
  const [marginLeft, setMarginLeft] = useState(40);

  useEffect(() => {
    // แปลง maxY เป็น string format มี comma คั่น เช่น 1,234,567
    const maxYString = maxY.toLocaleString();

    // วัดความกว้างข้อความ (ต้อง match font size กับแกน Y)
    const width = getTextWidth(maxYString, '12px Arial');

    // กำหนด marginLeft = ความกว้าง + เผื่อช่องว่าง 15 px
    setMarginLeft(Math.ceil(width) + 15);
  }, [maxY]);

  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 40, right: 30, left: marginLeft, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            textAnchor="middle"
            height={40}
          />
          <YAxis
            domain={[0, maxY]}
            tickFormatter={(v) => v.toLocaleString()}
          />
          
          <Tooltip
  formatter={(value, name) => [`${Number(value).toLocaleString()} ฿`, name]}
/>

          <Legend verticalAlign="bottom" height={36} />
          <Bar dataKey="revenue" fill="#a855f7" name="Revenue" />

          {/* สัญลักษณ์ ฿ ด้านบนแกน Y */}
          <text
            x={marginLeft+50} // ให้สัญลักษณ์ ฿ อยู่ใกล้แกน Y ตาม margin.left ใหม่
            y={18}
            fill="currentColor"
            className="text-black dark:text-white"
            fontSize={20}
            fontWeight="bold"
          >
            ฿
          </text>

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
