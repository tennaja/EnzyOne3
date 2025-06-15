'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function generateRandomColors(count) {
  const colors = [];
  const saturation = 70;
  const lightness = 50;

  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 / count) * i);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}

// ✅ Label: แสดงแค่เปอร์เซ็นต์
const renderSimpleLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize={14}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(2)}%`}
    </text>
  );
};

export default function EnergyPieChart({ data }) {
  let pieData = [];
console.log('EnergyPieChart data:', data);
  if (Array.isArray(data)) {
    // ✅ กรณีรับแบบ [{ name: 'Energy from Grid', value: 45 }, ...]
    pieData = data;
  } else if (data?.devices) {
    // ✅ กรณีรับแบบ { devices: [...] }
    pieData = data.devices
      .filter((d) => !d.deviceName.startsWith('Forecast')) // ❌ ตัด Forecast ออก
      .map((d) => ({
        name: d.deviceName,
        value: d.energy,
      }));
  }

  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
  const COLORS = generateRandomColors(pieData.length);

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            outerRadius={100}
            dataKey="value"
            label={renderSimpleLabel}
            labelLine={false}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
  formatter={(value, name) => {
    const percent = ((value / totalValue) * 100).toFixed(2);
    return [`${percent}%`, name];
  }}
/>


        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {pieData.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[idx] }}
            ></div>
            <span className="text-sm">{entry.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}
