'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

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

const pieData = [
  { name: 'Grid', value: 30 },
  { name: 'PV', value: 40 },
  { name: 'Battery', value: 20 },
  { name: 'Loss', value: 10 },
];

const COLORS = generateRandomColors(pieData.length);

// ✅ Custom label: แนวนอน + ตัวเล็ก
const renderSimpleLabel = ({
  cx, cy, midAngle, outerRadius, percent, name,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize={10} // 👈 ตัวเล็กลง
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function EnergyPieChart() {
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
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} kWh`, name]} />
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
