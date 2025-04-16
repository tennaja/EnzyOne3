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
import { getChargeHeadbyId, getChargeHeadStatics, getChargeHeadHistoryStatistics} from "@/utils/api";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const ChargerHeadDetail = () => {
  const router = useRouter();
  const today = dayjs(); // ใช้สำหรับคำนวณและเปรียบเทียบ
    const todayFormatted = today.format("YYYY/MM/DD");
  const [chargerName, setChargerName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [stationName, setStationName] = useState('');
  const [chargerHeadId, setChargerHeadId] = useState('');
  const [chargerHeadName, setChargerHeadName] = useState('');
    const [chargerId, setChargerId] = useState('');
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
          const result = await getChargeHeadbyId(id);
          console.log("Station:", result);
          console.log("Chargers:", result.chargers);
          if (result) {
            setStation(result);
           
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
          const result = await getChargeHeadStatics(id);
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
          chargeHeadId: id,
          groupBy: timeUnit,
          endDate: endDate,
          startDate: startDate,
        };
        try {
          const result = await getChargeHeadHistoryStatistics(Param)
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
          const storedChargerHeadId = localStorage.getItem("chargerHeadId");
          const storedChargerHeadName = localStorage.getItem("chargerHeadName");
          
          if (storedChargerHeadId) setChargerHeadId(storedChargerHeadId);
          if (storedChargerHeadName) setChargerHeadName(storedChargerHeadName);
          if (storedSiteName) setSiteName(storedSiteName);
          if (storedChargerId) setChargerId(storedChargerId);
          if (storedStationName) setStationName(storedStationName);
          if (storedChargerName) setChargerName(storedChargerName);
          if (storedChargerHeadId) {
            GetStationbyId(storedChargerHeadId);
            GetStationStatic(storedChargerId);
          }
        }
      }, []);

      useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
    
        setChargerName(searchParams.get('chargerName') || localStorage.getItem('chargerName') || 'Default Charger Name');
        setSiteName(searchParams.get('siteName') || localStorage.getItem('siteName') || 'Default Site Name');
        setStationName(searchParams.get('stationName') || localStorage.getItem('stationName') || 'Default Station Name');
        setChargerHeadId(searchParams.get('chargerHeadId') || localStorage.getItem('chargerHeadId') || 'default-charger-head-id');
        setChargerHeadName(searchParams.get('chargerHeadName') || localStorage.getItem('chargerHeadName') || 'Default Charger Head Name');
      }, []);
    
      useEffect(() => {
        const storedChargerHeadId = localStorage.getItem("chargerHeadId");
          if (storedChargerHeadId) {
            GetChargerHistoryStatistics(storedChargerHeadId)
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
            item.carBrand
              ?.toString()
              .toLowerCase()
              .includes(searchChargingQuery.toLowerCase()) ||
            item.carModel
              ?.toString()
              .toLowerCase()
              .includes(searchChargingQuery.toLowerCase()) ||
            item.chargeHeadName
              ?.toString()
              .toLowerCase()
              .includes(searchChargingQuery.toLowerCase()) ||
            item.chargerName
              ?.toString()
              .toLowerCase()
              .includes(searchChargingQuery.toLowerCase()) ||
            item.electricityAmount
              ?.toString()
              .toLowerCase()
              .includes(searchChargingQuery.toLowerCase()) ||
            item.endTime
              ?.toString()
              .toLowerCase()
              .includes(searchChargingQuery.toLowerCase()) ||
            item.price
              ?.toString()
              .toLowerCase()
              .includes(searchChargingQuery.toLowerCase()) ||
            item.startTime
              ?.toString()
              .toLowerCase()
              .includes(searchChargingQuery.toLowerCase()) ||
            item.stationName
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
            onClick={() => router.push("chargerdetail")}
          />

          <div className="flex flex-col">
            <strong>{chargerHeadName}</strong>
            <div className="flex items-center space-x-1 gap-1">
  <Link href={'./'} className="text-sm text-gray-500 hover:text-[#1aa7a7] hover:underline transition-colors duration-200">
    {siteName}
  </Link>
  <span>/</span>
  <Link href={'stationdetail'} className="text-sm text-gray-500 hover:text-[#1aa7a7] hover:underline transition-colors duration-200">
    {stationName}
  </Link>
  <span>/</span>
                <Link href={'chargerdetail'} className="text-sm text-gray-500 hover:text-[#1aa7a7] hover:underline transition-colors duration-200">
                  {chargerName}
                </Link>
</div>

          </div>
        </div>
      </div>

      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
        <span className="text-lg font-bold block mb-2">
        Charge Head Information
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
                      <strong>Charger Head Name</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.name}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Cable Type</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.cableType}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Connector Type</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.connectorType}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Power Rating</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.powerRating}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Charger Head Price (per kWh)</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.price ?? "-"}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Max Volt / Max Amp</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.maxVolt}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Maintenance Mode</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.maintenance}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Reservable</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.reservable}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>ChargeHead Code</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.chargeHeadCode}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Charge Name</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.chargerName}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Station Name</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">{station?.stationName}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>ChargeHead Status</strong>
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
                  
                </tbody>
              </table>
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

export default ChargerHeadDetail;
