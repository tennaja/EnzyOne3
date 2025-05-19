import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    Cell, // ✅ เพิ่มตัวนี้
  } from "recharts";
  

const COLORS = ["#0070f3", "#e91e63", "#9e9e9e"];

function ScopeTop3BarChart({ scope, data }) {
  // คำนวณความสูงจากจำนวน bar (ขั้นต่ำ 250 px)
  const chartHeight = Math.max(data.length * 60, 250);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">{scope} Top3 Emission</h3>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value) => `${value} tCO₂e`} />
            <Bar dataKey="value" fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={(val) => val.toLocaleString()}
                style={{ fontSize: 12, fill: "#333" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ScopeTop3BarChart;
