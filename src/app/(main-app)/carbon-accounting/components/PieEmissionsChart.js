'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function PieEmissionsChart({ data, colors, total }) {
  return (
    <div style={{ width: '100%', position: 'relative', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index].color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{total.toLocaleString()}</p>
        <p style={{ fontSize: '12px', color: '#666' }}>tCO₂e</p>
      </div>
    </div>
  );
}
