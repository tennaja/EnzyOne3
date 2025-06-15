'use client';

import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Brush,
} from 'recharts';

export default function RevenueBarChart3({ data, type }) {
  if (!data || !data.timestamp?.length || !data.devices?.length) {
    return (
      <div
        style={{
          width: '100%',
          height: '400px',
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

  const deviceNames = data.devices.map(device => device.deviceName);
  const allLegendKeys = [...deviceNames, 'baseline'];

  const [hiddenKeys, setHiddenKeys] = useState(new Set());

  // สร้างข้อมูล chartData จาก timestamp และ devices
  const chartData = data.timestamp.map((date, index) => {
    const entry = {
      day: date,
      fullDate: date,
    };
    data.devices.forEach(device => {
      entry[device.deviceName] = device.history[index] ?? 0;
    });
    entry['baseline'] = data.devices[0]?.baseline[index] ?? 0;
    return entry;
  });

  const maxY = Math.max(
    ...chartData.flatMap(item => [
      ...deviceNames.map(name => hiddenKeys.has(name) ? 0 : item[name]),
      hiddenKeys.has('baseline') ? 0 : item.baseline,
    ])
  );

  const maxAbsY = Math.max(
    ...chartData.flatMap(item => [
      ...deviceNames.map(name => hiddenKeys.has(name) ? 0 : Math.abs(item[name])),
      hiddenKeys.has('baseline') ? 0 : Math.abs(item.baseline),
    ])
  );

  // คำนวณ left margin
  const getTextWidth = (text, font = '12px Roboto') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  };
  const leftMargin = Math.ceil(getTextWidth(maxAbsY.toLocaleString()) + 10);

  // จัดการ toggle hide/show series
  const handleLegendClick = (event) => {
    const { dataKey } = event;
    setHiddenKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  // สีของแต่ละ device
  const colors = ["#FFB74D", "#81C784", "#4FC3F7", "#BA68C8", "#F06292"];

  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 40, right: 0, left: leftMargin, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, maxY]} tickFormatter={v => v.toLocaleString()} />
          <Tooltip formatter={(value, name) => [`${Number(value).toLocaleString()} ฿`, name]} />

          <Legend
            verticalAlign="bottom"
            height={36}
            onClick={handleLegendClick}
            wrapperStyle={{ cursor: 'pointer' }}
            payload={[
              ...deviceNames.map((name, i) => ({
                id: name,
                value: name,
                type: 'square',
                color: colors[i % colors.length],
                inactive: hiddenKeys.has(name),
                dataKey: name,
              })),
              {
                id: 'baseline',
                value: 'Baseline',
                type: 'line',
                color: '#D32F2F',
                inactive: hiddenKeys.has('baseline'),
                dataKey: 'baseline',
              },
            ]}
          />

          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />

          {/* Stack Bars */}
          {deviceNames.map((name, index) =>
            !hiddenKeys.has(name) ? (
              <Bar
                key={name}
                dataKey={name}
                stackId="a"
                fill={colors[index % colors.length]}
                name={name}
              />
            ) : null
          )}

          {/* Baseline Line */}
          {!hiddenKeys.has('baseline') && (
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#D32F2F"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
              name="Baseline"
            />
          )}

         {/* Conditionally Render Brush */}
         {/* <Brush
            dataKey="day"
            height={30}
            stroke="#8884d8"
            startIndex={type === 'lifetime' ? 0 : undefined}
            endIndex={type === 'lifetime' ? chartData.length - 1 : undefined}
            travellerWidth={type === 'lifetime' ? 0 : undefined}
          /> */}

          <Brush
                                                              dataKey="day"
                                                              height={30}
                                                              stroke="#8884d8"
                                                              startIndex={chartData.length <= 1 ? 0 : undefined}
                                                              endIndex={chartData.length - 1}
                                                              travellerWidth={chartData.length <= 1 ? 0 : undefined}
                                                              disabled={chartData.length <= 1}
                                                            />

          <text
            x={120}
            y={18}
            fill="currentColor"
            className="text-black dark:text-white"
            fontSize={20}
            fontWeight="bold"
          >
            ฿
          </text>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
