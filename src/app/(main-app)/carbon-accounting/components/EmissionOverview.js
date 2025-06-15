'use client';
import React, { useState, useMemo ,useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  ResponsiveContainer,
} from 'recharts';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from "@mui/material/Tooltip";
const COLORS = {
  scope1: '#4BC0C0',
  scope2: '#008A8B',
  scope3: '#63ebe7',
};

const scopeNames = {
  scope1: 'Scope 1',
  scope2: 'Scope 2',
  scope3: 'Scope 3',
};

export default function EmissionsOverview({ selectedYear,totalEmission, totalEmissionByMonth, onDetailClick }) {
  const allScopes = Object.keys(scopeNames);

  // ตรวจสอบ scope ที่มีข้อมูลจาก totalEmission หรือ totalEmissionByMonth
  const availableScopes = useMemo(() => {
    const fromTotal = totalEmission
      ? Object.entries(totalEmission)
          .filter(([key, value]) => value !== null && value !== 0)
          .map(([key]) => key)
      : [];

    const fromMonthly = totalEmissionByMonth
      ? allScopes.filter((scope) =>
          Object.values(totalEmissionByMonth).some((month) => month[scope] !== null && month[scope] !== 0)
        )
      : [];

    // รวมจากทั้งสองแหล่ง แล้ว filter ให้ไม่ซ้ำ
    return Array.from(new Set([...fromTotal, ...fromMonthly]));
  }, [totalEmission, totalEmissionByMonth]);

  const [visibleScopes, setVisibleScopes] = useState(availableScopes);
  useEffect(() => {
    setVisibleScopes(availableScopes);
  }, [availableScopes]);
  

  const toggleScope = (scope) => {
    setVisibleScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const pieData = useMemo(() => {
    if (!totalEmission || Object.keys(totalEmission).length === 0) return null;

    return Object.entries(totalEmission)
      .filter(([key]) => visibleScopes.includes(key))
      .map(([key, value]) => ({
        name: key,
        value,
      }));
  }, [totalEmission, visibleScopes]);

  const pieTotal = pieData?.reduce((sum, item) => sum + item.value, 0) || 0;

  const barData = useMemo(() => {
    if (!totalEmissionByMonth || Object.keys(totalEmissionByMonth).length === 0) return [];

    return Object.entries(totalEmissionByMonth).map(([month, values]) => ({
      month: month.charAt(0).toUpperCase() + month.slice(1),
      ...Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value !== null ? value : undefined])
      ),
    }));
  }, [totalEmissionByMonth]);

  return (
    <div>
      <div className="flex w-full gap-4 flex-col lg:flex-row">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2">
  <h3 className="font-semibold text-md ">
    Total Emissions
    <Tooltip
      title={
        <>
          <strong>Total Emissions</strong>
          <div>ปริมาณการปล่อยก๊าซเรือนกระจกทั้งหมดจากทั้ง 3 Scope ภายในระยะเวลา 1 ปี</div>
        </>
      }
      arrow
      placement="top"
      componentsProps={{
        tooltip: { sx: { fontSize: "14px", fontFamily: "inherit" } },
      }}
    >
      <InfoOutlinedIcon
        className="text-[#33BFBF] ml-1 cursor-pointer"
        fontSize="small"
      />
    </Tooltip>
  </h3>
  {/* New Label */}
  <p className="text-base text-gray-500 mt-2">
    January - December {selectedYear}
  </p>
  {pieData && pieData.length > 0 ? (
    <div style={{ width: "100%", position: "relative", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            label={({ value }) => `${value} tCO₂e`}
          >
            {pieData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[entry.name]}
              />
            ))}
          </Pie>
          <PieTooltip formatter={(value) => `${value} tCO₂e`} />
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "16px", fontWeight: "bold" }}>
          {pieTotal.toLocaleString()}
        </p>
        <p style={{ fontSize: "12px", color: "#666" }}>tCO₂e</p>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-[400px] text-gray-400 text-lg">
      No data
    </div>
  )}
</div>

        {/* Bar Chart */}
        <div className="w-full lg:w-1/2">
          <h3 className="font-semibold text-md mb-10">Monthly Emissions Trends
          <Tooltip
  title={
    <>
      <strong>Monthly Emissions Trends</strong>
      <div>ปริมาณการปล่อยก๊าซเรือนกระจกจากทั้ง 3 Scope จำแนกรายเดือนภายในระยะเวลา 1 ปี</div>
    </>
  }
  arrow
  placement="top"
  componentsProps={{
    tooltip: { sx: { fontSize: "14px" ,fontFamily: "inherit", } },
  }}
>
  <InfoOutlinedIcon
    className="text-[#33BFBF] ml-1 cursor-pointer"
    fontSize="small"
  />
</Tooltip>
          </h3>
          {barData && barData.length > 0 ? (
            <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={barData}
    margin={{ top: 35, right: 50, left: 0, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="month"
      label={{
        angle: 0,
        value: 'Month',
        position: 'insideRight',
        offset: 0,
        dy: -15, // ย้ายลงใต้เส้นแกน X
        dx: 50,
        style: { fontSize: 14, fill: '#666' },
      }}
    />
    <YAxis 
  label={{
    value: 'tCO₂e',
    angle: 0,
    position: 'top',
    offset: 0,
    dx: 20,
    dy: -20, // ย้ายขึ้นเหนือเส้นแกน Y
    style: { fontSize: 14, fill: '#666' },
  }} 
/>


    <BarTooltip formatter={(value) => `${value} tCO₂e`} />
    {availableScopes.map((scope) =>
      visibleScopes.includes(scope) ? (
        <Bar
          key={scope}
          dataKey={scope}
          stackId="a"
          fill={COLORS[scope]}
        />
      ) : null
    )}
  </BarChart>
</ResponsiveContainer>

          </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-gray-400 text-lg">
              No data
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      {availableScopes.length > 0 && (
        <div className="flex justify-center mt-6 gap-6">
          {availableScopes.map((scope) => (
            <div
              key={scope}
              onClick={() => toggleScope(scope)}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: COLORS[scope],
                  borderRadius: '50%',
                  opacity: visibleScopes.includes(scope) ? 1 : 0.3,
                  border: visibleScopes.includes(scope) ? 'none' : '1px solid #ccc',
                }}
              />
              <span
                style={{
                  fontSize: '14px',
                  color: visibleScopes.includes(scope) ? '#333' : '#aaa',
                  textDecoration: visibleScopes.includes(scope) ? 'none' : 'line-through',
                }}
              >
                {scopeNames[scope]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Detail Button */}
      <div className="mt-6 flex justify-center">
        <button
          className="w-20 text-sm border border-[#32c0bf] text-[#32c0bf] rounded py-1 hover:bg-[#e6fafa] transition"
          onClick={() => onDetailClick?.()}
        >
          Detail
        </button>
      </div>
    </div>
  );
}
