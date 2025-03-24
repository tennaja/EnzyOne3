import React, { useState, useMemo, useEffect, useRef } from "react";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeviceDetail from "./DeviceDetail";
import MapTH from "./MapLeaflet";
import CreateIcon from '@mui/icons-material/Create';
import {
  getDeviceListData,getDevicebyId, getHistoryGraphDataa, getEnergyHistoryGraphDataa, getSchedulebyid, putUpdateSchedule,DeviceControl
} from "@/utils/api";

import { useDispatch, useSelector} from "react-redux";
import {
  setDeviceById
} from "@/redux/slicer/smartstreetlightSlice"
import MyChart from "./Chart1";
import SchedulePopup from "./Popupchedule";
import BarChartComponent from "./Barchart";
import ModalConfirm from "./Popupconfirm";
import ModalDone from "./Popupcomplete";
import ModalFail from "./PopupFali";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "./Loading";
const Dashboard = ({ deviceData, FetchDevice, Sitename, Groupname }) => {
const dispatch = useDispatch();

  const today = new Date().toISOString().split("T")[0];
  const [activeTab, setActiveTab] = useState("table");
  const [devcielist , setDevicelist] = useState([]);
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
  const [timeUnit, setTimeUnit] = useState("hour");
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState();
  const [deviceForSchedule,setDeviceforSchedule] = useState([])
  const [openModalSchedule, setopenModalSchedule] = useState(false)
  const [openModalconfirm, setopenModalconfirm] = useState(false)
  const [openModalsuccess, setopenModalsuccess] = useState(false)
  const [openModalfail, setopenModalfail] = useState(false)
  const [modalConfirmProps, setModalConfirmProps] = useState(null);
  const [modalErrorProps, setModalErorProps] = useState(null);
  const [modalSuccessProps, setModalSuccessProps] = useState(null);
  
  const SelectIdSite = useSelector((state) => state.smartstreetlightData.siteId);
  const SelectIdGroup = useSelector((state) => state.smartstreetlightData.groupId);
  const SelectDeviceById = useSelector((state) => state.smartstreetlightData.devicebyId);
  const siteIdRef = useRef(SelectIdSite);
  const groupIdRef = useRef(SelectIdGroup);
  const devicedetailPopupRef = useRef();
  const schedulePopupRef = useRef();
  
  console.log(SelectDeviceById)
  useEffect(() => {
    // อัพเดต useRef เมื่อ SelectIdSite หรือ SelectIdGroup เปลี่ยนแปลง
    siteIdRef.current = SelectIdSite;
    groupIdRef.current = SelectIdGroup;

    // เรียก GetDeviceList เมื่อค่าของ SelectIdSite หรือ SelectIdGroup เปลี่ยน
    GetDeviceList();
  }, [SelectIdSite, SelectIdGroup]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!openModalSchedule && !openModalconfirm) {
        Promise.all([GetDeviceList(false), getdevicebyId(SelectDeviceById)]);
      }
    }, 60000);
  
    return () => clearInterval(intervalId);
  }, [openModalSchedule, openModalconfirm, SelectDeviceById]);
  
  const GetDeviceList = async (showLoading = true) => {
    const paramsNav = {
      siteId: siteIdRef.current,
      groupId: groupIdRef.current,
    };
  
    if (showLoading) setLoading(true); // โหลดเฉพาะการเรียกครั้งแรก
  
    try {
      const result = await getDeviceListData(paramsNav);
      if (result?.data?.length > 0) {
        setDevicelist(result.data);
      } else {
        setDevicelist([]);
      }
    } catch (error) {
      console.error("Error fetching device list:", error);
    } finally {
      if (showLoading) {
        setTimeout(() => setLoading(false), 3000);
      }
    }
  };
  

  // const GetDeviceList = async () => {
  //   const paramsNav = {
  //     siteId: siteIdRef.current,
  //     groupId: groupIdRef.current,
  //   };
  
  //   setLoading(true); // เริ่มโหลด
  //   try {
  //     const result = await getDeviceListData(paramsNav);
  //     if (result?.data?.length > 0) {
  //       setDevicelist(result.data); // อัปเดต state ด้วยข้อมูล
  //     } else {
  //       setDevicelist([]); // ตั้งค่าเป็น array ว่างหากไม่มีข้อมูล
  //     }
  //   } catch (error) {
  //     console.error("Error fetching device list:", error);
  //   } finally {
  //     setTimeout(() => setLoading(false), 3000); // หยุดโหลดหลังจาก 4 วินาที
  //   }
  // };

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

  const filteredData = devcielist.filter((item) =>
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
    dispatch(setDeviceById(id))
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


//   useEffect(() => {
//     const intervalId = setInterval(() => {
//         // ทำงานถ้ามีป๊อบอัพอันใดอันหนึ่งเปิดอยู่
//         if (!openModalSchedule &&  !openModalconfirm) {
//             FetchDevice();
//         }
//     }, 15000);

//     return () => clearInterval(intervalId);
// }, [openModalSchedule, openModalconfirm]);

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
        setopenModalSchedule(true);
        
        // ดึง siteId และ groupId จาก result
        const paramsNav = {
          siteId: result.data.siteId,
          groupId: result.data.groupId,
        };
  
        // เรียก getDeviceListData ด้วยค่าที่ได้มา
        const deviceResult = await getDeviceListData(paramsNav);
        if (deviceResult?.data?.length > 0) {
          setDeviceforSchedule(deviceResult.data);
        } else {
          setDeviceforSchedule([]);
        }
      } else {
        console.log("No groups found!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
     
        setLoading(false);
      
    }
  };

  const handleOpenModalconfirm = () => {
    setopenModalconfirm(true);
    setModalConfirmProps({
      onCloseModal: handleClosePopup,
      onClickConfirmBtn: handleExternalUpdate,
      title: "Edit/Save Schedule",
      content: "Are you sureyou want to save this schedule ?"
      ,
      buttonTypeColor: "primary",
    });
  };
  const handleExternalUpdate = () => {

    if (schedulePopupRef.current) {
      console.log("🚀 กำลังเรียก triggerSave() จากภายนอก");
      schedulePopupRef.current.triggerUpdate(); // ✅ เรียก triggerSave() ใน SchedulePopup.js
    } else {
      console.log("❌ schedulePopupRef.current เป็น null");
    }
  };
  const UpdateSchedul = async (id, req) => {
    try {
      console.log("Request Parameters:", req);

      const result = await putUpdateSchedule(id, req);
      console.log("Group List Result:", result);

      if (result.status === 200) {
        setopenModalconfirm(false)
        setopenModalSchedule(false)
        notifySuccess(result?.data?.title, result?.data?.message);
        GetDeviceList()
        getdevicebyId(SelectDeviceById)
        setScheduleData(null);
      } else {
        console.log("No groups found!");
        setopenModalfail(true)
      }
    } catch (error) {
      console.log("Error creating schedule:", error);
    }
  };
  const handleClosePopup = () => {
    setopenModalconfirm(false)
    setopenModalsuccess(false)
    setopenModalfail(false)
  }
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
    maxAllowedEndDate.setFullYear(startDateObj.getFullYear() + 1);

    const todayDate = new Date(today);
    const newEndDateObj = new Date(newEndDate);

    if (newEndDateObj <= maxAllowedEndDate && newEndDateObj <= todayDate) {
      setEndDate2(newEndDate);
    }
  };
  const notifySuccess = (title, message) =>
    toast.success(
      <div className="px-2">
        <div className="flex flex-row font-bold">{title}</div>
        <div className="flex flex-row text-xs">{message}</div>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  const handleExecute = () => {

      if (devicedetailPopupRef.current) {
        console.log("🚀 กำลังเรียก triggerSave() จากภายนอก");
        devicedetailPopupRef.current.triggerExecute(); // ✅ เรียก triggerSave() ใน SchedulePopup.js
      } else {
        console.log("❌ schedulePopupRef.current เป็น null");
      }
    };
  const handlesubmitcontrol = async (req) => {
            const res = await DeviceControl(req);
        
            if (res.status === 200) {
              setopenModalconfirm(false)
              setopenModalconfirm(false);
              notifySuccess(res?.data?.title,res?.data?.message);
              GetDeviceList()
              getdevicebyId(SelectDeviceById)
            } else {
              setopenModalconfirm(false)
              setopenModalfail(true)
              setModalErorProps({
                onCloseModal: handleClosePopup,
                title: res?.title,
                content: res?.message,
                buttonTypeColor: "danger",
              });
              console.log(res)
            }
    };
  const handleOpenModalconfirmControl = (name,status,dimming) => {
      setopenModalconfirm(true);
      setModalConfirmProps({
        onCloseModal: handleClosePopup,
        onClickConfirmBtn: handleExecute,
        title: "Confirm Execution",
        content: `
          <div class="mx-auto w-fit px-4 text-left">
            <p>Device: ${name}</p>
            <p>Status: ${status ? "on" : "off"}</p>
            ${status && dimming ? `<p>% Dimming: ${dimming}%</p>` : ""}
          </div>
        `,
        buttonTypeColor: "primary",
      });
    };

    
  // ให้แน่ใจว่า API ถูกเรียกหลังจาก endDate2 ถูกอัปเดตจริง
  useEffect(() => {
    if (selectedDevice?.id) {
      GetEnergyHistoryGraph(selectedDevice.id);
    }
  }, [endDate2, startDate2]);

  const handleTimeUnitChange = (e) => {

    setTimeUnit(e.target.value);

  };

  useEffect(() => {
    if (selectedDevice?.id) {
      GetHistoryGraph(selectedDevice.id);

    }
  }, [endDate, startDate]);

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
                locationList={devcielist.map((loca, index) => ({
                  id: loca.id,
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
                SiteId={siteIdRef.current}
                GroupId={groupIdRef.current}
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
                          Running Hours
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
      <td colSpan="7" className="px-2 py-4 text-center text-gray-500">Device not found</td>
    </tr>
  ) : (
    currentData.map((record, index) => {
      // Function to highlight the search query
      const highlightText = (text) => {
        if (!text || !searchQuery) return text;
        const textString = String(text); // Convert to string if it's not already a string
        const parts = textString.split(new RegExp(`(${searchQuery})`, 'gi')); // Split by search query, keeping it in the result
        return parts.map((part, i) => 
          part.toLowerCase() === searchQuery.toLowerCase() ? 
            <span key={i} className="bg-yellow-300">{part}</span> : 
            part
        );
      };
      

      return (
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
                setSelectedLocation({ lat: record.latitude, lng: record.longitude });
                setMapZoomLevel(15);
                GetHistoryGraph(record.id);
                GetEnergyHistoryGraph(record.id);
              }}
            >
              {highlightText(record.name)} {/* Highlight the search term */}
            </div>
            <div>{highlightText(record.groupName)}</div>
          </td>
          <td className="px-2 py-1 text-center">{highlightText(record.kW)}</td>
          <td className="px-2 py-1 text-center">{highlightText(record.kWh)}</td>
          <td className="px-2 py-1 text-center">{highlightText(record.runningHour)}</td>
          <td className="px-2 py-1 text-center">
            <span
              className={`inline-block px-2 py-1 text-sm font-bold  ${record.status === "on"
                ? "text-[#12B981]"
                : record.status === "off"
                ? "text-[#9DA8B9]"
                : "text-[#FF3D4B]"
                }`}
            >
              {highlightText(record.status)} {/* Highlight the search term */}
            </span>
          </td>
          <td className="px-2 py-1 text-right">{highlightText(record.percentDimming)}</td>
          <td className="px-2 py-2 text-right text-balance">{highlightText(record.lastUpdated)}</td>
        </tr>
      );
    })
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
                  ref={devicedetailPopupRef}
                  device={selectedDevice}
                  setActiveTab={() => { setActiveTab("table"); setSelectedLocation(null); }}
                  onhandleOpenPopupconfirm={handleOpenModalconfirmControl}
                  OnsubmitControl={handlesubmitcontrol}

                  
                />

              </div>
            )}

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
                        new Date(new Date(startDate2).setDate(new Date(startDate2).getDate() + 365)).getTime() // 31 วันหลัง startDate2
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
              <BarChartComponent data={graphData2} type={timeUnit} />
            </div>
          </div>
          <SchedulePopup
            ref={schedulePopupRef}
            isOpen={openModalSchedule}
            onClose={() => {
              setopenModalSchedule(false);
              setScheduleData(null);
            }}
            scheduleData={scheduleData}
            deviceList={deviceForSchedule}
            onUpdateSchedule={UpdateSchedul}
            onHandleConfirm={handleOpenModalconfirm}
            groupId={scheduleData?.groupId}
            action={"update"}
            />
            
        </div>)}
      
      </div>
      
      {openModalconfirm && <ModalConfirm {...modalConfirmProps} />}
      {openModalfail && <ModalFail onCloseModal={handleClosePopup} />}
      {loading && <Loading/>}      
      <ToastContainer />
    </>
  );
};

export default Dashboard;
