import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

const scopeColors = {
  scope1: ["#008EAF", "#FF35C6", "#FF9966","#4bc0c0"],
  scope2: ["#008A8B", "#FF35C6", "#FF9966","#4bc0c0"],
  scope3: ["#63ebe7", "#FF35C6", "#FF9966","#4bc0c0"],
};

const scopes = [
  { key: "scope1", label: "Scope 1" },
  { key: "scope2", label: "Scope 2" },
  { key: "scope3", label: "Scope 3" },
];

const scopeTooltips = {
  scope1: {
    title: "Scope 1 : การปล่อยก๊าซเรือนกระจกโดยตรง (Direct Emissions)",
    description:
      "การปล่อยก๊าซเรือนกระจกโดยตรงทั้งหมดจากกิจกรรมขององค์กรหรือภายใต้การควบคุมขององค์กร เช่น การเผาไหม้เชื้อเพลิง สารทำความเย็น หม้อไอน้ำ เตาเผา การปล่อยก๊าซจากยานพาหนะ",
  },
  scope2: {
    title: "Scope 2 : การปล่อยก๊าซเรือนกระจกทางอ้อมที่ถูกซื้อมา (Indirect Emissions)",
    description:
      "การปล่อยก๊าซเรือนกระจกทางอ้อมที่เกี่ยวข้องกับพลังงานที่ซื้อหรือได้มาเท่านั้น เช่น ไอน้ำ ไฟฟ้า ความร้อน หรือการทำความเย็น ซึ่งเกิดขึ้นนอกสถานที่และถูกใช้โดยองค์กร",
  },
  scope3: {
    title: "Scope 3 : การปล่อยก๊าซเรือนกระจกทางอ้อมที่อยู่เหนือการควบคุม (indirect value chain emissions)",
    description:
      "การปล่อยก๊าซเรือนกระจกทางอ้อมอื่นๆ ทั้งหมดจากกิจกรรมขององค์กร ซึ่งเกิดขึ้นจากแหล่งที่องค์กรไม่ได้เป็นเจ้าของหรือควบคุม เช่น การใช้กระดาษA4, การใช้น้ำประปา, การซื้อไฟฟ้าเพื่อจำหน่าย, การใช้รถบริการรับ-ส่งพนักงาน",
  },
};

export default function ScopeTop3BarChart({ year, emissionData }) {
  // เช็คข้อมูลให้แน่นอนเป็น array
  const safeEmissionData = Array.isArray(emissionData) ? emissionData : [];

  // หา data ปีที่ต้องการ
  const selectedYearData = safeEmissionData.find((item) => item.year === year) || {};

  // Custom tick แสดงคำในแกน y ให้ขึ้นบรรทัดใหม่ได้
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

  // ฟังก์ชัน map ข้อมูล scope (กรอง Top3)

  const getScopeTop3Data = (scopeKey) => {
    const data = selectedYearData[scopeKey]?.data ?? [];
    return data.map(({ name, value }) => ({
      name,
      value,
    }));
  };
  
  // const getScopeTop3Data = (scopeKey) => {
  //   const data = selectedYearData[scopeKey]?.data ?? [];
  //   return data
  //     .slice()
  //     .sort((a, b) => b.value - a.value)
  //     .map(({ name, value }) => ({
  //       name,
  //       value,
  //     }));
  // };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {scopes.map(({ key, label }) => {
        const scopeDataFormatted = getScopeTop3Data(key);

        const colors = scopeColors[key] || ["#8884d8", "#82ca9d", "#ffc658"];

        return (
          <div
            key={key}
            className="bg-white p-4 rounded shadow h-72 flex flex-col"
          >
            {/* หัวข้อ พร้อม tooltip */}
            <h3 className="font-bold mb-2 text-left flex items-center gap-1">
              {label} Top 3 Emissions
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
                  tooltip: { sx: { fontSize: "14px", fontFamily: "inherit" } },
                }}
              >
                <InfoOutlinedIcon
                  className="text-[#33BFBF] ml-1 cursor-pointer"
                  fontSize="small"
                />
              </Tooltip>
            </h3>

            <div className="flex-1">
              {scopeDataFormatted.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={scopeDataFormatted}
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
                    <RechartsTooltip
  // labelFormatter ใช้แสดงชื่อแทน label ปกติ
  labelFormatter={(label, payload) => {
    if (payload && payload.length > 0) {
      return payload[0].payload.name; // แสดงชื่อข้อมูล
    }
    return label;
  }}
  // formatter แสดงแค่ค่าตัวเลขพร้อมหน่วย ไม่ขึ้นคำว่า "value:"
  formatter={(value, name, props) => {
    return [`${value.toLocaleString()} tCO₂e`, ""]; // ชื่อช่องว่าง ไม่แสดงอะไร
  }}
/>

                    <Bar dataKey="value">
                      {scopeDataFormatted.map((entry, index) => (
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
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
