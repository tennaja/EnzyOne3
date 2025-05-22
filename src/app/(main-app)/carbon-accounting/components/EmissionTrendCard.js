import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const scopes = [
  { key: "scope1", label: "Scope 1" },
  { key: "scope2", label: "Scope 2" },
  { key: "scope3", label: "Scope 3" },
];

// กำหนดชุดสีแยกตาม scope
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
  const filteredData = Array.isArray(emissionData)
    ? emissionData.filter((item) => item.year !== year)
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {scopes.map(({ key, label }, scopeIndex) => {
        // ข้อมูลของ scope นี้ สำหรับทุกปีที่กรองแล้ว
        const dataForScope = filteredData.filter(
          (item) => item[key] && item[key].data?.length > 0
        );

        if (dataForScope.length === 0) {
          return (
            <div key={key} className="bg-white p-4 rounded shadow h-72">
              <div className="flex flex-col justify-center items-center h-full text-gray-500">
                <h3 className="font-bold mb-2 text-center">{label} Emission Trend</h3>
                <p>No data available</p>
              </div>
            </div>
          );
        }

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
          <div key={key} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">{label} Emission Trend</h3>

            {/* Bar Chart */}
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
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

            {/* Table */}
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
          </div>
        );
      })}
    </div>
  );
}
