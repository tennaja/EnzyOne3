'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Brush,
} from 'recharts';

// กำหนดสีที่แตกต่างกัน
const distinctColors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
  '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
];

export default function RevenueBarChart2({ data }) {
  const { devices = [], timestamp = [] } = data;
  if (!timestamp.length || !devices.length) {
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

  // map ข้อมูล chart โดยใช้ timestamp จริง
  const chartData = timestamp.map((time, index) => {
    const point = { time }; // ใช้ timestamp ดิบเป็นแกน X
    devices.forEach((device, i) => {
      point[`gen${i + 1}`] = device.history?.[index] ?? 0;
    });
    return point;
  });

  const maxY = Math.max(
    ...chartData.flatMap(item =>
      devices.map((_, i) => item[`gen${i + 1}`] ?? 0)
    )
  );

  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, maxY]} />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />

          {/* Stacked Bars with stackId */}
          {devices.map((device, i) => (
            <Bar
              key={`bar-gen${i + 1}`}
              dataKey={`gen${i + 1}`}
              name={device.deviceName || `Gen ${i + 1}`}
              stackId="a"
              fill={distinctColors[i % distinctColors.length]}
            />
          ))}

          <Brush dataKey="time" height={30} stroke="#8884d8" />

          {/* Custom kWh label on Y-axis */}
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
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
