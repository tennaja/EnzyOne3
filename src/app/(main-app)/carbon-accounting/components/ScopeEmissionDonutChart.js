import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from "@mui/material/Tooltip";

const scopes = [
  { key: "scope1", label: "Scope 1", id: 1 },
  { key: "scope2", label: "Scope 2", id: 2 },
  { key: "scope3", label: "Scope 3", id: 3 },
];
const scopeTooltips = {
  scope1: {
    title: "Scope 1 : การปล่อยก๊าซเรือนกระจกโดยตรง (Direct Emissions)",
    description: "การปล่อยก๊าซเรือนกระจกโดยตรงทั้งหมดจากกิจกรรมขององค์กรหรือภายใต้การควบคุมขององค์กร เช่น การเผาไหม้เชื้อเพลิง สารทำความเย็น หม้อไอน้ำ เตาเผา การปล่อยก๊าซจากยานพาหนะ",
  },
  scope2: {
    title: "Scope 2 : การปล่อยก๊าซเรือนกระจกทางอ้อมที่ถูกซื้อมา (Indirect Emissions)",
    description: "การปล่อยก๊าซเรือนกระจกทางอ้อมที่เกี่ยวข้องกับพลังงานที่ซื้อหรือได้มาเท่านั้น เช่น ไอน้ำ ไฟฟ้า ความร้อน หรือการทำความเย็น ซึ่งเกิดขึ้นนอกสถานที่และถูกใช้โดยองค์กร",
  },
  scope3: {
    title: "Scope 3 : การปล่อยก๊าซเรือนกระจกทางอ้อมที่อยู่เหนือการควบคุม (indirect value chain emissions)",
    description: "การปล่อยก๊าซเรือนกระจกทางอ้อมอื่นๆ ทั้งหมดจากกิจกรรมขององค์กร ซึ่งเกิดขึ้นจากแหล่งที่องค์กรไม่ได้เป็นเจ้าของหรือควบคุม เช่น การใช้กระดาษA4, การใช้น้ำประปา, การซื้อไฟฟ้าเพื่อจำหน่าย, การใช้รถบริการรับ-ส่งพนักงาน",
  },
};

const scopeColors = {
  scope1: ["#008EAF", "#FF35C6", "#FF9966","#4bc0c0"],
  scope2: ["#008A8B", "#FF35C6", "#FF9966","#4bc0c0"],
  scope3: ["#BFFCFB", "#FF35C6", "#FF9966","#4bc0c0"],
};

export default function ScopeEmissionDonutChart({ year, emissionData, setActiveTab }) {
  const safeEmissionData = Array.isArray(emissionData) ? emissionData : [];
  const selectedYearData = safeEmissionData.find((item) => item.year === year);
  
  if (!selectedYearData) {
    // กรณีไม่มีข้อมูลปีนั้นเลย แสดง No data ในทุก scope
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {scopes.map(({ key, label }) => (
          
          <div
            key={key}
            className="bg-white p-4 rounded shadow flex flex-col h-72 relative"
          >
            <h3 className="font-bold mb-2 text-left flex items-center gap-1">
              {label} Emissions
              <Tooltip
  title={
    <>
      <strong>{scopeTooltips[key].title}</strong>
      <div>{scopeTooltips[key].description}</div>
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

            <div className="flex-1 flex justify-center items-center">
              <p className="text-gray-500 text-sm">No data available</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // กรณีมีข้อมูลปีนั้น
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {scopes.map(({ key, label, id }) => {
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
            <h3 className="font-bold mb-2 text-left flex items-center gap-1">
              {label} Emissions
              <Tooltip
  title={
    <>
      <strong>{scopeTooltips[key].title}</strong>
      <div>{scopeTooltips[key].description}</div>
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

            <div className="relative w-full min-h-[280px] h-72 flex justify-center items-center">
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, bottom: 20 }}>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      label={({ value }) => `${value} tCO₂e`}

                      isAnimationActive={false}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) =>
                        `${Number(value).toLocaleString()} tCO₂e`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm">No data available</p>
              )}

              {/* จำนวนรวมแสดงตรงกลาง */}
              {hasData ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-lg font-bold">{formattedTotal}</p>
                  <p className="text-sm text-gray-500">tCO₂e</p>
                </div>
              ) : null}
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
                  <button
                    className="w-20 text-sm border border-[#32c0bf] text-[#32c0bf] rounded py-1 hover:bg-[#e6fafa] transition"
                    onClick={() =>
                      setActiveTab?.({ tab: "detail", scopeId: id })
                    }
                  >
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
