import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from "@mui/material/Tooltip";
const scopes = [
  { key: "scope1", label: "Scope 1" },
  { key: "scope2", label: "Scope 2" },
  { key: "scope3", label: "Scope 3" },
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

const scopeColors = [
  ["#008EAF", "#FF35C6", "#FF9966"], // Scope 1
  ["#008A8B", "#FF35C6", "#FF9966"], // Scope 2
  ["#BFFCFB", "#FF35C6", "#FF9966"], // Scope 3
];


function getColor(scopeIndex, itemIndex) {
  const colors = scopeColors[scopeIndex] || ["#000000"]; // fallback สีดำถ้าไม่มีชุดสี
  return colors[itemIndex % colors.length];
}

export default function EmissionTrendCard({ year, emissionData }) {
  // กรองข้อมูลปีที่ไม่ตรงกับปีที่รับเข้ามา (แสดงปีอื่น ๆ ทั้งหมด)
  const filteredData = Array.isArray(emissionData) ? emissionData : [];


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {scopes.map(({ key, label }, scopeIndex) => {
        // ข้อมูลของ scope นี้ สำหรับทุกปีที่กรองแล้ว
        const dataForScope = filteredData
  .filter((item) => item[key] && item[key].data?.length > 0)
  .sort((a, b) => a.year - b.year); // ✅ เรียงปีน้อยไปมาก

  
        // หาชื่อรายการ emission (item.name) จากทุกปีใน scope นี้ (union ของชื่อทั้งหมด)
        const itemNamesSet = new Set();
        dataForScope.forEach((yearData) => {
          yearData[key].data.forEach((item) => {
            itemNamesSet.add(item.name);
          });
        });
        const itemNames = Array.from(itemNamesSet);

        // สร้าง chartData
        // รูปแบบ: [{ year: xxxx, "การเผาไหม้เชื้อเพลิงเพื่อผลิตไฟฟ้า": val, ... }, ...]
        const chartData = dataForScope.map((yearData) => {
          const obj = { year: yearData.year };
          // สร้าง map ชื่อ -> value เพื่อให้ดึงได้ง่าย
          const mapNameToValue = {};
          yearData[key].data.forEach((item) => {
            mapNameToValue[item.name] = item.value || 0;
          });
          itemNames.forEach((name) => {
            obj[name] = mapNameToValue[name] || 0;
          });
          return obj;
        });

        // สร้าง table data จาก itemNames + ค่าในแต่ละปี
        const tableData = itemNames.map((name, idx) => {
          const row = {
            name,
            color: getColor(scopeIndex, idx),
          };
          dataForScope.forEach((yearData) => {
            // หา value ของชื่อ name ในปีนี้
            const foundItem = yearData[key].data.find((i) => i.name === name);
            row[yearData.year] = foundItem ? foundItem.value : 0;
          });
          return row;
        });

        return (
          <div key={key} className="bg-white p-4 rounded shadow flex flex-col">
            <h3 className="font-bold mb-2 text-left flex items-center gap-1">{label} Emission Trend
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
        
            <div className="flex-1 flex justify-center items-center min-h-[288px]">
              {dataForScope.length === 0 ? (
                <p className="text-gray-500 text-sm">No data available</p>
              ) : (
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="year" />
                      <YAxis />
                      <RechartsTooltip
                      formatter={(value, name) => [`${value} tCO₂e`, name]}
                      />
                      {/* <Legend /> */}
                      {itemNames.map((name, i) => (
                        <Bar
                          key={name}
                          dataKey={name}
                          stackId="a"
                          fill={getColor(scopeIndex, i)}
                          isAnimationActive={false}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
        
            {dataForScope.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-1">Item</th>
                      {dataForScope.map((item) => (
                        <th key={item.year} className="text-center">
                          {item.year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="flex items-center py-1 whitespace-nowrap">
                          <span
                            className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                            style={{ backgroundColor: row.color }}
                          />
                          <span className="truncate">{row.name}</span>
                        </td>
                        {dataForScope.map((item) => (
                          <td key={item.year} className="text-center">
                            {row[item.year].toFixed(3)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
        
      })}
    </div>
  );
}
