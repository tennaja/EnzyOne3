'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function EmissionsChart({ barData }) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const LEGEND_ITEMS = [
    { name: 'Scope 1', color: '#0088FE' },
    { name: 'Scope 2', color: '#00C49F' },
    { name: 'Scope 3', color: '#FFBB28' },
  ];

  if (!barData || barData.length === 0) {
    return <p>No data available</p>;
  }

  // สร้าง Pie data จากการรวมค่าทุกเดือน
  const totalByScope = barData.reduce(
    (acc, entry) => {
      acc['Scope 1'] += entry['Scope 1'] || 0;
      acc['Scope 2'] += entry['Scope 2'] || 0;
      acc['Scope 3'] += entry['Scope 3'] || 0;
      return acc;
    },
    { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 }
  );

  const pieData = [
    { name: 'Scope 1', value: totalByScope['Scope 1'] },
    { name: 'Scope 2', value: totalByScope['Scope 2'] },
    { name: 'Scope 3', value: totalByScope['Scope 3'] },
  ];

  const totalValue = pieData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        {/* Pie Chart */}
        <div style={{ flex: 1, position: 'relative', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Total in the center of the Pie */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{totalValue.toLocaleString()}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>tCO₂e</p>
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div style={{ flex: 2, height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Scope 1" stackId="a" fill="#0088FE" />
              <Bar dataKey="Scope 2" stackId="a" fill="#00C49F" />
              <Bar dataKey="Scope 3" stackId="a" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Shared Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '30px' }}>
        {LEGEND_ITEMS.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: '50%' }} />
            <span style={{ fontSize: '14px', color: '#333' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
