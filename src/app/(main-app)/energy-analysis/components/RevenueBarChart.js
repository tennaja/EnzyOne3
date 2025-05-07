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
} from 'recharts';

const data = [
  { day: '01', revenue: 95 },
  { day: '02', revenue: 89 },
  { day: '03', revenue: 117 },
  { day: '04', revenue: 92 },
  { day: '05', revenue: 90 },
  { day: '06', revenue: 102 },
  { day: '07', revenue: 85 },
  { day: '08', revenue: 115 },
  { day: '09', revenue: 80 },
  { day: '10', revenue: 123 },
  { day: '11', revenue: 113 },
  { day: '12', revenue: 87 },
  { day: '13', revenue: 75 },
  { day: '14', revenue: 114 },
  { day: '15', revenue: 109 },
  { day: '16', revenue: 112 },
  { day: '17', revenue: 113 },
  { day: '18', revenue: 78 },
];

export default function RevenueBarChart() {
  return (
    <div style={{ width: '100%', height: 420 }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <Bar dataKey="revenue" fill="#a855f7" name="Revenue" />

          {/* Custom ฿ label on top of Y-axis */}
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
