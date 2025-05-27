"use client";
import { useState } from "react";
import Card from "./Card";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en"; // หรือ 'th' ถ้าอยากใช้ภาษาไทย
import customParseFormat from "dayjs/plugin/customParseFormat";
import EnergyPieChart from "./EnergyPieChart";
import EnergyTrendChart from "./EnergyChart";
import RevenueBarChart from "./RevenueBarChart";
import Tooltip from "@mui/material/Tooltip";
import { getSummaryOverviewList , getSummaryEnergyHistory ,getSummaryEnergyRevenue } from "@/utils/api";
import { useEffect } from "react";
import Loading from "./Loading";
dayjs.extend(customParseFormat);

const { MonthPicker } = DatePicker;
const allTabs = [
  { id: "day", label: "Day" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
  { id: "lifetime", label: "Lifetime" },
];

const revenueTabs = allTabs.filter((tab) => tab.id !== "day");

const GroupTabs = ({ range, onChange, tabs }) => {
  return (
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
};


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

  // Default: day
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

export default function Summary() {
  const [energyRange, setEnergyRange] = useState("day");
  const [energyDate, setEnergyDate] = useState(dayjs());
  const [revenueRange, setRevenueRange] = useState("month");
  const [revenueDate, setRevenueDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [summaryOverviewData, setSummaryOverviewData] = useState([]);
  const [energyHistoryData, setEnergyHistoryData] = useState([]);
  const [revenueHistoryData, setRevenueHistoryData] = useState([]);
  
  useEffect(() => {
    // Fetch initial data for Summary Overview
    GetSummaryOverview();
  
    // Set interval to refresh Summary Overview every 5 minutes
    const interval = setInterval(() => {
      GetSummaryOverview(false);
    }, 300000); // 300,000 ms = 5 minutes
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Fetch initial data for Energy History
    GetEnergyHistory();
  
    // Set interval to refresh Energy History every 5 minutes
    const interval = setInterval(() => {
      GetEnergyHistory(false);
    }, 300000); // 300,000 ms = 5 minutes
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [energyDate, energyRange]);
  
  useEffect(() => {
    // Fetch initial data for Energy Revenue
    GetEnergyRevenue();
  
    // Set interval to refresh Energy Revenue every 5 minutes
    const interval = setInterval(() => {
      GetEnergyRevenue(false);
    }, 300000); // 300,000 ms = 5 minutes
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [revenueDate, revenueRange]);

const GetSummaryOverview = async (showLoading = true) => {
   
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

    try {
      const result = await getSummaryOverviewList();
      if (result && result.status === 200) {
        console.log("Device List Result:", result);
        setSummaryOverviewData(result.data);
      } else {
        setSummaryOverviewData([]);
      }
    } catch (error) {
      console.error("Error fetching device list:", error);
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
      groupBy : energyRange,
    };
    
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

    try {
      const result = await getSummaryEnergyHistory(paramsNav);
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
      groupBy : revenueRange,
    };
    
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

    try {
      const result = await getSummaryEnergyRevenue(paramsNav);
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
      // format number with commas, ถ้าเป็น integer แสดงไม่ต้องมีทศนิยม
      const formattedValue = Number.isInteger(value)
        ? value.toLocaleString('en-US')
        : parseFloat(value.toFixed(1)).toLocaleString('en-US');
      return `${formattedValue}K`;
    }
  
    return num.toLocaleString('en-US'); // ใส่ลูกน้ำให้ตัวเลขที่น้อยกว่า 1000
  }

  console.log("Summary component loaded");

  return (
    <>
      <div className="mt-5">
        <span className="text-xl font-bold">Plant KPI</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-2">
          <Card title="Current power" value={formatNumber(summaryOverviewData?.kpi?.currentPower)} unit="kW" />
          <Card title="Yield today" value={formatNumber(summaryOverviewData?.kpi?.currentPower)} unit="MWh" />
          <Card
            title="Revenue today"
            tootipword={"Yield today * Revenue rate"}
            value={formatNumberWithK(summaryOverviewData?.kpi?.yieldToday)} unit="Baht"
          hasInfo={true}
          />
          <Card
            title="Total yield"
            tootipword={"Total energy yield of the plant since installation."}
            value={formatNumber(summaryOverviewData?.kpi?.yieldTotal)} unit="kWh" hasInfo={true}
          />
          <Card
            title="Inverter rated power"
            tootipword={
              "The rated power data refers to the capacity of the inverters installed in this plant"
            }
            value={formatNumber(summaryOverviewData?.kpi?.inverterRatedPower)} unit="kW" hasInfo={true}
          />
          <Card title="Rate ESS capacity" value={formatNumber(summaryOverviewData?.kpi?.rateEssCapacity)} unit="KWh" />
          <Card title="Purchased from grid" value={formatNumber(summaryOverviewData?.kpi?.purchasedEnergy)} unit="KWh"  />
        </div>

        <span className="text-xl font-bold mb-4">Environmental Benefits</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-2">
          <Card title="CO₂ avoided" value={formatNumber(summaryOverviewData?.environmental?.carbonAvoided)} unit="tons"  />
          <Card title="Equivalent tree planted" value={formatNumber(summaryOverviewData?.environmental?.equivalentTrees)} unit=""/>
        </div>
      </div>
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center">
            <span className="text-xl font-bold">Energy Trend</span>
            <Tooltip
              title="Values above the zero line represent production power, while values below represent consumption power."
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

          {/* Energy Section */}
          <div className="flex items-center">
            {/* <span className="mr-4 font-medium">Energy:</span> */}
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
              onChange={(val) => setEnergyDate(val)}
            />
          </div>
        </div>

        <div className="text-lg mb-4">
  <span className="font-base text-sm">Yield: </span>
  <span className="font-bold text-xl">
    {formatNumberWithK(
      energyHistoryData?.yield > 1000 
        ? energyHistoryData.yield / 1000 
        : energyHistoryData?.yield
    )}
  </span> {energyHistoryData?.yield > 1000 ? 'MWh' : 'kWh'}

  <span className="ml-6 font-base text-sm">Consumption: </span>
  <span className="font-bold text-xl">
    {formatNumberWithK(
      energyHistoryData?.consumption > 1000 
        ? energyHistoryData.consumption / 1000 
        : energyHistoryData?.consumption
    )}
  </span> {energyHistoryData?.consumption > 1000 ? 'MWh' : 'kWh'}
</div>



        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3 h-80 flex flex-col items-center justify-center">
          <EnergyTrendChart
  type={energyRange}
  dataProp={energyHistoryData?.history} // apiData คือ object ที่ได้จาก API
/>

          </div>
          <div className="w-full lg:w-1/3 h-80  flex flex-col items-center justify-center">
            <EnergyPieChart  data={[
    { name: 'Energy from Grid', value:  energyHistoryData?.yield},
    { name: 'Energy from PV', value: energyHistoryData?.netConsumption },
  ]}/>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-8">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center">
            <span className="text-xl font-bold">Revenue Trend</span>
          </div>

          {/* Revenue Section */}
          <div className="flex items-center">
            {/* <span className="mr-4 font-medium">Revenue:</span> */}
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
          <span className="font-base text-sm">Total Revenue: </span>
          <span className="font-bold text-xl">{formatNumberWithK(revenueHistoryData?.revenue)}</span> ฿
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <RevenueBarChart history={revenueHistoryData?.history}/>
        </div>
      </div>
      {loading && <Loading/>}  
    </>
  );
}
