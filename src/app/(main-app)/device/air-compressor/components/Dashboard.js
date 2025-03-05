import React, { useState, useMemo } from "react";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Map from "./Thaimap";
import DeviceDetail from "./DeviceDetail";
import MapTH from "./MapTest";
import CreateIcon from '@mui/icons-material/Create';
const Dashboard = ({ deviceData }) => {
  const [activeTab, setActiveTab] = useState("table");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLocation, setSelectedLocation] = useState(null);
  // const [mapZoomLevel, setMapZoomLevel] = useState(15); //default zoom level
  // const [locationDataList, setLocationDataList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "device", direction: "asc" });


  const [mapZoomLevel, setMapZoomLevel] = useState(15); // กำหนดค่า zoom เริ่มต้น
  
  const schedules = [
    {
      title: "ประตูทางเข้า เปิดทุกวัน ตอนเช้า",
      dimming: "20% Dimming",
      time: "05:00 - 07:00",
    },
    {
      title: "ประตูทางเข้า เปิดทุกวัน ตอนเที่ยง",
      dimming: "20% Dimming",
      time: "12:00 - 13:00",
    },
    {
      title: "ประตูทางเข้า เปิดทุกวัน ตอนเย็น",
      dimming: "20% Dimming",
      time: "18:00 - 21:00",
    },
  ];
  // ดึงค่าพิกัดจาก deviceData และสร้าง locationDataList
  const locationDataList = useMemo(() => {
    return deviceData
      .filter(device => device.lat && device.lng) // กรองเฉพาะที่มี lat, lng
      .map(device => ({
        lat: device.lat,
        lng: device.lng
      }));
  }, [deviceData]);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // ฟิลเตอร์ข้อมูลตามคำค้นหา
  const filteredData = deviceData.filter((item) =>
    item.device.toLowerCase().includes(searchQuery.toLowerCase())
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
    setSelectedDevice(Data); // เมื่อคลิกหมุด, จะได้รับข้อมูลทั้งหมดของหมุด
    console.log("Selected device data:", Data); // หรือใช้ข้อมูลนี้ในการแสดงรายละเอียด
  };

  return (
    <>
    <div className="flex gap-3">
      <div className="w-[450px] ">
      <div className="flex justify-center w-full h-[450px] justify-items-center overflow-hidden mt-10 mb-7">
                          {/* <MapTH
                            zoom={mapZoomLevel}
                            selectedLocation={selectedLocation} // ส่งพิกัดที่เลือกไป
                            locationList={locationDataList}
                            className={"w-full h-[450px] justify-items-center"}
                            setActiveTab={setActiveTab}  // ใช้ฟังก์ชันที่เรียก setActiveTab
                            isGotoLatLon
                          ></MapTH> */}
                          <MapTH
                              locationList={deviceData.map((loca, index) => ({
                                id: index + 1,  // เพิ่ม id ให้กับแต่ละหมุด
                                device: `Device ${index + 1}`, // เพิ่มชื่ออุปกรณ์
                                kW: Math.random() * 100, // ข้อมูลสมมุติ
                                kWh: Math.random() * 1000, // ข้อมูลสมมุติ
                                runningHrs: Math.random() * 100, // ข้อมูลสมมุติ
                                status: "active", // ข้อมูลสมมุติ
                                connection: "wifi", // ข้อมูลสมมุติ
                                dimming: Math.random() * 100, // ข้อมูลสมมุติ
                                ...loca,
                              }))}
                              className={"w-full h-[450px] justify-items-center"}
                              zoom={mapZoomLevel}
                              selectedLocation={selectedLocation}
                              setSelectedLocation={setSelectedLocation}  // Pass setSelectedLocation function
                              onDeviceClick={handleDeviceClick} 
                              setActiveTab={setActiveTab}
                            />

                            
                        </div>
                        {activeTab === "table" ? (
                        <>
                        </>) : (
                          <>
                          
                          
      <h1 className="text-base font-bold mb-2">Active Schedule</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md border-t border-gray-300 text-sm">
          <tbody>
            {schedules.map((schedule, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} border-b border-gray-300`}>
                <td className="py-2 px-4">{schedule.title}</td>
                <td className="py-2 px-4">{schedule.dimming}</td>
                <td className="py-2 px-4">{schedule.time}</td>
                <td className="py-2 px-4">
                  <button className="text-gray-500 hover:text-gray-700"><CreateIcon/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
                          </>) }
      </div>

      <div className="w-60 flex-1">
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
                      onClick={() => handleSort("device")}
                    >
                      Device
                      {sortConfig.key === "device" && sortConfig.direction === "asc" ? (
                        <ArrowDropUpIcon style={{ fontSize: "14px", marginLeft: "4px" }} />
                      ) : (
                        <ArrowDropDownIcon style={{ fontSize: "14px", marginLeft: "4px" }} />
                      )}
                    </th>
                    <th
                      className="px-2 py-1 text-center text-gray-700 cursor-pointer"
                      onClick={() => handleSort("kW")}
                    >
                      kW
                      {sortConfig.key === "kW" && sortConfig.direction === "asc" ? (
                        <ArrowDropUpIcon style={{ fontSize: "14px", marginLeft: "4px" }} />
                      ) : (
                        <ArrowDropDownIcon style={{ fontSize: "14px", marginLeft: "4px" }} />
                      )}
                    </th>
                    <th
                      className="px-2 py-1 text-center text-gray-700 cursor-pointer"
                      onClick={() => handleSort("kWh")}
                    >
                      kWh
                      {sortConfig.key === "kWh" && sortConfig.direction === "asc" ? (
                        <ArrowDropUpIcon style={{ fontSize: "14px", marginLeft: "4px" }} />
                      ) : (
                        <ArrowDropDownIcon style={{ fontSize: "14px", marginLeft: "4px" }} />
                      )}
                    </th>
                    <th
                      className="px-2 py-1 text-center text-gray-700 cursor-pointer"
                      onClick={() => handleSort("runningHrs")}
                    >
                      Running Hrs
                      {sortConfig.key === "runningHrs" && sortConfig.direction === "asc" ? (
                        <ArrowDropUpIcon style={{ fontSize: "14px", marginLeft: "4px" }} />
                      ) : (
                        <ArrowDropDownIcon style={{ fontSize: "14px", marginLeft: "4px" }} />
                      )}
                    </th>
                    <th className="px-2 py-1 text-center text-gray-700" >Status</th>
                    <th className="px-2 py-1 text-center text-gray-700">% Dimming</th>
                    <th className="px-2 py-1 text-center text-gray-700">Last Updated</th>
                    <th className="px-2 py-1 text-center text-gray-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((record, index) => (
                    <tr
                      key={record.id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                      style={{ borderBottom: '1px solid #e0e0e0' }}
                    >
                      <td className="px-2 py-1 text-left">{record.device}</td>
                      <td className="px-2 py-1 text-center">{record.kW}</td>
                      <td className="px-2 py-1 text-center">{record.kWh}</td>
                      <td className="px-2 py-1 text-center">{record.runningHrs}</td>
                      <td className="px-2 py-1 text-center">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-bold  ${
                            record.status === "On"
                              ? "text-[#33BFBF]"
                              : record.status === "Offline"
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-2 py-1 text-center" >{record.dimming}</td>
                      <td className="px-2 py-2 text-center">{record.lastupdate}</td>
                      
                      <td className="px-2 py-1 text-center">
                      <ArrowForwardIosOutlinedIcon
                          onClick={() => {
                            setSelectedDevice(record);
                            setActiveTab("detail");
                            setSelectedLocation({ lat: record.lat, lng: record.lng }); // อัพเดตตำแหน่งที่เลือก
                            setMapZoomLevel(15); // ซูมเข้าเมื่อเลือกอุปกรณ์
                          }}
                          style={{ color: 'var(--primary)', cursor: 'pointer' }}
                        />
                      </td>
                    </tr>
                  ))}
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
    
    
    
        
        
       
    </>
  );
};

export default Dashboard;
