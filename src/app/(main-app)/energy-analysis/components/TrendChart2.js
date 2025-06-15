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

const getTextWidth = (text, font = '12px sans-serif') => {
  if (typeof document === 'undefined') return 0;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  return context.measureText(text).width;
};

export default function EnergyTrendChart3({ type, data }) {
  const isSummaryType = type === 'month' || type === 'year' || type === 'lifetime';

  const { devices = [], timestamp = [] } = data || {};
  const [hiddenKeys, setHiddenKeys] = useState([]);

  // สร้างข้อมูลสำหรับกราฟ (เรียก useMemo ก่อน return ใด ๆ)
  const chartData = useMemo(() => {
    return timestamp.map((time, index) => {
      const point = { day: time };
      devices.forEach((device) => {
        const deviceKey = device.deviceName;
        point[deviceKey] = device.history?.[index] ?? null;
        if (isSummaryType && Array.isArray(device.baseline)) {
          point[`baseline_${deviceKey}`] = device.baseline[index] ?? null;
        }
      });
      return point;
    });
  }, [timestamp, devices, isSummaryType]);

  const maxY = useMemo(() => {
    const allValues = chartData.flatMap((obj) =>
      Object.values(obj).filter((v) => typeof v === 'number')
    );
    return Math.max(...allValues.map((v) => Math.abs(v)), 0);
  }, [chartData]);

  const leftMargin = useMemo(() => {
    const label = maxY.toLocaleString();
    const width = getTextWidth(label, '12px Roboto');
    return Math.ceil(width + 10);
  }, [maxY]);

  const colorList = ['#FB8C00', '#008001', '#03A9F4', '#AB47BC', '#FF7043'];
  const baselineColorList = ['#FFD54F', '#AED581', '#81D4FA', '#CE93D8', '#FFAB91'];

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
      {isSummaryType ? 'kWh' : 'kW'}
    </text>
  );

  // *** ไม่ return ก่อน เรียก hook ทุกตัวก่อน ***

  // กรณี no data แสดง div แทนกราฟ
  if (!timestamp.length || !devices.length) {
    return (
      <div
        style={{
          width: '100%',
          height: 300,
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

  // render กราฟ summary หรือ non-summary
  if (isSummaryType) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={chartData}
          barCategoryGap={10}
          margin={{ top: 40, right: 0, left: leftMargin, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, maxY]} tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip formatter={(value, name) => [`${Number(value).toLocaleString()} kWh`, name]} />
          <Legend {...legendProps} />
          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
          {renderUnitLabel()}

          {devices.map((device, index) => {
            const key = device.deviceName;
            return (
              <Bar
                key={`actual-${key}`}
                dataKey={key}
                stackId="actual"
                name={key}
                fill={colorList[index % colorList.length]}
                hide={hiddenKeys.includes(key)}
              />
            );
          })}

          {devices.map((device, index) => {
            const baselineKey = `baseline_${device.deviceName}`;
            return (
              <Bar
                key={`baseline-${baselineKey}`}
                dataKey={baselineKey}
                stackId="baseline"
                name={`Baseline ${device.deviceName}`}
                fill={baselineColorList[index % baselineColorList.length]}
                hide={hiddenKeys.includes(baselineKey)}
              />
            );
          })}
                    <Brush
                                                    dataKey="time"
                                                    height={30}
                                                    stroke="#8884d8"
                                                    startIndex={chartData.length <= 1 ? 0 : undefined}
                                                    endIndex={chartData.length - 1}
                                                    travellerWidth={chartData.length <= 1 ? 0 : undefined}
                                                    disabled={chartData.length <= 1}
                                                  />
          {/* <Brush dataKey="day" height={30} stroke="#8884d8" /> */}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  // non-summary line chart
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 40, right: 0, left: leftMargin, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis domain={[0, maxY]} tickFormatter={(v) => v.toLocaleString()} />
        <Tooltip formatter={(value, name) => [`${Number(value).toLocaleString()} kW`, name]} />
        <Legend {...legendProps} />
        <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
        {renderUnitLabel()}

        {devices.map((device, index) => {
          const key = device.deviceName;
          return (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colorList[index % colorList.length]}
              strokeWidth={2}
              name={key}
              hide={hiddenKeys.includes(key)}
            />
          );
        })}
<Brush
                                                    dataKey="time"
                                                    height={30}
                                                    stroke="#8884d8"
                                                    startIndex={chartData.length <= 1 ? 0 : undefined}
                                                    endIndex={chartData.length - 1}
                                                    travellerWidth={chartData.length <= 1 ? 0 : undefined}
                                                    disabled={chartData.length <= 1}
                                                  />

        {/* <Brush dataKey="day" height={30} stroke="#8884d8" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
}
