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

const data = [];

for (let day = 1; day <= 18; day++) {
  const time = `${day.toString().padStart(2, '0')}`;
  data.push({
    day: time,
    gen1: 40 + Math.floor(Math.random() * 50),
    gen2: 50 + Math.floor(Math.random() * 50),
    gen3: 30 + Math.floor(Math.random() * 50),
    baseline1: 60 + Math.floor(Math.random() * 20),
    baseline2: 70 + Math.floor(Math.random() * 20),
    baseline3: 50 + Math.floor(Math.random() * 20),
  });
}

const maxY = Math.max(
  ...data.flatMap(item => [
    item.gen1,
    item.gen2,
    item.gen3,
    item.baseline1,
    item.baseline2,
    item.baseline3,
  ])
);

export default function RevenueChart3() {
  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={data}
          margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, maxY]} />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />

          {/* Bar (Load) */}
          <Bar dataKey="gen1" stackId="a" fill="#FFB74D" name="Load 1" />
          <Bar dataKey="gen2" stackId="a" fill="#81C784" name="Load 2" />
          <Bar dataKey="gen3" stackId="a" fill="#4FC3F7" name="Load 3" />

          {/* Line (Baseline) */}
          <Line
            type="monotone"
            dataKey="baseline1"
            stroke="#D32F2F"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
            name="Baseline Load A"
          />
          <Line
            type="monotone"
            dataKey="baseline2"
            stroke="#1976D2"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
            name="Baseline Load B"
          />
          <Line
            type="monotone"
            dataKey="baseline3"
            stroke="#388E3C"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
            name="Baseline Load C"
          />

          <Brush dataKey="day" height={30} stroke="#8884d8" />

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
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
