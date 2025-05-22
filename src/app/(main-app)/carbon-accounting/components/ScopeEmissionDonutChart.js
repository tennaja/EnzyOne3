import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const scopeColors = {
  scope1: ["#008EAF", "#FF35C6", "#FF9966"],
  scope2: ["#008A8B", "#FF35C6", "#FF9966"],
  scope3: ["#BFFCFB", "#FF35C6", "#FF9966"],
};

export default function ScopeEmissionDonutChart({ year, emissionData }) {
  const safeEmissionData = Array.isArray(emissionData) ? emissionData : [];
  const selectedYearData = safeEmissionData.find((item) => item.year === year);

  const scopes = [
    { key: "scope1", label: "Scope 1" },
    { key: "scope2", label: "Scope 2" },
    { key: "scope3", label: "Scope 3" },
  ];

  if (!selectedYearData) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {scopes.map(({ key, label }) => (
          <div
            key={key}
            className="bg-white p-4 rounded shadow flex flex-col justify-center items-center h-72 text-gray-500"
          >
            <h3 className="font-bold mb-2 text-center">{label} Emissions</h3>
            <p>No data</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {scopes.map(({ key, label }) => {
        const scopeData = selectedYearData?.[key];
        const data = Array.isArray(scopeData?.data) ? scopeData.data : [];
        const totalRaw = scopeData?.total ?? 0;
        const safeTotal = Number(String(totalRaw).replace(/,/g, "")) || 0;
        const formattedTotal = safeTotal.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        });

        const hasData = data.length > 0;
        const colors = scopeColors[key] || ["#ccc", "#999", "#666"];

        return (
          <div
            key={key}
            className="bg-white p-4 rounded shadow flex flex-col justify-between h-full"
          >
            <h3 className="font-bold mb-2 text-left">{label} Emissions</h3>

            <div className="relative w-full min-h-[280px] h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, bottom: 20 }}>
                  <Pie
                    data={hasData ? data : [{ name: "No data", value: 1 }]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    label={({ value }) => value}
                    isAnimationActive={false}
                  >
                    {hasData
                      ? data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                          />
                        ))
                      : <Cell fill="#f0f0f0" />}
                  </Pie>
                  {hasData && (
                    <Tooltip
                      formatter={(value) =>
                        `${Number(value).toLocaleString()} tCO₂e`
                      }
                    />
                  )}
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                {hasData ? (
                  <>
                    <p className="text-lg font-bold">{formattedTotal}</p>
                    <p className="text-sm text-gray-500">tCO₂e</p>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">No data</p>
                )}
              </div>
            </div>

            {hasData ? (
              <>
                <div className="mt-4 text-sm w-full">
                  <p className="font-semibold text-center mb-1">
                    Top3 Emissions Ratio
                  </p>
                  <ul className="space-y-1">
                    {data.map((item, index) => {
                      const percent =
                        safeTotal > 0
                          ? ((item.value / safeTotal) * 100).toFixed(1)
                          : "0.0";
                      return (
                        <li key={index} className="flex items-center text-sm">
                          <span
                            className="w-3 h-3 inline-block rounded-full mr-2"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          <span className="flex-1 truncate">{item.name}</span>
                          <span className="ml-2 text-gray-500">{percent}%</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-4 flex justify-center">
                  <button className="w-20 text-sm border border-[#32c0bf] text-[#32c0bf] rounded py-1 hover:bg-[#e6fafa] transition">
                    Detail
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-6" />
            )}
          </div>
        );
      })}
    </div>
  );
}
