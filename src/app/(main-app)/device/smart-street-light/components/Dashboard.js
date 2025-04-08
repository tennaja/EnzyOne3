import React, { useState, useMemo, useEffect, useRef } from "react";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeviceDetail from "./DeviceDetail";
import MapTH from "./MapSmSt";
import CreateIcon from '@mui/icons-material/Create';
import {
  getDeviceListData, getDevicebyId, getHistoryGraphDataa, getEnergyHistoryGraphDataa, getSchedulebyid, putUpdateSchedule, DeviceControl
} from "@/utils/api";

import { useDispatch, useSelector } from "react-redux";
import {
  setDeviceById
} from "@/redux/slicer/smartstreetlightSlice"
import MyChart from "./Chart1";
import SchedulePopup from "./Popupchedule";
import BarChartComponent from "./Barchart";
import ModalConfirm from "./Popupconfirm";
import ModalDone from "./Popupcomplete";
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import dayjs from "dayjs";
import ModalFail from "./PopupFali";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "./Loading";
const Dashboard = ({ deviceData, FetchDevice, Sitename, Groupname }) => {
  const dispatch = useDispatch();

  const today = dayjs(); // ใช้สำหรับคำนวณและเปรียบเทียบ
const todayFormatted = today.format('YYYY/MM/DD');

  const [activeTab, setActiveTab] = useState("table");
  const [devcielist, setDevicelist] = useState([]);
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
  const [deviceForSchedule, setDeviceforSchedule] = useState([])
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
        console.log("Device List Result:", result.data);
        setDevicelist(result.data);
      } else {
        setDevicelist([]);
      }
    } catch (error) {
      console.error("Error fetching device list:", error);
    } finally {
      if (showLoading) {
        setTimeout(() => setLoading(false), 1000);
      }
    }
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  function toSuperscript(num) {
    const superscripts = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³',
        '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷',
        '8': '⁸', '9': '⁹', '+': '⁺'
    };
    return num.split('').map(char => superscripts[char] || char).join('');
}

function transformTimeFormat(input) {
    return input.replace(/\((\+(\d+))\)/, (_, exp, num) => toSuperscript(exp));
}


const filteredData = devcielist.filter((item) => {
  const name = item.name?.toString().toLowerCase();
  const kW = item.kW?.toString().toLowerCase();
  const kWh = item.kWh?.toString().toLowerCase();
  const percentDimming = item.percentDimming?.toString().toLowerCase();
  const runningHour = item.runningHour?.toString().toLowerCase();
  const status = item.status?.toString().toLowerCase();
  const lastUpdated = item.lastUpdated?.toLowerCase();
  const groupName = item.groupName?.toString().toLowerCase();
  const siteName = item.siteName?.toString().toLowerCase();
  
  const query = searchQuery.toLowerCase();
  
  // รวม groupName และ siteName เพื่อค้นหาคำที่มีเครื่องหมาย '-'
  const combinedName = `${siteName} - ${groupName}`.toLowerCase();

  return (
    name?.includes(query) ||
    kW?.includes(query) ||
    kWh?.includes(query) ||
    percentDimming?.includes(query) ||
    runningHour?.includes(query) ||
    status?.includes(query) ||
    lastUpdated?.includes(query) ||
    combinedName.includes(query) // ค้นหาใน combinedName ที่รวมเครื่องหมาย '-'
  );
});





  useEffect(() => {
    // รีเซ็ต sortConfig เมื่อ devcielist เปลี่ยนแปลง
    setSortConfig({ key: "device", direction: "asc" });
  }, [devcielist]); // ฟังการเปลี่ยนแปลงของ devcielist

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
      setStartDate(today)
      setEndDate(today)
      setStartDate2(today)
      setEndDate2(today)
      setTimeUnit("hour")
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

  const getMaxEndDate1 = (selectedStartDate) => {
    if (!selectedStartDate) return dayjs(); // ถ้าไม่มี startDate, ใช้วันนี้
  
    const maxByStartDate = dayjs(selectedStartDate).add(31, "day");
    return dayjs(Math.min(maxByStartDate.valueOf(), dayjs().valueOf())); // ใช้ valueOf() เพื่อแปลงเป็น timestamp แล้วใช้ Math.min
  };
  
 // ฟังก์ชันอัปเดต startDate
const handleStartDateChange = (date, dateString) => {
  if (!date) {
    setStartDate(null);
    return;
  }

  setStartDate(dateString);

  // คำนวณ maxEndDate1 ใหม่ตาม startDate
  const newMaxEndDate1 = getMaxEndDate1(dateString);

  // ถ้า endDate มีอยู่แล้ว และเกิน maxEndDate1 → อัปเดต endDate ใหม่
  if (endDate && dayjs(endDate).isAfter(newMaxEndDate1)) {
    setEndDate(newMaxEndDate1.format("YYYY/MM/DD"));
  }
};

// ฟังก์ชันอัปเดต endDate
const handleEndDateChange = (date, dateString) => {
  if (!date) {
    setEndDate(null);
    return;
  }

  setEndDate(dateString);

  // ถ้าเลือก endDate ก่อน startDate → อัปเดต startDate ให้เป็น 31 วันก่อนหน้า
  if (!startDate) {
    setStartDate(dayjs(date).subtract(31, "day").format("YYYY/MM/DD"));
  }
};

