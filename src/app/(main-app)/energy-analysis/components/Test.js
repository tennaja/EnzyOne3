import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const allParameters = [
  { type: 'Voltage', label: 'V80BUS1-A', unit: 'kV', color: '#8e44ad' },
  { type: 'Current', label: 'I80KA--2A', unit: 'kA', color: '#16a085' },
];

const generateMockData = () => {
  return Array.from({ length: 100 }, (_, i) => ({
    time: i,
    'V80BUS1-A': 200 * Math.sin(i * 0.2),
    'I80KA--2A': 20 * Math.exp(-0.03 * i) * Math.sin(i * 0.2),
  }));
};

const ChartDashboard = () => {
  const [charts, setCharts] = useState([]);
  const data = generateMockData();

  // ฟังก์ชันสร้างกราฟใหม่
  const handleCreateNewChart = () => {
    setCharts([...charts, {
      id: Date.now(),
      selectedParams: [],
      range: [0, 100],
    }]);
  };

  // ฟังก์ชันเพิ่มพารามิเตอร์ลงในกราฟที่เลือก
  const handleAddParam = (chartId, label) => {
    setCharts(prev => prev.map(chart => {
      if (chart.id === chartId) {
        const exists = chart.selectedParams.find(p => p.label === label);
        if (exists) return chart;

        const paramToAdd = allParameters.find(p => p.label === label);
        if (!paramToAdd) return chart;

        return {
          ...chart,
          selectedParams: [...chart.selectedParams, paramToAdd],
        };
      }
      return chart;
    }));
  };

  // ฟังก์ชันเปลี่ยนแปลงช่วงข้อมูลในกราฟ
  const handleRangeChange = (chartId, value) => {
    setCharts(prev => prev.map(chart =>
      chart.id === chartId ? { ...chart, range: [0, Number(value)] } : chart
    ));
  };

  // ฟังก์ชันลบกราฟ
  const handleDeleteChart = (chartId) => {
    setCharts(charts.filter(chart => chart.id !== chartId));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with Parameter Table */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Parameter List</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Label</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Unit</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allParameters.map((param) => (
              <tr key={param.label}>
                <td className="px-4 py-2 text-sm text-gray-700">{param.type}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{param.label}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{param.unit}</td>
                <td>
                  <button
                    onClick={() => handleAddParam(charts[charts.length - 1]?.id, param.label)} // เลือกจากกราฟล่าสุด
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Area with Charts */}
      <div className="w-2/3 p-4 overflow-y-auto space-y-10">
        {/* ปุ่มสร้างกราฟใหม่ */}
        <button
          onClick={handleCreateNewChart}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Create New Chart
        </button>

        {/* แสดงกราฟ */}
        {charts.map((chart, index) => {
          const filteredData = data.slice(chart.range[0], chart.range[1]);
          return (
            <div key={chart.id} className="space-y-4 border p-4 rounded-lg shadow">
              <h3 className="font-semibold">Chart No {index + 1}</h3> {/* แก้ไขเป็น Chart No 1, 2, 3 */}
              <div className="flex flex-wrap gap-2">
                {/* ไม่ต้องเลือกพารามิเตอร์จากกราฟ */}
              </div>

              {/* ช่วงเวลาของกราฟ */}
              <input
                type="range"
                min="0"
                max="100"
                value={chart.range[1]}
                onChange={(e) => handleRangeChange(chart.id, e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-gray-500">Time Range: 0 - {chart.range[1]}</p>

              {/* แสดงกราฟ */}
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" />
                  <Tooltip />
                  <Legend />
                  {chart.selectedParams.map((param) => (
                    <Line
                      key={param.label}
                      yAxisId="left"
                      type="monotone"
                      dataKey={param.label}
                      stroke={param.color}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>

              {/* ปุ่มลบกราฟ */}
              <button
                onClick={() => handleDeleteChart(chart.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-2 rounded"
              >
                Delete Chart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartDashboard;
