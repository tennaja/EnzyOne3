import React, { useState, useMemo, useEffect } from "react";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeviceDetail from "./DeviceDetail";
import MapTH from "./MapLeaflet";
import CreateIcon from '@mui/icons-material/Create';
import {
  getDevicebyId, getHistoryGraphDataa, getEnergyHistoryGraphDataa, getSchedulebyid
} from "@/utils/api";
import ChartComponent from "./Chart1";
import MyChart from "./Chart1";
import SchedulePopup from "./Popupchedule";
import BarChartComponent from "./Barchart";
const Dashboard = ({ deviceData, FetchDevice ,Sitename,Groupname}) => {
  
  const today = new Date().toISOString().split("T")[0];
  const [activeTab, setActiveTab] = useState("table");
  const [selectedDevice, setSelectedDevice] = useState();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [graphData, setGraphDaata] = useState();
  const [graphData2, setGraphDaata2] = useState();
  const [selectedLocation, setSelectedLocation] = useState(null);
  // const [mapZoomLevel, setMapZoomLevel] = useState(15); //default zoom level
  // const [locationDataList, setLocationDataList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "device", direction: "asc" });
  const [mapCenter, setMapCenter] = useState({ lat: 15.8700, lng: 100.9925 }); // เก็บค่าตำแหน่ง
  const [mapZoomLevel, setMapZoomLevel] = useState(15); // กำหนดค่า zoom เริ่มต้น
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [startDate2, setStartDate2] = useState(today);
  const [endDate2, setEndDate2] = useState(today);
  const [timeUnit, setTimeUnit] = useState("day");
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState();
  const [openModalSchedule ,setopenModalSchedule] = useState(false)
  const datagraph = {
    "timestamp": [
      "2025-02-01 00:00:00",
      "2025-02-02 00:00:00"
    ],
    "kwh": [
      18,
      9
    ]
  };
  useEffect(() => {
    if (!deviceData || Object.keys(deviceData).length === 0) {
      setIsLoading(true); // ยังโหลดไม่เสร็จ
    } else {
      setIsLoading(false); // โหลดเสร็จแล้ว
    }
  }, [deviceData]);

  // ดึงค่าพิกัดจาก deviceData และสร้าง locationDataList
  // const locationDataList = useMemo(() => {
  //   return deviceData
  //     .filter(device => device.lat && device.lng) // กรองเฉพาะที่มี lat, lng
  //     .map(device => ({
  //       lat: device.lat,
  //       lng: device.lng
  //     }));
  // }, [deviceData]);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = deviceData.filter((item) =>
    item.name?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kW?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kWh?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.percentDimming?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.runningHour?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lastUpdated?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.groupName?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );


  // ฟังก์ชั่นการ sort
  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });
  };

  // การ sort ข้อมูลที่ใช้ useMemo เพื่อลดการคำนวณซ้ำ
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // คำนวณข้อมูลที่จะแสดงตามหน้า
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleDeviceClick = (Data) => {
    GetHistoryGraph(Data.id);
    GetEnergyHistoryGraph(Data.id)
    getdevicebyId(Data.id); // เมื่อคลิกหมุด, จะได้รับข้อมูลทั้งหมดของหมุด
    console.log("Selected device data:", Data); // หรือใช้ข้อมูลนี้ในการแสดงรายละเอียด
  };

  const getdevicebyId = async (id) => {
    console.log("Device Id:", id);

    try {
      const result = await getDevicebyId(id);
      console.log("Group List Result:", result);

      if (result) {
        setSelectedDevice(result);
        setSelectedStatus(result.status); // ✅ เก็บค่า status ของอุปกรณ์
      } else {
        console.log("No groups found!");
      }
    } catch (error) {
      console.error("Error fetching device data:", error);
    }
  };
  useEffect(() => {
    // Check if the active tab is 'dashboard'
    if (activeTab === "table") {
      // FetchDevice();
      setSearchQuery("")
    }
  }, [activeTab]);  // This will run whenever `activeTab` changes.

  const GetHistoryGraph = async (id) => {
    const Param = {
      deviceId: id,
      endDate: endDate,
      startDate: startDate
    };
    const res = await getHistoryGraphDataa(Param);

    if (res.status === 200) {
      setGraphDaata(res.data)
      console.log("เข้าาาาาาาาาาาาาาาาา", res.data)



    } else {

      console.log('ไม่เข้าาาาาาาาาาาาาาาาา')
    }
  };


  const GetEnergyHistoryGraph = async (id) => {
    const Param = {
      deviceId: id,
      groupBy: timeUnit,
      endDate: endDate2,
      startDate: startDate2
    };
    const res = await getEnergyHistoryGraphDataa(Param);

    if (res.status === 200) {
      setGraphDaata2(res.data)
      console.log("เข้าาาาาาาาาาาาาาาาา", res.data)



    } else {

      console.log('ไม่เข้าาาาาาาาาาาาาาาาา')
    }
  };
  const getSchedulById = async (id) => {
    console.log("Device Id:", id);

    try {
      const result = await getSchedulebyid(id);
      console.log("Group List Result:", result);

      if (result) {
        
        setScheduleData(result.data);
        setopenModalSchedule(true)
      } else {
        console.log("No groups found!");
      }
    } catch (error) {
      console.error("Error fetching device data:", error);
    }
  };

  

  const handleStartDateChangeHistorical = (e) => {
    const newStartDate = e.target.value;
    console.log(newStartDate)
    setStartDate(newStartDate);

    const maxAllowedEndDate = new Date(newStartDate);
    maxAllowedEndDate.setUTCDate(maxAllowedEndDate.getUTCDate() + 31);

    // ถ้า endDate เกิน 31 วัน ให้อัปเดตเป็น maxAllowedEndDate
    if (new Date(endDate) > maxAllowedEndDate) {
      setEndDate(maxAllowedEndDate.toISOString().split("T")[0]);
    }
  };

