'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function PieEmissionsChart({ data }) {
  console.log('PieEmissionsChart data:', data);

  const isEmpty =
    !data ||
    (Array.isArray(data) && data.length === 0) ||
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

  // แปลง object เป็น array สำหรับ PieChart
  const transformedData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value,
  }));

  // สีแบบตายตัวตามลำดับ
  const fixedColors = ['#BFFCFB', '#008A8B', '#4BC0C0'];

  // คำนวณ total จากค่าทั้งหมด
  const total = transformedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ width: '100%', position: 'relative', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={transformedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            label={({ name, value }) => `${value}`}
          >
            {transformedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={fixedColors[index % fixedColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* แสดงผลรวมตรงกลางกราฟ */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{total.toLocaleString()}</p>
        <p style={{ fontSize: '12px', color: '#666' }}>tCO₂e</p>
      </div>
    </div>
  );
}
