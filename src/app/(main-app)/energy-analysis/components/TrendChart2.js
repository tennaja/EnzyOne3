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

export default function EnergyTrendChart3({ type, data }) {
  const isSummaryType = type === 'month' || type === 'year' || type === 'lifetime';

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

  // 🔁 แปลงข้อมูลให้อยู่ในรูปแบบ Array พร้อม actual & baseline ต่อ device
  const chartData = timestamp.map((time, index) => {
    const point = { day: time };

    devices.forEach((device, dIndex) => {
      const deviceKey = device.deviceName;
      point[deviceKey] = device.history?.[index] ?? null;

      // baseline ของแต่ละ device -> ตั้งชื่อแยก key
      if (isSummaryType && Array.isArray(device.baseline)) {
        point[`baseline_${deviceKey}`] = device.baseline[index] ?? null;
      }
    });

    return point;
  });

  // 🔍 คำนวณ maxY เพื่อขยาย Y-axis
  const allValues = chartData.flatMap(obj =>
    Object.values(obj).filter(v => typeof v === 'number')
  );
  const maxY = Math.max(...allValues);

  const colorList = ['#FB8C00', '#008001', '#03A9F4', '#AB47BC', '#FF7043'];
  const baselineColorList = ['#FFD54F', '#AED581', '#81D4FA', '#CE93D8', '#FFAB91'];

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

  if (isSummaryType) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} barCategoryGap={10} margin={{ top: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, maxY]} />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
          {renderUnitLabel()}

          {/* 🟠 Actual */}
          {devices.map((device, index) => (
            <Bar
              key={`actual-${device.deviceName}`}
              dataKey={device.deviceName}
              stackId="actual"
              name={device.deviceName}
              fill={colorList[index % colorList.length]}
            />
          ))}

          {/* 🟡 Baseline */}
          {devices.map((device, index) => {
            const baselineKey = `baseline_${device.deviceName}`;
            return (
              <Bar
                key={`baseline-${device.deviceName}`}
                dataKey={baselineKey}
                stackId="baseline"
                name={`Baseline ${device.deviceName}`}
                fill={baselineColorList[index % baselineColorList.length]}
              />
            );
          })}

          <Brush dataKey="day" height={30} stroke="#8884d8" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  // 🔵 แบบ LineChart สำหรับ non-summary
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis domain={[0, maxY]} />
        <Tooltip />
        <Legend wrapperStyle={{ marginBottom: -20 }} />
        <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
        {renderUnitLabel()}

        {devices.map((device, index) => (
          <Line
            key={device.deviceName}
            type="monotone"
            dataKey={device.deviceName}
            stroke={colorList[index % colorList.length]}
            strokeWidth={2}
            name={device.deviceName}
          />
        ))}

        <Brush dataKey="day" height={30} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
