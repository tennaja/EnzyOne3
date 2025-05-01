"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/en";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const allParameters = [
    { type: "Voltage", label: "V80BUS1-A", unit: "kV" },
    { type: "Voltage", label: "V80BUS1-B", unit: "kV" },
    { type: "Voltage", label: "V80BUS2-A", unit: "kV" },
  
    { type: "Current", label: "I80KA--2A", unit: "kA" },
    { type: "Current", label: "I80KA--2B", unit: "kA" },
    { type: "Current", label: "I80KA--3A", unit: "kA" },
  
    { type: "Water Temp", label: "CPMS01-", unit: "celcius" },
    { type: "Water Temp", label: "CPMS02-", unit: "celcius" },
    { type: "Water Temp", label: "CPMS03-", unit: "celcius" },
  
  
    { type: "Frequency", label: "FRQ-MAIN", unit: "Hz" },
    { type: "Frequency", label: "FRQ-BACK", unit: "Hz" },
  
    { type: "Power", label: "PWR-MAIN", unit: "MW" },
  
    { type: "Pressure", label: "PRS-VALVE1", unit: "bar" },
  ];
  

  const generateMockData = () => {
    const result = [];
    const now = dayjs();
  
    for (let i = 0; i < 744; i++) {
      const time = now.subtract(i, "hour").format("YYYY/MM/DD HH:mm");
      const dataPoint = { time };
  
      allParameters.forEach((param, index) => {
        let value;
        switch (param.type) {
          case "Voltage":
            value = 190 + Math.sin(i * 0.03 + index) * 20;
            break;
          case "Current":
            value = 9 + Math.cos(i * 0.05 + index) * 3;
            break;
          case "Water Temp":
            value = 30 + Math.sin(i * 0.08 + index) * 1.5;
            break;
          case "Oil Temp":
            value = 45 + Math.cos(i * 0.07 + index) * 2;
            break;
          case "Frequency":
            value = 49 + Math.sin(i * 0.02 + index) * 0.5;
            break;
          case "Power":
            value = 80 + Math.cos(i * 0.04 + index) * 10;
            break;
          case "Pressure":
            value = 2 + Math.sin(i * 0.05 + index) * 0.5;
            break;
          default:
            value = 0;
        }
  
        dataPoint[param.label] = parseFloat(value.toFixed(2));
      });
  
      result.unshift(dataPoint);
    }
  
    return result;
  };
  

const getDistinctColor = (() => {
  const usedHues = new Set(); // ✅ แก้ตรงนี้
  return () => {
    let hue;
    let tries = 0;
    do {
      hue = Math.floor(Math.random() * 360);
      tries++;
    } while (
      Array.from(usedHues).some((usedHue) => Math.abs(usedHue - hue) < 30) &&
      tries < 100
    );

    usedHues.add(hue);
    return `hsl(${hue}, 70%, 50%)`;
  };
})();

