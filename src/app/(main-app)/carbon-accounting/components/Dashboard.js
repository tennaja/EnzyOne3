"use client";
import { useState ,useEffect} from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en"; // หรือ 'th' ถ้าอยากใช้ภาษาไทย
import customParseFormat from "dayjs/plugin/customParseFormat";
import Tooltip from "@mui/material/Tooltip";
import {getCarbonDashboardSummary} from "@/utils/api";

import Loading from "./Loading";
import { Select } from 'antd';

const { Option } = Select;
import ScopeEmissionDonutChart from "./ScopeEmissionDonutChart";
import ScopeTop3BarChart from "./ScopeTop3BarChart";
import EmissionTrendCard from './EmissionTrendCard';
import PieEmissionsChart from './PieEmissionsChart';
import BarEmissionsChart from './BarEmissionsChart';
import ChartLegend from './ChartLegend';
dayjs.extend(customParseFormat);

const { MonthPicker } = DatePicker;





export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [totalEmission, setTotalEmission] = useState([]);
  const [totalEmissionByMonth, setTotalEmissionByMonth] = useState([]);
  const [scopeEmission, setScopeEmission] = useState([]);
  const [scopeEmissionByMonth, setScopeEmissionByMonth] = useState([]);
  const [scopeEmissionByYear, setScopeEmissionByYear] = useState([]);
  const [year, setYear] = useState(dayjs().format("YYYY"));
  const [month, setMonth] = useState(dayjs().format("MM"));
  const [date, setDate] = useState(dayjs());
 
  useEffect(() => {
    GetCarbonDashboardSummary();
  }, []);
