import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// สีของ Pie
const COLORS = ["#0070f3", "#e91e63", "#9e9e9e"];

function ScopeEmissionDonutChart({ scope, data, total }) {
  const calculatedTotal = total ?? data.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
  const safeTotal = Number(String(calculatedTotal).replace(/,/g, ''));

  const formattedTotal = !isNaN(safeTotal)
    ? safeTotal.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
    : "0.000";

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-between h-full">
      {/* Title ชิดซ้าย */}
      <h3 className="font-bold mb-2 text-left">{scope} Emissions</h3>

      <div className="relative w-full min-h-[280px] h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, bottom: 20 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              labelLine
              label
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toLocaleString()} tCO₂e`} />
          </PieChart>
        </ResponsiveContainer>

        {/* Total ตรงกลาง donut */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-lg font-bold">{formattedTotal}</p>
          <p className="text-sm text-gray-500">tCO₂e</p>
        </div>
      </div>

      {/* Legend ด้านล่าง */}
      <div className="mt-4 text-sm w-full">
        <p className="font-semibold text-center mb-1">Top3 Emissions Ratio</p>
        <ul className="space-y-1">
          {data.map((item, index) => {
            const percent = safeTotal > 0
              ? ((item.value / safeTotal) * 100).toFixed(1)
              : '0.0';

            return (
              <li key={index} className="flex items-center text-sm">
                <span
                  className="w-3 h-3 inline-block rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="flex-1 truncate">{item.name}</span>
                <span className="ml-2 text-gray-500">{percent}%</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ปุ่มล่างสุด + สไตล์ใหม่ */}
      <div className="mt-4 flex justify-center">
        <button
          className="w-20 text-sm border border-[#32c0bf] text-[#32c0bf] rounded py-1 hover:bg-[#e6fafa] transition"
        >
          Detail
        </button>
      </div>
    </div>
  );
}

export default ScopeEmissionDonutChart;
