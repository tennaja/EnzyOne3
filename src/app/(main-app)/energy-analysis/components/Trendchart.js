'use client';
import React, { useMemo, useState, useCallback } from 'react';
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

  const [hiddenKeys, setHiddenKeys] = useState([]);

  const chartData = useMemo(() => {
    if (!timestamp.length || !devices.length) return [];

    return timestamp.map((time, index) => {
      const point = { time };
      devices.forEach((device, i) => {
        point[`gen${i + 1}`] = device.history?.[index] ?? 0;
      });
      return point;
    });
  }, [timestamp, devices]);

  const maxY = useMemo(() => {
    return Math.max(
      ...chartData.flatMap(item =>
        devices.map((_, i) => item[`gen${i + 1}`] ?? 0)
      )
    );
  }, [chartData, devices]);

  const getTextWidth = (text, font = '12px sans-serif') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  };

  const leftMargin = useMemo(() => {
    const maxLabel = maxY.toLocaleString();
    const width = getTextWidth(maxLabel, '12px Roboto');
    return Math.max(1, width + 10);
  }, [maxY]);

  const handleLegendClick = useCallback(
    (e) => {
      const key = e.dataKey || e.value;
      setHiddenKeys((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    },
    []
  );

  const legendProps = {
    onClick: handleLegendClick,
    wrapperStyle: { cursor: 'pointer', marginBottom: -20 },
  };

  const renderUnitLabel = () => (
    <text
      x={80}
      y={15}
      fontSize={15}
      fontWeight="bold"
      fill="currentColor"
      className="text-black dark:text-white"
    >
      {["month", "year", "lifetime"].includes(type) ? "kWh" : "kW"}
    </text>
  );

  if (!timestamp.length || !devices.length || !chartData.length) {
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

  const isBarChart = ["month", "year", "lifetime"].includes(type);

  return (
    <ResponsiveContainer width="100%" height={300}>
      {isBarChart ? (
        <ComposedChart
          data={chartData}
          margin={{ top: 40, right: 0, left: leftMargin, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" textAnchor="middle" height={40} />
          <YAxis domain={[0, maxY]} tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip formatter={(value, name) => [`${Number(value).toLocaleString()} kWh`, name]} />
          <Legend {...legendProps} />
          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
          {renderUnitLabel()}
          {devices.map((device, i) => (
            <Bar
              key={`bar-gen${i + 1}`}
              dataKey={`gen${i + 1}`}
              name={device.deviceName || `Gen ${i + 1}`}
              fill={distinctColors[i % distinctColors.length]}
              stackId="a"
              hide={hiddenKeys.includes(`gen${i + 1}`)}
            />
          ))}
          <Brush dataKey="time" height={30} stroke="#8884d8" />
        </ComposedChart>
      ) : (
        <LineChart data={chartData} margin={{ top: 40, right: 0, left: leftMargin, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" textAnchor="middle" height={40} />
          <YAxis domain={[0, maxY]} tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip formatter={(value, name) => [`${Number(value).toLocaleString()} kW`, name]} />
          <Legend {...legendProps} />
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
              hide={hiddenKeys.includes(`gen${i + 1}`)}
            />
          ))}
          <Brush dataKey="time" height={30} stroke="#8884d8" />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}
