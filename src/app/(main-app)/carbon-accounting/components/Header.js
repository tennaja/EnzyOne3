"use client";
import { useState, useEffect } from "react";
import TabNavigation from "./TabNavigation";
import Dashboard from "./Dashboard.js";
import Detail from "./Detail";
import CustomGraph from "./CustomGraph";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Select } from "antd";
import {
  getCarbonYearList,
  getCarbonBusinessUnitList,
  getCarbonSiteList,
  getCarbonReport
} from "@/utils/api";
const { Option } = Select;

const tabConfig = [
  { id: "dashboard", label: "Dashboard" },
  { id: "detail", label: "Detail" },
  { id: "customchart", label: "Custom Chart" },
];

export default function Header() {
  const [activeTab, setActiveTab] = useState({ tab: "dashboard", scopeId: 0 });

  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("");
  const [selectYear,setSelectYear] = useState("");
  const [yearList, setYearList] = useState([]);

  // const [businessUnit, setBusinessUnit] = useState(0);
  // const [site, setSite] = useState("All Site");
  const [businessUnitList, setBusinessUnitList] = useState([]);
  const [siteList, setSiteList] = useState([]);
  const [companyId, setCompanyId] = useState(2);
  const [selectSiteId,setSelectSiteId] = useState(0)
  const [siteId, setSiteId] = useState(0);
  const [selectBusinessUnitId,setSelectBusinessUnitId] = useState(0)
  const [businessUnitId, setBusinessUnitId] = useState(0);

  useEffect(() => {
    GetCarbonYearList();
    // GetCarbonBusinessUnitList();
    // GetCarbonSiteList();
  }, []);

  // useEffect(() => {
  //   if (year) {
  //     const paramsNav = {
  //       siteId: siteId,
  //       businessUnitId: businessUnitId,
  //       companyId: companyId,
  //       year: year,
  //     };
  //     GetCarbonDashboardSummary(paramsNav);
  //   }
  // }, [year, siteId, businessUnitId, companyId]);

  useEffect(() => {
    GetCarbonSiteList();
  }, [businessUnitId]);

  const GetCarbonYearList = async (showLoading = true) => {
    const companyId = 2;

    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

    try {
      const result = await getCarbonYearList(companyId);
      if (result && result.status === 200) {
        console.log("Year List: ------ >", result.data);
        setYearList(result.data);
        setYear(result.data[0].year); // ตั้งค่า year เป็นปีแรกในรายการ
        setSelectYear(result.data[0].year)
        GetCarbonBusinessUnitList();
        GetCarbonSiteList();
      } else {
        setYearList([]);
      }
    } catch (error) {
      console.log("Error Summary Carbon:", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const GetCarbonBusinessUnitList = async (showLoading = true) => {
    const companyId = 2;
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
    try {
      const result = await getCarbonBusinessUnitList(companyId);
      if (result && result.status === 200) {
        console.log("Business Unit List: ------ >", result.data);
        setBusinessUnitList(result.data);
        setBusinessUnitId(result.data[0].id); // ตั้งค่า businessUnit เป็นปีแรกในรายการ
        setSelectBusinessUnitId(result.data[0].id ?? 0)
      } else {
        setBusinessUnitList([]);
      }
    } catch (error) {
      console.log("Error Summary Carbon:", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  const GetCarbonSiteList = async (showLoading = true) => {
    const paramsNav = {
      businessUnitId: businessUnitId,
      companyId: companyId,
    };
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
    try {
      const result = await getCarbonSiteList(paramsNav);
      if (result && result.status === 200) {
        console.log("Site List: ------ >", result.data);
        setSiteList(result.data);
        setSiteId(result.data[0].id); // ตั้งค่า site เป็นปีแรกในรายการ
        setSelectSiteId(result.data[0].id ?? 0)
      } else {
        setSiteList([]);
      }
    } catch (error) {
      console.log("Error Summary Carbon:", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };


  const DownloadFile = async (showLoading = true) => {
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
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
  };

  const handleYearChange = (value) => {
    setYear(value);
    console.log("Selected Year:", value);
  };
  const handleBusinessUnitChange = (value) => {
    setBusinessUnitId(value);
    GetCarbonSiteList();
  };
  const handleSiteChange = (value) => {
    setSiteId(value);
  };
  
  const handleSearch = () => {
    setSelectYear(year)
    setSelectBusinessUnitId(businessUnitId ?? 0)
    setSelectSiteId(siteId ?? 0)

  }

  const renderContent = () => {
    switch (activeTab.tab) {
      case "dashboard":
        return (
          <Dashboard
            year={selectYear}
            businessUnitId={selectBusinessUnitId}
            siteId={selectSiteId}
            scopeId={activeTab.scopeId}
            setActiveTab={setActiveTab}
          />
        );
      case "detail":
        return (
          <Detail
            scopeId={activeTab.scopeId}
            year={selectYear}
            businessUnitId={selectBusinessUnitId}
            siteId={selectSiteId}
            setActiveTab={setActiveTab}
          />
        );
      case "customchart":
        return ( 
        <CustomGraph 
            scopeId={activeTab.scopeId} 
            businessUnitId={selectBusinessUnitId}
            siteId={selectSiteId}
            year={selectYear}
        />
      );
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div>
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-xl text-enzy-dark">
            Carbon Accounting
          </span>
          <TabNavigation
            activeTab={activeTab.tab} // ✅ ส่งแค่ชื่อแท็บ
            onTabChange={(tabId) => setActiveTab({ tab: tabId, scopeId: 0 })} // ✅ แปลงกลับเป็น object
            tabs={tabConfig}
            showBreadcrumb={false}
          />
            
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          {
            // ดึง breadcrumb ด้วยการ slice tabConfig จาก 0 ถึง activeTab
            tabConfig
              .slice(0, tabConfig.findIndex((t) => t.id === activeTab) + 1)
              .map((tab, index, arr) => (
                <span key={tab.id} className="inline-flex items-center">
                  <button
                    onClick={() => setActiveTab({ tab: tab.id, siteId: 0 })}
                    className="text-teal-600 hover:underline"
                  >
                    {tab.label}
                  </button>
                  {index < arr.length - 1 && (
                    <span className="mx-1 text-gray-400">/</span>
                  )}
                </span>
              ))
          }
        </div>
      </div>
      
      {/* Filters */}
      {activeTab.tab !== "customchart" && (
  <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
    <div className="flex items-center gap-3">
      {/* กลุ่มแรก: Select + Search */}
      <div className="flex items-center gap-3">
        <span className="text-sm">Target Year:</span>
        <Select
          value={year}
          style={{ width: 150 }}
          onChange={handleYearChange}
        >
          {yearList.map((item) => (
            <Option key={item.year} value={item.year}>
              {item.year}
            </Option>
          ))}
        </Select>

        <span className="text-sm">Business Unit:</span>
        <Select
          value={businessUnitId}
          onChange={handleBusinessUnitChange}
          style={{ width: 200 }}
        >
          {businessUnitList.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>

        <span className="text-sm">Site:</span>
        <Select
          value={siteId}
          style={{ width: 200 }}
          onChange={handleSiteChange}
        >
          {siteList.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>

        <button
          type="button"
          className="text-white bg-[#33BFBF] rounded-md text-lg px-10 h-9"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* ปุ่ม Annual Report ชิดขวา */}
      {activeTab.tab === "dashboard" && (
        <button
          onClick={DownloadFile}
          type="button"
          className="h-10 bg-transparent text-sm border-2 border-[#32c0bf] text-[#32c0bf] px-3 py-2 rounded-md flex items-center gap-2 hover:bg-[#32c0bf] hover:text-white transition-colors ml-auto"
        >
          <FileDownloadIcon />
          Annual Report
        </button>
      )}
    </div>
  </div>
)}

      {renderContent()}
    </div>
  );
}
