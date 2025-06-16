"use client";
import { useState, useEffect, useMemo } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import EnergyPieChart from "./EnergyPieChart";
import EnergyTrendChart3 from "./TrendChart2";
import RevenueBarChart3 from "./BarChart2";
import { Select, Space } from "antd";
import HeatmapPage from "./Heatmap";
import {
  getConsumptionSummary,
  getConsumptionEnergyHistory,
  getConsumptionCostHistory,
  getConsumptionHeatmap,
  getConsumtionDeviceList,
} from "@/utils/api";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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


export default function Consumption() {
  const [activeTab, setActiveTab] = useState("load");
  const [lastUpdated, setLatsUpdated] = useState("");
  // const [searchLoad, setSearchLoad] = useState("");
  // const [searchMeter, setSearchMeter] = useState("");
  const [energyRange, setEnergyRange] = useState("day");
  const [energyDate, setEnergyDate] = useState(dayjs());
  const [revenueRange, setRevenueRange] = useState("month");
  const [revenueDate, setRevenueDate] = useState(dayjs());
  const [heatmapData, setHeatmaplData] = useState([]);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth);
  const yearMonth = `${year}/${month}`;
  const [sourceType, setSourceType] = useState(0);
  const [consumptionDeviceList, setConsumptionDeviceList] = useState([]);
  const [energyHistoryData, setEnergyHistoryData] = useState([]);
  const [costHistoryData, setCostHistoryData] = useState([]);
  const [dropdownDeviceList, setDropdownDeviceList] = useState([]);
  const [searchLoad, setSearchLoad] = useState("");
  const [sortByLoad, setSortByLoad] = useState("");
  const [sortDirectionLoad, setSortDirectionLoad] = useState("asc");
  const [currentPageLoad, setCurrentPageLoad] = useState(1);
  const [rowsPerPageLoad, setRowsPerPageLoad] = useState(20);
  // State สำหรับ Meter table
  const [searchMeter, setSearchMeter] = useState("");
  const [sortByMeter, setSortByMeter] = useState("");
  const [sortDirectionMeter, setSortDirectionMeter] = useState("asc");
  const [currentPageMeter, setCurrentPageMeter] = useState(1);
  const [rowsPerPageMeter, setRowsPerPageMeter] = useState(20);
  const [totalSummary, setTotalSummary] = useState({
    power: "0.00",
    energy: "0.00",
    onPeak: "0.00",
    offPeak: "0.00",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetConsumptionDeviceList();
    const interval = setInterval(() => {
      GetConsumptionDeviceList(false);
    }, 300000);

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    GetEnergyHistory();
    const interval = setInterval(() => {
      GetEnergyHistory(false);
    }, 300000);

    return () => clearInterval(interval);
  }, [activeTab, energyDate, energyRange]);

  useEffect(() => {
    GetCostHistory();
    const interval = setInterval(() => {
      GetCostHistory(false);
    }, 300000);

    return () => clearInterval(interval);
  }, [activeTab, revenueDate, revenueRange]);

  useEffect(() => {
    GetDropdownDeviceList();
    const interval = setInterval(() => {
      GetDropdownDeviceList(false);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    GetConsumptionnHeatmap();
    const interval = setInterval(() => {
      GetConsumptionnHeatmap(false);
    }, 300000);

    return () => clearInterval(interval);
  }, [year, month, sourceType,activeTab]);

  const GetConsumptionDeviceList = async (showLoading = true) => {
    const params = {
      siteId: 6,
      deviceType: activeTab,
    };
    if (showLoading) setLoading(true);
    try {
      const result = await getConsumptionSummary(params);
      if (result && result.status === 200) {
        const data = result.data;
        setLatsUpdated(data.lastUpdated);
        console.log(data);
        const total = data.data.reduce(
          (acc, item) => {
            acc.power += Number(item.power || 0);
            acc.energy += Number(item.energy || 0);
            acc.onPeak += Number(item.onPeak || 0);
            acc.offPeak += Number(item.offPeak || 0);
            return acc;
          },
          { power: 0, energy: 0, onPeak: 0, offPeak: 0 }
        );

        setConsumptionDeviceList(data.data);
        setTotalSummary({
          power: total.power.toFixed(2),
          energy: total.energy.toFixed(2),
          onPeak: total.onPeak.toFixed(2),
          offPeak: total.offPeak.toFixed(2),
        });
      } else {
        setConsumptionDeviceList([]);
        setTotalSummary({
          power: "0.00",
          energy: "0.00",
          onPeak: "0.00",
          offPeak: "0.00",
        });
      }
    } catch (error) {
      console.error("Error fetching Summary History:", error);
      setConsumptionDeviceList([]);
      setTotalSummary({
        power: "0.00",
        energy: "0.00",
        onPeak: "0.00",
        offPeak: "0.00",
      });
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  const GetEnergyHistory = async (showLoading = true) => {
    const paramsNav = {
      siteId: 6,
      deviceType: activeTab,
      date: energyDate.format("YYYY/MM/DD"),
      groupBy: energyRange,
    };

    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

    try {
      const result = await getConsumptionEnergyHistory(paramsNav);
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
  const GetCostHistory = async (showLoading = true) => {
    const paramsNav = {
      siteId: 6,
      deviceType: activeTab,
      date: revenueDate.format("YYYY/MM/DD"),
      groupBy: revenueRange,
    };
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
    try {
      const result = await getConsumptionCostHistory(paramsNav);
      if (result && result.status === 200) {
        console.log("Summary Revenue:", result);
        setCostHistoryData(result.data);
      } else {
        setCostHistoryData([]);
      }
    } catch (error) {
      console.error("Error fetching Summary Revenue:", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  const GetDropdownDeviceList = async (showLoading = true) => {
    const siteId = 6;
    if (showLoading) setLoading(true);
    try {
      const result = await getConsumtionDeviceList(siteId);
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

  const GetConsumptionnHeatmap = async (showLoading = true) => {
    const paramsNav = {
      siteId: 6,
      date: yearMonth,
      deviceId: sourceType,
      deviceType: activeTab
    };
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
    try {
      const result = await getConsumptionHeatmap(paramsNav);
      if (result && result.status === 200) {
        console.log("Production Heatmap:", result);
        setHeatmaplData(result.data);
      } else {
        setHeatmaplData([]);
      }
    } catch (error) {
      console.error("Error fetching Production Heatmap:", error);
      setHeatmaplData([]);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
      // ถ้าไม่ใช่ปีปัจจุบัน → reset เป็นเดือน 01
      setMonth("01");
    
  };
  // const handleYearChange = (newYear) => {
  //   setYear(newYear);
  //   // Reset month ถ้าเดือนเกินจากเดือนปัจจุบันในปีปัจจุบัน
  //   if (
  //     parseInt(newYear) === currentYear &&
  //     parseInt(month) > parseInt(currentMonth)
  //   ) {
  //     setMonth(currentMonth);
  //   }
  // };

  const filterData = (data, search) =>
    data
      .map((item, index) => ({
        ...item, // คัดลอกข้อมูลเดิมทั้งหมด
        originalIndex: index + 1, // เพิ่ม originalIndex โดยเริ่มที่ 1
      }))
      .filter(
        (item) =>
          item?.name?.toLowerCase().includes(search.toLowerCase()) ||
          item?.power?.toFixed(2).toString().includes(search.toLowerCase()) ||
          item?.energy?.toFixed(2).toString().includes(search.toLowerCase()) ||
          item?.onPeak?.toFixed(2).toString().includes(search.toLowerCase()) ||
          item?.offPeak?.toFixed(2).toString().includes(search.toLowerCase()) ||
          item?.originalIndex?.toString().includes(search.toLowerCase())
      );

  const onSortLoad = (key) => {
    if (sortByLoad === key) {
      setSortDirectionLoad(sortDirectionLoad === "asc" ? "desc" : "asc");
    } else {
      setSortByLoad(key);
      setSortDirectionLoad("asc");
    }
  };

  // ฟังก์ชันเปลี่ยน sort สำหรับ Meter
  const onSortMeter = (key) => {
    if (sortByMeter === key) {
      setSortDirectionMeter(sortDirectionMeter === "asc" ? "desc" : "asc");
    } else {
      setSortByMeter(key);
      setSortDirectionMeter("asc");
    }
  };
  const sortData = (data, sortBy, sortDirection) => {
    if (!sortBy || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      // ถ้าค่าใดเป็น null หรือ undefined ให้ย้ายไปท้าย
      if (valA == null) return 1;
      if (valB == null) return -1;

      // ถ้าเป็นตัวเลข
      const numA = parseFloat(valA);
      const numB = parseFloat(valB);
      const isNumber = !isNaN(numA) && !isNaN(numB);

      if (isNumber) {
        return sortDirection === "asc" ? numA - numB : numB - numA;
      }

      // ถ้าเป็นข้อความ
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  };

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

  function formatNumberWithK(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      return '-';
    }
  
    if (num >= 1000) {
      const value = num / 1000;
      const formattedValue = value.toFixed(2); // แสดงทศนิยม 2 ตำแหน่งเสมอ
      return `${formattedValue}K`;
    }
  
    return num.toLocaleString('en-US'); // แสดงเลขน้อยกว่า 1,000 แบบมีลูกน้ำ
  }
  

  const renderEnergyTrend = (title) => (
    <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center">
          <span className="text-xl font-bold">{title}</span>
          <Tooltip
            title="Comparing device consumption power (line chart) and total energy consumed (bar chart)."
            arrow
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: "14px", // ปรับขนาดฟอนต์
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

      <div className="flex flex-col lg:flex-row mt-4">
        <div className="w-full lg:w-2/3 h-auto flex items-center justify-center">
          <EnergyTrendChart3 type={energyRange} data={energyHistoryData} />
        </div>
        <div className="w-full lg:w-1/3 h-auto flex flex-col items-center justify-center">
        <span className="text-sm text-gray-500 dark:text-white ">
          Consumption Ratio
        </span>
          <EnergyPieChart data={energyHistoryData} />
        </div>
      </div>
    </div>
  );

  const renderRevenueTrend = (title) => (
    <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center">
          <span className="text-xl font-bold">{title}</span>
          {/* <Tooltip
            title="More information about this metric"
            arrow
            placement="top"
          >
            <InfoOutlinedIcon
              className="text-[#33BFBF] ml-1 cursor-pointer"
              fontSize="small"
            />
          </Tooltip> */}
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
            allowClear={false}
          />
        </div>
      </div>

      <div className="text-lg mb-4">
        <span className="text-sm">Total Cost: </span>
        <span className="font-bold text-xl">
          {formatNumberWithK(costHistoryData?.cost)}
        </span>{" "}
        ฿
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <RevenueBarChart3 data={costHistoryData} type={revenueRange}/>
      </div>
    </div>
  );

  const renderSortHeader = (label, key, sortBy, sortDirection, onSort) => (
    <div
      className="flex items-center gap-1 cursor-pointer select-none"
      onClick={() => onSort(key)}
    >
      {label}
      <div className="flex flex-col">
        <ArrowDropUpIcon
          style={{
            fontSize: "14px",
            marginBottom: "-2px",
            opacity: sortBy === key && sortDirection === "asc" ? 1 : 0.3,
          }}
        />
        <ArrowDropDownIcon
          style={{
            fontSize: "14px",
            marginTop: -2,
            opacity: sortBy === key && sortDirection === "desc" ? 1 : 0.3,
          }}
        />
      </div>
    </div>
  );

  const renderTableLoad = (
    data,
    search,
    setSearch,
    sortBy,
    sortDirection,
    onSort,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage
  ) => {
    const filteredData = filterData(data, search);
    const sortedData = sortData(filteredData, sortBy, sortDirection);
// คำนวณ total summary จาก filteredData
const total = filteredData.reduce(
  (acc, item) => {
    acc.power += Number(item.power || 0);
    acc.energy += Number(item.energy || 0);
    acc.onPeak += Number(item.onPeak || 0);
    acc.offPeak += Number(item.offPeak || 0);
    return acc;
  },
  { power: 0, energy: 0, onPeak: 0, offPeak: 0 }
);

const totalSummary = {
  power: total.power.toFixed(2),
  energy: total.energy.toFixed(2),
  onPeak: total.onPeak.toFixed(2),
  offPeak: total.offPeak.toFixed(2),
};

    // คำนวณ pagination
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const pagedData = sortedData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

    const handleChangePage = (page) => {
      if (page < 1) page = 1;
      else if (page > totalPages) page = totalPages;
      setCurrentPage(page);
    };

    const handleRowsPerPageChange = (e) => {
      setRowsPerPage(Number(e.target.value));
      setCurrentPage(1); // reset page เมื่อเปลี่ยน rows per page
    };

    return (
      <>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Energy Load Consumption</h2>
          <div className="flex flex-col items-end gap-4">
            <input
              type="text"
              placeholder="Search"
              className="border rounded px-3 py-1 text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset page ถ้ามี search ใหม่
              }}
            />
            <span className="text-sm text-gray-500 dark:text-white">
              Last Updated on {lastUpdated}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-y border-gray-200 bg-gray-50 dark:bg-gray-900">
              <tr className="text-gray-700 dark:text-white">
                <th className="py-2">
                  {renderSortHeader(
                    "#",
                    "originalIndex",
                    sortBy,
                    sortDirection,
                    onSortLoad
                  )}
                </th>
                <th className="py-2">
                  {renderSortHeader(
                    "Source",
                    "name",
                    sortBy,
                    sortDirection,
                    onSort
                  )}
                </th>
                <th className="py-2">
                  {renderSortHeader(
                    "Current Power (kW)",
                    "power",
                    sortBy,
                    sortDirection,
                    onSort
                  )}
                </th>
                <th className="py-2">
                  {renderSortHeader(
                    "Energy Consumption (kWh)",
                    "energy",
                    sortBy,
                    sortDirection,
                    onSort
                  )}
                </th>
                <th className="py-2">
                  {renderSortHeader(
                    "On - Peak (kWh)",
                    "onPeak",
                    sortBy,
                    sortDirection,
                    onSort
                  )}
                </th>
                <th className="py-2">
                  {renderSortHeader(
                    "Off - Peak (kWh)",
                    "offPeak",
                    sortBy,
                    sortDirection,
                    onSort
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td
                    className="py-4 text-center text-gray-500 dark:text-gray-400"
                    colSpan={6}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                pagedData.map((item) => (
                  <tr
                    key={item.originalIndex}
                    className="border-b border-gray-200"
                  >
                    <td className="py-2">
                      {highlightText(item.originalIndex, search)}
                    </td>
                    <td className="py-2">{highlightText(item.name, search)}</td>
                    <td className="py-2">
                      {highlightText(parseFloat(item.power).toFixed(2), search)}
                    </td>
                    <td className="py-2">
                      {highlightText(
                        parseFloat(item.energy).toFixed(2),
                        search
                      )}
                    </td>
                    <td className="py-2">
                      {highlightText(
                        parseFloat(item.onPeak).toFixed(2),
                        search
                      )}
                    </td>
                    <td className="py-2">
                      {highlightText(
                        parseFloat(item.offPeak).toFixed(2),
                        search
                      )}
                    </td>
                  </tr>
                ))
              )}

              {pagedData.length > 0 && (
                <tr className="font-semibold bg-gray-100 border-t border-gray-200 dark:bg-gray-900 dark:text-white">
                  <td className="py-2" colSpan={2}>
                    Total
                  </td>
                  <td className="py-2">{totalSummary.power}</td>
                  <td className="py-2">{totalSummary.energy}</td>
                  <td className="py-2">{totalSummary.onPeak}</td>
                  <td className="py-2">{totalSummary.offPeak}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm mr-1">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-gray-300 text-sm rounded-lg"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleChangePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
            >
              {/* import ไอคอนมาใช้ เช่นจาก @mui/icons-material */}
              <ArrowBackIosNewIcon style={{ fontSize: "12px" }} />
            </button>
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handleChangePage(currentPage + 1)}
              disabled={currentPage === totalPages || filteredData.length === 0}
              className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
            >
              <ArrowForwardIosOutlinedIcon style={{ fontSize: "12px" }} />
            </button>
          </div>
        </div>
      </>
    );
  };
  const renderTableMeter = (
    data,
    search,
    setSearch,
    sortBy,
    sortDirection,
    onSort,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage
  ) => {
    const filteredData = filterData(data, search);
    const sortedData = sortData(filteredData, sortBy, sortDirection);
// คำนวณ total summary จาก filteredData
const total = filteredData.reduce(
  (acc, item) => {
    acc.power += Number(item.power || 0);
    acc.energy += Number(item.energy || 0);
    acc.onPeak += Number(item.onPeak || 0);
    acc.offPeak += Number(item.offPeak || 0);
    return acc;
  },
  { power: 0, energy: 0, onPeak: 0, offPeak: 0 }
);

const totalSummary = {
  power: total.power.toFixed(2),
  energy: total.energy.toFixed(2),
  onPeak: total.onPeak.toFixed(2),
  offPeak: total.offPeak.toFixed(2),
};

    // คำนวณ pagination
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const pagedData = sortedData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

    const handleChangePage = (page) => {
      if (page < 1) page = 1;
      else if (page > totalPages) page = totalPages;
      setCurrentPage(page);
    };

    const handleRowsPerPageChange = (e) => {
      setRowsPerPage(Number(e.target.value));
      setCurrentPage(1); // reset page เมื่อเปลี่ยน rows per page
    };

    return (
      <>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Energy Meter Consumption</h2>
          <div className="flex flex-col items-end gap-4">
            <input
              type="text"
              placeholder="Search"
              className="border rounded px-3 py-1 text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset page ถ้ามี search ใหม่
              }}
            />
            <span className="text-sm text-gray-500 dark:text-white">
              Last Updated on {lastUpdated}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-y border-gray-200 bg-gray-50 dark:bg-gray-900">
              <tr className="text-gray-700 dark:text-white">
                <th className="py-2">
                  {renderSortHeader(
                    "#",
                    "originalIndex",
                    sortBy,
                    sortDirection,
                    onSortLoad
                  )}
                </th>
                <th className="py-2">
                  {renderSortHeader(
                    "Source",
                    "name",
                    sortBy,
                    sortDirection,
                    onSort
                  )}
                </th>
                <th className="py-2">
                  {renderSortHeader(
                    "Current Power (kW)",
                    "power",
                    sortBy,
                    sortDirection,
                    onSort
                  )}
                </th>
                <th className="py-2">
                  {renderSortHeader(
                    "Energy Consumption (kWh)",
                    "energy",
                    sortBy,
                    sortDirection,
                    onSort
                  )}
                </th>
                <th className="py-2">
                  {renderSortHeader(
                    "On - Peak (kWh)",
                    "onPeak",
                    sortBy,
                    sortDirection,
                    onSort
                  )}
                </th>
                <th className="py-2">
                  {renderSortHeader(
                    "Off - Peak (kWh)",
                    "offPeak",
                    sortBy,
                    sortDirection,
                    onSort
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td
                    className="py-4 text-center text-gray-500 dark:text-gray-400"
                    colSpan={6}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                pagedData.map((item) => (
                  <tr
                    key={item.originalIndex}
                    className="border-b border-gray-200"
                  >
                    <td className="py-2">
                      {highlightText(item.originalIndex, search)}
                    </td>
                    <td className="py-2">{highlightText(item.name, search)}</td>
                    <td className="py-2">
                      {highlightText(parseFloat(item.power).toFixed(2), search)}
                    </td>
                    <td className="py-2">
                      {highlightText(
                        parseFloat(item.energy).toFixed(2),
                        search
                      )}
                    </td>
                    <td className="py-2">
                      {highlightText(
                        parseFloat(item.onPeak).toFixed(2),
                        search
                      )}
                    </td>
                    <td className="py-2">
                      {highlightText(
                        parseFloat(item.offPeak).toFixed(2),
                        search
                      )}
                    </td>
                  </tr>
                ))
              )}

              {pagedData.length > 0 && (
                <tr className="font-semibold bg-gray-100 border-t border-gray-200 dark:bg-gray-900 dark:text-white">
                  <td className="py-2" colSpan={2}>
                    Total
                  </td>
                  <td className="py-2">{totalSummary.power}</td>
                  <td className="py-2">{totalSummary.energy}</td>
                  <td className="py-2">{totalSummary.onPeak}</td>
                  <td className="py-2">{totalSummary.offPeak}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm mr-1">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-gray-300 text-sm rounded-lg"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleChangePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
            >
              {/* import ไอคอนมาใช้ เช่นจาก @mui/icons-material */}
              <ArrowBackIosNewIcon style={{ fontSize: "12px" }} />
            </button>
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handleChangePage(currentPage + 1)}
              disabled={currentPage === totalPages || filteredData.length === 0}
              className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
            >
              <ArrowForwardIosOutlinedIcon style={{ fontSize: "12px" }} />
            </button>
          </div>
        </div>
      </>
    );
  };
  // renderTableMeter แบบเดียวกัน
  // const renderTableMeter = (
  //   data,
  //   search,
  //   setSearch,
  //   sortBy,
  //   sortDirection,
  //   onSort,
  //   totalSummary,
  //   currentPage,
  //   setCurrentPage,
  //   rowsPerPage,
  //   setRowsPerPage
  // ) => {
  //   const filteredData = filterData(data, search);
  //   const sortedData = sortData(filteredData, sortBy, sortDirection);

  //   const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  // const pagedData = sortedData.slice(
  //   (currentPage - 1) * rowsPerPage,
  //   currentPage * rowsPerPage
  // );

  // const handleChangePage = (page) => {
  //   if (page < 1) page = 1;
  //   else if (page > totalPages) page = totalPages;
  //   setCurrentPage(page);
  // };

  // const handleRowsPerPageChange = (e) => {
  //   setRowsPerPage(Number(e.target.value));
  //   setCurrentPage(1); // reset page เมื่อเปลี่ยน rows per page
  // };

  //   return (
  //     <>
  //       <div className="flex justify-between mb-4">
  //         <h2 className="text-xl font-bold">Energy Meter Consumption</h2>
  //         <div className="flex flex-col items-end gap-4">
  //           <input
  //             type="text"
  //             placeholder="Search"
  //             className="border rounded px-3 py-1 text-sm"
  //             value={search}
  //             onChange={(e) => {
  //               setSearch(e.target.value);
  //               setCurrentPage(1);
  //             }}
  //           />
  //           <span className="text-sm text-gray-500 dark:text-white">
  //             Last Updated on DD/MM/YYYY 00:00
  //           </span>
  //         </div>
  //       </div>

  //       <div className="overflow-x-auto">
  //         <table className="min-w-full text-sm text-left">
  //           <thead className="border-y border-gray-200 bg-gray-50 dark:bg-gray-900">
  //             <tr className="text-gray-700 dark:text-white">
  //               <th className="py-2">#</th>
  //               <th className="py-2">
  //                 {renderSortHeader("Source", "source", sortBy, sortDirection, onSort)}
  //               </th>
  //               <th className="py-2">
  //                 {renderSortHeader(
  //                   "Energy (kW)",
  //                   "energyConsumption",
  //                   sortBy,
  //                   sortDirection,
  //                   onSort
  //                 )}
  //               </th>
  //               <th className="py-2">
  //                 {renderSortHeader(
  //                   "Power (kW)",
  //                   "powerConsumption",
  //                   sortBy,
  //                   sortDirection,
  //                   onSort
  //                 )}
  //               </th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {pagedData.length === 0 ? (
  //               <tr>
  //                 <td
  //                   className="py-4 text-center text-gray-500 dark:text-gray-400"
  //                   colSpan={4}
  //                 >
  //                   No data
  //                 </td>
  //               </tr>
  //             ) : (
  //               pagedData.map((item) => (
  //                 <tr key={item.originalIndex} className="border-b border-gray-200">
  //                   <td className="py-2">{highlightText(item.originalIndex, search)}</td>
  //                   <td className="py-2">{highlightText(item.source, search)}</td>
  //                   <td className="py-2">
  //                     {highlightText(parseFloat(item.energyConsumption).toFixed(2), search)}
  //                   </td>
  //                   <td className="py-2">
  //                     {highlightText(parseFloat(item.powerConsumption).toFixed(2), search)}
  //                   </td>
  //                 </tr>
  //               ))
  //             )}

  //             {pagedData.length > 0 && (
  //               <tr className="font-semibold bg-gray-100 border-t border-gray-200 dark:bg-gray-900 dark:text-white">
  //                 <td className="py-2" colSpan={2}>
  //                   Total
  //                 </td>
  //                 <td className="py-2">{totalSummary.energyConsumption}</td>
  //                 <td className="py-2">{totalSummary.powerConsumption}</td>
  //               </tr>
  //             )}
  //           </tbody>
  //         </table>
  //       </div>

  //       {/* Pagination */}
  //       <div className="flex justify-between items-center mt-4">
  //       <div>
  //         <span className="text-sm mr-1">Rows per page:</span>
  //         <select
  //           value={rowsPerPage}
  //           onChange={handleRowsPerPageChange}
  //           className="border border-gray-300 text-sm rounded-lg"
  //         >
  //           <option value={10}>10</option>
  //           <option value={20}>20</option>
  //           <option value={50}>50</option>
  //           <option value={100}>100</option>
  //         </select>
  //       </div>

  //       <div className="flex items-center space-x-2">
  //         <button
  //           onClick={() => handleChangePage(currentPage - 1)}
  //           disabled={currentPage === 1}
  //           className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
  //         >
  //           {/* import ไอคอนมาใช้ เช่นจาก @mui/icons-material */}
  //           <ArrowBackIosNewIcon style={{ fontSize: "12px" }} />
  //         </button>
  //         <span className="text-sm">
  //           {currentPage} / {totalPages}
  //         </span>
  //         <button
  //           onClick={() => handleChangePage(currentPage + 1)}
  //           disabled={currentPage === totalPages || filteredData.length === 0}
  //           className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
  //         >
  //           <ArrowForwardIosOutlinedIcon style={{ fontSize: "12px" }} />
  //         </button>
  //       </div>
  //     </div>
  //     </>
  //   );
  // };
  // const currentYear = new Date().getFullYear().toString();
  // const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  // const [year, setYear] = useState(currentYear);
  // const [month, setMonth] = useState(currentMonth);
  // const [sourceType, setSourceType] = useState('All');

  const renderHeatmapSection = () => (
    <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center">
          <span className="text-xl font-bold">Heatmap</span>
          <Tooltip
            title="Visualizes hourly energy consumption patterns over the selected month."
            arrow
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: "14px", // ปรับขนาดฟอนต์
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
          <Select
            value={year}
            onChange={handleYearChange}
            style={{ width: 100 }}
          >
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
                {item.name}
              </Option>
            ))}
          </Select>
        </Space>
      </div>
      <div className="mt-5">
        <HeatmapPage data={heatmapData} Energytype="Energy Consumed" />
      </div>
    </div>
  );

  return (
    <>
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "load"
                ? "border-b-2 border-teal-500 text-black dark:text-white"
                : "text-gray-400 dark:text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("load");
              setSortDirectionLoad("");
              setSortByLoad("");
              setSortByMeter("");
              setSortDirectionMeter("");
            }}
          >
            Load Consumption
          </button>
          <button
            className={`ml-4 px-4 py-2 font-semibold ${
              activeTab === "meter"
                ? "border-b-2 border-teal-500 text-black dark:text-white"
                : "text-gray-400 dark:text-gray-600"
            }`}
            onClick={() => {
              setActiveTab("meter");
              setSortDirectionLoad("");
              setSortByLoad("");
              setSortByMeter("");
              setSortDirectionMeter("");
            }}
          >
            Meter Consumption
          </button>
        </div>
        {activeTab === "load" ? (
          <>
            {renderTableLoad(
              consumptionDeviceList,
              searchLoad,
              setSearchLoad,
              sortByLoad,
              sortDirectionLoad,
              onSortLoad,
              currentPageLoad,
              setCurrentPageLoad,
              rowsPerPageLoad, // ส่งเพิ่มเข้าไป
              setRowsPerPageLoad // ส่งเพิ่มเข้าไป
            )}
          </>
        ) : (
          <>
            {renderTableMeter(
              consumptionDeviceList,
              searchMeter,
              setSearchMeter,
              sortByMeter,
              sortDirectionMeter,
              onSortMeter,
              currentPageMeter,
              setCurrentPageMeter,
              rowsPerPageMeter,
              setRowsPerPageMeter
            )}
          </>
        )}
      </div>
      {activeTab === "load" ? (
        <>
          {renderEnergyTrend("Energy Load Consumption")}
          {renderRevenueTrend("Consumption Cost")}
        </>
      ) : (
        <>
          {renderEnergyTrend("Energy  Meter Consumption")}
          {renderRevenueTrend("Consumption Cost")}
        </>
      )}
      {renderHeatmapSection()}
      {loading && <Loading />}
    </>
  );
}
