"use client";
import { useState, useEffect } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import EnergyPieChart from "./EnergyPieChart";
import EnergyTrendChart2 from "./Trendchart";
import RevenueBarChart2 from "./BarChart";
import { Select, Space } from "antd";
import HeatmapPage from "./Heatmap";
import {
  getProductEnergyDeviceList,
  getProductEnergyHistory,
  getProductRevenueHistory,
  getProductDeviceList,
  getProductionHeatmap
} from "@/utils/api";

const { Option } = Select;

const allTabs = [
  { id: "day", label: "Day" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
  { id: "lifetime", label: "Lifetime" },
];

const revenueTabs = allTabs.filter((tab) => tab.id !== "day");

const GroupTabs = ({ range, onChange, tabs }) => (
  <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-4 py-2 text-sm border-r last:border-r-0 border-gray-300 dark:border-gray-600 transition-all ${
          range === tab.id
            ? "bg-teal-500 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const DatePickerByRange = ({ range, value, onChange }) => {
  if (range === "lifetime") {
    return <DatePicker disabled className="ml-4" />;
  }

  if (range === "year") {
    return (
      <DatePicker
        picker="year"
        format="YYYY"
        value={value}
        onChange={onChange}
        className="ml-4"
        allowClear={false}
      />
    );
  }

  if (range === "month") {
    return (
      <DatePicker
        picker="month"
        format="YYYY/MM"
        value={value}
        onChange={onChange}
        className="ml-4"
        allowClear={false}
      />
    );
  }

  return (
    <DatePicker
      format="YYYY/MM/DD"
      value={value}
      onChange={onChange}
      className="ml-4"
      allowClear={false}
    />
  );
};

const loadData = [
  {
    id: 1,
    source: "Gen 1",
    powerGeneration: "120.50",
    energyGeneration: "300.50",
    revenue: "100.00",
  },
  {
    id: 2,
    source: "Gen 2",
    powerGeneration: "110.10",
    energyGeneration: "280.00",
    revenue: "90.00",
  },
];

export default function Production() {
  const [searchLoad, setSearchLoad] = useState("");
  const [energyRange, setEnergyRange] = useState("day");
  const [energyDate, setEnergyDate] = useState(dayjs());
  const [revenueRange, setRevenueRange] = useState("month");
  const [revenueDate, setRevenueDate] = useState(dayjs());
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth);
  const [externalData, setExternalData] = useState([]);
  const yearMonth = `${year}/${month}`;

  
  const [sourceType, setSourceType] = useState(0); // ใช้ number 0 สำหรับ All

  const [productDeviceList, setProductDeviceList] = useState([]);
  const [dropdownDeviceList, setDropdownDeviceList] = useState([]);
  const [energyHistoryData, setEnergyHistoryData] = useState([]);
  const [revenueHistoryData, setRevenueHistoryData] = useState([]);
  const [totalSummary, setTotalSummary] = useState({
    power: "0.00",
    energy: "0.00",
    revenue: "0.00",
  });

  useEffect(() => {
    GetEnergyProductDeviceList();
    GetDropdownDeviceList();
  }, []);
  useEffect(() => {
    GetEnergyHistory();
  }, [energyDate, energyRange]);
  useEffect(() => {
    GetEnergyRevenue();
  }, [revenueDate, revenueRange]);
  useEffect(() => {
    GetProductionHeatmap();
  }, [year,month, sourceType]);


  const GetEnergyProductDeviceList = async () => {
    const siteId = 6;

    try {
      const result = await getProductEnergyDeviceList(siteId);
      if (result && result.status === 200) {
        const data = result.data;

        const total = data.reduce(
          (acc, item) => {
            acc.power += Number(item.power || 0);
            acc.energy += Number(item.energy || 0);
            acc.revenue += Number(item.revenue || 0);
            return acc;
          },
          { power: 0, energy: 0, revenue: 0 }
        );

        setProductDeviceList(data);
        setTotalSummary({
          power: total.power.toFixed(2),
          energy: total.energy.toFixed(2),
          revenue: total.revenue.toFixed(2),
        });
      } else {
        setProductDeviceList([]);
        setTotalSummary({ power: "0.00", energy: "0.00", revenue: "0.00" });
      }
    } catch (error) {
      console.error("Error fetching Summary History:", error);
      setProductDeviceList([]);
      setTotalSummary({ power: "0.00", energy: "0.00", revenue: "0.00" });
    }
  };
  const GetDropdownDeviceList = async () => {
    const siteId = 6;

    try {
      const result = await getProductDeviceList(siteId);
      if (result && result.status === 200) {
        setDropdownDeviceList(result.data)
        console.log("Dropdown Device List:", result.data);
      } else {
        setDropdownDeviceList([]);
      }
    } catch (error) {
      console.error("Error fetching Summary History:", error);
      setProductDeviceList([]);
      setTotalSummary({ power: "0.00", energy: "0.00", revenue: "0.00" });
    }
  };
  const GetEnergyHistory = async () => {
    const paramsNav = {
      siteId: 6,
      date: energyDate.format("YYYY/MM/DD"),
      groupBy: energyRange,
    };

    // if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

    try {
      const result = await getProductEnergyHistory(paramsNav);
      if (result && result.status === 200) {
        console.log("Summary History:", result);
        setEnergyHistoryData(result.data);
      } else {
        setEnergyHistoryData([]);
      }
    } catch (error) {
      console.error("Error fetching Summary History:", error);
    } finally {
      // if (showLoading) {
      //   setTimeout(() => setLoading(false), 1000);
      // }
    }
  };

  const GetEnergyRevenue = async () => {
    const paramsNav = {
      siteId: 6,
      date: revenueDate.format("YYYY/MM/DD"),
      groupBy : revenueRange,
    };

    // if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
    try {
      const result = await getProductRevenueHistory(paramsNav);
      if (result && result.status === 200) {
        console.log("Summary Revenue:", result);
        setRevenueHistoryData(result.data);
      } else {
        setRevenueHistoryData([]);
      }
    } catch (error) {
      console.error("Error fetching Summary Revenue:", error);
    } finally {
      // if (showLoading) {
      //   setTimeout(() => setLoading(false), 1000);
      // }
    }
  };
  const GetProductionHeatmap = async () => {
    const paramsNav = {
      siteId: 6,
      date: yearMonth,
      deviceId: sourceType,
    };
    try {
      const result = await getProductionHeatmap(paramsNav);
      if (result && result.status === 200) {
        console.log("Production Heatmap:", result);
        setExternalData(result.data);
      } else {
        setExternalData([]);
      }
    } catch (error) {
      console.error("Error fetching Production Heatmap:", error);
      setExternalData([]);
    } finally {
      // if (showLoading) {
      //   setTimeout(() => setLoading(false), 1000);
      // }
    }
  };
 
  
  const filterData = (data, search) =>
    data
      .map((item, index) => ({
        ...item, // คัดลอกข้อมูลเดิมทั้งหมด
        originalIndex: index + 1, // เพิ่ม originalIndex โดยเริ่มที่ 1
      }))
      .filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.name.toString().includes(search.toLowerCase()) ||
          item.power.toString().includes(search.toLowerCase()) ||
          item.energy.toString().includes(search.toLowerCase()) ||
          item.revenue.toString().includes(search.toLowerCase()) ||
          item.originalIndex.toString().includes(search) // ค้นหาด้วย originalIndex
      );

  const highlightText = (text, search) => {
    if (!search) return text; // หากไม่มีคำค้นให้แสดงข้อความปกติ
    const parts = text.split(new RegExp(`(${search})`, "gi")); // แบ่งข้อความที่ตรงกับคำค้น
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      return '-';
    }
    return num.toLocaleString('en-US');
  }
  
  function formatNumberWithK(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      return '-';
    }
  
    if (num >= 1000) {
      const value = num / 1000;
      // ตัดทศนิยมถ้าเป็นเลขกลม เช่น 1000 -> 1k, 1500 -> 1.5k
      return Number.isInteger(value) ? `${value}K` : `${parseFloat(value.toFixed(1))}K`;
    }
  
    return num.toLocaleString('en-US'); // หรือจะใช้ num.toString() ก็ได้
  }
 
  const handleYearChange = (newYear) => {
    setYear(newYear);
    // Reset month ถ้าเดือนเกินจากเดือนปัจจุบันในปีปัจจุบัน
    if (
      parseInt(newYear) === currentYear &&
      parseInt(month) > parseInt(currentMonth)
    ) {
      setMonth(currentMonth);
    }
  };

  return (
    <>
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Energy Production</h2>
          <div className="flex flex-col items-end gap-4">
            <input
              type="text"
              placeholder="Search"
              className="border rounded px-3 py-1 text-sm"
              value={searchLoad}
              onChange={(e) => setSearchLoad(e.target.value)}
            />
            <span className="text-sm text-gray-500 dark:text-white">
              Last Updated on DD/MM/YYYY 00:00
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-y border-gray-200 bg-gray-50 dark:bg-gray-900 ">
              <tr className="text-gray-700 dark:text-white">
                <th className="py-2">#</th>
                <th className="py-2">Source</th>
                <th className="py-2">Power Generation (kW)</th>
                <th className="py-2">Energy Generation (kWh)</th>
                <th className="py-2">Revenue (Bath)</th>
              </tr>
            </thead>
            <tbody>
              {filterData(productDeviceList, searchLoad).map((item) => (
                <tr
                  key={item.originalIndex}
                  className="border-b border-gray-200"
                >
                  <td className="py-2">
                    {highlightText(item.originalIndex.toString(), searchLoad)}
                  </td>
                  <td className="py-2">
                    {highlightText(item.name, searchLoad)}
                  </td>
                  <td className="py-2">
                    {highlightText(item.power.toString(), searchLoad)}
                  </td>
                  <td className="py-2">
                    {highlightText(item.energy.toString(), searchLoad)}
                  </td>
                  <td className="py-2">
                    {highlightText(item.revenue.toString(), searchLoad)}
                  </td>
                </tr>
              ))}

              <tr className="font-semibold bg-gray-100 border-t border-gray-200 dark:bg-gray-900 dark:text-white">
                <td className="py-2" colSpan={2}>
                  Total
                </td>
                <td className="py-2">{totalSummary.power} kW</td>
                <td className="py-2">{totalSummary.energy} kWh</td>
                <td className="py-2">{totalSummary.revenue} Bath</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Energy Trend Section */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center">
            <span className="text-xl font-bold">Energy Trend</span>
            <Tooltip
              title="Comparing device production power (line chart) and total energy produced (bar chart)."
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    fontSize: '14px', // ปรับขนาดฟอนต์
                  },
                },
              }}
            >
              <InfoOutlinedIcon
                className="text-[#33BFBF] ml-1 cursor-pointer"
                fontSize="small"
              />
            </Tooltip>
          </div>
          <div className="flex items-center">
            <GroupTabs
              range={energyRange}
              onChange={(val) => {
                setEnergyRange(val);
                setEnergyDate(dayjs());
              }}
              tabs={allTabs}
            />
            <DatePickerByRange
              range={energyRange}
              value={energyDate}
              onChange={(val) => setEnergyDate(dayjs(val))}
            />
          </div>
        </div>

        {/* <div className="text-lg mb-4">
            <span className="text-sm">Yield: </span>
            <span className="font-bold text-xl">25.24</span> kWh
            <span className="ml-6 text-sm">Consumption: </span>
            <span className="font-bold text-xl">101.61</span> kWh
          </div> */}

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3 h-80 flex items-center justify-center">
            <EnergyTrendChart2 type={energyRange} data={energyHistoryData}/>
          </div>
          <div className="w-full lg:w-1/3 h-80  flex flex-col items-center justify-center">
            <EnergyPieChart data={energyHistoryData}/>
          </div>
        </div>
      </div>

      {/* Revenue Trend Section */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center">
            <span className="text-xl font-bold">Revenue Trend</span>
          </div>

          <div className="flex items-center">
            <GroupTabs
              range={revenueRange}
              onChange={(val) => {
                setRevenueRange(val);
                setRevenueDate(dayjs());
              }}
              tabs={revenueTabs}
            />
            <DatePickerByRange
              range={revenueRange}
              value={revenueDate}
              onChange={(val) => setRevenueDate(val)}
            />
          </div>
        </div>

        <div className="text-lg mb-4">
          <span className="text-sm">Total Revenue: </span>
          <span className="font-bold text-xl">{formatNumberWithK(revenueHistoryData?.revenue)}</span> ฿
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <RevenueBarChart2 data={revenueHistoryData}/>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center">
            <span className="text-xl font-bold">Heatmap</span>
            <Tooltip
              title="Visualizes hourly energy production patterns over the selected month."
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    fontSize: '14px', // ปรับขนาดฟอนต์
                  },
                },
              }}
            >
              <InfoOutlinedIcon
                className="text-[#33BFBF] ml-1 cursor-pointer"
                fontSize="small"
              />
            </Tooltip>
          </div>
          <Space>
          <Select value={year} onChange={handleYearChange} style={{ width: 100 }}>
        {[2023, 2024, 2025]
          .filter((y) => y <= currentYear)
          .map((y) => (
            <Option key={y} value={y.toString()}>
              {y}
            </Option>
          ))}
      </Select>

      <Select value={month} onChange={setMonth} style={{ width: 100 }}>
        {Array.from({ length: 12 }, (_, i) => {
          const val = (i + 1).toString().padStart(2, "0");
          const isDisabled =
            parseInt(year) === currentYear && val > currentMonth;
          return (
            <Option key={val} value={val} disabled={isDisabled}>
              {val}
            </Option>
          );
        })}
      </Select>
            <Select
  value={sourceType}
  onChange={setSourceType}
  style={{ width: 200 }}
  placeholder="Select Source Type"
>
  <Option value={0}>All</Option>

  {dropdownDeviceList.map((item) => (
    <Option key={item.id} value={item.id}>
      {item.devId}
    </Option>
  ))}
</Select>


          </Space>
        </div>
        
        <div className="w-full flex items-center justify-center mt-5"></div>
          <HeatmapPage data={externalData} />
      </div>
    </>
  );
}
