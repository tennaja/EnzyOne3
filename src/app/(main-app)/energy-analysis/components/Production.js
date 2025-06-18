"use client";
import { useState, useEffect, useMemo} from "react";
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
        onClick={() => {
          if (tab.id !== range) {
            onChange(tab.id);
          }
        }}
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
  const [lastUpdated,setLatsUpdated]=useState('')
  const [rowsPerPage, setRowsPerPage] = useState(20); // default 10

  // const [totalSummary, setTotalSummary] = useState({
  //   power: "0.00",
  //   energy: "0.00",
  //   revenue: "0.00",
  // });
  const [loading, setLoading] = useState(false);
  
  // useEffect(() => {
  //   const firstLoad = async () => {
  //     console.log("Start loading...");
  //     setLoading(true);
  //     try {
  //       await Promise.all([
  //         GetEnergyProductDeviceList().then(() => console.log("GetEnergyProductDeviceList done")),
  //         GetDropdownDeviceList().then(() => console.log("GetDropdownDeviceList done")),
  //         GetEnergyHistory().then(() => console.log("GetEnergyHistory done")),
  //         GetEnergyRevenue().then(() => console.log("GetEnergyRevenue done")),
  //         GetProductionHeatmap().then(() => console.log("GetProductionHeatmap done"))
  //       ]);
  //       console.log("All done");
  
  //       await new Promise(resolve => setTimeout(resolve, 10000));
  //     } catch (error) {
  //       console.error("Error in loading:", error);
  //     } finally {
  //       setLoading(false);
  //       console.log("setLoading(false)");
  //     }
  //   };
  
  //   firstLoad();
  // }, []);
  

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
   
      GetEnergyHistory(); // เรียกเฉพาะเมื่อเปลี่ยน
  
    const interval = setInterval(() => {
      GetEnergyHistory(false);
    }, 300000);

    return () => clearInterval(interval);
  }, [energyDate, energyRange]);

  useEffect(() => {
    
      GetEnergyRevenue(); // เรียกเฉพาะเมื่อเปลี่ยน
   
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
        setLatsUpdated(data.lastUpdated)
        console.log(data)
        const total = data?.data.reduce(
          (acc, item) => {
            acc.power += Number(item.power || 0);
            acc.energy += Number(item.energy || 0);
            acc.revenue += Number(item.revenue || 0);
            return acc;
          },
          { power: 0, energy: 0, revenue: 0 }
        );

        setProductDeviceList(data?.data);
        // setTotalSummary({
        //   power: total.power.toFixed(2),
        //   energy: total.energy.toFixed(2),
        //   revenue: total.revenue.toFixed(2),
        // });
      } else {
        setProductDeviceList([]);
        // setTotalSummary({ power: "0.00", energy: "0.00", revenue: "0.00" });
      }
    } catch (error) {
      console.error("Error fetching Summary History:", error);
      setProductDeviceList([]);
      // setTotalSummary({ power: "0.00", energy: "0.00", revenue: "0.00" });
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

          item?.name?.toLowerCase().includes(search.toLowerCase()) ||
          item?.power?.toFixed(2).toString().includes(search.toLowerCase()) ||
          item?.energy?.toFixed(2).toString().includes(search.toLowerCase()) ||
          item?.revenue?.toFixed(2).toString().includes(search.toLowerCase()) ||
          item?.originalIndex?.toString().includes(search.toLowerCase()) // ค้นหาด้วย originalIndex
      );

  const [currentPage, setCurrentPage] = useState(1);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const direction =
        prev.key === key && prev.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
  };
  const sortedData = useMemo(() => {
    const data = filterData(productDeviceList, searchLoad);
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (typeof valA === "number") {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }

      return sortConfig.direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [productDeviceList, searchLoad, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

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

  const handleYearChange = (newYear) => {
    setYear(newYear);
      // ถ้าไม่ใช่ปีปัจจุบัน → reset เป็นเดือน 01
      setMonth("01");
    
  };
  

  const totalSummary = useMemo(() => {
    const total = sortedData.reduce(
      (acc, item) => {
        acc.power += Number(item.power || 0);
        acc.energy += Number(item.energy || 0);
        acc.revenue += Number(item.revenue || 0);
        return acc;
      },
      { power: 0, energy: 0, revenue: 0 }
    );
  
    return {
      power: total.power.toFixed(2),
      energy: total.energy.toFixed(2),
      revenue: total.revenue.toFixed(2),
    };
  }, [sortedData]);
  

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
              Last Updated on {lastUpdated}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-y border-gray-200 bg-gray-50 dark:bg-gray-900">
              <tr className="text-gray-700 dark:text-white text-sm">
                {/* <th className="px-2 py-2">#</th> */}

                {[
                  { key: "originalIndex", label: "#" },
                  { key: "name", label: "Source" },
                  { key: "power", label: "Power Generation (kW)" },
                  { key: "energy", label: "Energy Generation (kWh)" },
                  { key: "revenue", label: "Revenue (Bath)" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-2 py-2 cursor-pointer text-left"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    <div
                      style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        marginLeft: "4px",
                      }}
                    >
                      <ArrowDropUpIcon
                        style={{
                          fontSize: "14px",
                          opacity:
                            sortConfig.key === col.key &&
                            sortConfig.direction === "asc"
                              ? 1
                              : 0.3,
                          marginBottom: "-2px",
                        }}
                      />
                      <ArrowDropDownIcon
                        style={{
                          fontSize: "14px",
                          opacity:
                            sortConfig.key === col.key &&
                            sortConfig.direction === "desc"
                              ? 1
                              : 0.3,
                          marginTop: "-2px",
                        }}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
  {paginatedData.length === 0 ? (
    <tr>
      <td className="py-4 text-center text-gray-500 dark:text-gray-400" colSpan={5}>
        No data found
      </td>
    </tr>
  ) : (
    <>
      {paginatedData.map((item) => (
        <tr
          key={item.originalIndex}
          className="border-b border-gray-200"
        >
          <td className="py-2">
            {highlightText(item.originalIndex, searchLoad)}
          </td>
          <td className="py-2">
            {highlightText(item.name, searchLoad)}
          </td>
          <td className="py-2">
            {highlightText(
              parseFloat(item.power).toFixed(2),
              searchLoad
            )}
          </td>
          <td className="py-2">
            {highlightText(
              parseFloat(item.energy).toFixed(2),
              searchLoad
            )}
          </td>
          <td className="py-2">
            {highlightText(
              parseFloat(item.revenue).toFixed(2),
              searchLoad
            )}
          </td>
        </tr>
      ))}

      {/* ✅ แสดง Total เฉพาะเมื่อมีข้อมูล */}
      <tr className="font-semibold bg-gray-100 border-t border-gray-200 dark:bg-gray-900 dark:text-white">
        <td className="py-2" colSpan={2}>
          Total
        </td>
        <td className="py-2">{totalSummary.power} kW</td>
        <td className="py-2">{totalSummary.energy} kWh</td>
        <td className="py-2">{totalSummary.revenue} Bath</td>
      </tr>
    </>
  )}
</tbody>

          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-sm mr-1">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1); // reset page กลับหน้าแรกเมื่อเปลี่ยน rowsPerPage
                }}
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
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
              >
                <ArrowBackIosNewIcon style={{ fontSize: "12px" }} />
              </button>
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
              >
                <ArrowForwardIosOutlinedIcon style={{ fontSize: "12px" }} />
              </button>
            </div>
          </div>
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

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3 h-80 flex items-center justify-center">
            <EnergyTrendChart2 type={energyRange} data={energyHistoryData} />
          </div>
          <div className="w-full lg:w-1/3 h-80  flex flex-col items-center justify-center">
            <EnergyPieChart data={energyHistoryData} />
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
          <span className="font-bold text-xl">
            {formatNumberWithK(revenueHistoryData?.revenue)}
          </span>{" "}
          ฿
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <RevenueBarChart2 data={revenueHistoryData} type={revenueRange}/>
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

        <div className="w-full flex items-center justify-center mt-5"></div>
        <HeatmapPage data={externalData} Energytype="Energy Generated"/>
      </div>
      {loading && <Loading />}
    </>
  );
}
