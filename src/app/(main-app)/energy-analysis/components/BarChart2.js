'use client';

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

export default function RevenueChart3({ data }) {
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

  // ใช้ timestamp โดยตรง
  const chartData = data.timestamp.map((date, index) => {
    const entry = {
      day: date, // ใช้ timestamp โดยตรง
      fullDate: date,
    };

    data.devices.forEach(device => {
      entry[device.deviceName] = device.history[index] ?? 0;
    });

    // สมมุติว่า baseline ของ device แรกเป็น baseline รวม
    entry['baseline'] = data.devices[0]?.baseline[index] ?? 0;

    return entry;
  });

  const maxY = Math.max(
    ...chartData.flatMap(item => [
      ...deviceNames.map(name => item[name]),
      item.baseline,
    ])
  );
  
  // 🧠 เผื่อคุณใช้ค่าลบด้วย → ใช้ Math.abs()
  const maxAbsY = Math.max(
    ...chartData.flatMap(item => [
      ...deviceNames.map(name => Math.abs(item[name])),
      Math.abs(item.baseline),
    ])
  );
  
  // 🧮 คำนวณ left margin ตาม maxAbsY
  const getTextWidth = (text, font = '12px Roboto') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  };
  
  const leftMargin = Math.ceil(getTextWidth(maxAbsY.toLocaleString()) + 10);
  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 40, right: 0, left: leftMargin, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" /> {/* ใช้ timestamp โดยตรง */}
          <YAxis domain={[0, maxY]} />
          <Tooltip
  formatter={(value, name) => [`${Number(value).toLocaleString()} ฿`, name]}
/>

          <Legend verticalAlign="bottom" height={36} />
          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />

          {/* Stack Bars */}
          {deviceNames.map((name, index) => (
            <Bar
              key={name}
              dataKey={name}
              stackId="a"
              fill={["#FFB74D", "#81C784", "#4FC3F7", "#BA68C8", "#F06292"][index % 5]}
              name={name}
            />
          ))}

          {/* Baseline Line */}
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

          <Brush dataKey="day" height={30} stroke="#8884d8" />

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
