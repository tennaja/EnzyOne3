'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  ReferenceLine,
  Brush,
  CartesianGrid,
} from 'recharts';

const distinctColors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
  '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
];

export default function EnergyTrendChart2({ type = 'day', data = {} }) {
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

  const renderUnitLabel = () => (
    <text
      x={40}
      y={15}
      fontSize={15}
      fontWeight="bold"
      fill="currentColor"
      className="text-black dark:text-white"
    >
      kWh
    </text>
  );

  // ใช้ ComposedChart สำหรับกราฟรวมข้อมูลทุกเครื่อง
  if (type === 'month' || type === 'year' || type === 'lifetime') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            textAnchor="middle"
            height={40}
          />
          <YAxis domain={[0, maxY]} />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
          {renderUnitLabel()}
          {devices.map((device, i) => (
            <Bar
              key={`bar-gen${i + 1}`}
              dataKey={`gen${i + 1}`}
              name={device.deviceName || `Gen ${i + 1}`}
              fill={distinctColors[i % distinctColors.length]}
              stackId="a"
            />
          ))}
          <Brush dataKey="time" height={30} stroke="#8884d8" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  // สำหรับ type === 'day'
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
         
          textAnchor="middle"
          height={40}
        
        
        />
        <YAxis domain={[0, maxY]} />
        <Tooltip />
        <Legend wrapperStyle={{ marginBottom: -20 }} />
        <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
        {renderUnitLabel()}
        {devices.map((device, i) => (
          <Line
            key={`line-gen${i + 1}`}
            type="monotone"
            dataKey={`gen${i + 1}`}
            stroke={distinctColors[i % distinctColors.length]}
            strokeWidth={2}
            name={device.deviceName || `Gen ${i + 1}`}
            strokeDasharray={
              device.deviceName?.toLowerCase().includes('forecast') ? '5 5' : ''
            }
          />
        ))}
        <Brush dataKey="time" height={30} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
