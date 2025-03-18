import React, { useMemo } from "react";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const MyChart = ({ graphdata }) => {
  // ✅ ใช้ useMemo เพื่อป้องกันการสร้าง data ซ้ำๆ และป้องกัน error
  const data = useMemo(() => {
    if (!graphdata || !graphdata.timestamp) return []; // ถ้ายังไม่มีข้อมูลให้ return []

    return graphdata.timestamp.map((time, index) => ({
      timestamp: time,
      kw: graphdata.kw?.[index] ?? 0, // ใช้ ?? 0 ป้องกัน undefined
      dimming: graphdata.dimming?.[index] ?? 0,
      status: graphdata.status?.[index] ?? 0,
    }));
  }, [graphdata]); // คำนวณใหม่เฉพาะเมื่อ graphdata เปลี่ยน

  // ✅ ป้องกันการ render ComposedChart ถ้า data ยังว่าง
//   if (!data.length) return <p></p>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data} margin={{ top: 40, right: 20, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />

        {/* YAxis สำหรับ kw (ซ้าย) */}
        <YAxis yAxisId="left" orientation="left" label={{ value: "kw", position: "top", offset: 15, angle: 0 }} />
        
        {/* YAxis สำหรับ status (ซ้ายสุด) */}
        <YAxis yAxisId="statusAxis" orientation="left" domain={[0, 1]} tickCount={2} label={{ value: "Status", position: "top", offset: 15, angle: 0 }} />
        
        {/* YAxis สำหรับ dimming (ขวา) */}
        <YAxis yAxisId="right" orientation="right" label={{ value: "Dimming", position: "top", offset: 15, angle: 0 }} />
        
        <Tooltip />

        {/* กราฟแท่งของ dimming (เหลือง) */}
        <Bar dataKey="dimming" fill="#FFCC33" yAxisId="right" />

        {/* กราฟเส้นของ status (เขียว) */}
        <Line type="stepAfter" dataKey="status" stroke="green" strokeWidth={2} yAxisId="statusAxis" dot={true} />

        {/* กราฟเส้นของ kw (น้ำเงิน) */}
        <Line type="monotone" dataKey="kw" stroke="blue" strokeWidth={2} yAxisId="left" dot={true} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default MyChart;
