'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BarEmissionsChart({ data, colors }) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          {colors.map((item, index) => (
            <Bar key={index} dataKey={item.name} stackId="a" fill={item.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
