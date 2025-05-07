'use client';

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

const data = [];

for (let day = 1; day <= 18; day++) {
  const time = `${day.toString().padStart(2, '0')}`;
  data.push({
    day: time,
    gen1: 40 + Math.floor(Math.random() * 50),
    gen2: 50 + Math.floor(Math.random() * 50),
    gen3: 30 + Math.floor(Math.random() * 50),
  });
}

const maxY = Math.max(
  ...data.flatMap(item => [item.gen1, item.gen2, item.gen3])
);

export default function RevenueBarChart2() {
  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, maxY]} />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />

          {/* Stacked Bars with stackId */}
          <Bar dataKey="gen1" stackId="a" fill="#FFB74D" name="Gen 1" />
          <Bar dataKey="gen2" stackId="a" fill="#81C784" name="Gen 2" />
          <Bar dataKey="gen3" stackId="a" fill="#4FC3F7" name="Gen 3" />

          <Brush dataKey="day" height={30} stroke="#8884d8" />

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
