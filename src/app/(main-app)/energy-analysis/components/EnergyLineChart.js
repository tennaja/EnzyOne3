'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const lineData = [
  { name: 'Mon', yield: 20, consumption: 80 },
  { name: 'Tue', yield: 25, consumption: 90 },
  { name: 'Wed', yield: 30, consumption: 95 },
  { name: 'Thu', yield: 27, consumption: 85 },
  { name: 'Fri', yield: 32, consumption: 100 },
  { name: 'Sat', yield: 28, consumption: 92 },
  { name: 'Sun', yield: 25, consumption: 101 },
];

export default function EnergyLineChart() {
  return (
   
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="yield" stroke="#10B981" strokeWidth={2} />
          <Line type="monotone" dataKey="consumption" stroke="#3B82F6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    
  );
}
