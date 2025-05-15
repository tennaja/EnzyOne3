"use client";
import { useState, useEffect } from "react";
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

const loadData = [
  {
    id: 1,
    source: "Load A",
    currentPower: "120.5",
    energyConsumption: "300.5",
    onPeak: "100",
    offPeak: "200",
  },
  {
    id: 2,
    source: "Load B",
    currentPower: "110.1",
    energyConsumption: "280.0",
    onPeak: "90",
    offPeak: "190",
  },
];

const meterData = [
  {
    id: 1,
    source: "Meter X",
    currentPower: "98.0",
    energyConsumption: "240.3",
  },
  {
    id: 2,
    source: "Meter Y",
    currentPower: "105.2",
    energyConsumption: "250.6",
  },
];

export default function Consumption() {
  const [activeTab, setActiveTab] = useState("load");
  const [searchLoad, setSearchLoad] = useState("");
  const [searchMeter, setSearchMeter] = useState("");
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
  const [totalSummary, setTotalSummary] = useState({
    power: "0.00",
    energy: "0.00",
    onPeak: "0.00",
    offPeak: "0.00",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetConsumptionDeviceList();
  }, [activeTab]);
  useEffect(() => {
    GetEnergyHistory();
  }, [activeTab, energyDate, energyRange]);
  useEffect(() => {
    GetCostHistory();
  }, [activeTab, revenueDate, revenueRange]);

  useEffect(() => {
    GetDropdownDeviceList();
  }, []);
  useEffect(() => {
    GetConsumptionnHeatmap();
  }, [year, month, sourceType]);

  const GetConsumptionDeviceList = async () => {
    const params = {
      siteId: 6,
      deviceType: activeTab,
    };
    setLoading(true)
    try {
      const result = await getConsumptionSummary(params);
      if (result && result.status === 200) {
        const data = result.data;

        const total = data.reduce(
          (acc, item) => {
            acc.power += Number(item.power || 0);
            acc.energy += Number(item.energy || 0);
            acc.onPeak += Number(item.onPeak || 0);
            acc.offPeak += Number(item.offPeak || 0);
            return acc;
          },
          { power: 0, energy: 0, onPeak: 0, offPeak: 0 }
        );

        setConsumptionDeviceList(data);
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
    }finally {
      setLoading(false)
    }
  };
  const GetEnergyHistory = async () => {
    const paramsNav = {
      siteId: 6,
      deviceType: activeTab,
      date: energyDate.format("YYYY/MM/DD"),
      groupBy: energyRange,
    };
    setLoading(true)
    // if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

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
      setLoading(false)
      // if (showLoading) {
      //   setTimeout(() => setLoading(false), 1000);
      // }
    }
  };
  const GetCostHistory = async () => {
    const paramsNav = {
      siteId: 6,
      deviceType: activeTab,
      date: revenueDate.format("YYYY/MM/DD"),
      groupBy: revenueRange,
    };
    setLoading(true)
    // if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
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
      setLoading(false)
      // if (showLoading) {
      //   setTimeout(() => setLoading(false), 1000);
      // }
    }
  };
  const GetDropdownDeviceList = async () => {
    const siteId = 6;
    setLoading(true)
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
    }finally {
      setLoading(false)
    }
  };

  const GetConsumptionnHeatmap = async () => {
    const paramsNav = {
      siteId: 6,
      date: yearMonth,
      deviceId: sourceType,
    };
    setLoading(true)
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
      setLoading(false)
      // if (showLoading) {
      //   setTimeout(() => setLoading(false), 1000);
      // }
    }
  };

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

  const filterData = (data, search) =>
    data
      .map((item, index) => ({
        ...item, // คัดลอกข้อมูลเดิมทั้งหมด
        originalIndex: index + 1, // เพิ่ม originalIndex โดยเริ่มที่ 1
      }))
      .filter(
        (item) =>
          item?.name?.toLowerCase().includes(search.toLowerCase()) ||
          item?.power?.toString().includes(search.toLowerCase()) ||
          item?.energy?.toString().includes(search.toLowerCase()) ||
          item?.onPeak?.toString().includes(search.toLowerCase()) ||
          item?.offPeak?.toString().includes(search.toLowerCase()) ||
          item?.originalIndex?.toString().includes(search.toLowerCase())
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
  
  function formatNumberWithK(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      return '-';
    }
  
    if (num >= 1000) {
      const value = num / 1000;
      // format number with commas, ถ้าเป็น integer แสดงไม่ต้องมีทศนิยม
      const formattedValue = Number.isInteger(value)
        ? value.toLocaleString('en-US')
        : parseFloat(value.toFixed(1)).toLocaleString('en-US');
      return `${formattedValue}K`;
    }
  
    return num.toLocaleString('en-US'); // ใส่ลูกน้ำให้ตัวเลขที่น้อยกว่า 1000
  }
  

  const renderEnergyTrend = (title) => (
    <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center">
          <span className="text-xl font-bold">{title}</span>
          <Tooltip
            title="More information about this metric"
            arrow
            placement="top"
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

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full lg:w-2/3 h-80 flex items-center justify-center">
          <EnergyTrendChart3 type={energyRange} data={energyHistoryData} />
        </div>
        <div className="w-full lg:w-1/3 h-80  flex flex-col items-center justify-center">
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
          <Tooltip
            title="More information about this metric"
            arrow
            placement="top"
          >
            <InfoOutlinedIcon
              className="text-[#33BFBF] ml-1 cursor-pointer"
              fontSize="small"
            />
          </Tooltip>
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
        <span className="font-bold text-xl">{formatNumberWithK(costHistoryData?.cost)}</span> ฿
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <RevenueBarChart3 data={costHistoryData} />
      </div>
    </div>
  );

  const renderTableLoad = (data, search, setSearch) => {
    const filteredData = filterData(data, search);

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
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="text-sm text-gray-500 dark:text-white">
              Last Updated on DD/MM/YYYY 00:00
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-y border-gray-200 bg-gray-50 dark:bg-gray-900">
              <tr className="text-gray-700 dark:text-white">
                <th className="py-2">#</th>
                <th className="py-2">Source</th>
                <th className="py-2">Current Power (kWh)</th>
                <th className="py-2">Energy Consumption (kWh)</th>
                <th className="py-2">On - Peak (kWh)</th>
                <th className="py-2">Off - Peak</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    className="py-4 text-center text-gray-500 dark:text-gray-400"
                    colSpan={6}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.originalIndex}
                    className="border-b border-gray-200"
                  >
                    <td className="py-2">
                      {highlightText(item.originalIndex, search)}
                    </td>
                    <td className="py-2">{highlightText(item.name, search)}</td>
                    <td className="py-2">
                      {highlightText(item.power, search)}
                    </td>
                    <td className="py-2">
                      {highlightText(item.energy, search)}
                    </td>
                    <td className="py-2">
                      {highlightText(item.onPeak, search)}
                    </td>
                    <td className="py-2">
                      {highlightText(item.offPeak, search)}
                    </td>
                  </tr>
                ))
              )}

              {filteredData.length > 0 && (
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
      </>
    );
  };

  const renderTableMeter = (data, search, setSearch) => {
    const filteredData = filterData(data, search);

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
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="text-sm text-gray-500 dark:text-white">
              Last Updated on DD/MM/YYYY 00:00
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-y border-gray-200 bg-gray-50 dark:bg-gray-900">
              <tr className="text-gray-700 dark:text-white">
                <th className="py-2">#</th>
                <th className="py-2">Source</th>
                <th className="py-2">Energy (kW)</th>
                <th className="py-2">Power (kWh)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    className="py-4 text-center text-gray-500 dark:text-gray-400"
                    colSpan={4}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2">{item.id}</td>
                    <td className="py-2">{item.source}</td>
                    <td className="py-2">
                      {parseFloat(item.energyConsumption).toFixed(2)}
                    </td>
                    <td className="py-2">
                      {parseFloat(item.currentPower).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}

              {filteredData.length > 0 && (
                <tr className="font-semibold bg-gray-100 border-t border-gray-200 dark:bg-gray-900 dark:text-white">
                  <td className="py-2" colSpan={2}>
                    Total
                  </td>
                  <td className="py-2">XXX.XX</td>
                  <td className="py-2">XXX.XX</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

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
            title="More information about this metric"
            arrow
            placement="top"
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
        <HeatmapPage data={heatmapData} />
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
            onClick={() => setActiveTab("load")}
          >
            Load Consumption
          </button>
          <button
            className={`ml-4 px-4 py-2 font-semibold ${
              activeTab === "meter"
                ? "border-b-2 border-teal-500 text-black dark:text-white"
                : "text-gray-400 dark:text-gray-600"
            }`}
            onClick={() => setActiveTab("meter")}
          >
            Meter Consumption
          </button>
        </div>
        {activeTab === "load" ? (
          <>
            {renderTableLoad(consumptionDeviceList, searchLoad, setSearchLoad)}
          </>
        ) : (
          <>{renderTableMeter(consumptionDeviceList, searchMeter, setSearchMeter)}</>
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
      {loading && <Loading/>}  
    </>
  );
}
