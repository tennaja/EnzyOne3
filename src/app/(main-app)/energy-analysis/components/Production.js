"use client";
import { useState, useEffect } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import EnergyPieChart from "./EnergyPieChart";
import EnergyTrendChart2 from "./Trendchart";
import RevenueBarChart2 from "./BarChart";
import { Select, Space } from 'antd';
import HeatmapPage from './Heatmap';

const { Option } = Select;

const allTabs = [
  { id: 'day', label: 'Day' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'lifetime', label: 'Lifetime' },
];

const revenueTabs = allTabs.filter(tab => tab.id !== 'day');

const GroupTabs = ({ range, onChange, tabs }) => (
  <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-4 py-2 text-sm border-r last:border-r-0 border-gray-300 dark:border-gray-600 transition-all ${
          range === tab.id
            ? 'bg-teal-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const DatePickerByRange = ({ range, value, onChange }) => {
  if (range === 'lifetime') {
    return <DatePicker disabled className="ml-4" />;
  }

  if (range === 'year') {
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

  if (range === 'month') {
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
    source: 'Gen 1',
    powerGeneration: '120.50',
    energyGeneration: '300.50',
    revenue: '100.00',
  },
  {
    id: 2,
    source: 'Gen 2',
    powerGeneration: '110.10',
    energyGeneration: '280.00',
    revenue: '90.00',
  },
];



export default function Production() {
  const [searchLoad, setSearchLoad] = useState('');
  const [energyRange, setEnergyRange] = useState('day');
  const [energyDate, setEnergyDate] = useState(dayjs());
  const [revenueRange, setRevenueRange] = useState('month');
  const [revenueDate, setRevenueDate] = useState(dayjs());

  const filterData = (data, search) =>
    data.filter((item) => item.source.toLowerCase().includes(search.toLowerCase()));

  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [sourceType, setSourceType] = useState('All');

  const generateData = () => {
    return Array.from({ length: 24 }, (_, hourIndex) => {
      const hour = `${hourIndex.toString().padStart(2, '0')}:00`;
      const dayData = {};
      for (let day = 1; day <= 31; day++) {
        const dayKey = day.toString().padStart(2, '0');
        dayData[dayKey] = Math.floor(Math.random() * 100);
      }
      return {
        year,
        month,
        sourceType,
        hour,
        ...dayData,
      };
    });
  };

  const [externalData, setExternalData] = useState(generateData());

  useEffect(() => {
    const filteredData = generateData().filter(
      (entry) =>
        entry.year === year &&
        entry.month === month &&
        (sourceType === 'All' || entry.sourceType === sourceType)
    );
    console.log("Filtered data:", filteredData);
    setExternalData(filteredData);
  }, [year, month, sourceType]);

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
    {filterData(loadData, searchLoad).map((item) => (
      <tr key={item.id} className="border-b border-gray-200">
        <td className="py-2">{item.id}</td>
        <td className="py-2">{item.source}</td>
        <td className="py-2">{item.powerGeneration}</td>
        <td className="py-2">{item.energyGeneration}</td>
        <td className="py-2">{item.revenue}</td>
      </tr>
    ))}
    <tr className="font-semibold bg-gray-100 border-t border-gray-200 dark:bg-gray-900 dark:text-white">
      <td className="py-2" colSpan={2}>Total</td>
      <td className="py-2">XXX.XX kW</td>
      <td className="py-2">XXX.XX kWh</td>
      <td className="py-2">XXX.XX Bath</td>
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
              <Tooltip title="More information about this metric" arrow placement="top">
                <InfoOutlinedIcon className="text-[#33BFBF] ml-1 cursor-pointer" fontSize="small" />
              </Tooltip>
            </div>
            <div className="flex items-center">
              <GroupTabs range={energyRange} onChange={(val) => { setEnergyRange(val); setEnergyDate(dayjs()); }} tabs={allTabs} />
              <DatePickerByRange range={energyRange} value={energyDate} onChange={(val) => setEnergyDate(dayjs(val))} />
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
              <EnergyTrendChart2 type={energyRange} />
            </div>
            <div className="w-full lg:w-1/3 h-80  flex flex-col items-center justify-center">
              <EnergyPieChart />
            </div>
          </div>
        </div>

        {/* Revenue Trend Section */}
        <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center">
              <span className="text-xl font-bold">Revenue Trend</span>
              <Tooltip title="More information about this metric" arrow placement="top">
                <InfoOutlinedIcon className="text-[#33BFBF] ml-1 cursor-pointer" fontSize="small" />
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
                
              />
            </div>
          </div>

          <div className="text-lg mb-4">
            <span className="text-sm">Total Revenue: </span>
            <span className="font-bold text-xl">25.24</span> ฿
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <RevenueBarChart2 />
          </div>
        </div>

        {/* Heatmap Section */}
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
              <Select value={year} onChange={setYear} style={{ width: 100 }}>
                {[2023, 2024, 2025].map((y) => (
                  <Option key={y} value={y.toString()}>
                    {y}
                  </Option>
                ))}
              </Select>
              <Select value={month} onChange={setMonth} style={{ width: 100 }}>
                {Array.from({ length: 12 }, (_, i) => {
                  const val = (i + 1).toString().padStart(2, '0');
                  return (
                    <Option key={val} value={val}>
                      {val}
                    </Option>
                  );
                })}
              </Select>
              <Select value={sourceType} onChange={setSourceType} style={{ width: 150 }}>
                <Option value="All">All</Option>
                <Option value="Solar">Solar</Option>
                <Option value="Wind">Wind</Option>
              </Select>
            </Space>
          </div>

          <HeatmapPage externalData={externalData} year={year} month={month} sourceType={sourceType} />
        </div>
      
    </>
  );
}
