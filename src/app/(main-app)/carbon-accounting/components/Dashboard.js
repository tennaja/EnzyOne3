"use client";
import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en"; // หรือ 'th' ถ้าอยากใช้ภาษาไทย
import customParseFormat from "dayjs/plugin/customParseFormat";
import Tooltip from "@mui/material/Tooltip";
import { getCarbonDashboardSummary } from "@/utils/api";
import Loading from "./Loading";
import { Select } from "antd";
const { Option } = Select;
import ScopeEmissionDonutChart from "./ScopeEmissionDonutChart";
import ScopeTop3BarChart from "./ScopeTop3BarChart";
import EmissionTrendCard from "./EmissionTrendCard";
import EmissionsOverview from "./EmissionOverview";
dayjs.extend(customParseFormat);



export default function Dashboard({ year, businessUnitId, siteId ,setActiveTab}) {
  console.log("Dashboard year:", year);
  const [loading, setLoading] = useState(false);
  const [totalEmission, setTotalEmission] = useState([]);
  const [totalEmissionByMonth, setTotalEmissionByMonth] = useState([]);
  const [scopeEmission, setScopeEmission] = useState([]);
  const [lastUpdated,setLatsUpdated]= useState('')
  // const [scopeEmissionByMonth, setScopeEmissionByMonth] = useState([]);
  // const [scopeEmissionByYear, setScopeEmissionByYear] = useState([]);
  // const [year, setYear] = useState(dayjs().format("YYYY"));
  // const [month, setMonth] = useState(dayjs().format("MM"));
  // const [date, setDate] = useState(dayjs());

  useEffect(() => {

    GetCarbonDashboardSummary();
  }, [year, businessUnitId, siteId]);
  const GetCarbonDashboardSummary = async (showLoading = true) => {
    const paramsNav = {
      siteId: siteId,
      businessUnitId: businessUnitId,
      companyId: 2,
      year: year,
    };

    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

    try {
      const result = await getCarbonDashboardSummary(paramsNav);
      if (result && result.status === 200) {
        console.log("Summary Carbon ALL:", result.data);
        console.log("Summary Carbon:", result.data.emissionData);
        setTotalEmission(result.data.totalEmission);
        setTotalEmissionByMonth(result.data.totalEmissionByMonth);
        setScopeEmission(result.data.emissionData);
        setLatsUpdated(result.data.lastUpdated)
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
    { name: "Scope 1", color: "#0088FE" },
    { name: "Scope 2", color: "#00C49F" },
    { name: "Scope 3", color: "#FFBB28" },
  ];

  // ✅ MOCK DATA ชัดเจน เห็นสัดส่วนต่างกันชัดเจน
  const barData = [
    { month: "Jan", "Scope 1": 300000, "Scope 2": 100000, "Scope 3": 50000 },
    { month: "Feb", "Scope 1": 200000, "Scope 2": 150000, "Scope 3": 30000 },
    { month: "Mar", "Scope 1": 100000, "Scope 2": 200000, "Scope 3": 80000 },
    { month: "Apr", "Scope 1": 250000, "Scope 2": 50000, "Scope 3": 100000 },
    { month: "May", "Scope 1": 150000, "Scope 2": 120000, "Scope 3": 60000 },
    { month: "Jun", "Scope 1": 180000, "Scope 2": 90000, "Scope 3": 40000 },
  ];

  // รวมค่าเพื่อใช้ใน PieChart
  const totalByScope = barData.reduce(
    (acc, entry) => {
      acc["Scope 1"] += entry["Scope 1"] || 0;
      acc["Scope 2"] += entry["Scope 2"] || 0;
      acc["Scope 3"] += entry["Scope 3"] || 0;
      return acc;
    },
    { "Scope 1": 0, "Scope 2": 0, "Scope 3": 0 }
  );

  const pieData = LEGEND_ITEMS.map((item) => ({
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
      title: "Scope 1",
      data: [
        { year: "2022", A: 0, B: 0, C: 0 },
        { year: "2023", A: 0, B: 0, C: 0 },
        { year: "2024", A: 2165131, B: 13544, C: 136 },
      ],
      table: [
        {
          name: "Stationary Combustion",
          2022: 0,
          2023: 0,
          2024: "2,165,131.000",
          color: "#0070f3",
        },
        {
          name: "Stationary Fuel",
          2022: 0,
          2023: 0,
          2024: "13,544.000",
          color: "#e91e63",
        },
        {
          name: "Company Vehicles",
          2022: 0,
          2023: 0,
          2024: "136.000",
          color: "#ff9800",
        },
      ],
    },
    {
      title: "Scope 2",
      data: [
        { year: "2022", A: 0 },
        { year: "2023", A: 0 },
        { year: "2024", A: 0.052 },
      ],
      table: [
        {
          name: "Grid Mix 2016–2018",
          2022: 0,
          2023: 0,
          2024: "0.052",
          color: "#009688",
        },
      ],
    },
    {
      title: "Scope 3",
      data: [
        { year: "2022", A: 0 },
        { year: "2023", A: 0 },
        { year: "2024", A: 88.2 },
      ],
      table: [
        {
          name: "16 Other",
          2022: 0,
          2023: 0,
          2024: "88.200",
          color: "#b2ebf2",
        },
      ],
    },
  ];
  return (
    <>
      <div className="w-full flex justify-end mt-5">
  <div className="flex items-end">
    <p className="text-sm block">
      Lasted Updated on {lastUpdated}
    </p>
  </div>
</div>


      {/* Emissions Summary */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
      <EmissionsOverview
  totalEmission={totalEmission}
  totalEmissionByMonth={totalEmissionByMonth}
  onDetailClick={() => setActiveTab({ tab: 'detail', scopeId: null })}
/>

      </div>

      {/* Scope Emissions */}
      {/* Donut Charts */}
      <div className="w-full mb-6 mt-5 ">
        <ScopeEmissionDonutChart year={year} emissionData={scopeEmission} setActiveTab={setActiveTab}/>
      </div>

      {/* Scope Top3 Emission */}
      {/* Bar Charts */}
      <div className="w-full mb-6 mt-5">
        <ScopeTop3BarChart year={year} emissionData={scopeEmission} />
      </div>

      {/* Emission Trends */}
      <div className="w-full mb-6 mt-5">
        <EmissionTrendCard year={year} emissionData={scopeEmission} />
      </div>

      {loading && <Loading/>}  
    </>
  );
}
