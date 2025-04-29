'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const pieData = [
  { name: 'Energy from Grid', value: 50 },
  { name: 'Energy from PV', value: 50 },
];

const COLORS = ['#10B981', '#6B7280'];

export default function EnergyPieChart() {
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex gap-4">
        {pieData.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
            <span className='text-sm'>{entry.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}
