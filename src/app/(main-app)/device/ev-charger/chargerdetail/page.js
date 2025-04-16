"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatisticsCard from "../component/StatisticsCard.js";
import dynamic from "next/dynamic";
const MapTH = dynamic(() => import("../component/MapSmSt"), { ssr: false });
import BarChartComponent from "../component/Barchart.js";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getChargerbyId, getChargersStatics, getChargerHistoryStatistics} from "@/utils/api";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const ChargerDetail = () => {
  const router = useRouter();
  const today = dayjs(); // ใช้สำหรับคำนวณและเปรียบเทียบ
  const todayFormatted = today.format("YYYY/MM/DD");
  const [chargerId, setChargerId] = useState('');
  const [chargerName, setChargerName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [stationName, setStationName] = useState('');
  const [station, setStation] = useState({});
  const [staticsToday, setStaticsToday] = useState({});
  const [staticsTotal, setStaticsTotal] = useState({});
  const [chargersHead, setChargersHead] = useState([]);
  const [startDate, setStartDate] = useState(todayFormatted);
  const [endDate, setEndDate] = useState(todayFormatted);
  const [timeUnit, setTimeUnit] = useState("hour");
  const [graphData, setGraphData] = useState();
  const [mapZoomLevel, setMapZoomLevel] = useState(15);
  const [searchChargingQuery, setSearchChargingQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [chargingCurrentPage, setChargingCurrentPage] = useState(1);
  const [chargingRowsPerPage, setChargingRowsPerPage] = useState(20);
  const [chargingSortConfig, setChargingSortConfig] = useState({
    key: "device",
    direction: "asc",
  });
  const OptionsTimeUnit = [
    { label: "Hour", value: "hour" },
    { label: "Day", value: "day" },
    { label: "Month", value: "month" },
  ];

  const handleChargerHeadClick = (chargerHeadId, chargerHeadName) => {
    localStorage.setItem('chargerHeadId', chargerHeadId);
    localStorage.setItem('chargerHeadName', chargerHeadName); // เก็บชื่อของ Charger Head
    router.push('chargerheaddetail');
  };

    const GetStationbyId = async (id) => {
      console.log("station Id:", id);
      try {
        const result = await getChargerbyId(id);
        console.log("Station:", result);
        console.log("Chargers:", result.chargers);
        if (result) {
          setStation(result);
          setChargersHead(result.chargeHeads);
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
    const GetStationStatic = async (id) => {
      console.log("station Id:", id);
      try {
        const result = await getChargersStatics(id);
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
  
    const GetChargerHistoryStatistics = async (id) => {
      const Param = {
        chargerId: id,
        groupBy: timeUnit,
        endDate: endDate,
        startDate: startDate,
      };
      try {
        const result = await getChargerHistoryStatistics(Param)
        if (result) {
          setGraphData(result?.data);
          console.log("Graph Data:", result?.data);
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };
  
    useEffect(() => {
      // ดึงข้อมูลจาก Local Storage
      if (typeof window !== "undefined") {
        const storedSiteName = localStorage.getItem("siteName");
        const storedChargerId = localStorage.getItem("chargerId");
        const storedChargerName = localStorage.getItem("chargerName");
        const storedStationName = localStorage.getItem("stationName");

        if (storedSiteName) setSiteName(storedSiteName);
        if (storedChargerId) setChargerId(storedChargerId);
        if (storedStationName) setStationName(storedStationName);
        if (storedChargerName) setChargerName(storedChargerName);
        if (storedChargerId) {
          GetStationbyId(storedChargerId);
          GetStationStatic(storedChargerId);
        }
      }
    }, []);
  
    useEffect(() => {
      const storedChargerId = localStorage.getItem("chargerId");
        if (storedChargerId) {
          GetChargerHistoryStatistics(storedChargerId)
        }
      }, [endDate, startDate, timeUnit]);
  
    const handleChargerClick = (chargerId, chargerName) => {
      localStorage.setItem("chargerId", chargerId);
      localStorage.setItem("chargerName", chargerName);
      router.push("chargerdetail");
    };
  
    const handleSearchChargingquery = (e) => {
      setSearchChargingQuery(e.target.value);
    };
    const filteredChargingList = chargersHead
      ?.map((item, index) => ({ ...item, displayIndex: index + 1 })) // เพิ่มลำดับเลขให้แต่ละ item
      .filter(
        (item) =>
          item.name
            ?.toString()
            .toLowerCase()
            .includes(searchChargingQuery.toLowerCase()) ||
          item.connectorType
            ?.toString()
            .toLowerCase()
            .includes(searchChargingQuery.toLowerCase()) ||
          item.powerRating
            ?.toString()
            .toLowerCase()
            .includes(searchChargingQuery.toLowerCase()) ||
          item.reservable
            ?.toString()
            .toLowerCase()
            .includes(searchChargingQuery.toLowerCase()) ||
          item.chargeBoxMapping
            ?.toString()
            .toLowerCase()
            .includes(searchChargingQuery.toLowerCase()) ||
          item.status
            ?.toString()
            .toLowerCase()
            .includes(searchChargingQuery.toLowerCase()) ||
          item.currentCharging
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
  
    const handleTimeUnitChange = (value) => {
      setTimeUnit(value);
    };
    
  
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
            onClick={() => router.push("stationdetail")}
          />

          <div className="flex flex-col">
            <strong>{chargerName}</strong>
            <div className="flex items-center space-x-1 gap-1">
  <Link href={'./'} className="text-sm text-gray-500 hover:text-[#1aa7a7] hover:underline transition-colors duration-200">
    {siteName}
  </Link>
  <span>/</span>
  <Link href={'stationdetail'} className="text-sm text-gray-500 hover:text-[#1aa7a7] hover:underline transition-colors duration-200">
    {stationName}
  </Link>
</div>

          </div>
        </div>
      </div>

      {/* Charger Head Table */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
        <span className="text-lg font-bold block mb-2">
        Charger Information
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
                      <strong>Charger Name</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.name}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Brand Name</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.brandName}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Charger Type</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.type}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Power Type</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.powerType}</td>
                  </tr>
                  {/* <tr className="text-xs  border-b border-gray-200">
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
                  </tr> */}
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Charger Price (per kWh)</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.price}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>SimultaneousCharging</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.simultaneousCharge}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>StationName</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.stationName}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Latitude / Longitude</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.latitude},{station?.longitude}
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
            Charge Head Information
          </span>
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-60 flex-1">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold">
                  {chargersHead.length} Chargers
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
                        className="px-2 py-1 text-left cursor-pointer"
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
                        className="px-2 py-1 text-center"
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
                        className="px-2 py-1 text-center"
                        onClick={() => handleSortCharging("connectorType")}
                      >
                        Connector Type
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
                                chargingSortConfig.key === "connectorType" &&
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
                                chargingSortConfig.key === "connectorType" &&
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
                        onClick={() => handleSortCharging("powerRating")}
                      >
                        Power Rating
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
                                chargingSortConfig.key === "powerRating" &&
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
                                chargingSortConfig.key === "powerRating" &&
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
                        onClick={() => handleSortCharging("reservable")}
                      >
                        Reservable
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
                                chargingSortConfig.key === "reservable" &&
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
                                chargingSortConfig.key === "reservable" &&
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
                        onClick={() => handleSortCharging("chargeBoxMapping")}
                      >
                        ChargeBox Mapping
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
                                chargingSortConfig.key === "chargeBoxMapping" &&
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
                                chargingSortConfig.key === "chargeBoxMapping" &&
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
                        onClick={() => handleSortCharging("status")}
                      >
                        Status
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
                                chargingSortConfig.key === "status" &&
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
                                chargingSortConfig.key === "status" &&
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
                        onClick={() => handleSortCharging("currentCharging")}
                      >
                        Current EV Charging
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
                                chargingSortConfig.key === "currentCharging" &&
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
                                chargingSortConfig.key === "currentCharging" &&
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
                            <td className="px-2 py-1 text-left dark:text-white">
                              {highlightText(record.displayIndex)}
                            </td>
                            <td className="px-2 py-1 text-center text-[#33BFBF] underline cursor-pointer hover:text-[#28A9A9] dark:text-[#33BFBF] dark:hover:text-[#28A9A9]"
                            onClick={() => {
                              handleChargerHeadClick(record.id, record.name);
                            }}>
                              {highlightText(record.name)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.connectorType)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.powerRating)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.reservable)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.chargeBoxMapping)}
                            </td>
                            <td
  className="px-2 py-1 text-center font-bold"
  style={{
    color:
      record?.status === 'available' ? '#12B981' :
      record?.status === 'charging' ? '#259AE6' :
      record?.status === 'out of Order' ? '#DF4667' :
      record?.status === 'reserved' ? '#9747FF' :
      record?.status === 'maintenance' ? '#8A99AF' :
      'black'
  }}
