'use client';

import React, { useState } from 'react';
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

const distinctColors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
  '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
];

export default function RevenueBarChart2({ data }) {
  const { devices = [], timestamp = [] } = data;

  // กำหนด state สำหรับแสดง/ซ่อนแต่ละ Bar
  const [hiddenBars, setHiddenBars] = useState({});

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

  const chartData = timestamp.map((time, index) => {
    const point = { time };
    devices.forEach((device, i) => {
      point[`gen${i + 1}`] = device.history?.[index] ?? 0;
    });
    return point;
  });

  const getTextWidth = (text, font = '12px Roboto') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  };

  const maxY = Math.max(
    ...chartData.flatMap(item =>
      devices.map((_, i) =>
        hiddenBars[`gen${i + 1}`] ? 0 : item[`gen${i + 1}`] ?? 0
      )
    )
  );
  const leftMargin = Math.ceil(getTextWidth(maxY.toLocaleString()) + 10);

  const handleLegendClick = (e) => {
    const { dataKey } = e;
    setHiddenBars(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 40, right: 0, left: leftMargin, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, maxY]} tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip
            formatter={(value, name) => [`${Number(value).toLocaleString()} ฿`, name]}
          />
          <Legend verticalAlign="bottom" height={36} onClick={handleLegendClick} />
          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />

          {devices.map((device, i) => {
            const key = `gen${i + 1}`;
            return (
              <Bar
                key={`bar-${key}`}
                dataKey={key}
                name={device.deviceName || `Gen ${i + 1}`}
                stackId="a"
                fill={distinctColors[i % distinctColors.length]}
                hide={hiddenBars[key]}
              />
            );
          })}

          <Brush dataKey="time" height={30} stroke="#8884d8" />

          <text
            x={110}
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