const GetCarbonDashboardSummary = async (showLoading = true) => {
    const paramsNav = {
      siteId: 1,
      businessUnitId: 1,
      companyId : 2,
      year: "2025",
    };
    
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

    try {
      const result = await getCarbonDashboardSummary(paramsNav);
      if (result && result.status === 200) {
        console.log("Summary Carbon ALL:", result.data);
        console.log("Summary Carbon:", result.data.emissionData
        );
        setTotalEmission(result.data.totalEmission);
        setTotalEmissionByMonth(result.data.totalEmissionByMonth);
        setScopeEmission(result.data.emissionData);
      } else {
        setTotalEmission([]);
      }
    } catch (error) {
      console.log("Error Summary Carbon:", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  
  const LEGEND_ITEMS = [
    { name: 'Scope 1', color: '#0088FE' },
    { name: 'Scope 2', color: '#00C49F' },
    { name: 'Scope 3', color: '#FFBB28' },
  ];
  
  // ✅ MOCK DATA ชัดเจน เห็นสัดส่วนต่างกันชัดเจน
  const barData = [
    { month: 'Jan', 'Scope 1': 300000, 'Scope 2': 100000, 'Scope 3': 50000 },
    { month: 'Feb', 'Scope 1': 200000, 'Scope 2': 150000, 'Scope 3': 30000 },
    { month: 'Mar', 'Scope 1': 100000, 'Scope 2': 200000, 'Scope 3': 80000 },
    { month: 'Apr', 'Scope 1': 250000, 'Scope 2': 50000,  'Scope 3': 100000 },
    { month: 'May', 'Scope 1': 150000, 'Scope 2': 120000, 'Scope 3': 60000 },
    { month: 'Jun', 'Scope 1': 180000, 'Scope 2': 90000,  'Scope 3': 40000 },
  ];
  

  // รวมค่าเพื่อใช้ใน PieChart
  const totalByScope = barData.reduce(
    (acc, entry) => {
      acc['Scope 1'] += entry['Scope 1'] || 0;
      acc['Scope 2'] += entry['Scope 2'] || 0;
      acc['Scope 3'] += entry['Scope 3'] || 0;
      return acc;
    },
    { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 }
  );

  const pieData = LEGEND_ITEMS.map(item => ({
    name: item.name,
    value: totalByScope[item.name],
  }));

  const totalValue = pieData.reduce((sum, entry) => sum + entry.value, 0);

  const scopeData = [
    {
      scope: "Scope 1",
      total: "2,178,823.750",
      donut: [
        { name: "Stationary combustion: Sub...", value: 2165131 },
        { name: "Stationary combustion: Gas...", value: 1113544 },
        { name: "Combustion during transpo...", value: 711136 },
      ],
      bar: [
        { name: "Stationary co...", value: 2165131 },
        { name: "Stationary co...", value: 13544 },
        { name: "Combustion...", value: 136 },
      ],
    },
    {
      scope: "Scope 2",
      total: "0.052",
      donut: [{ name: "Grid Mix 2016-2018", value: 0.052 }],
      bar: [{ name: "Grid Mix 2016-2018", value: 0.052 }],
    },
    {
      scope: "Scope 3",
      total: "88.200",
      donut: [{ name: "16 Other", value: 88.2 }],
      bar: [{ name: "16 Other", value: 88.2 }],
    },
  ];

  const scopes = [
    {
      title: 'Scope 1',
      data: [
        { year: '2022', A: 0, B: 0, C: 0 },
        { year: '2023', A: 0, B: 0, C: 0 },
        { year: '2024', A: 2165131, B: 13544, C: 136 },
      ],
      table: [
        { name: 'Stationary Combustion', '2022': 0, '2023': 0, '2024': '2,165,131.000', color: '#0070f3' },
        { name: 'Stationary Fuel', '2022': 0, '2023': 0, '2024': '13,544.000', color: '#e91e63' },
        { name: 'Company Vehicles', '2022': 0, '2023': 0, '2024': '136.000', color: '#ff9800' },
      ],
    },
    {
      title: 'Scope 2',
      data: [
        { year: '2022', A: 0 },
        { year: '2023', A: 0 },
        { year: '2024', A: 0.052 },
      ],
      table: [
        { name: 'Grid Mix 2016–2018', '2022': 0, '2023': 0, '2024': '0.052', color: '#009688' },
      ],
    },
    {
      title: 'Scope 3',
      data: [
        { year: '2022', A: 0 },
        { year: '2023', A: 0 },
        { year: '2024', A: 88.2 },
      ],
      table: [
        { name: '16 Other', '2022': 0, '2023': 0, '2024': '88.200', color: '#b2ebf2' },
      ],
    },
  ];
  return (
    <>
  

      {/* Filters */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
      <div className="flex items-center gap-3">
      <span className="text-sm">Target Year:</span>
      <Select defaultValue="2025" style={{ width: 150 }}>
        <Option value="2025">2025</Option>
        <Option value="2024">2024</Option>
        <Option value="2023">2023</Option>
        <Option value="2022">2022</Option>
      </Select>
      <span className="text-sm">Business Unit:</span>
      <Select defaultValue="All BU" style={{ width: 150 }}>
        <Option value="All BU">All BU</Option>
        <Option value="BU1">BU1</Option>
        <Option value="BU2">BU2</Option>
      </Select>
      <span className="text-sm">Site:</span>
      <Select defaultValue="All Site" style={{ width: 150 }}>
        <Option value="All Site">All Site</Option>
        <Option value="Site1">Site1</Option>
        <Option value="Site2">Site2</Option>
      </Select>

        <button
    type="button"
    className="text-white bg-[#33BFBF] rounded-md text-lg px-10 h-9"
    // onClick={handleSearch}
  >
    Search
  </button>
      </div>
      </div>

     {/* Emissions Summary */}
<div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
  <div className="flex w-full gap-4">
    {/* Left - Pie Chart */}
    <div className="w-1/2">
      <h3 className="font-semibold text-md mb-10">Total Emissions</h3>
      <PieEmissionsChart data={totalEmission}  />
    </div>

    {/* Right - Bar Chart */}
    <div className="w-1/2">
      <h3 className="font-semibold text-md mb-10">Monthly Emissions Trends</h3>

      <BarEmissionsChart data={totalEmissionByMonth} />
      
    </div>
  </div>

  {/* Legend */}
  <ChartLegend />
  <div className="mt-4 flex justify-center">
        <button
          className="w-20 text-sm border border-[#32c0bf] text-[#32c0bf] rounded py-1 hover:bg-[#e6fafa] transition"
        >
          Detail
        </button>
    </div>
</div>


      {/* Scope Emissions */}
      {/* Donut Charts */}
      <div className="w-full mb-6 mt-5 ">
  <ScopeEmissionDonutChart year={2025} emissionData={scopeEmission} />
</div>


      {/* Scope Top3 Emission */}
      {/* Bar Charts */}
      <div className="w-full mb-6 mt-5">
        
          <ScopeTop3BarChart year={2025} emissionData={scopeEmission} />
       
      </div>

      {/* Emission Trends */}
      <div className="w-full mb-6 mt-5">
      
        <EmissionTrendCard
         year={2025} emissionData={scopeEmission}
        />

    </div>

      {/* {loading && <Loading/>}   */}
    </>
  );
}
