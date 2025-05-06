// pages/load-consumption.js
"use client";
import { useState ,useEffect} from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import EnergyPieChart from "./EnergyPieChart";
import EnergyTrendChart3 from "./TrendChart2";
import RevenueBarChart3 from "./BarChart2";
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
  { id: 1, source: 'Load A', currentPower: '120.5', energyConsumption: '300.5', onPeak: '100', offPeak: '200' },
  { id: 2, source: 'Load B', currentPower: '110.1', energyConsumption: '280.0', onPeak: '90', offPeak: '190' },
];

const meterData = [
  { id: 1, source: 'Meter X', currentPower: '98.0', energyConsumption: '240.3' },
  { id: 2, source: 'Meter Y', currentPower: '105.2', energyConsumption: '250.6' },
];

export default function Consumption() {
  const [activeTab, setActiveTab] = useState('load');
  const [searchLoad, setSearchLoad] = useState('');
  const [searchMeter, setSearchMeter] = useState('');
  const [energyRange, setEnergyRange] = useState('day');
  const [energyDate, setEnergyDate] = useState(dayjs());
  const [revenueRange, setRevenueRange] = useState('month');
  const [revenueDate, setRevenueDate] = useState(dayjs());

  const filterData = (data, search) =>
    data.filter((item) => item.source.toLowerCase().includes(search.toLowerCase()));

  const renderEnergyTrend = () => (
    <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center">
          <span className="text-xl font-bold">Energy Load Consumption</span>
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
          <EnergyTrendChart3 type={energyRange} />
        </div>
        <div className="w-full lg:w-1/3 h-80  flex flex-col items-center justify-center">
          <EnergyPieChart />
        </div>
      </div>
    </div>
  );

  const renderRevenueTrend = () => (
    <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center">
          <span className="text-xl font-bold">Consumption Cost</span>
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
            allowClear={false}
          />
        </div>
      </div>

      <div className="text-lg mb-4">
        <span className="text-sm">Total Cost: </span>
        <span className="font-bold text-xl">25.24</span> ฿
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <RevenueBarChart3 />
      </div>
    </div>
  );

  const renderTableLoad = (data, search, setSearch) => (
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
    <span className="text-sm text-gray-500">
      Last Updated on DD/MM/YYYY 00:00
    </span>
  </div>
</div>


      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-y border-gray-200 bg-gray-50">
            <tr className="text-gray-700">
              <th className="py-2">#</th>
              <th className="py-2">Source</th>
              <th className="py-2">Current Power (kWh)</th>
              <th className="py-2">Energy Consumption (kWh)</th>
              <th className="py-2">On - Peak (kWh)</th>
              <th className="py-2">Off - Peak</th>
            </tr>
          </thead>
          <tbody>
            {filterData(data, search).map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2">{item.id}</td>
                <td className="py-2">{item.source}</td>
                <td className="py-2">{item.currentPower}</td>
                <td className="py-2">{item.energyConsumption}</td>
                <td className="py-2">{item.onPeak}</td>
                <td className="py-2">{item.offPeak}</td>
              </tr>
            ))}
            <tr className="font-semibold bg-gray-100 border-t border-gray-200">
              <td className="py-2" colSpan={2}>Total</td>
              <td className="py-2">XXX.XX</td>
              <td className="py-2">XXX.XX</td>
              <td className="py-2">XXX.XX</td>
              <td className="py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTableMeter = (data, search, setSearch) => (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Energy  Meter Consumption</h2>
        <div className="flex flex-col items-end gap-4">
          <input
            type="text"
            placeholder="Search"
            className="border rounded px-3 py-1 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-sm text-gray-500">
            Last Updated on DD/MM/YYYY 00:00
          </span>
        </div>
      </div>
  
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-y border-gray-200 bg-gray-50">
            <tr className="text-gray-700">
              <th className="py-2">#</th>
              <th className="py-2">Source</th>
              <th className="py-2">Energy (kW)</th>
              <th className="py-2">Power (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {filterData(data, search).map((item) => (
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
            ))}
            <tr className="font-semibold bg-gray-100 border-t border-gray-200">
              <td className="py-2" colSpan={2}>Total</td>
              <td className="py-2">XXX.XX</td>
              <td className="py-2">XXX.XX</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
  

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
      <div className='mt-5'>
      <HeatmapPage externalData={externalData} year={year} month={month} sourceType={sourceType} />
      </div>
    </div>
  );

  return (
    <>
    <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === 'load' ? 'border-b-2 border-teal-500 text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'
            }`}
            onClick={() => setActiveTab('load')}
          >
            Load Consumption
          </button>
          <button
            className={`ml-4 px-4 py-2 font-semibold ${
              activeTab === 'meter' ? 'border-b-2 border-teal-500 text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'
            }`}
            onClick={() => setActiveTab('meter')}
          >
            Meter Consumption
          </button>
        </div>
        {activeTab === 'load' ? (
      <>
        {renderTableLoad(loadData, searchLoad, setSearchLoad)}
      </>
    ) : (
      <>
        {renderTableMeter(meterData, searchMeter, setSearchMeter)}
     
      </>
    )}
      </div>
     {activeTab === 'load' ? (
      <>
        {renderEnergyTrend()}
        {renderRevenueTrend()}
        {renderHeatmapSection()}
      </>
    ) : (
      <>
        
        {renderEnergyTrend()}
        {renderRevenueTrend()}
        {renderHeatmapSection()}
      </>
    )}
    </>
  );
}
