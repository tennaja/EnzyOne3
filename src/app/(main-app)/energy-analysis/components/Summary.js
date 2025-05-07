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

  // const handleClick = (id) => {
  //   setEnergyRange(id);
  // };

  // const renderDatePicker = () => {
  //   if (energyRange === "lifetime") {
  //     return <DatePicker disabled className="ml-4" />;
  //   }

  //   if (energyRange === "year") {
  //     return (
  //       <DatePicker
  //         picker="year"
  //         format="YYYY"
  //         value={selectedDate}
  //         onChange={(date) => setSelectedDate(date)}
  //         className="ml-4"
  //         allowClear={false}
  //       />
  //     );
  //   }

  //   if (energyRange === "month") {
  //     return (
  //       <DatePicker
  //         picker="month"
  //         format="YYYY/MM"
  //         value={selectedDate}
  //         onChange={(date) => setSelectedDate(date)}
  //         className="ml-4"
  //         allowClear={false}
  //       />
  //     );
  //   }

  //   // Default: day
  //   return (
  //     <DatePicker
  //       format="YYYY/MM/DD"
  //       value={selectedDate}
  //       onChange={(date) => setSelectedDate(date)}
  //       className="ml-4"
  //       allowClear={false}
  //     />
  //   );
  // };
  const data = {
    currentPower: { value: "254.14", unit: "kW" },
    yieldToday: { value: "1.72", unit: "MWh" },
    revenueToday: { value: "8.48K", unit: "Baht", hasInfo: true },
    totalYield: { value: "828.91", unit: "MWh", hasInfo: true },
    inventorRatedPower: { value: "980.00", unit: "kW", hasInfo: true },
    rateEssCapacity: { value: "0.00", unit: "kWh" },
    supplyFromGrid: { value: "76.37", unit: "kWh" },
    co2Avoided: { value: "2.37", unit: "tons" },
    treePlanted: { value: "4", unit: "" },
  };
  console.log("Summary component loaded");

  return (
    <>
      <div className="mt-5">
        <span className="text-xl font-bold">Plant KPI</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-2">
          <Card title="Current power" {...data.currentPower} />
          <Card title="Yield today" {...data.yieldToday} />
          <Card
            title="Revenue today"
            tootipword={"Yield today * Revenue rate"}
            {...data.revenueToday}
          />
          <Card
            title="Total yield"
            tootipword={"Total energy yield of the plant since installation."}
            {...data.totalYield}
          />
          <Card
            title="Inverter rated power"
            tootipword={
              "The rated power data refers to the capacity of the inverters installed in this plant"
            }
            {...data.inventorRatedPower}
          />
          <Card title="Rate ESS capacity" {...data.rateEssCapacity} />
          <Card title="Purchased from grid" {...data.supplyFromGrid} />
        </div>

        <span className="text-xl font-bold mb-4">Environmental Benefits</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-2">
          <Card title="CO₂ avoided" {...data.co2Avoided} />
          <Card title="Equivalent tree planted" {...data.treePlanted} />
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
          <span className="font-bold text-xl">25.24</span> kWh
          <span className="ml-6 font-base text-sm">Consumption: </span>
          <span className="font-bold text-xl">101.61</span> kWh
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3 h-80 flex flex-col items-center justify-center">
            <EnergyTrendChart type={energyRange} />
          </div>
          <div className="w-full lg:w-1/3 h-80  flex flex-col items-center justify-center">
            <EnergyPieChart />
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-8">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center">
            <span className="text-xl font-bold">Revenue Trend</span>
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
          <span className="font-bold text-xl">25.24</span> ฿
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <RevenueBarChart />
        </div>
      </div>
    </>
  );
}