const handleEndDateChangeHistorical = (e) => {
    const newEndDate = e.target.value;
    const maxAllowedEndDate = new Date(startDate);
    maxAllowedEndDate.setDate(maxAllowedEndDate.getDate() + 31);

    const newEndDateObj = new Date(newEndDate);

    // จำกัดให้ endDate ไม่เกิน 31 วันจาก startDate และไม่เกินวันที่ปัจจุบัน
    if (newEndDateObj <= maxAllowedEndDate && newEndDateObj <= new Date(today)) {
      setEndDate(newEndDate);

      // เรียก GetHistoryGraph ถ้ามีอุปกรณ์ที่เลือก
      if (selectedDevice?.id) {
        GetHistoryGraph(selectedDevice.id);
      }
    }
  };


  const handleStartDateChangeHistorical2 = (e) => {
    const newStartDate = e.target.value;
    console.log(newStartDate);

    setStartDate2(newStartDate);

    const maxEndDate = new Date(newStartDate);
    maxEndDate.setUTCDate(maxEndDate.getUTCDate() + 31);
    const formattedMaxEndDate = maxEndDate.toISOString().split("T")[0];

    setEndDate2((prevEndDate) => (new Date(prevEndDate) > maxEndDate ? formattedMaxEndDate : prevEndDate));
};

const handleEndDateChangeHistorical2 = (e) => {
    const newEndDate = e.target.value;
    const startDateObj = new Date(startDate2);
    const maxAllowedEndDate = new Date(startDateObj);
    maxAllowedEndDate.setDate(startDateObj.getDate() + 31);

    const todayDate = new Date(today);
    const newEndDateObj = new Date(newEndDate);

    if (newEndDateObj <= maxAllowedEndDate && newEndDateObj <= todayDate) {
        setEndDate2(newEndDate);
    }
};

