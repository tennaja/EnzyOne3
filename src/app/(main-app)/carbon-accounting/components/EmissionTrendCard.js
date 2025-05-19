import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
  } from "recharts";
  
  export default function EmissionTrendCard({ title, chartData, tableData }) {

    function getColor(index) {
        const colors = ["#0070f3", "#e91e63", "#ff9800", "#00bcd4"];
        return colors[index % colors.length];
      }
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">{title} Emission Trend</h3>
  
        {/* Bar Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartData[0] &&
  Object.keys(chartData[0])
    .filter((key) => key !== "year")
    .map((key, i) => (
      <Bar
        key={i}
        dataKey={key}
        stackId="a"
        fill={tableData[i]?.color || "#ccc"}
      />
    ))}

            </BarChart>
          </ResponsiveContainer>
        </div>
  
        {/* Table */}
        <div className="mt-4">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-1">Item</th>
                <th>2022</th>
                <th>2023</th>
                <th>2024</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="flex items-center py-1">
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="truncate">{row.name}</span>
                  </td>
                  <td className="text-center">{row["2022"]}</td>
                  <td className="text-center">{row["2023"]}</td>
                  <td className="text-center">{row["2024"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  
  