// คำนวณ maxEndDate1 ตาม startDate
const maxEndDate1 = getMaxEndDate1(startDate);



// ฟังก์ชันคำนวณ maxEndDate ที่ไม่เกิน 365 วันจาก startDate2 หรือวันนี้
const getMaxEndDate = (startDate2) => {
  const today = dayjs(); // วันปัจจุบัน
  const maxByStartDate2 = dayjs(startDate2).add(365, "day"); // 365 วันหลังจาก startDate2

  // ใช้ Math.min เพื่อเลือกค่าน้อยที่สุดระหว่าง maxByStartDate2 หรือวันนี้
  const maxDate = Math.min(maxByStartDate2.valueOf(), today.valueOf()); // ใช้ valueOf() เพื่อแปลงเป็น timestamp
  return dayjs(maxDate); // แปลง timestamp กลับเป็น dayjs object
};

// ฟังก์ชันอัปเดต startDate2
const handleStartDateChangeHistorical2 = (date, dateString) => {
  if (!date) return;

  setStartDate2(dateString);

  // คำนวณ maxEndDate ใหม่จาก startDate2
  const newMaxEndDate = getMaxEndDate(dateString);

  // ถ้า endDate2 มีอยู่แล้ว และเกิน maxEndDate → อัปเดตใหม่
  if (endDate2 && dayjs(endDate2).isAfter(newMaxEndDate)) {
    setEndDate2(newMaxEndDate.format("YYYY/MM/DD"));
  }
};

// ฟังก์ชันอัปเดต endDate2
const handleEndDateChangeHistorical2 = (date, dateString) => {
  if (!date) return;

  setEndDate2(dateString);

  // ถ้าเลือก endDate2 ก่อน startDate2 → จำกัด startDate2 ไม่ให้เกิน 365 วันก่อนหน้า
  if (!startDate2) {
    setStartDate2(dayjs(date).subtract(365, "day").format("YYYY/MM/DD"));
  }
};