>
  {highlightText(record?.status)}
</td>

                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.currentCharging ?? "-")}
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
              <div className="inline-flex items-center bg-gray-100 rounded-md p-1">
      {OptionsTimeUnit.map((option) => (
        <button
          key={option.value}
          onClick={() => handleTimeUnitChange(option.value)}
          className={`px-4 py-1 rounded-md text-sm font-medium ${
            timeUnit === option.value
              ? "bg-white shadow text-black"
              : "text-gray-500 hover:text-black"
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

              {/* DatePicker สำหรับ End Date */}
              <DatePicker
                className="w-48 p-2 bg-white border shadow-default 
  dark:border-slate-300 dark:bg-[#121212] dark:text-slate-200"
                value={endDate ? dayjs(endDate, "YYYY/MM/DD") : null}
                onChange={handleEndDateChange}
                format="YYYY/MM/DD" // ใช้รูปแบบ YYYY/MM/DD
                min={startDate ? dayjs(startDate, "YYYY/MM/DD") : null} // กำหนดวันที่เริ่มต้น
                max={maxEndDate1} // กำหนดวันที่สิ้นสุด
                disabledDate={(current) => {
                  // ปิดการเลือกวันที่ที่น้อยกว่า startDate หรือมากกว่า maxEndDate1
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
            />
          </div>
          <div className="mt-5">
            <BarChartComponent
              data={graphData}
              type="hour"
              timestampKey="timestamp"
              valueKeys={["electricityAmount"]}
            />
          </div>
          <div className="mt-5">
            <BarChartComponent
              data={graphData}
              type="hour"
              timestampKey="timestamp"
              valueKeys={["revenue"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargerDetail;
