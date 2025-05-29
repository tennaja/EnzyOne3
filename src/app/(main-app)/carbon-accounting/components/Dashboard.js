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

      // Set interval to refresh Energy Revenue every 5 minutes
      const interval = setInterval(() => {
        GetCarbonDashboardSummary(false);
      }, 900000); // 300,000 ms = 5 minutes
    
      // Cleanup interval on component unmount
      return () => clearInterval(interval);
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




  
  return (
    <>
      <div className="w-full flex justify-end mt-5">
  <div className="flex items-end">
    <p className="text-sm block">
      Last Updated on {lastUpdated}
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
