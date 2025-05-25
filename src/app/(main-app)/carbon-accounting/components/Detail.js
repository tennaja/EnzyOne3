"use client";
import { useState, useEffect,useMemo} from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Select, Space } from "antd";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { getCarbonDetailList, getCarbonDetail ,getCarbonScopeList } from "@/utils/api";
import Loading from "./Loading";
const { Option } = Select;

export default function Detail({ scopeId, businessUnitId, year, siteId }) {
  
  const [detailData, setDetailData] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [scope, setScope] = useState(0);
  const [scopeList, setScopeList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetCarbonDetail();
    const interval = setInterval(() => {
      GetCarbonDetail(false);
    }
    , 300000); // 300,000 ms = 5 minutes
    return () => clearInterval(interval);
  }, [businessUnitId, year, siteId]);

  useEffect(() => {
    GetCarbonDetailList();
    const interval = setInterval(() => {
      GetCarbonDetailList(false);
    }, 300000); // 300,000 ms = 5 minutes
    return () => clearInterval(interval);
  }, [scopeId, businessUnitId, year, siteId , scope]);

  useEffect(() => {
    GetCarbonScopeList();
  }, [businessUnitId, year, siteId, scopeId]);

  // useEffect(() => {
  //   GetEnergyHistory();
  //   const interval = setInterval(() => {
  //     GetEnergyHistory(false);
  //     }, 300000);

  //   return () => clearInterval(interval);
  // }, [energyDate, energyRange]);

  // useEffect(() => {
  //   GetEnergyRevenue();
  //   const interval = setInterval(() => {
  //     GetEnergyRevenue(false);
  //     }, 300000);
  useEffect(() => {
    if (scopeList.length > 0) {
      const matchedScope = scopeList.find(item => item.scope === scopeId);
      setScope(matchedScope ? matchedScope.scope : 0);
    }
  }, [scopeId, scopeList]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);

  const GetCarbonScopeList = async (showLoading = true) => {
    const paramsNav = {
      siteId: siteId,
      businessUnitId: businessUnitId,
      companyId: 2,
      year: year,
    };

    if (showLoading) setLoading(true);

  try {
    const result = await getCarbonScopeList(paramsNav);
    if (result?.status === 200) {
      
      setScopeList(result.data);

      setScope(result.data.scope); // All = 0
    } else {
      setScopeList([]);
      setScope(0);
    }
  } catch (error) {
    console.error("Carbon Scope List Error:", error);
  } finally {
    if (showLoading) setLoading(false);
  }
  };
  const GetCarbonDetail = async (showLoading = true) => {
    const paramsNav = {
      siteId: siteId,
      businessUnitId: businessUnitId,
      companyId: 2,
      year: year,
    };

    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก

    try {
      const result = await getCarbonDetail(paramsNav);
      if (result && result.status === 200) {
        console.log("Carbon Detail: ------>", result.data);
        setDetailData(result.data.totalEmission);
      } else {
        setDetailData([]);
      }
    } catch (error) {
      console.error("Carbon Detail: ------>", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  const GetCarbonDetailList = async (showLoading = true) => {
    const paramsNav = {
      siteId: siteId,
      businessUnitId: businessUnitId,
      companyId: 2,
      year: year,
      format: "",
      scope: scope ?? scopeId
    };
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
    try {
      const result = await getCarbonDetailList(paramsNav);
      if (result && result.status === 200) {
        console.log("Carbon Detail List: ------>", result.data);
        setDetailList(result.data);
      } else {
        setDetailList([]);
      }
    } catch (error) {
      console.error("Carbon Detail List: ------>", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  

  const DownLoadExcel = async () => {
    try {
      const result = await getCarbonDetailList({
      siteId: siteId,
      businessUnitId: businessUnitId,
      companyId: 2,
      year: year,
      format: "xlsx",
      scope: scope ?? scopeId
      });

      if (result && result.status === 200) {
        // result.data เป็น Blob หรือ ArrayBuffer เพราะตั้ง responseType แล้ว
        const blob = result.data;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `carbon-report-2025.xlsx`;
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

  const handleScopeChange = (value) => {
    setScope(value);
    console.log("Selected scope:", value);
  }

  
  

  // แยกข้อมูลของแต่ละ Scope
  const scope1Data = detailData.map((item) => ({
    year: item.year,
    value: item.data.scope1,
  }));
  const scope2Data = detailData.map((item) => ({
    year: item.year,
    value: item.data.scope2,
  }));
  const scope3Data = detailData.map((item) => ({
    year: item.year,
    value: item.data.scope3,
  }));

  const filteredList = detailList.filter((item) => {
    const search = (searchTerm ?? "").toLowerCase();
    const scopeName = String(item.scopeName ?? "").toLowerCase();
    const category = item.scope === 3 ? String(item.categoryName ?? "-") : "-";
    const categoryLower = category.toLowerCase();
    const activity = String(item.activity ?? "").toLowerCase();
    const twoYearsAgo =
      item.twoYearsAgo != null ? String(item.twoYearsAgo) : "";
    const previousYear =
      item.previousYear != null ? String(item.previousYear) : "";
    const selectedYear =
      item.selectedYear != null ? String(item.selectedYear) : "";

    return (
      scopeName.includes(search) ||
      categoryLower.includes(search) ||
      activity.includes(search) ||
      twoYearsAgo.includes(search) ||
      previousYear.includes(search) ||
      selectedYear.includes(search)
    );
  });
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const isSameKey = prevConfig.key === key;
      const direction = isSameKey && prevConfig.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
  };

  const sortedList = [...filteredList].sort((a, b) => {
    const key = sortConfig.key;
    const direction = sortConfig.direction;
  
    let aValue = a[key];
    let bValue = b[key];
  
    // ถ้าเป็น emission_x ให้ map ไปยัง field ที่ถูกต้อง
    if (key.startsWith("emission_")) {
      const index = parseInt(key.split("_")[1]);
      const yearMap = ["twoYearsAgo", "previousYear", "selectedYear"];
      aValue = a[yearMap[index]];
      bValue = b[yearMap[index]];
    }
  
    // ถ้าเป็น category ให้แปลงตามเงื่อนไข scope === 3
    if (key === "category") {
      aValue = a.scope === 3 ? (a.categoryName || "-") : "-";
      bValue = b.scope === 3 ? (b.categoryName || "-") : "-";
    }
  
    // Normalize ค่าที่เป็น string
    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();
  
    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedList.slice(start, start + rowsPerPage);
  }, [sortedList, currentPage, rowsPerPage]);
  
  const totalPages = Math.ceil(sortedList.length / rowsPerPage);
  
  

  const renderScopeTable = (title, data) => (
    <div className="rounded-md border  dark:border-slate-700 p-4 shadow-sm bg-white">
      <h2 className="font-semibold text-lg mb-2 border-b pb-1">{title}</h2>
      <table className="w-full text-sm border-t">
        <thead className="text-left">
          <tr className="border-b bg-gray-100 dark:bg-slate-700">
            <th className="py-1 px-2">Year</th>
            <th className="py-1 px-2">Total (tCO2e)</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                className="py-2 px-2 text-center text-gray-500 dark:text-slate-400"
                colSpan={2}
              >
                No data
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.year} className="border-b">
                <td className="py-1 px-2">{row.year}</td>
                <td className="py-1 px-2">{row.value.toFixed(3)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const highlightText = (text, search) => {
    if (text === null || text === undefined) return "";
    if (!search) return text;

    const textStr = String(text);
    const searchStr = String(search);

    const parts = textStr.split(new RegExp(`(${searchStr})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === searchStr.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 dark:bg-yellow-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  function formatNumber(num) {
    if (typeof num !== "number" || isNaN(num)) {
      return "-";
    }
    return num.toLocaleString("en-US");
  }

  function formatNumberWithK(num) {
    if (typeof num !== "number" || isNaN(num)) {
      return "-";
    }

    if (num >= 1000) {
      const value = num / 1000;
      // format number with commas, ถ้าเป็น integer แสดงไม่ต้องมีทศนิยม
      const formattedValue = Number.isInteger(value)
        ? value.toLocaleString("en-US")
        : parseFloat(value.toFixed(1)).toLocaleString("en-US");
      return `${formattedValue}K`;
    }

    return num.toLocaleString("en-US"); // ใส่ลูกน้ำให้ตัวเลขที่น้อยกว่า 1000
  }

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        {renderScopeTable("Scope 1", scope1Data)}
        {renderScopeTable("Scope 2", scope2Data)}
        {renderScopeTable("Scope 3", scope3Data)}
      </div>

      {/* Emissions Table */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5 space-y-6">
        {/* Search + Export */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
  {/* ซ้ายสุด: Dropdown */}
  <div className="flex items-center">
  <Select
  value={scope}
  style={{ width: 250, height: 40 }}
  onChange={handleScopeChange}
>
  <Option value={0}>All</Option>
  {scopeList.map((item) => (
    <Option key={item.scope} value={item.scope}>
      {item.scopeName}
    </Option>
  ))}
</Select>

  </div>

  {/* ขวาสุด: Search + Export */}
  <div className="flex items-center gap-3">
    <input
      type="text"
      placeholder="ค้นหา"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="h-10 border px-3 py-2 text-sm rounded-md dark:bg-slate-700 dark:text-white dark:border-slate-600"
    />
    <button
      onClick={DownLoadExcel}
      type="button"
      className="h-10 bg-transparent text-sm border-2 border-[#32c0bf] text-[#32c0bf] px-3 py-2 rounded-md flex items-center gap-2 hover:bg-[#32c0bf] hover:text-white transition-colors"
    >
      <FileDownloadIcon />
      Export to Excel
    </button>
  </div>
</div>

        <div className="overflow-x-auto  border border-gray-300 dark:border-slate-700">
          <table className="w-full text-sm table-auto border-collapse">
          <thead className="bg-gray-100 dark:bg-slate-800 text-left border-b">
  <tr>
    {[
      { key: "scope", label: "Scope" },
      { key: "category", label: "Category" },
      { key: "activity", label: "Activity" },
    ].map((col) => (
      <th
        key={col.key}
        className="px-4 py-2 border-r align-middle cursor-pointer"
        rowSpan={2}
        onClick={() => handleSort(col.key)}
      >
        {col.label}
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            marginLeft: "4px",
          }}
        >
          <ArrowDropUpIcon
            style={{
              fontSize: "14px",
              opacity:
                sortConfig.key === col.key && sortConfig.direction === "asc"
                  ? 1
                  : 0.3,
              marginBottom: "-2px",
            }}
          />
          <ArrowDropDownIcon
            style={{
              fontSize: "14px",
              opacity:
                sortConfig.key === col.key && sortConfig.direction === "desc"
                  ? 1
                  : 0.3,
              marginTop: "-2px",
            }}
          />
        </div>
      </th>
    ))}

    {[...Array(3)].map((_, i) => {
      const displayYear = Number(year) - (2 - i);
      return (
        <th
          key={displayYear}
          className="px-4 py-1 text-center border-r align-middle"
          colSpan={1}
        >
          FY{displayYear}
        </th>
      );
    })}
  </tr>
  <tr>
    {[...Array(3)].map((_, i) => (
      <th
        key={i}
        className="px-4 py-1 text-center border-r align-middle cursor-pointer"
        onClick={() => handleSort(`emission_${i}`)} // คุณสามารถเปลี่ยน key ให้เหมาะกับข้อมูลจริง
      >
        Emission (tCO₂e)
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            marginLeft: "4px",
          }}
        >
          <ArrowDropUpIcon
            style={{
              fontSize: "14px",
              opacity:
                sortConfig.key === `emission_${i}` &&
                sortConfig.direction === "asc"
                  ? 1
                  : 0.3,
              marginBottom: "-2px",
            }}
          />
          <ArrowDropDownIcon
            style={{
              fontSize: "14px",
              opacity:
                sortConfig.key === `emission_${i}` &&
                sortConfig.direction === "desc"
                  ? 1
                  : 0.3,
              marginTop: "-2px",
            }}
          />
        </div>
      </th>
    ))}
  </tr>
</thead>
<tbody>
  {paginatedData.length > 0 ? (
    paginatedData.map((item, index) => (
      <tr key={index} className="even:bg-gray-50 dark:even:bg-slate-700">
        <td className="px-4 py-2 border-t">
          {highlightText(item.scopeName, searchTerm)}
        </td>
        <td className="px-4 py-2 border-t">
          {highlightText(
            item.scope === 3 ? item.categoryName || "-" : "-",
            searchTerm
          )}
        </td>
        <td className="px-4 py-2 border-t">
          {highlightText(item.activity, searchTerm)}
        </td>
        <td className="px-4 py-2 border-t text-right">
          {highlightText(
            item.twoYearsAgo !== null ? item.twoYearsAgo.toFixed(3) : "-",
            searchTerm
          )}
        </td>
        <td className="px-4 py-2 border-t text-right">
          {highlightText(
            item.previousYear !== null ? item.previousYear.toFixed(3) : "-",
            searchTerm
          )}
        </td>
        <td className="px-4 py-2 border-t text-right">
          {highlightText(
            item.selectedYear !== null ? item.selectedYear.toFixed(3) : "-",
            searchTerm
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-slate-400">
        No data
      </td>
    </tr>
  )}
</tbody>

          </table>
           
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-sm mr-1">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1); // reset page กลับหน้าแรกเมื่อเปลี่ยน rowsPerPage
                }}
                className="border border-gray-300 text-sm rounded-lg"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
              >
                <ArrowBackIosNewIcon style={{ fontSize: "12px" }} />
              </button>
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
              >
                <ArrowForwardIosOutlinedIcon style={{ fontSize: "12px" }} />
              </button>
            </div>
          </div>
      </div>
      {loading && <Loading />}
    </>
  );
}
