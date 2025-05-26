"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { Checkbox, Select } from "antd";
import ModalConfirm from "./Popupconfirm";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "dayjs/locale/en";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltips from "@mui/material/Tooltip";
import {
  getCustomDevice,
  getCustomDeviceHistory,
  getCarbonYearList,
  getCarbonBusinessUnitList,
  getCarbonSiteList,
  getCarbonScopeList,
  getCarbonCustomChart,
} from "@/utils/api";
const { Option } = Select;

dayjs.extend(customParseFormat);

export default function CustomGraph({}) {
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("");
  const [yearList, setYearList] = useState([]);
  const [businessUnitId, setBusinessUnitId] = useState(0);
  const [siteId, setSiteId] = useState(0);
  const [scope, setScope] = useState(0);
  const [scopeList, setScopeList] = useState([]);
  const [businessUnitList, setBusinessUnitList] = useState([]);
  const [siteList, setSiteList] = useState([]);
  const [companyId, setCompanyId] = useState(2);
  const [openModalAlert, setopenModalAlert] = useState(false);
  const [modalAlertProps, setModalAlertProps] = useState(null);
  const [openModalconfirm, setopenModalconfirm] = useState(false);
  const [modalConfirmProps, setModalConfirmProps] = useState(null);
  const [chartDataList, setChartDataList] = useState([]);
  const [dataCustom, setDataCustom] = useState([]); // 🆕 เก็บรายการที่เพิ่ม
  const [visibleItems, setVisibleItems] = useState(dataCustom.map(() => true));

  useEffect(() => {
    GetCarbonYearList();
  }, []);

  useEffect(() => {
    GetCarbonSiteList();
  }, [businessUnitId]);

  useEffect(() => {
    GetCarbonScopeList();
  }, [businessUnitId, year, siteId]);

  const GetCarbonYearList = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const result = await getCarbonYearList(companyId);
      if (result?.status === 200) {
        setYearList(result.data);
        setYear(result.data[0].year);
        await GetCarbonBusinessUnitList();
        await GetCarbonSiteList();
      } else {
        setYearList([]);
      }
    } catch (error) {
      console.log("Error Summary Carbon:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const GetCarbonBusinessUnitList = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const result = await getCarbonBusinessUnitList(companyId);
      if (result?.status === 200) {
        setBusinessUnitList(result.data);
        setBusinessUnitId(result.data[0].id);
      } else {
        setBusinessUnitList([]);
      }
    } catch (error) {
      console.log("Error Summary Carbon:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const GetCarbonSiteList = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const result = await getCarbonSiteList({ businessUnitId, companyId });
      if (result?.status === 200) {
        setSiteList(result.data);
        setSiteId(result.data[0].id);
      } else {
        setSiteList([]);
      }
    } catch (error) {
      console.log("Error Summary Carbon:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

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
        // setScope(result.data[0].scope); // All = 0
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

    const handleAdd = async () => {
      const selectedBusinessUnitId = Number(businessUnitId);
      const selectedSiteId = Number(siteId);
      const selectedScope = Number(scope);
    
      const businessUnit = businessUnitList.find((b) => b.id === selectedBusinessUnitId);
      const site = siteList.find((s) => s.id === selectedSiteId);
      const scopeItem = scopeList.find((s) => s.scope === selectedScope);
    
      if (!businessUnit || !site) return;
    
      // เช็คซ้ำ (businessUnitId, siteId, scopeId) ใน dataCustom
  const isDuplicate = dataCustom.some(
    (item) =>
      item.businessUnitId === selectedBusinessUnitId &&
      item.siteId === selectedSiteId &&
      item.scopeId === selectedScope
  );

  if (isDuplicate) {
    setopenModalAlert(
      
    )
    return;
  }

  if (dataCustom.length >= 10) {
    alert("You can only add up to 10 parameters.");
    return;
  }
    
      // ✅ สร้างอันใหม่ล่าสุด
      const newItem = {
        year,
        businessUnitId: selectedBusinessUnitId,
        businessUnitName: businessUnit.name,
        siteId: selectedSiteId,
        siteName: site.name,
        scopeId: selectedScope,
        scopeName: scopeItem ? scopeItem.scopeName : "All",
      };
    
      const updatedDataCustom = [...dataCustom, newItem];
setDataCustom(updatedDataCustom);
setVisibleItems((prev) => [...prev, true]);

try {
  setLoading(true);

  // ✅ รวมค่าทั้งหมดจาก updatedDataCustom เพื่อให้เป็น array
  const siteIds = updatedDataCustom.map((item) => item.siteId);
  const businessUnitIds = updatedDataCustom.map((item) => item.businessUnitId);
  const scopes = updatedDataCustom.map((item) => item.scopeId);

  // ✅ ยิง API โดยส่งเป็น array
  const result = await getCarbonCustomChart({
    siteId: siteIds,
    businessUnitId: businessUnitIds,
    companyId,
    year,
    scope: scopes,
  });

  if (result && result.status === 200) {
    const data = result.data;
    console.log(result.data)
  
    const chartItems = updatedDataCustom.map((item, index) => ({
      id: `${item.siteId}_${item.scopeId}`,
      name: `${item.scopeName} (${item.siteName})`,
      values: {
        [year]: data.selectedYear?.[index] || 0,
        [year - 1]: data.previousYear?.[index] || 0,
        [year - 2]: data.twoYearsAgo?.[index] || 0,
      },
    }));

    console.log(chartItems)
  
    setChartDataList(chartItems);

  }
   else {
    console.error("API error:", result);
  }
} catch (err) {
  console.error("Fetch error:", err);
} finally {
  setLoading(false);
}

    
      // ✅ Reset form
      setBusinessUnitId(null);
      setSiteId(null);
      setScope(0);
    };
    
    
    

  const years = [year - 2, year - 1, year];

  const chartData =
    dataCustom.length > 0 && chartDataList.length > 0
      ? years.map((year) => {
          const dataPoint = { year: year.toString() };

          chartDataList.forEach((chartItem, index) => {
            const customItem = dataCustom[index];
            if (!customItem) return;

            const scopeName = customItem.scopeName || `param${index + 1}`;
            const key = `${scopeName} #${index + 1}`;
            dataPoint[key] = chartItem.values?.[year] ?? 0;
          });

          return dataPoint;
        })
      : [];

  const colors = [
    "#4BC0C0",
    "#008A8B",
    "#FF35C6",
    "#FF9966",
    "#E74C3C",
    "#FFC40E",
    "#66CC66",
    "#00AA00",
    "#3399FF",
    "#9747FF",
  ];

  // ฟังก์ชันลบรายการตาม businessUnitId, siteId, scopeId
  const handleRemove = (indexToRemove) => {
    setDataCustom((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleOpenModalconfirmDeleteAll = () => {
    setopenModalconfirm(true);
    setModalConfirmProps({
      onCloseModal: handleClosePopup,
      onClickConfirmBtn: handleDeleteAll,
      title: "Delete All Parameters",
      content: "Are you sure you want to delete all the parameters?",
      buttonTypeColor: "primary",
    });
  };
  const handleClosePopup = () => {
    setopenModalconfirm(false);
  };

  const handleDeleteAll = () => {
      setDataCustom([]);
      setVisibleItems([]);
      setopenModalconfirm(false);
  };

  const handleYearChange = (value) => {
    setYear(value);
  };

  const handleBusinessUnitChange = (value) => {
    setBusinessUnitId(value);
  };

  const handleSiteChange = (value) => {
    setSiteId(value);
  };

  const handleScopeChange = (value) => {
    setScope(value);
    console.log("Selected scope:", value);
  };

  const toggleVisibility = (index) => {
    setVisibleItems((prev) => {
      const newVisible = [...prev];
      newVisible[index] = !newVisible[index];
      return newVisible;
    });
  };

  return (
    <>
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm">Target Year:</span>
          <Select
            value={year}
            style={{ width: 150 }}
            onChange={handleYearChange}
            disabled={true}
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
            style={{ width: 200 }}
            onChange={handleBusinessUnitChange}
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
            disabled={!businessUnitId}
          >
            {siteList.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>

          <span className="text-sm">Scope:</span>
          <Select
            value={scope}
            style={{ width: 250, height: 40 }}
            onChange={handleScopeChange}
            disabled={!businessUnitId || !siteId}
          >
            <Option value={0}>All</Option>
            {scopeList.map((item) => (
              <Option key={item.scope} value={item.scope}>
                {item.scopeName}
              </Option>
            ))}
          </Select>

          <button
            type="button"
            onClick={handleAdd}
            className={`rounded-md text-sm px-5 h-9 
    ${
      !businessUnitId ||
      !siteId ||
      scope === 0 ||
      scope === undefined ||
      dataCustom.length >= 10
        ? "bg-[#e3e3e3] cursor-not-allowed text-[#999999]" // disabled style สีเทา + cursor ห้ามคลิก
        : "bg-[#61bcbe] text-white" // enabled style สีเขียว + hover
    }
  `}
            disabled={
              !businessUnitId ||
              !siteId ||
              scope === 0 ||
              scope === undefined ||
              dataCustom.length >= 10
            }
          >
            Add
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-4 text-lg font-semibold">
              <div>
                Select:{" "}
                <span className="text-cyan-500">{dataCustom.length} / 10</span>{" "}
                parameter
              </div>
              {/* <div className="h-5 w-px bg-gray-300" />
              <Tooltips
                title="Two types of parameters are allowed to compare at once. To compare more parameters, please add a new custom chart."
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: "14px",
                    },
                  },
                }}
              >
                <InfoOutlinedIcon
                  className="text-[#33BFBF] ml-1 cursor-pointer"
                  fontSize="small"
                />
              </Tooltips> */}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Parameter List จาก dataCustom */}
            <div className="lg:w-[20%] w-full pr-0 lg:pr-4 mb-4 lg:mb-0 lg:border-r">
              <div className="flex flex-col gap-3">
                {dataCustom.length === 0 && (
                  <p className="text-gray-500 italic">No parameters added.</p>
                )}
                {dataCustom.map((item, index) => (
                  <div
                    key={`${item.businessUnitId}_${item.siteId}_${item.scopeId}_${index}`}
                    className="rounded-lg p-3 shadow-sm bg-[#f2fafa] border-2 border-[#32c0bf] dark:bg-gray-800 dark:text-white flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-2">
                      {/* วงกลมสี */}
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                      {/* ข้อมูลชื่อแบบจัดกลางแนวตั้ง */}
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-semibold leading-tight">
                          {item.businessUnitName}
                        </p>
                        <p className="text-xs leading-tight">{item.siteName}</p>
                        <p className="text-xs text-gray-400 italic leading-tight">
                          {item.scopeName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={visibleItems[index]}
                        onChange={() => toggleVisibility(index)}
                      />

                      <button
                        onClick={() => handleRemove(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove parameter ${item.businessUnitName} - ${item.siteName} - ${item.scopeName}`}
                        type="button"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {dataCustom.length > 0 && (
                <button
                  onClick={handleOpenModalconfirmDeleteAll}
                  className="mt-4 text-red-600 underline hover:text-red-800 text-center"
                  type="button"
                >
                  Delete All
                </button>
              )}
            </div>

            {/* Chart */}
            <div className="lg:w-[80%] w-full h-auto">
              <ResponsiveContainer width="100%" height={400}>
                {chartData.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500 italic">No data available</p>
                  </div>
                ) : (
                  <BarChart width={800} height={500} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />{" "}
                    {/* เพิ่มเส้นกริด */}
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;

                        return (
                          <div className="bg-white border rounded-md p-2 shadow text-sm">
                            <p className="font-semibold mb-2">{label}</p>
                            {payload.map((entry, i) => {
                              const item = dataCustom[i];
                              const value = entry.value?.toLocaleString(
                                undefined,
                                {
                                  maximumFractionDigits: 2,
                                }
                              );

                              return (
                                <div key={i} className="flex items-center mb-1">
                                  <span
                                    className="w-3 h-3 rounded-full inline-block mr-2"
                                    style={{ backgroundColor: entry.color }}
                                  ></span>
                                  <span className="font-medium">
                                    {item.businessUnitName} - {item.siteName} -{" "}
                                    {item.scopeName}
                                  </span>
                                  :&nbsp;<span>{value} tCO₂e</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }}
                    />
                    {dataCustom.map((item, index) => {
                      console.log(item)
                      if (!visibleItems[index]) return null;
                      const dataKey = `${item.scopeName} #${index + 1}`;
                      return (
                        <Bar
                          key={dataKey}
                          dataKey={dataKey}
                          fill={colors[index % colors.length]}
                        />
                      );
                    })}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {openModalconfirm && <ModalConfirm {...modalConfirmProps} />}
    </>
  );
}
