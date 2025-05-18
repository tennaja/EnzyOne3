"use client";

import React, { useEffect, useState ,useMemo } from "react";
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
import { Checkbox, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/en";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {getCustomDevice,getCustomDeviceHistory} from "@/utils/api";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const getDistinctColor = (() => {
  let usedHues = new Set();
  const hueStep = 137.5; // ใช้ golden angle (137.5 องศา) เพื่อกระจายสีอย่างสม่ำเสมอ
  let currentHue = 0;

  return () => {
    // คำนวณ hue ใหม่โดยใช้ golden angle
    currentHue = (currentHue + hueStep) % 360;

    // ตรวจสอบว่า hue นี้ถูกใช้ไปแล้วหรือไม่
    while (usedHues.has(currentHue)) {
      currentHue = (currentHue + hueStep) % 360;

      // รีเซ็ต usedHues หากครบทุกสีแล้ว
      if (usedHues.size >= 360 / hueStep) {
        usedHues = new Set();
      }
    }

    usedHues.add(currentHue);

    // กำหนด saturation และ lightness ให้เหมาะสม
    const saturation = 70; // ความอิ่มตัวของสี
    const lightness = 50; // ความสว่างของสี

    return `hsl(${currentHue}, ${saturation}%, ${lightness}%)`;
  };
})();

