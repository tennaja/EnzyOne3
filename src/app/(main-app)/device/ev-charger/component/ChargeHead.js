"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatisticsCard from "../component/StatisticsCard.js";
import dynamic from "next/dynamic";
import Loading from "./Loading";
const MapTH = dynamic(() => import("../component/MapSmSt"), { ssr: false });
import BarChartComponent from "../component/Barchart.js";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  getChargeHeadbyId,
  getChargeHeadStatics,
  getChargeHeadHistoryStatistics,
} from "@/utils/api";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const ChargerHeadDetail = ({ onNavigate }) => {
  const StationName = useSelector((state) => state.evchargerData.stationName);
  const SiteName = useSelector((state) => state.evchargerData.siteName);
  const ChargerName = useSelector((state) => state.evchargerData.chargerName);
  const ChargerHeadName = useSelector(
    (state) => state.evchargerData.chargeHeadName
  );
  const ChargerHeadId = useSelector(
    (state) => state.evchargerData.chargeHeadId
  );
  const router = useRouter();
  const today = dayjs(); // ใช้สำหรับคำนวณและเปรียบเทียบ
  const todayFormatted = today.format("YYYY/MM/DD");
  const [station, setStation] = useState({});
  const [staticsToday, setStaticsToday] = useState({});
  const [staticsTotal, setStaticsTotal] = useState({});
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'days').format("YYYY/MM/DD"));
  const [endDate, setEndDate] = useState(todayFormatted);
  const [loading, setLoading] = useState(false);
  const [timeUnit, setTimeUnit] = useState("hour");
  const [graphData, setGraphData] = useState();
  const [mapZoomLevel, setMapZoomLevel] = useState(15);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const OptionsTimeUnit = [
    { label: "Hour", value: "hour" },
    { label: "Day", value: "day" },
    { label: "Month", value: "month" },
  ];


  const GetStationbyId = async (id,showLoading = true) => {
    if (showLoading) setLoading(true);
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
    }finally {
      if (showLoading) {
        setLoading(false);
        }
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
      const result = await getChargeHeadHistoryStatistics(Param);
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

    if (ChargerHeadId) {
      GetStationbyId(ChargerHeadId);
      GetStationStatic(ChargerHeadId);
    }
  }, []);

  useEffect(() => {
    if (ChargerHeadId) {
      GetChargerHistoryStatistics(ChargerHeadId);
    }
  }, [endDate, startDate, timeUnit,ChargerHeadId]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("⏳ Refreshing data every 2 minutes from Redux...");
      Promise.all([GetStationbyId(ChargerHeadId,false)]);
      GetStationStatic(ChargerHeadId);
      GetChargerHistoryStatistics(ChargerHeadId);
    }, 300000);

    return () => clearInterval(interval);
  }, [ChargerHeadId]);

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
            onClick={() => onNavigate("chargerdetail")}
          />

          <div className="flex flex-col">
            <strong>{ChargerHeadName}</strong>
            <div className="flex items-center space-x-1 gap-1">
              <span
                onClick={() => onNavigate("dashboard")}
                className="text-sm text-gray-500 hover:text-[#1aa7a7] hover:underline transition-colors duration-200 cursor-pointer"
              >
                {SiteName}
              </span>
              <span>/</span>
              <span
                onClick={() => onNavigate("stationdetail")}
                className="text-sm text-gray-500 hover:text-[#1aa7a7] hover:underline transition-colors duration-200 cursor-pointer"
              >
                {StationName}
              </span>
              <span>/</span>
              <span
                onClick={() => onNavigate("chargerdetail")}
                className="text-sm text-gray-500 hover:text-[#1aa7a7] hover:underline transition-colors duration-200 cursor-pointer"
              >
                {ChargerName}
              </span>
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
                          name: station.stationName,
                          status: station.stationStatus,
                          lat: station.latitude, // ใช้ latitude จาก station
                          lng: station.longitude, // ใช้ longitude จาก station
                          siteName: SiteName,
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
                    <td className="px-4 py-2 font-bold">{station?.name}</td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Cable Type</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.cableType}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Connector Type</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.connectorType}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Power Rating</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.powerRating}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Charger Head Price (per kWh)</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.price ?? "-"}
                    </td>
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
                    <td className="px-4 py-2 font-bold">
                      {station?.maintenance}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Reservable</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.reservable}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>ChargeHead Code</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.chargeHeadCode}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Charge Name</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.chargerName}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>Station Name</strong>
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {station?.stationName}
                    </td>
                  </tr>
                  <tr className="text-xs  border-b border-gray-200">
                    <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white">
                      <strong>ChargeHead Status</strong>
                    </td>
                    <td
                      className="px-4 py-2 font-bold"
                      style={{
                        color:
                          station?.status === "Available"
                            ? "#12B981"
                            : station?.status === "Charging"
                            ? "#259AE6"
                            : station?.status === "Out of order"
                            ? "#DF4667"
                            : station?.status === "Reserved"
                            ? "#9747FF"
                            : station?.status === "Maintenance"
                            ? "#8A99AF"
                            : "black",
                      }}
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
          {loading && <Loading />}
        </div>
      </div>
    </div>
  );
};

export default ChargerHeadDetail;