// คำนวณ maxEndDate ตาม startDate2
const maxEndDate = getMaxEndDate(startDate2); // ใช้ฟังก์ชัน getMaxEndDate เพื่อคำนวณ maxEndDate

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
      notifySuccess(res?.data?.title, res?.data?.message);
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
  const handleOpenModalconfirmControl = (name, status, dimming) => {
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
    setSortConfig({}); 
  }, [deviceData]); 

 
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
                  <table className="min-w-full rounded-lg border-t border-gray-300 text-sm">
                    <tbody>
                      {selectedDevice?.schedules?.map((schedule, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} border-b border-gray-300`}>
                          <td className="py-2 px-4">
                            <div className="font-bold text-gray-900 dark:text-white">{schedule.name}</div>
                            <div className="font-bold text-gray-900 dark:text-white">{schedule.percentDimming}% Dimming</div>
                            <div className="font-bold text-gray-900 dark:text-white">
                            <div className="flex flex-col">
  {schedule?.repeat === "once" ? (
  <>
    <span>Start: {schedule?.executionDateTime}</span>
    <span>Stop: {schedule?.executionEndDateTime}</span>
  </>
) : (
  <>
    <span>{schedule?.customDate}</span>
    <span>
      {schedule?.startTime && schedule?.endTime
        ? `${schedule.startTime} - ${transformTimeFormat(schedule.endTime)}`
        : "ยังไม่ได้กำหนด"}
    </span>
  </>
)}

  </div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{schedule.repeat}</div>
                          </td>

                          <td className="py-2 px-4">
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100" onClick={() => {
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
                      <tr className="text-xs text-black border-b border-gray-300 dark:text-white">
                        <th
                          className="px-2 py-1 text-left cursor-pointer"
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
                          className="px-2 py-1 text-right cursor-pointer"
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
                          className="px-2 py-1 text-right cursor-pointer"
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
                          className="px-2 py-1 text-right cursor-pointer"
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

                        <th className="px-2 py-1 text-center" onClick={() => handleSort("status")}>
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

                        <th className="px-2 py-1 text-right" onClick={() => handleSort("percentDimming")}>
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

                        <th className="px-2 py-1 text-right" onClick={() => handleSort("lastUpdated")}>
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
                          <td colSpan="7" className="px-2 py-4 text-center text-gray-500 dark:text-gray-400">Device not found</td>
                        </tr>
                      ) : (
                        currentData.map((record, index) => {
                          const highlightText = (text) => {
                            if (!text || !searchQuery) return text; // ถ้าไม่มี searchQuery หรือไม่มีข้อความจะไม่ไฮไลต์
                          
                            const textString = String(text); // แปลงข้อความเป็น string หากยังไม่ใช่ string
                          
                            // ตรวจสอบว่า searchQuery มีอยู่ในข้อความหรือไม่
                            if (!textString.toLowerCase().includes(searchQuery.toLowerCase())) {
                              return textString; // ถ้าไม่มี searchQuery ในข้อความ ให้คืนค่าข้อความเดิม
                            }
                          
                            // แยกข้อความด้วย searchQuery
                            const parts = textString.split(new RegExp(`(${searchQuery})`, 'gi'));
                          
                            // วนลูปส่วนที่แยกออกมาและไฮไลต์เฉพาะ searchQuery
                            return parts.map((part, i) => {
                              if (part.toLowerCase() === searchQuery.toLowerCase()) {
                                // ไฮไลต์เฉพาะส่วนที่ตรงกับ searchQuery
                                return <span key={i} className="bg-yellow-300 dark:bg-yellow-300">{part}</span>;
                              }
                              return part; // คืนค่าข้อความส่วนที่เหลือโดยไม่ไฮไลต์
                            });
                          };
                          
                          return (
                            <tr
                              key={record.id}
                              className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}`}
                              style={{ borderBottom: '1px solid #e0e0e0' }}
                            >
                              <td className="px-2 py-1 text-left">
                                <div
                                  className="text-[#33BFBF] underline cursor-pointer hover:text-[#28A9A9] dark:text-[#33BFBF] dark:hover:text-[#28A9A9] text-base mb-1"
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
                                <div className="flex dark:text-white space-x-2">
  <div>{highlightText(`${record.siteName} - ${record.groupName}`)}</div>
</div>




                              </td>
                              <td className="px-2 py-1 text-right dark:text-white">{highlightText(record.kW)}</td>
                              <td className="px-2 py-1 text-right dark:text-white">{highlightText(record.kWh)}</td>
                              <td className="px-2 py-1 text-right dark:text-white">{highlightText(record.runningHour)}</td>
                              <td className="px-2 py-1 text-center">
                                <span
                                  className={`inline-block px-2 py-1 text-sm font-bold ${record.status === "on"
                                    ? "text-[#12B981] dark:text-[#12B981]"
                                    : record.status === "off"
                                      ? "text-[#9DA8B9] dark:text-[#9DA8B9]"
                                      : "text-[#FF3D4B] dark:text-[#FF3D4B]"
                                    }`}
                                >
                                  {highlightText(record.status)} {/* Highlight the search term */}
                                </span>
                              </td>
                              <td className="px-2 py-1 text-right dark:text-white">{highlightText(record.percentDimming)}</td>
                              <td className="px-2 py-2 text-right text-balance dark:text-white">{highlightText(record.lastUpdated)}</td>
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
                      disabled={currentPage === totalPages || filteredData.length === 0}
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
                <DatePicker
                  className="w-60 p-2 bg-white border shadow-default 
        dark:border-slate-300 dark:bg-[#121212] dark:text-slate-200"
                  value={startDate ? dayjs(startDate, "YYYY/MM/DD") : null}
                  onChange={handleStartDateChange}
                  disabledDate={(current) => current && current > today} // ห้ามเลือกวันในอนาคต
                  format="YYYY/MM/DD"
                  allowClear={false}
                />

                {/* DatePicker สำหรับ End Date */}
                <DatePicker
                className="w-60 p-2 bg-white border shadow-default 
        dark:border-slate-300 dark:bg-[#121212] dark:text-slate-200"
  value={endDate ? dayjs(endDate, "YYYY/MM/DD") : null}
  onChange={handleEndDateChange}
  format="YYYY/MM/DD"
  min={startDate ? dayjs(startDate, "YYYY/MM/DD") : null}
  max={maxEndDate1}
  disabledDate={(current) =>
    current &&
    (
      current < dayjs(startDate, "YYYY/MM/DD") || // น้อยกว่า startDate
      current > maxEndDate1 // มากกว่า 31 วันหลัง startDate หรือวันนี้
    )
  }
  allowClear={false}
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
                <DatePicker
                  className="w-60 p-2 bg-white border shadow-default 
        dark:border-slate-300 dark:bg-[#121212] dark:text-slate-200"
                  value={startDate2 ? dayjs(startDate2, "YYYY/MM/DD") : null}
                  onChange={handleStartDateChangeHistorical2}
                  disabledDate={(current) => current && current > today} // ห้ามเลือกวันในอนาคต
                  format="YYYY/MM/DD"
                  allowClear={false}
                />

                {/* DatePicker สำหรับ End Date */}
                <DatePicker
                  className="w-60 p-2 bg-white border shadow-default 
        dark:border-slate-300 dark:bg-[#121212] dark:text-slate-200"
                  value={endDate2 ? dayjs(endDate2, "YYYY/MM/DD") : null}
                  onChange={handleEndDateChangeHistorical2}
                  format="YYYY/MM/DD"
                  min={startDate2 ? dayjs(startDate2, "YYYY/MM/DD") : null} // min = startDate2
                  max={maxEndDate} // max = 365 วันหลังจาก startDate2 หรือวันนี้
                  disabledDate={(current) =>
                    current && (current < dayjs(startDate2, "YYYY/MM/DD") || current > maxEndDate)
                  }
                  allowClear={false}
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
      {openModalfail && <ModalFail {...modalErrorProps} />}
      {loading && <Loading />}
      <ToastContainer />
    </>
  );
};

export default Dashboard;
