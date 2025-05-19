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
  getProductSummary,
  getProductEnergyHistory,
  getProductRevenueHistory,
  getProductDeviceList,
  getProductionHeatmap,
} from "@/utils/api";
import Loading from "./Loading";
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

export default function Detail() {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetEnergyProductDeviceList();
    GetDropdownDeviceList();
    const interval = setInterval(() => {
    GetEnergyProductDeviceList(false);
    GetDropdownDeviceList(false);
    }, 300000); // 300,000 ms = 5 minutes
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    GetEnergyHistory();
    const interval = setInterval(() => {
      GetEnergyHistory(false);
      }, 300000); 
    
    return () => clearInterval(interval);
  }, [energyDate, energyRange]);
  
  useEffect(() => {
    GetEnergyRevenue();
    const interval = setInterval(() => {
      GetEnergyRevenue(false);
      }, 300000); 
    
    return () => clearInterval(interval);
    
  }, [revenueDate, revenueRange]);
  
  useEffect(() => {
    GetProductionHeatmap();
    const interval = setInterval(() => {
      GetProductionHeatmap(false);
      }, 300000); 
    
    return () => clearInterval(interval);
    
  }, [year, month, sourceType]);

  const GetEnergyProductDeviceList = async (showLoading = true) => {
    const siteId = 6;
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
    try {
      const result = await getProductSummary(siteId);
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
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  const GetDropdownDeviceList = async (showLoading = true) => {
    const siteId = 6;
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
    try {
      const result = await getProductDeviceList(siteId);
      if (result && result.status === 200) {
        setDropdownDeviceList(result.data);
        console.log("Dropdown Device List:", result.data);
      } else {
        setDropdownDeviceList([]);
      }
    } catch (error) {
      console.error("Error fetching Summary History:", error);
      setProductDeviceList([]);
      setTotalSummary({ power: "0.00", energy: "0.00", revenue: "0.00" });
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  const GetEnergyHistory = async (showLoading = true) => {
    const paramsNav = {
      siteId: 6,
      date: energyDate.format("YYYY/MM/DD"),
      groupBy: energyRange,
    };
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

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
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const GetEnergyRevenue = async (showLoading = true) => {
    const paramsNav = {
      siteId: 6,
      date: revenueDate.format("YYYY/MM/DD"),
      groupBy: revenueRange,
    };
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
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
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  const GetProductionHeatmap = async (showLoading = true) => {
    const paramsNav = {
      siteId: 6,
      date: yearMonth,
      deviceId: sourceType,
    };
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
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
      if (showLoading) {
        setLoading(false);
      }
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
          item.name.toString().includes(search.toLowerCase()) ||
          item.power.toString().includes(search.toLowerCase()) ||
          item.energy.toString().includes(search.toLowerCase()) ||
          item.revenue.toString().includes(search.toLowerCase()) ||
          item.originalIndex.toString().includes(search) // ค้นหาด้วย originalIndex
      );

  const highlightText = (text, search) => {
    const textStr = String(text); // แปลง text เป็น string
    const searchStr = String(search); // แปลง search เป็น string

    if (!searchStr) return textStr; // หากไม่มีคำค้นให้แสดงข้อความปกติ

    const parts = textStr.split(new RegExp(`(${searchStr})`, "gi")); // แบ่งข้อความที่ตรงกับคำค้น
    return parts.map((part, index) =>
      part.toLowerCase() === searchStr.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  function formatNumber(num) {
    if (typeof num !== "number" || isNaN(num)) {
      return "-";
    }
    return num.toLocaleString("en-US");
  }

  function formatNumberWithK(num) {
    if (typeof num !== "number" || isNaN(num)) {
      return "-";
    }

    if (num >= 1000) {
      const value = num / 1000;
      // format number with commas, ถ้าเป็น integer แสดงไม่ต้องมีทศนิยม
      const formattedValue = Number.isInteger(value)
        ? value.toLocaleString("en-US")
        : parseFloat(value.toFixed(1)).toLocaleString("en-US");
      return `${formattedValue}K`;
    }

    return num.toLocaleString("en-US"); // ใส่ลูกน้ำให้ตัวเลขที่น้อยกว่า 1000
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
        
      </div>
     
      {loading && <Loading />}
    </>
  );
}
