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
  Cell,
} from "recharts";

const scopeColors = {
  scope1: ["#008EAF", "#FF35C6", "#FF9966"],
  scope2: ["#008A8B", "#FF35C6", "#FF9966"],
  scope3: ["#BFFCFB", "#FF35C6", "#FF9966"],
};

const scopes = [
  { key: "scope1", label: "Scope 1" },
  { key: "scope2", label: "Scope 2" },
  { key: "scope3", label: "Scope 3" },
];

export default function ScopeTop3BarChart({ year, emissionData }) {
  const safeEmissionData = Array.isArray(emissionData) ? emissionData : [];
  const selectedYearData = safeEmissionData.find((item) => item.year === year);

  const CustomizedYAxisTick = ({ x, y, payload }) => {
    const words = payload.value.split(" ");
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={4} textAnchor="end" fill="#666" fontSize={10}>
          {words.map((word, index) => (
            <tspan key={index} x={0} dy={index === 0 ? 0 : 10}>
              {word}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {scopes.map(({ key, label }) => {
        const scopeData = selectedYearData?.[key]?.data ?? [];
        const colors = scopeColors[key] || ["#8884d8", "#82ca9d", "#ffc658"];

        return (
          <div key={key} className="bg-white p-4 rounded shadow h-72">
            <div style={{ width: "100%", height: "100%" }}>
              {scopeData.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-gray-500">
                  <h3 className="font-bold mb-2 text-center">{label} Top3 Emission</h3>
                  <p>No data available</p>
                </div>
              ) : (
                <>
                  <h3 className="font-bold mb-2">{label} Top3 Emission</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={scopeData}
                      margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        tickFormatter={(v) => v.toLocaleString()}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={<CustomizedYAxisTick />}
                      />
                      <Tooltip formatter={(value) => `${value} tCO₂e`} />
                      <Bar dataKey="value" >
                        {scopeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                          />
                        ))}
                        <LabelList
                          dataKey="value"
                          position="right"
                          formatter={(val) => val.toLocaleString()}
                          style={{ fontSize: 10, fill: "#333" }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
