"use client";
import { useState, useEffect, useMemo } from "react";

import StatisticsCard from "./StatisticsCard.js.js";
import dynamic from "next/dynamic";
const MapTH = dynamic(() => import("./MapSmSt.js"), { ssr: false });
import BarChartComponent from "./Barchart.js";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  getStationbyId,
  getStationsStatics,
  getStationHistoryStatistics,
  getChargeHeadList,
} from "@/utils/api";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import ChargeHeadModal from "./ModalCharghead.js";
import {
  setSiteName,
  setChargerId,
  setChargerName,
} from "@/redux/slicer/evchargerSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading.js";

const StationDetail = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const today = dayjs(); // ใช้สำหรับคำนวณและเปรียบเทียบ
  const todayFormatted = today.format("YYYY/MM/DD");
  const [opened, setOpened] = useState(false);
  const [station, setStation] = useState({});
  const [staticsToday, setStaticsToday] = useState({});
  const [staticsTotal, setStaticsTotal] = useState({});
  const [chargers, setChargers] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'days').format("YYYY/MM/DD"));
const [endDate, setEndDate] = useState(todayFormatted);
  const [timeUnit, setTimeUnit] = useState("hour");
  const [graphData, setGraphData] = useState();
  const [loading, setLoading] = useState(false);
  const [chargeHeadList, setChargeHeadList] = useState();
  const [mapZoomLevel, setMapZoomLevel] = useState(15);
  const [searchChargingQuery, setSearchChargingQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [chargingCurrentPage, setChargingCurrentPage] = useState(1);
  const [chargingRowsPerPage, setChargingRowsPerPage] = useState(20);
  const [chargingSortConfig, setChargingSortConfig] = useState({
    key: "device",
    direction: "asc",
  });
  const StationId = useSelector((state) => state.evchargerData.stationId);
  const StationName = useSelector((state) => state.evchargerData.stationName);
  const SiteName = useSelector((state) => state.evchargerData.siteName);
  console.log("StationName:", StationName);
  const OptionsTimeUnit = [
    { label: "Hour", value: "hour" },
    { label: "Day", value: "day" },
    { label: "Month", value: "month" },
  ];
  const GetStationbyId = async (id,showLoading = true) => {
    if (showLoading) setLoading(true); 
    try {
      const result = await getStationbyId(id);
      console.log("Station:", result);
      console.log("Chargers:", result.chargers);
      if (result) {
        setStation(result);
        setChargers(result.chargers);

        dispatch(setSiteName(result.siteName));
        localStorage.setItem("siteName", result.siteName);

        // ตั้งค่า selectedLocation ด้วย latitude และ longitude
        if (result.latitude && result.longitude) {
          setSelectedLocation({
            lat: result.latitude,
            lng: result.longitude,
          });
        }
      } else {
        console.log("No Stations found!");
      }
    } catch (error) {
      console.error("Error fetching station data:", error);
    }finally {
        if (showLoading) {
            setLoading(false);
            }
    }
  };
  const GetStationStatic = async (id) => {
    console.log("station Id:", id);
    try {
      const result = await getStationsStatics(id);
      console.log("Today:", result?.data?.today);
      console.log("Total:", result?.data?.total);
      if (result) {
        setStaticsToday(result?.data?.today);
        setStaticsTotal(result?.data?.total);
        // ตั้งค่า selectedLocation ด้วย latitude และ longitude
        if (result.latitude && result.longitude) {
          setSelectedLocation({
            lat: result.latitude,
            lng: result.longitude,
          });
        }
      } else {
        console.log("No Stations found!");
      }
    } catch (error) {
      console.error("Error fetching station data:", error);
    }
  };

  const GetStationHistoryStatistics = async (id) => {
    const Param = {
      stationId: id,
      groupBy: timeUnit,
      endDate: endDate,
      startDate: startDate,
    };
    try {
      const result = await getStationHistoryStatistics(Param);

      if (result) {
        setGraphData(result?.data);
        console.log("Graph Data:", result?.data);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  const getChageHeadList = async (id) => {
    console.log("Device Id:", id);
    try {
      const result = await getChargeHeadList(id);
      console.log("Group List Result:", result);

      if (result) {
        setChargeHeadList(result?.data);
        setOpened(true); // ✅ เก็บค่า status ของอุปกรณ์
      } else {
        console.log("No groups found!");
      }
    } catch (error) {
      console.error("Error fetching device data:", error);
    }
  };

  useEffect(() => {
    // ดึงข้อมูลจาก Local Storage

    if (StationId) {
      GetStationbyId(StationId);
      GetStationStatic(StationId);
    }
  }, []);

  useEffect(() => {
    if (StationId ) {
      GetStationHistoryStatistics(StationId);
    }
  }, [endDate, startDate, timeUnit,StationId]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("⏳ Refreshing data every 2 minutes from Redux...");
      Promise.all([GetStationbyId(StationId,false)]);
      GetStationStatic(StationId);
      GetStationHistoryStatistics(StationId);
    }, 300000);

    return () => clearInterval(interval);
  }, [StationId]);

  const handleChargerClick = (chargerId, chargerName) => {
    localStorage.setItem("chargerId", chargerId);
    localStorage.setItem("chargerName", chargerName);

    dispatch(setChargerId(chargerId));
    dispatch(setChargerName(chargerName));

    // router.push("/device/ev-charger?page=chargerdetail");
    onNavigate("chargerdetail");
  };

  const handleSearchChargingquery = (e) => {
    setSearchChargingQuery(e.target.value);
    setChargingCurrentPage(1);
  };
  const filteredChargingList = chargers
    ?.map((item, index) => ({ ...item, displayIndex: index + 1 })) // เพิ่มลำดับเลขให้แต่ละ item
    .filter(
      (item) =>
        item.name
          ?.toString()
          .toLowerCase()
          .includes(searchChargingQuery.toLowerCase()) ||
        item.brand
          ?.toString()
          .toLowerCase()
          .includes(searchChargingQuery.toLowerCase()) ||
        item.type
          ?.toString()
          .toLowerCase()
          .includes(searchChargingQuery.toLowerCase()) ||
        item.chargeHeadCount
          ?.toString()
          .toLowerCase()
          .includes(searchChargingQuery.toLowerCase()) ||
        item.displayIndex.toString().includes(searchChargingQuery)
    );

  const handleSortCharging = (column) => {
    let direction = "asc";
    if (
      chargingSortConfig.key === column &&
      chargingSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setChargingSortConfig({ key: column, direction });
  };

  // ข้อมูล charging session ที่ sort แล้ว
  const sortedChargingList = useMemo(() => {
    const sorted = [...filteredChargingList];
    sorted.sort((a, b) => {
      const valueA = a[chargingSortConfig.key];
      const valueB = b[chargingSortConfig.key];

      if (valueA < valueB)
        return chargingSortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB)
        return chargingSortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredChargingList, chargingSortConfig]);

  // Pagination สำหรับ charging
  const chargingIndexOfLastItem = chargingCurrentPage * chargingRowsPerPage;
  const chargingIndexOfFirstItem =
    chargingIndexOfLastItem - chargingRowsPerPage;
  const currentChargingData = sortedChargingList.slice(
    chargingIndexOfFirstItem,
    chargingIndexOfLastItem
  );
  const totalChargingPages = Math.ceil(
    filteredChargingList.length / chargingRowsPerPage
  );

  const handleChangeChargingPage = (page) => {
    setChargingCurrentPage(page);
  };

  const handleRowsPerChargingPageChange = (e) => {
    setChargingRowsPerPage(Number(e.target.value));
    setChargingCurrentPage(1);
  };

  const calculateDefaultDateRange = (groupBy) => {
    const today = dayjs(); // วันปัจจุบัน
    let startDate;

    switch (groupBy) {
      case "hour":
        startDate = today.subtract(7, "day"); // 7 วันก่อนหน้า
        break;
      case "day":
        startDate = today.subtract(1, "month"); // 1 เดือนก่อนหน้า
        break;
      case "month":
        startDate = today.subtract(1, "year"); // 1 ปีก่อนหน้า
        break;
      default:
        startDate = today.subtract(7, "day"); // ค่าเริ่มต้นเป็น 7 วันก่อนหน้า
    }

    return {
      startDate: startDate.format("YYYY/MM/DD"),
      endDate: today.format("YYYY/MM/DD"),
    };
  };

  const handleTimeUnitChange = (value) => {
    setTimeUnit(value);

    // คำนวณ Default Date Range ตาม Group by
    const { startDate, endDate } = calculateDefaultDateRange(value);
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const handleStartDateChange = (date) => {
    if (date) {
      setStartDate(date.format("YYYY/MM/DD")); // อัปเดต startDate
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      setEndDate(date.format("YYYY/MM/DD")); // อัปเดต endDate
    }
  };

  const maxEndDate1 = useMemo(() => {
    switch (timeUnit) {
      case "hour":
        return dayjs(); // กรณี Hour: ใช้วันปัจจุบัน
      case "day":
        return dayjs(); // กรณี Day: ใช้วันปัจจุบัน
      case "month":
        return dayjs(); // กรณี Month: ใช้วันปัจจุบัน
      default:
        return dayjs(); // ค่าเริ่มต้นเป็นวันปัจจุบัน
    }
  }, [timeUnit]);

  useEffect(() => {
    const { startDate, endDate } = calculateDefaultDateRange(timeUnit);
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const getDisplayTime = (open, close) => {
    if (open === null && close === null) return "Closed";
    if (open === "00:00" && close === "00:00") return "Open 24 hrs";
    return `${open} - ${close}`;
  };

  const days = [
    { label: "Mon", key: "mon" },
    { label: "Tue", key: "tue" },
    { label: "Wed", key: "wed" },
    { label: "Thu", key: "thu" },
    { label: "Fri", key: "fri" },
    { label: "Sat", key: "sat" },
    { label: "Sun", key: "sun" },
  ];

  const openingHours = useMemo(() => {
    return days.map(({ label, key }) => {
      const open = station?.[`${key}OpeningTime`];
      const close = station?.[`${key}ClosingTime`];
      const time = getDisplayTime(open, close);
      return { label, time };
    });
  }, [station]); // Recompute when station changes

  return (
    <div>
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
        <div className="flex items-center gap-4">
          <ArrowBackIosNewIcon
            style={{
              fontSize: "20px",
              color: "#33BFBF",
              cursor: "pointer",
              "&:hover": {
                color: "#2aa7a7",
              },
            }}
            onClick={() => onNavigate("dashboard")}
          />

          <div className="flex flex-col">
            <strong>{StationName}</strong>
            <span
              onClick={() => onNavigate("dashboard")}
              className="text-sm text-gray-500 hover:text-[#1aa7a7] hover:underline transition-colors duration-200 cursor-pointer"
            >
              {SiteName}
            </span>
          </div>
        </div>
      </div>

      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
        <span className="text-lg font-bold block mb-2">
          Station Information
        </span>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-[450px]">
            <div className="flex justify-center w-full h-[500px] justify-items-center overflow-hidden mt-5 mb-7">
              <MapTH
                locationList={
                  station && station.latitude && station.longitude
                    ? [
                        {
                          id: station.id,
                          name: station.name,
                          status: station.status,
                          lat: station.latitude, // ใช้ latitude จาก station
                          lng: station.longitude, // ใช้ longitude จาก station
                          siteName: station.siteName,
                        },
                      ]
                    : [] // ถ้าไม่มีข้อมูล ให้ส่งอาร์เรย์ว่าง
                }
                className={"w-full h-[500px] justify-items-center"}
                zoom={mapZoomLevel}
                selectedLocation={selectedLocation} // ใช้ selectedLocation เพื่อแสดงตำแหน่งที่เลือก
                setSelectedLocation={setSelectedLocation}
              />
            </div>
          </div>

          <div className="w-full lg:w-60 flex-1">
            <div className="flex-1 ml-6">
              <table className="w-full mt-5 text-sm">
                <tbody>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Station Name</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.name}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Description</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.description}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Brand Name</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.brand}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Currency</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.currency}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Station Status</strong>
                    </td>
                    <td
                      className={`px-4 py-2 font-bold ${
                        station?.status === "open"
                          ? "text-[#12B981]"
                          : "text-[#FF3D4B]"
                      }`}
                    >
                      {station?.status}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Address</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.address}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Country</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.country}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Province</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.province}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Postal Code</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.postalCode}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Latitude / Longitude</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.latitude},{station?.longitude}
                    </td>
                  </tr>
                  <tr className="text-xs border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] align-top dark:bg-gray-900 dark:text-white">
                      <strong>Opening Hours</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {openingHours.map(({ label, time }) => (
                        <div className="flex items-center gap-2" key={label}>
                          <span className="w-10">{label}</span>{" "}
                          {/* กำหนดขนาดของวันให้เล็กลง */}
                          <span className="ml-2">{time}</span>{" "}
                          {/* ลดระยะห่างระหว่างวันและเวลา */}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
        <div>
          <span className="text-lg font-bold block mb-2">
            Charger Information
          </span>
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-60 flex-1">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold">
                  {chargers.length} Chargers
                </span>
                <input
                  type="text"
                  placeholder="ค้นหา"
                  value={searchChargingQuery}
                  onChange={handleSearchChargingquery}
                  className="border border-gray-300 p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                />
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="min-w-full table-auto text-sm">
                  <thead>
                    <tr className="text-xs text-black border-b border-gray-300 dark:text-white">
                      <th
                        className="px-2 py-1 text-right cursor-pointer"
                        onClick={() => handleSortCharging("displayIndex")}
                      >
                        #
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
                                chargingSortConfig.key === "displayIndex" &&
                                chargingSortConfig.direction === "asc"
                                  ? 1
                                  : 0.3,
                              marginBottom: "-2px", // ลดช่องว่างระหว่างลูกศร
                            }}
                          />
                          <ArrowDropDownIcon
                            style={{
                              fontSize: "14px",
                              opacity:
                                chargingSortConfig.key === "displayIndex" &&
                                chargingSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px", // ลดช่องว่างระหว่างลูกศร
                            }}
                          />
                        </div>
                      </th>
                      <th
                        className="px-2 py-1 text-left"
                        onClick={() => handleSortCharging("name")}
                      >
                        Name
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
                                chargingSortConfig.key === "name" &&
                                chargingSortConfig.direction === "asc"
                                  ? 1
                                  : 0.3,
                              marginBottom: "-2px",
                            }}
                          />
                          <ArrowDropDownIcon
                            style={{
                              fontSize: "14px",
                              opacity:
                                chargingSortConfig.key === "name" &&
                                chargingSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px",
                            }}
                          />
                        </div>
                      </th>
                      <th
                        className="px-2 py-1 text-left"
                        onClick={() => handleSortCharging("brand")}
                      >
                        Brand
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
                                chargingSortConfig.key === "brand" &&
                                chargingSortConfig.direction === "asc"
                                  ? 1
                                  : 0.3,
                              marginBottom: "-2px",
                            }}
                          />
                          <ArrowDropDownIcon
                            style={{
                              fontSize: "14px",
                              opacity:
                                chargingSortConfig.key === "brand" &&
                                chargingSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px",
                            }}
                          />
                        </div>
                      </th>
                      <th
                        className="px-2 py-1 text-left"
                        onClick={() => handleSortCharging("type")}
                      >
                        Type
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
                                chargingSortConfig.key === "type" &&
                                chargingSortConfig.direction === "asc"
                                  ? 1
                                  : 0.3,
                              marginBottom: "-2px",
                            }}
                          />
                          <ArrowDropDownIcon
                            style={{
                              fontSize: "14px",
                              opacity:
                                chargingSortConfig.key === "type" &&
                                chargingSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px",
                            }}
                          />
                        </div>
                      </th>
                      <th
                        className="px-2 py-1 text-center"
                        onClick={() => handleSortCharging("chargeHeadCount")}
                      >
                        Count of Charge Head
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
                                chargingSortConfig.key === "chargeHeadCount" &&
                                chargingSortConfig.direction === "asc"
                                  ? 1
                                  : 0.3,
                              marginBottom: "-2px",
                            }}
                          />
                          <ArrowDropDownIcon
                            style={{
                              fontSize: "14px",
                              opacity:
                                chargingSortConfig.key === "chargeHeadCount" &&
                                chargingSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px",
                            }}
                          />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentChargingData.length === 0 ? (
                      <tr>
                        <td
                          colSpan="10"
                          className="px-2 py-4 text-center text-gray-500 dark:text-gray-400"
                        >
                          Charging Session History not found
                        </td>
                      </tr>
                    ) : (
                      currentChargingData.map((record, index) => {
                        const highlightText = (text) => {
                          if (!text || !searchChargingQuery) return text; // ถ้าไม่มีข้อความหรือ searchQuery ให้คืนค่าข้อความเดิม
                          const textString = String(text); // แปลงข้อความเป็น string
                          const parts = textString.split(
                            new RegExp(`(${searchChargingQuery})`, "gi")
                          ); // แยกข้อความตาม searchQuery
                          return parts.map((part, i) =>
                            part.toLowerCase() ===
                            searchChargingQuery.toLowerCase() ? (
                              <span
                                key={i}
                                className="bg-yellow-300 dark:bg-yellow-300"
                              >
                                {part}
                              </span>
                            ) : (
                              part
                            )
                          );
                        };
                        return (
                          <tr
                            key={record.id || record.displayIndex} // ใช้ record.id หรือ displayIndex เป็น key
                            className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              record.displayIndex % 2 === 0
                                ? "bg-white dark:bg-gray-800"
                                : "bg-gray-100 dark:bg-gray-900"
                            }`}
                            style={{ borderBottom: "1px solid #e0e0e0" }}
                          >
                            <td className="px-2 py-1 text-right dark:text-white">
                              {highlightText(record.displayIndex)}
                            </td>
                            <td
                              className="px-2 py-1 text-left text-[#33BFBF] underline cursor-pointer hover:text-[#28A9A9] dark:text-[#33BFBF] dark:hover:text-[#28A9A9]"
                              onClick={() => {
                                handleChargerClick(record.id, record.name);
                              }}
                            >
                              {highlightText(record.name)}
                            </td>
                            <td className="px-2 py-1 text-left dark:text-white">
                              {highlightText(record.brand)}
                            </td>
                            <td className="px-2 py-1 text-left dark:text-white">
                              {highlightText(record.type)}
                            </td>
                            <td
                              className="px-2 py-1 text-center text-[#33BFBF] underline cursor-pointer hover:text-[#28A9A9] dark:text-[#33BFBF] dark:hover:text-[#28A9A9]"
                              onClick={() => getChageHeadList(record.id)}
                            >
                              {highlightText(record.chargeHeadCount)}
                            </td>
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
                    value={chargingRowsPerPage}
                    onChange={handleRowsPerChargingPageChange}
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
                    onClick={() =>
                      handleChangeChargingPage(chargingCurrentPage - 1)
                    }
                    disabled={chargingCurrentPage === 1}
                    className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
                  >
                    <ArrowBackIosNewIcon style={{ fontSize: "12px" }} />
                  </button>
                  <span className="text-sm">
                    {chargingCurrentPage} / {totalChargingPages}
                  </span>
                  <button
                    onClick={() =>
                      handleChangeChargingPage(chargingCurrentPage + 1)
                    }
                    disabled={
                      chargingCurrentPage === totalChargingPages ||
                      filteredChargingList.length === 0
                    }
                    className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
                  >
                    <ArrowForwardIosOutlinedIcon style={{ fontSize: "12px" }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-3 mt-3">
        <div className="bg-white rounded-2xl flex w-full max-w-6xl overflow-hidden">
          <StatisticsCard
            title="Today Statistics"
            sessions={staticsToday?.sessionCount}
            kwh={staticsToday?.electricityAmount}
            revenue={staticsToday?.revenue}
          />
        </div>
        <div className="bg-white rounded-2xl flex w-full max-w-6xl overflow-hidden">
          <StatisticsCard
            title="Total Statistics"
            sessions={staticsTotal?.sessionCount}
            kwh={staticsTotal?.electricityAmount}
            revenue={staticsTotal?.revenue}
          />
        </div>
      </div>
      <div className="grid rounded-xl bg-white p-6 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
        <div>
          <span className="text-lg font-bold block mb-2">Statistics</span>

          <div className="flex justify-between items-center mb-2 mt-5">
            <div className="flex items-center gap-2">
              <span className="text-sm">Group by:</span>
              <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
  {OptionsTimeUnit.map((option) => (
    <button
      key={option.value}
      onClick={() => handleTimeUnitChange(option.value)}
      className={`px-4 py-1 rounded-md text-sm font-medium ${
        timeUnit === option.value
          ? "bg-white dark:bg-gray-600 shadow text-black dark:text-white"
          : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
      }`}
    >
      {option.label}
    </button>
  ))}
</div>

            </div>
            <div className="flex gap-2 mt-5 items-center">
              <span className="text-sm">Date :</span>
              <DatePicker
                className="w-48 p-2 bg-white border shadow-default 
          dark:border-slate-300 dark:bg-[#121212] dark:text-slate-200"
                value={startDate ? dayjs(startDate, "YYYY/MM/DD") : null}
                onChange={handleStartDateChange}
                disabledDate={(current) => current && current > today} // ห้ามเลือกวันในอนาคต
                format="YYYY/MM/DD"
                allowClear={false}
              />
              <p>-</p>
              <DatePicker
                className="w-48 p-2 bg-white border shadow-default 
          dark:border-slate-300 dark:bg-[#121212] dark:text-slate-200"
                value={endDate ? dayjs(endDate, "YYYY/MM/DD") : null}
                onChange={handleEndDateChange}
                format="YYYY/MM/DD"
                min={startDate ? dayjs(startDate, "YYYY/MM/DD") : null} // กำหนดวันที่เริ่มต้น
                max={maxEndDate1} // กำหนดวันที่สิ้นสุด
                disabledDate={(current) => {
                  return (
                    current &&
                    (current.isBefore(dayjs(startDate, "YYYY/MM/DD"), "day") || // น้อยกว่า startDate
                      current.isAfter(dayjs(maxEndDate1, "YYYY/MM/DD"), "day")) // มากกว่า maxEndDate1
                  );
                }}
                allowClear={false}
              />
            </div>
          </div>

          <div className="mt-5">
            <BarChartComponent
              data={graphData}
              type="hour"
              timestampKey="timestamp"
              valueKeys={["session"]}
              yAxisLabel="Sessions"
              legendLabels={{
                session: "Session",
              }}
              decimalPlaces={0} 
            />
          </div>
          <div className="mt-5">
            <BarChartComponent
              data={graphData}
              type="hour"
              timestampKey="timestamp"
              valueKeys={["electricityAmount"]}
              yAxisLabel="Energy (kWh)"
              legendLabels={{
                electricityAmount: "Energy",
              }}
              decimalPlaces={2} 
            />
          </div>
          <div className="mt-5">
            <BarChartComponent
              data={graphData}
              type="hour"
              timestampKey="timestamp"
              valueKeys={["revenue"]}
              yAxisLabel="Revenue"
              legendLabels={{
                revenue: "Revenue",
              }}
              decimalPlaces={2} 
            />
          </div>
        </div>
      </div>
      <ChargeHeadModal
        opened={opened}
        onClose={() => setOpened(false)}
        chargers={chargeHeadList}
      />
      {loading && <Loading />}
    </div>
  );
};

export default StationDetail;