const CustomGraph = () => {
  const [charts, setCharts] = useState([]);
  const [parameterList, setParameterList] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data] = useState(parameterList);
  useEffect(() => {
    GetConsumtionParameterList();
  
    // เพิ่ม Chart เริ่มต้นเมื่อโหลดหน้าเว็บครั้งแรก
    setCharts([
      {
        id: Date.now(),
        selectedParams: [], // ไม่มีพารามิเตอร์เริ่มต้น
        dateRange: [dayjs().subtract(7, "day"), dayjs()], // ค่าเริ่มต้น: 7 วันล่าสุด
        data: [], // ข้อมูลเริ่มต้นว่าง
      },
    ]);
  }, []);


  const GetConsumtionParameterList = async () => {
      const siteId = 6;
      setLoading(true)
      try {
        const result = await getCustomDevice(siteId);
        if (result && result.status === 200) {
          setParameterList(result.data);
          console.log("Parameter List:", result.data);
        } else {
          setParameterList([]);
        }
      } catch (error) {
        console.error("Error fetching Parameter List:", error);
        setParameterList([]);
      }finally {
        setLoading(false)
      }
    };
    const allParameters = useMemo(() => {
      if (!Array.isArray(parameterList)) return [];
      return parameterList.flatMap((device, deviceIndex) => {
        return device.unit.map((unit, unitIndex) => ({
          id: device.id, // สร้าง id โดยใช้ devId และ unit
          label: device.name, // ให้ตรงกับ key ใน data
          unit,
          type: device.deviceTypeId,
          devId: device.devId,
        }));
      });
    }, [parameterList]);


    const mapHistoryDataToChartData = (historyData) => {
      const { timestamp, unit1, unit2 } = historyData;
    
      if (!timestamp || !Array.isArray(timestamp)) {
        console.error("Invalid timestamp data:", timestamp);
        return [];
      }
    
      const chartData = timestamp.map((time, index) => {
        const dataPoint = { time };
    
        if (Array.isArray(unit1)) {
          unit1.forEach((unit) => {
            const key = `${unit.device}_${unit.name}`;
            dataPoint[key] = unit.value?.[index] ?? null;
          });
        }
    
        if (Array.isArray(unit2)) {
          unit2.forEach((unit) => {
            const key = `${unit.device}_${unit.name}`;
            dataPoint[key] = unit.value?.[index] ?? null;
          });
        }
    
        return dataPoint;
      });
    
      console.log("Mapped Chart Data:", chartData);
      return chartData;
    };
    
    const GetConsumtionDeviceHistory = async (chartId, ids, units, startDate, endDate) => {
      console.log("ids", ids);
      console.log("units", units);
      console.log("startDate", startDate);
      console.log("endDate", endDate);
    
      if (!ids || ids.length === 0 || !units || units.length === 0) return;
    
      setLoading(true);
    
      try {
        const params = {
          siteId: 6,
          deviceId: ids,
          unit: units,
          startDate: startDate.format("YYYY/MM/DD"), // แปลงวันที่เป็นรูปแบบที่ API ต้องการ
          endDate: endDate.format("YYYY/MM/DD"),
        };
    
        const result = await getCustomDeviceHistory(params);
    
        if (result && result.status === 200) {
          const combinedData = mapHistoryDataToChartData(result.data);
    
          setCharts((prev) =>
            prev.map((chart) =>
              chart.id === chartId
                ? { ...chart, data: combinedData }
                : chart
            )
          );
    
          console.log("Updated Charts:", charts);
        } else {
          console.error("Error: Invalid response from API");
        }
      } catch (error) {
        console.error("Error fetching History Data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const handleCreateNewChart = () => {
      setCharts((prev) => [
        ...prev,
        {
          id: Date.now(),
          selectedParams: [], // ไม่มีพารามิเตอร์เริ่มต้น
          dateRange: [dayjs().subtract(7, "day"), dayjs()], // ค่าเริ่มต้น: 7 วันล่าสุด
          data: [], // ข้อมูลเริ่มต้นว่าง
        },
      ]);
    };

  const handleAddParam = (chartId, paramIds, unit) => {
    console.log("paramIds", paramIds);
    console.log("unit", unit);
  
    setCharts((prev) =>
      prev.map((chart) => {
        if (chart.id !== chartId) return chart;
  
        const newParams = paramIds
          .filter((id) => !chart.selectedParams.some((p) => p.id === id && p.unit === unit))
          .map((id) => {
            const param = allParameters.find((p) => p.id === id && p.unit === unit);
            if (!param) {
              console.error("Parameter not found for id:", id, "and unit:", unit);
              return null;
            }
            return {
              id: param.id,
              unit: param.unit,
              label: param.label,
              type: param.type,
              color: getDistinctColor(),
            };
          })
          .filter(Boolean);
  
        const updatedParams = [...chart.selectedParams, ...newParams];
        const uniqueParams = updatedParams.filter(
          (param, index, self) =>
            index === self.findIndex((p) => p.id === param.id && p.unit === param.unit)
        );
  
        const uniqueIds = [...new Set(uniqueParams.map((param) => param.id))];
        const uniqueUnits = [...new Set(uniqueParams.map((param) => param.unit))];
  
        // เรียก GetConsumtionDeviceHistory พร้อม startDate และ endDate
        const [startDate, endDate] = chart.dateRange;
        GetConsumtionDeviceHistory(chartId, uniqueIds, uniqueUnits, startDate, endDate);
  
        return {
          ...chart,
          selectedParams: uniqueParams,
        };
      })
    );
  };
  
  const handleRemoveParam = (chartId, paramIds, unit) => {
    setCharts((prev) =>
      prev.map((chart) => {
        if (chart.id !== chartId) return chart;
  
        // ลบ paramIds ที่ตรงกับ id และ unit
        const updatedParams = chart.selectedParams.filter(
          (p) => !(paramIds.includes(p.id) && p.unit === unit)
        );
  
        return {
          ...chart,
          selectedParams: updatedParams,
        };
      })
    );
  };

  const handleDateChange = (chartId, dates) => {
    setCharts((prev) =>
      prev.map((chart) => {
        if (chart.id !== chartId) return chart;
  
        // เรียก GetConsumtionDeviceHistory ใหม่เมื่อวันที่เปลี่ยน
        const uniqueIds = [...new Set(chart.selectedParams.map((param) => param.id))];
        const uniqueUnits = [...new Set(chart.selectedParams.map((param) => param.unit))];
        GetConsumtionDeviceHistory(chartId, uniqueIds, uniqueUnits, dates[0], dates[1]);
  
        return { ...chart, dateRange: dates };
      })
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

  
  const memoizedCharts = useMemo(() => {
    return charts.map((chart) => {
      const [startDate, endDate] = chart.dateRange;
  
      // คำนวณ filteredData
      const filteredData = data.filter((item) => {
        const t = dayjs(item.time, "YYYY-MM-DD HH:mm");
        return t.isAfter(startDate.startOf("day")) && t.isBefore(endDate.endOf("day"));
      });
  
      // คำนวณ uniqueUnits จาก selectedParams
      const selectedUnits = chart.selectedParams
        .map((p) => p.unit)
        .filter(Boolean); // กรอง unit ที่ไม่ใช่ falsy
      const uniqueUnits = [...new Set(selectedUnits)];
  
      return { ...chart, filteredData, uniqueUnits };
    });
  }, [charts, data]);

  return (
    <div className="mt-4">
      {memoizedCharts.map((chart) => (
  <div
    key={chart.id}
    className="rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4"
  >
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center space-x-4 text-lg font-semibold">
        <div>
          Select: <span className="text-cyan-500">{chart.selectedParams.length}</span> parameter
        </div>
        <div className="h-5 w-px bg-gray-300" />
        <div>
          Unit:{" "}
          {chart.uniqueUnits.map((unit, i) => (
            <span key={unit} className="text-cyan-500">
              {unit}
              {i < chart.uniqueUnits.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <RangePicker
          value={chart.dateRange}
          onChange={(dates) => handleDateChange(chart.id, dates)}
          disabledDate={disabledDate}
          format="YYYY/MM/DD"
          allowClear={false}
        />
        <IconButton onClick={() => handleDeleteChart(chart.id)} color="error">
          <DeleteIcon />
        </IconButton>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row">
      {/* Parameter List */}
      <div className="lg:w-[40%] w-full pr-0 lg:pr-4 mb-4 lg:mb-0 lg:border-r">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allParameters.map((param,index) => {
            const isSelected = chart.selectedParams.some(
              (p) => p.id === param.id && p.unit === param.unit
            );

            const isUnitAllowed =
              chart.selectedParams.length < 2 ||
              chart.uniqueUnits.length === 1 ||
              chart.uniqueUnits.includes(param.unit);

            const isDisabled = !isSelected && !isUnitAllowed;

            return (
              <div
              key={`${chart.id}_${param.id}_${param.unit}_${index}`} // รวม chart.id เพื่อให้ key ไม่ซ้ำ
                className={`border rounded-lg p-3 shadow-sm ${
                  isSelected
                    ? "bg-green-100 dark:bg-green-900"
                    : isDisabled
                    ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                    : "bg-white dark:bg-gray-800 dark:text-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold">{param.label}</p>
                    <p className="text-xs">{param.type}</p>
                    <p className="text-xs text-gray-500">{param.unit}</p>
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) =>
                      e.target.checked
                        ? handleAddParam(chart.id, [param.id], param.unit)
                        : handleRemoveParam(chart.id, [param.id], param.unit)
                    }
                    disabled={isDisabled}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="lg:w-[60%] w-full">
      <ResponsiveContainer width="100%" height="100%">
  <LineChart data={chart.data || []}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="time" tickFormatter={(str) => str.slice(5, 16)} />
    <Tooltip />
    <Legend />
    <Brush dataKey="time" height={30} stroke="#8884d8" />

    {/* แกน Y ฝั่งซ้าย */}
    {chart.uniqueUnits[0] && (
      <YAxis
        yAxisId="left"
        label={{
          value: chart.uniqueUnits[0],
          angle: -90,
          position: "insideLeft",
          offset: 10,
          style: { fontSize: 12, fontWeight: "bold" },
        }}
      />
    )}

    {/* แกน Y ฝั่งขวา */}
    {chart.uniqueUnits[1] && (
      <YAxis
        yAxisId="right"
        orientation="right"
        label={{
          value: chart.uniqueUnits[1],
          angle: -90,
          position: "insideRight",
          offset: 10,
          style: { fontSize: 12, fontWeight: "bold" },
        }}
      />
    )}

    {/* เส้นกราฟ */}
    {chart.selectedParams.map((param, index) => (
      <Line
        key={`${param.id}_${param.unit}_${index}`}
        type="monotone"
        dataKey={`${param.id}_${param.unit}`} // ใช้ devId และ unit เป็น dataKey
        stroke={param.color}
        dot={false}
        yAxisId={param.unit === chart.uniqueUnits[0] ? "left" : "right"} // แยกแกน Y ตาม unit
        name={`${param.type}-${param.label} (${param.unit})`} // ชื่อ Legend
      />
    ))}
  </LineChart>
</ResponsiveContainer>
      </div>
    </div>
  </div>
))}

      <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-2">
        <div className="border border-dashed border-gray-400 rounded-lg p-4 flex justify-center items-center">
          <Button type="primary" onClick={handleCreateNewChart}>
            + Add Graph
          </Button>
        </div>
      </div>
    </div>
    
  );
};

export default CustomGraph;