// ให้แน่ใจว่า API ถูกเรียกหลังจาก endDate2 ถูกอัปเดตจริง
useEffect(() => {
    if (selectedDevice?.id) {
        GetEnergyHistoryGraph(selectedDevice.id);
    }
}, [endDate2,startDate2]);



  const handleTimeUnitChange = (e) => {

    setTimeUnit(e.target.value);

  };
  
  useEffect(() => {
    if (selectedDevice?.id) {
      GetHistoryGraph(selectedDevice.id);
      
    }
  }, [endDate,startDate]);

  useEffect(() => {
    // Reset all keys in the sortConfig when deviceData changes
    setSortConfig({}); // Clear the sortConfig object completely
  }, [deviceData]); // This will trigger when deviceData changes
  return (
    <>

      <div className="grid rounded-xl bg-white p-6 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
        <div>
          <span className="text-lg font-bold block mb-2">Device List</span>
          <p className="text-base mb-4">{Sitename} | {Groupname}</p>


        </div>

        <div className="flex flex-col lg:flex-row gap-3">


          <div className="w-full lg:w-[450px]">
            <div className="flex justify-center w-full h-[500px] justify-items-center overflow-hidden mt-10 mb-7">
              <MapTH
                locationList={deviceData.map((loca, index) => ({
                  id: index + 1,
                  name: loca.name,
                  kW: loca.kW,
                  kWh: loca.kWh,
                  runningHour: loca.runningHour,
                  status: loca.status,
                  connection: loca.connection || "",
                  percentDimming: loca.percentDimming,
                  lat: loca.latitude,  // แปลงเป็นตัวเลข
                  lng: loca.longitude,  // แปลงเป็นตัวเลข
                }))}
                className={"w-full h-[500px] justify-items-center"}
                zoom={mapZoomLevel}
                selectedLocation={selectedLocation} // ใช้ selectedLocation เพื่อแสดงตำแหน่งที่เลือก
                setSelectedLocation={setSelectedLocation}
                onDeviceClick={handleDeviceClick} // คลิกที่อุปกรณ์จะทำการ fetch ข้อมูลอุปกรณ์
                setActiveTab={setActiveTab}
                mapCenter={mapCenter} // ถ้าไม่เปลี่ยนแปลง mapCenter จะใช้ค่าเดิม
                selectedStatus={selectedStatus} // ส่ง selectedStatus เข้าไปที่ MapTH
              />




            </div>
            {activeTab === "table" ? (
              <>
              </>) : (
              <>


<h1 className="text-base font-bold mb-2">Active Schedule</h1>
<div className="max-h-72 overflow-y-auto">
  <table className="min-w-full bg-white rounded-lg border-t border-gray-300 text-sm">
    <tbody>
      {selectedDevice?.schedules?.map((schedule, index) => (
        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} border-b border-gray-300`}>
          <td className="py-2 px-4">
            <div className="font-bold">{schedule.name}</div>
            <div className="font-bold">{schedule.percentDimming}% Dimming</div>
            <div className="font-bold">{schedule.startTime} - {schedule.endTime}</div>
            <div className="text-xs">{schedule.repeat}</div>
          </td>

          <td className="py-2 px-4">
            <button className="text-gray-500 hover:text-gray-700" onClick={() => {
              getSchedulById(schedule.id);
            }}>
              <CreateIcon />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


              </>)}
          </div>

          <div className="w-full lg:w-60 flex-1">
            {activeTab === "table" ? (
              <div className="flex-1 ml-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold">{filteredData.length} Devices</span>
                  <input
                    type="text"
                    placeholder="ค้นหา"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="border border-gray-300 p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 border-b border-gray-300">
                        <th
                          className="px-2 py-1 text-left text-gray-700 cursor-pointer"
                          onClick={() => handleSort("name")}
                        >
                          Device
                          <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
                            <ArrowDropUpIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "name" && sortConfig.direction === "asc" ? 1 : 0.3,
                                marginBottom: "-2px", // ลดช่องว่างระหว่างลูกศร
                              }}
                            />
                            <ArrowDropDownIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "name" && sortConfig.direction === "desc" ? 1 : 0.3,
                                marginTop: "-2px", // ลดช่องว่างระหว่างลูกศร
                              }}
                            />
                          </div>
                        </th>

                        <th
                          className="px-2 py-1 text-center text-gray-700 cursor-pointer"
                          onClick={() => handleSort("kW")}
                        >
                          kW
                          <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
                            <ArrowDropUpIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "kW" && sortConfig.direction === "asc" ? 1 : 0.3,
                                marginBottom: "-2px",
                              }}
                            />
                            <ArrowDropDownIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "kW" && sortConfig.direction === "desc" ? 1 : 0.3,
                                marginTop: "-2px",
                              }}
                            />
                          </div>
                        </th>

                        <th
                          className="px-2 py-1 text-center text-gray-700 cursor-pointer"
                          onClick={() => handleSort("kWh")}
                        >
                          kWh
                          <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
                            <ArrowDropUpIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "kWh" && sortConfig.direction === "asc" ? 1 : 0.3,
                                marginBottom: "-2px",
                              }}
                            />
                            <ArrowDropDownIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "kWh" && sortConfig.direction === "desc" ? 1 : 0.3,
                                marginTop: "-2px",
                              }}
                            />
                          </div>
                        </th>

                        <th
                          className="px-2 py-1 text-center text-gray-700 cursor-pointer"
                          onClick={() => handleSort("runningHour")}
                        >
                          Running Hrs
                          <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
                            <ArrowDropUpIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "runningHour" && sortConfig.direction === "asc" ? 1 : 0.3,
                                marginBottom: "-2px",
                              }}
                            />
                            <ArrowDropDownIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "runningHour" && sortConfig.direction === "desc" ? 1 : 0.3,
                                marginTop: "-2px",
                              }}
                            />
                          </div>
                        </th>

                        <th className="px-2 py-1 text-center text-gray-700" onClick={() => handleSort("status")}>
                          Status
                          <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
                            <ArrowDropUpIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "status" && sortConfig.direction === "asc" ? 1 : 0.3,
                                marginBottom: "-2px",
                              }}
                            />
                            <ArrowDropDownIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "status" && sortConfig.direction === "desc" ? 1 : 0.3,
                                marginTop: "-2px",
                              }}
                            />
                          </div>
                        </th>

                        <th className="px-2 py-1 text-right text-gray-700" onClick={() => handleSort("percentDimming")}>
                          % Dimming
                          <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
                            <ArrowDropUpIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "percentDimming" && sortConfig.direction === "asc" ? 1 : 0.3,
                                marginBottom: "-2px",
                              }}
                            />
                            <ArrowDropDownIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "percentDimming" && sortConfig.direction === "desc" ? 1 : 0.3,
                                marginTop: "-2px",
                              }}
                            />
                          </div>
                        </th>

                        <th className="px-2 py-1 text-right text-gray-700" onClick={() => handleSort("lastUpdated")}>
                          Last Updated
                          <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
                            <ArrowDropUpIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "lastUpdated" && sortConfig.direction === "asc" ? 1 : 0.3,
                                marginBottom: "-2px",
                              }}
                            />
                            <ArrowDropDownIcon
                              style={{
                                fontSize: "14px",
                                opacity: sortConfig.key === "lastUpdated" && sortConfig.direction === "desc" ? 1 : 0.3,
                                marginTop: "-2px",
                              }}
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
  {currentData.length === 0 ? (
    <tr>
      <td colSpan="7" className="px-2 py-4 text-center text-gray-500">Data not found</td>
    </tr>
  ) : (
    currentData.map((record, index) => (
      <tr
        key={record.id}
        className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
        style={{ borderBottom: '1px solid #e0e0e0' }}
      >
        <td className="px-2 py-1 text-left">
          <div
            className="text-[#33BFBF] underline cursor-pointer hover:text-[#28A9A9] text-base mb-1"
            onClick={() => {
              getdevicebyId(record.id);
              setActiveTab("detail");
              setSelectedLocation({ lat: record.latitude, lng: record.longitude }); // อัพเดตตำแหน่งที่เลือก
              setMapZoomLevel(15); // ซูมเข้าเมื่อเลือกอุปกรณ์
              GetHistoryGraph(record.id);
              GetEnergyHistoryGraph(record.id);
            }}
          >
            {record.name}
          </div>
          <div>{record.groupName}</div>
        </td>
        <td className="px-2 py-1 text-center">{record.kW}</td>
        <td className="px-2 py-1 text-center">{record.kWh}</td>
        <td className="px-2 py-1 text-center">{record.runningHour}</td>
        <td className="px-2 py-1 text-center">
          <span
            className={`inline-block px-2 py-1 text-sm font-bold  ${record.status === "on"
              ? "text-[#12B981]"
              : record.status === "off"
                ? "text-[#9DA8B9]"
                : "text-[#FF3D4B]"
              }`}
          >
            {record.status}
          </span>
        </td>
        <td className="px-2 py-1 text-right">{record.percentDimming}</td>
        <td className="px-2 py-2 text-right text-balance">{record.lastUpdated}</td>
      </tr>
    ))
  )}
</tbody>

                  </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <span className="text-sm mr-1">Rows per page:</span>
                    <select
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
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
                      onClick={() => handleChangePage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                      <ArrowBackIosNewIcon style={{ fontSize: '12px' }} />
                    </button>
                    <span className="text-sm">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => handleChangePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                      <ArrowForwardIosOutlinedIcon style={{ fontSize: '12px' }} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 ml-6">

                <DeviceDetail
                  device={selectedDevice}
                  setActiveTab={() => { setActiveTab("table"); setSelectedLocation(null); }}
                />

              </div>
            )}

          </div>

        </div>






      </div>
      {activeTab === "table" ? <></> : (
        <div className="grid rounded-xl bg-white p-6 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
          <div>
            <span className="text-lg font-bold block mb-2">Historical</span>
            <div className="flex gap-2 mt-5">
              <input
                type="date"
                className="w-60 p-2 border rounded"
                value={startDate}
                onChange={handleStartDateChangeHistorical}
                max={today}
              />

<input
  type="date"
  className="w-60 p-2 border rounded"
  value={endDate}
  min={startDate || ""} // ถ้า startDate เป็น null/"" จะไม่กำหนดค่า min
  max={
    startDate
      ? new Date(
          Math.min(
            new Date().getTime(), // วันที่ปัจจุบัน
            new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 31)).getTime() // 31 วันหลัง startDate
          )
        )
          .toISOString()
          .split("T")[0] // แปลงเป็น YYYY-MM-DD
      : new Date().toISOString().split("T")[0] // ถ้า startDate ไม่มีค่า ใช้วันนี้เป็น max
  }
  onChange={handleEndDateChangeHistorical}
/>


            </div>
            <div className="mt-5">
              <MyChart graphdata={graphData} />
            </div>
            <div className="flex gap-4 mt-5">
              <select
                className="w-60 p-2 border rounded"
                value={timeUnit}
                onChange={handleTimeUnitChange}
              >
                <option value="hour">Hourly</option>
                <option value="day">Daily</option>
                <option value="month">Monthly</option>
              </select>
              <input
                type="date"
                className="w-60 p-2 border rounded"
                value={startDate2}
                onChange={handleStartDateChangeHistorical2}
                max={today}
              />

<input
  type="date"
  className="w-60 p-2 border rounded"
  value={endDate2}
  min={startDate2 || ""} // ถ้า startDate2 เป็น null/"" จะไม่กำหนดค่า min
  max={
    startDate2
      ? new Date(
          Math.min(
            new Date().getTime(), // วันที่ปัจจุบัน
            new Date(new Date(startDate2).setDate(new Date(startDate2).getDate() + 31)).getTime() // 31 วันหลัง startDate2
          )
        )
          .toISOString()
          .split("T")[0] // แปลงเป็น YYYY-MM-DD
      : new Date().toISOString().split("T")[0] // ถ้า startDate2 ไม่มีค่า ใช้วันนี้เป็น max
  }
  onChange={handleEndDateChangeHistorical2}
/>



            </div>

            <div className="mt-5">
              <BarChartComponent data={graphData2} type={timeUnit}/>
            </div>
          </div>
          <SchedulePopup 
          isOpen={openModalSchedule} 
          onClose={() => {setopenModalSchedule(false); 
          setScheduleData(null);}}  
          scheduleData={scheduleData} 
          deviceList={deviceData} 
          groupId={scheduleData?.groupId} />
        </div>)}
       
    </>
  );
};

export default Dashboard;
