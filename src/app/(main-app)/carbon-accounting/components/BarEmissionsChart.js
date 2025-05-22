'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function BarEmissionsChart({ data }) {
  // เช็คกรณี data เป็น null, undefined หรือว่าง
  const isEmpty =
    !data ||
    (typeof data === 'object' && Object.keys(data).length === 0);

  if (isEmpty) {
    return (
      <div style={{
        width: '100%',
        height: 400,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#888',
        fontSize: 18,
      }}>
        No data
      </div>
    );
  }

  // แปลง object เป็น array และเก็บ null เป็น undefined เพื่อไม่แสดง bar
  const formattedData = Object.entries(data).map(([month, values]) => ({
    month: month.charAt(0).toUpperCase() + month.slice(1),
    scope1: values.scope1 !== null ? values.scope1 : undefined,
    scope2: values.scope2 !== null ? values.scope2 : undefined,
    scope3: values.scope3 !== null ? values.scope3 : undefined,
  }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="scope1" stackId="a" fill="#BFFCFB" />
          <Bar dataKey="scope2" stackId="a" fill="#008A8B" />
          <Bar dataKey="scope3" stackId="a" fill="#4BC0C0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
