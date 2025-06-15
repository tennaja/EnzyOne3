"use client";
import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en"; // หรือ 'th' ถ้าอยากใช้ภาษาไทย
import customParseFormat from "dayjs/plugin/customParseFormat";
import Tooltip from "@mui/material/Tooltip";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { getCarbonDashboardSummary,getCarbonReport } from "@/utils/api";
import Loading from "./Loading";
import { Select } from "antd";
const { Option } = Select;
import ScopeEmissionDonutChart from "./ScopeEmissionDonutChart";
import ScopeTop3BarChart from "./ScopeTop3BarChart";
import EmissionTrendCard from "./EmissionTrendCard";
import EmissionsOverview from "./EmissionOverview";
dayjs.extend(customParseFormat);



export default function Dashboard({ year, businessUnitId, siteId ,siteName,businessUnitName,setActiveTab}) {
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

const DownloadFile = async () => {
    setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
    try {
      const result = await getCarbonReport();
      if (result && result.status === 200) {
        // result.data เป็น Blob หรือ ArrayBuffer เพราะตั้ง responseType แล้ว
        const blob = result.data;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Annual Report.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // ล้าง URL ออกจาก memory
      } else {
        console.warn("Download failed or no data");
      }
    } catch (error) {
      console.error("Download Excel error:", error);
    }
    finally {
      
        setLoading(false);
      
    }
  };


  
  return (
    <>
      <div className="w-full flex justify-start mt-5">
  <div className="flex flex-col gap-2">
    <p className="text-lg font-bold text-slate-800 dark:text-white">
    Target Year {year} | {businessUnitName} | {siteName} 
    </p>
    <p className="text-sm block">
      Last Updated on {lastUpdated}
    </p>
  </div>
  <button
          onClick={DownloadFile}
          type="button"
          className="h-10 bg-transparent text-sm border-2 border-[#32c0bf] text-[#32c0bf] px-3 py-2 rounded-md flex items-center gap-2 hover:bg-[#32c0bf] hover:text-white transition-colors ml-auto"
        >
          <FileDownloadIcon />
          Annual Report
        </button>
</div>


      {/* Emissions Summary */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
      <EmissionsOverview
      selectedYear={year}
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