const ChartDashboard = () => {
  const [charts, setCharts] = useState([]);
  const [data] = useState(generateMockData());

  const handleCreateNewChart = () => {
    setCharts((prev) => [
      ...prev,
      {
        id: Date.now(),
        selectedParams: [],
        dateRange: [dayjs(), dayjs()],
      },
    ]);
  };

  const handleAddParam = (chartId, param) => {
    setCharts((prev) =>
      prev.map((chart) => {
        if (chart.id !== chartId) return chart;
        const exists = chart.selectedParams.find(
          (p) => p.label === param.label
        );
        if (exists) return chart;

        const sameUnitCount = chart.selectedParams.filter(
          (p) => p.unit === param.unit
        ).length;
        const uniqueUnits = [
          ...new Set(chart.selectedParams.map((p) => p.unit)),
        ];

        if (
          chart.selectedParams.length >= 2 &&
          uniqueUnits.length > 1 &&
          sameUnitCount === 0
        ) {
          return chart;
        }

        return {
          ...chart,
          selectedParams: [
            ...chart.selectedParams,
            { ...param, color: getDistinctColor() },
          ],
        };
      })
    );
  };

  const handleRemoveParam = (chartId, label) => {
    setCharts((prev) =>
      prev.map((chart) =>
        chart.id === chartId
          ? {
              ...chart,
              selectedParams: chart.selectedParams.filter(
                (p) => p.label !== label
              ),
            }
          : chart
      )
    );
  };

  const handleDateChange = (chartId, dates) => {
    setCharts((prev) =>
      prev.map((chart) =>
        chart.id === chartId ? { ...chart, dateRange: dates } : chart
      )
    );
  };

  const handleDeleteChart = (chartId) => {
    setCharts(charts.filter((chart) => chart.id !== chartId));
  };

  const disabledDate = (current) => {
    const today = dayjs().endOf("day");
    const thirtyOneDaysAgo = dayjs().subtract(31, "day").startOf("day");
    return current > today || current < thirtyOneDaysAgo;
  };

  return (
    <div className="mt-4">
      <Button type="primary" onClick={handleCreateNewChart}>
        + Create New Chart
      </Button>

      {charts.map((chart, index) => {
        const [startDate, endDate] = chart.dateRange;
        const filteredData = data.filter((item) => {
          const t = dayjs(item.time, "YYYY-MM-DD HH:mm");
          return (
            t.isAfter(startDate.startOf("day")) &&
            t.isBefore(endDate.endOf("day"))
          );
        });

        const selectedUnits = chart.selectedParams.map((p) => p.unit);
        const uniqueUnits = [...new Set(selectedUnits)];

        return (
          <div
            key={chart.id}
            className="rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4"
          >
            <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-xl">Chart #{index + 1}</h3>

<RangePicker
  value={chart.dateRange}
  onChange={(dates) => handleDateChange(chart.id, dates)}
  disabledDate={disabledDate}
  format="YYYY/MM/DD"
/>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Table Section */}
              <div className="lg:w-1/2 w-full pr-0 lg:pr-4 mb-4 lg:mb-0 lg:border-r ">
                <h4 className="font-semibold mb-2">Parameter List</h4>
                <table className="min-w-full">
                  <thead>
                    <tr className="text-xs text-black border-b border-gray-300 dark:text-white">
                      <th className="py-2 px-4 text-left ">Type</th>
                      <th className="py-2 px-4 text-left ">Label</th>
                      <th className="py-2 px-4 text-left ">Unit</th>
                      <th className="py-2 px-4 text-left ">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allParameters.map((param, idx) => {
                      const isSelected = chart.selectedParams.some(
                        (p) => p.label === param.label
                      );
                      const isUnitAllowed =
                        chart.selectedParams.length < 2 ||
                        uniqueUnits.length === 1 ||
                        selectedUnits.includes(param.unit);
                      const isDisabled = !isSelected && !isUnitAllowed;

                      const rowClass = isSelected
  ? "bg-green-100 dark:text-black"
  : isDisabled
  ? "bg-gray-100  text-gray-400 dark:bg-gray-700 dark:text-gray-500"
  : idx % 2 === 0
  ? "bg-gray-100 dark:bg-gray-900 dark:text-white"
  : "bg-white dark:bg-gray-800 dark:text-white";


                      return (
                        <tr
                          key={param.label}
                          className={`${rowClass} border-b border-[#e0e0e0]`}
                        >
                          <td className="px-2 py-1 text-left">{param.type}</td>
                          <td className="px-2 py-1 text-left">{param.label}</td>
                          <td className="px-2 py-1 text-left">{param.unit}</td>
                          <td className="px-2 py-1 text-left">
                            {isSelected ? (
                              <Button
                                type="default"
                                danger
                                size="small"
                                onClick={() =>
                                  handleRemoveParam(chart.id, param.label)
                                }
                              >
                                Unselect
                              </Button>
                            ) : (
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => handleAddParam(chart.id, param)}
                                disabled={isDisabled}
                                className={isDisabled ? "dark:text-gray-500" : "dark:text-white"}

                              >
                                Select
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Chart View */}
              <div className="lg:w-1/2 w-full">
                <h4 className="font-semibold mb-2 ml-2">Chart View</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={(str) => str.slice(5, 16)}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Brush dataKey="time" height={30} stroke="#8884d8" />
                    {chart.selectedParams.map((param) => (
                      <Line
                        key={param.label}
                        type="monotone"
                        dataKey={param.label}
                        stroke={param.color}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Button danger onClick={() => handleDeleteChart(chart.id)}
                className="mt-3"
                >
              Delete Chart
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ChartDashboard;
