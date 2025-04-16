"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  getDropdownSite,
  getDropdownStation,
  getStationList,
  getChargeHeadsCountByStatus,
  getChargingHistory,
} from "@/utils/api";
import { FaChargingStation } from "react-icons/fa";
import { RiBatteryChargeLine } from "react-icons/ri";
import { FaTriangleExclamation } from "react-icons/fa6";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
const MapTH = dynamic(() => import("../component/MapSmSt"), { ssr: false });

const Dashboard = () => {
  const today = dayjs(); // ใช้สำหรับคำนวณและเปรียบเทียบ
  const todayFormatted = today.format("YYYY/MM/DD");
  const pathname = usePathname(); // ดึง Path ปัจจุบันจาก Next.js App Router
  const router = useRouter();
  const [siteDropdwonlist, setSiteDropdwonlist] = useState();
  const [stationDropdwonlist, setStationDropdwonlist] = useState();
  const [charginglist, setChargingList] = useState([]);
  const [siteid, setSiteid] = useState();
  const [stationid, setStatonid] = useState();
  const [siteName, setSiteName] = useState("");
  const [stationName, setstationName] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedStationId, setSelectedStationId] = useState("");
  const [selectedSiteName, setSelectedSiteName] = useState("");
  const [stationList, setStationList] = useState([]);
  const [selectedStationName, setSelectedStationName] = useState("");
  const [countbystatusList, setCountStatusList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [startDate, setStartDate] = useState(todayFormatted);
  const [endDate, setEndDate] = useState(todayFormatted);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchChargingQuery, setSearchChargingQuery] = useState("");
  const [isfirst, setIsfirst] = useState(true);
  const [mapZoomLevel, setMapZoomLevel] = useState(15); // กำหนดค่า zoom เริ่มต้น
  const [currentPage, setCurrentPage] = useState(1);
  const [chargingCurrentPage, setChargingCurrentPage] = useState(1);
  const [chargingRowsPerPage, setChargingRowsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [stationSortConfig, setStationSortConfig] = useState({
    key: "device",
    direction: "asc",
  });
  const [chargingSortConfig, setChargingSortConfig] = useState({
    key: "device",
    direction: "asc",
  });
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedStation, setSelectedStation] = useState("");

  //Get siteDropdown
  const getSiteDropdown = async () => {
    const result = await getDropdownSite();
    console.log(result);
    console.log(result.length);

    if (result.length > 0) {
      setSiteDropdwonlist(result);
      const siteId = result[0].id ?? 0; // ถ้า id เป็น null ให้ใช้ 0

      if (isfirst) {
        // ใช้ isfirst จาก useState
        setSiteName(result[0].name);
        setSiteid(siteId);
        setSelectedSiteId(siteId);
        setSelectedSiteName(result[0].name);
        setSelectedSite(result[0].name);
        GetStationList(siteId);
        setIsfirst(false); // เซ็ตให้เป็น false หลังจากใช้งานครั้งแรก
      } else {
        // setSiteid(siteId);
        setSelectedSiteId(siteId);
        setSelectedSiteName(result[0].name);
      }

      getStationDropdown(siteId);
    }
  };
  //Get stationDropdown
  const getStationDropdown = async (siteid) => {
    console.log("Site ID:", siteid);
    setSiteid(siteid ?? 0);
    const result = await getDropdownStation(siteid);
    if (result.length > 0) {
      setStationDropdwonlist(result);
      const firstGroupId = result[0]?.id ?? 0;
      console.log("First Group ID:", firstGroupId);

      if (isfirst) {
        // ใช้ isfirst จาก useState
        setstationName(result[0]?.name || "");
        setStatonid(firstGroupId);
        setSelectedStationId(firstGroupId);
        setSelectedStationName(result[0]?.name || "");
        setIsfirst(false); // เซ็ตให้เป็น false หลังจากใช้งานครั้งแรก
      } else {
        setStatonid(firstGroupId);
        setSelectedStationId(firstGroupId);
        setSelectedStationName(result[0]?.name || "");
        console.log(result[0]?.name || "");
      }
    } else {
      console.log("No groups found!");
      setGrouplist([]); // ตั้งค่า grouplist เป็นว่างถ้าไม่มีข้อมูล
    }
  };
  //Get stationList
  const GetStationList = async (site) => {
    try {
      const result = await getStationList(site);
      console.log("Station List:", result);
  
      if (!stationid || stationid === "0") {
        // ถ้า stationid เป็น null หรือ "0" ให้แสดงทุกรายการ
        setStationList(result?.length > 0 ? result : []);
      } else {
        // ถ้า stationid มีค่า ให้แสดงเฉพาะที่ stationid ตรงกัน
        const filteredList = result.filter((station) => station.id === parseInt(stationid));
        console.log("Filtered Station List:", filteredList);
  
        // ถ้าไม่มีรายการที่ตรงกับ stationid ให้แสดงรายการทั้งหมด
        if (filteredList.length > 0) {
          setStationList(filteredList);
        } else {
          console.warn("No matching station found for stationid:", stationid);
          setStationList(result?.length > 0 ? result : []);
        }
      }
    } catch (error) {
      console.error("Error fetching station list:", error);
    }
  };
  
  //Get countbystatusList
  const GetCountByStatusList = async () => {
    const paramsNav = {
      siteId: siteid,
      stationId: stationid,
    };
    // setLoading(true);
    try {
      const result = await getChargeHeadsCountByStatus(paramsNav);
      console.log("Charer List:", result.data.lastUpdated);
      setCountStatusList(result.data);
    } catch (error) {
      console.error("Error fetching schedule list:", error);
    } finally {
      // setLoading(false);
    }
  };
  //Get Charging History
  const GetChargingHistory = async () => {
    const Param = {
      siteId: siteid,
      stationId: stationid,
      endDate: endDate,
      startDate: startDate,
    };
    const res = await getChargingHistory(Param);

    if (res.status === 200) {
      setChargingList(res.data);
      console.log("เข้าาาาาาาาาาาาาาาาา", res.data);
    } else {
      console.log("ไม่เข้าาาาาาาาาาาาาาาาา");
    }
  };

  useEffect(() => {
    getSiteDropdown();
    GetCountByStatusList();
  }, []);

  useEffect(() => {
    GetChargingHistory();
  }, [startDate, endDate]);
  // สร้าง icon map สำหรับ status
  const statusIcons = {
    "In-Use": <RiBatteryChargeLine fontSize="30px" />,
    "Out Of Service": <FaTriangleExclamation fontSize="30px" />,
    Available: <FaChargingStation fontSize="30px" />,
  };

  // แปลงข้อมูล
  const data = countbystatusList?.data?.map((item) => ({
    title: item.status,
    count: item.value,
    total: item.total,
    icon: statusIcons[item.status] || null,
  }));

  // // // โหลดค่าที่เก็บไว้ใน localStorage เมื่อหน้าโหลด
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //   const storedSite = localStorage.getItem("selectedSite"); // ดึงค่าจาก localStorage

  //   if (storedSite && siteDropdwonlist?.length > 0) {
  //     // ตรวจสอบว่า storedSite มีอยู่ใน siteDropdwonlist หรือไม่
  //     const matchedSite = siteDropdwonlist.find(
  //       (site) => site.name === storedSite
  //     );
  //     if (matchedSite) {
  //       // ถ้าตรงกัน ให้ตั้งค่า siteid และ selectedSite
  //       setSiteid(matchedSite.id);
  //       setSelectedSite(matchedSite.name);
  //       setSiteName(matchedSite.name);
  //       getStationDropdown(matchedSite.id); // โหลด Station Dropdown ตาม Site ที่เลือกไว้
  //       console.log('DDDDDDDDDDD')
  //     }
  //   }}
  // }, [siteDropdwonlist]); // ทำงานเมื่อ siteDropdwonlist ถูกอัปเดต

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedSite = localStorage.getItem("selectedSite");
  //     if (storedSite && siteDropdwonlist?.length > 0) {
  //       const matchedSite = siteDropdwonlist.find(
  //         (site) => site.name === storedSite
  //       );
  //       if (matchedSite) {
  //         setSiteid(matchedSite.id);
  //         setSelectedSite(matchedSite.name);
  //         setSiteName(matchedSite.name);
  //         getStationDropdown(matchedSite.id);
  //       }
  //     }
  //   }
  // }, [siteDropdwonlist]);

  const handleSiteChange = (event) => {
    const site = event.target.value;
    setSelectedSite(site);

    // เก็บค่า selectedSite ไว้ใน localStorage
    localStorage.setItem("selectedSite", site);
  };

  const handleStationChange = (event) => {
    console.log("Station ID:", event.target.value);
    setStatonid(event.target.value);
  };

  const handleStationClick = (stationId, stationName) => {
    if (!selectedSite) {
      alert("Please select a site before proceeding.");
      return;
    }

    // เก็บ siteName และ stationId ใน Local Storage
    localStorage.setItem("siteName", selectedSite);
    localStorage.setItem("stationId", stationId);
    localStorage.setItem("stationName", stationName);

    // // อัปเดต Breadcrumb
    // // const breadcrumb = [
    // //   { label: selectedSite, path: "ev-charger/stationdetail" },
    // // ];
    // localStorage.setItem("breadcrumb", JSON.stringify(breadcrumb));

    // เปลี่ยนหน้าไปยัง StationDetail
    router.push("ev-charger/stationdetail");
  };

  const handleSearchquery = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchChargingquery = (e) => {
    setSearchChargingQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log("Searching with:", selectedStationName);
    console.log("Site ID:", selectedSiteId);
    console.log("Station ID:", selectedStationId);
    setSiteName(selectedSiteName);
    setstationName(selectedStationName);
    setSiteid(selectedSiteId);
    setStatonid(selectedStationId);
    GetStationList(selectedSiteId);
    GetChargingHistory();
    GetCountByStatusList();
  };

  const filteredStationList = stationList
    ?.map((item, index) => ({ ...item, displayIndex: index + 1 })) // เพิ่มลำดับเลขให้แต่ละ item
    .filter(
      (item) =>
        item.address
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.brand
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.chargerCount
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.name
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.status
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

  const filteredChargingList = charginglist
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

  // ฟังก์ชั่นการ sort
  // ใช้เมื่อผู้ใช้กดหัวคอลัมน์เพื่อ sort ข้อมูล station
  const handleSortStation = (column) => {
    let direction = "asc";
    if (
      stationSortConfig.key === column &&
      stationSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setStationSortConfig({ key: column, direction });
  };

  // ข้อมูล station ที่ sort แล้ว
  const sortedStationList = useMemo(() => {
    const sorted = [...filteredStationList];
    sorted.sort((a, b) => {
      const valueA = a[stationSortConfig.key];
      const valueB = b[stationSortConfig.key];

      if (valueA < valueB)
        return stationSortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB)
        return stationSortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredStationList, stationSortConfig]);

  // Pagination สำหรับ station
  const stationIndexOfLastItem = currentPage * rowsPerPage;
  const stationIndexOfFirstItem = stationIndexOfLastItem - rowsPerPage;
  const currentStationData = sortedStationList.slice(
    stationIndexOfFirstItem,
    stationIndexOfLastItem
  );
  const totalStationPages = Math.ceil(filteredStationList.length / rowsPerPage);

  // ใช้เมื่อผู้ใช้กดหัวคอลัมน์เพื่อ sort ข้อมูล charging
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

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleChangeChargingPage = (page) => {
    setChargingCurrentPage(page);
  };

  const handleRowsPerChargingPageChange = (e) => {
    setChargingRowsPerPage(Number(e.target.value));
    setChargingCurrentPage(1);
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
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
        <div className="flex gap-5">
          <div>
            <span className="text-sm">Site: </span>
            <select
              className="w-44 border border-slate-300 mx-2 rounded-md h-9"
              onChange={(event) => {
                const selectedValue = event.target.value || "0"; // ถ้าเป็น null หรือ undefined ให้ใช้ "0"
                setSelectedSiteId(selectedValue); // เก็บค่า siteId ใน Redux
                getStationDropdown(selectedValue);
                setSelectedSite(event.target.selectedOptions[0]?.text || "");
                localStorage.setItem(
                  "selectedSite",
                  event.target.selectedOptions[0]?.text || ""
                );
                setSelectedSiteName(
                  event.target.selectedOptions[0]?.text || ""
                ); // ป้องกัน undefined
              }}
              value={siteid ?? "0"} // ถ้า siteid เป็น null ให้ใช้ "0"
            >
              {siteDropdwonlist?.map((site) => (
                <option key={site.id} value={site.id ?? "0"}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="text-sm">Station: </span>
            <select
              value={stationid ?? "0"}
              className="w-44 border border-slate-300 mx-2 rounded-md h-9"
              onChange={(event) => {
                const value = event.target.value;
                const label =
                  event.target.options[event.target.selectedIndex].text;
                setSelectedStationId(value);
                setSelectedStationName(label);
                handleStationChange(event); // ส่ง event เข้าตรง ๆ
              }}
            >
              {stationDropdwonlist?.map((station) => (
                <option key={station.id} value={station.id ?? "0"}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="text-white bg-[#33BFBF] rounded-md text-lg px-10 h-9"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div>
        <span className="text-base font-bold block mb-2 mt-5">
          Real-Time Data
        </span>
        <div className="flex justify-between">
          <p className="text-sm ">
            {siteName} | {stationName}
          </p>
          <p className="text-sm ">
            Lasted Updated {countbystatusList?.lastUpdated}
          </p>
        </div>
      </div>
      {/* Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              className="p-6 shadow-md rounded-xl bg-white border"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#f6f7fc] text-[#33BFBF]">
                  {item.icon}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-3xl font-bold">{item.count}</p>
                <p className="text-gray-600">Charge heads</p>
                <p className="text-gray-500 text-sm mt-1">
                  {item.count} of {item.total}
                </p>
                <div className="w-full bg-gray-300 h-1 rounded-full mt-2">
                  <div
                    className="bg-[#33BFBF] h-1 rounded-full"
                    style={{ width: `${(item.count / item.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Station Table */}
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
        <div>
          <span className="text-lg font-bold block mb-2 mt-4">
            Station List
          </span>
          <div className="flex justify-between">
            <p className="text-sm ">SiteName | StationName</p>
            {/* <p className="text-sm ">Lasted Updated 2025/04/03 08:00</p> */}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-[450px]">
            <div className="flex justify-center w-full h-[500px] justify-items-center overflow-hidden mt-10 mb-7">
              <MapTH
                locationList={
                  Array.isArray(stationList)
                    ? stationList.map((loca) => ({
                        id: loca.id,
                        name: loca.name,
                        status: loca.status,
                        lat: loca.latitude,
                        lng: loca.longitude,
                      }))
                    : []
                }
                className={"w-full h-[500px] justify-items-center"}
                zoom={mapZoomLevel}
                selectedLocation={selectedLocation}
              />
            </div>
          </div>

          <div className="w-full lg:w-60 flex-1">
            <div className="flex-1 ml-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold">
                  {filteredStationList.length} Stations
                </span>
                <input
                  type="text"
                  placeholder="ค้นหา"
                  value={searchQuery}
                  onChange={handleSearchquery}
                  className="border border-gray-300 p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                  <thead>
                    <tr className="text-xs text-black border-b border-gray-300 dark:text-white">
                      <th
                        className="px-2 py-1 text-left cursor-pointer"
                        onClick={() => handleSortStation("name")}
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
                                stationSortConfig.key === "name" &&
                                stationSortConfig.direction === "asc"
                                  ? 1
                                  : 0.3,
                              marginBottom: "-2px", // ลดช่องว่างระหว่างลูกศร
                            }}
                          />
                          <ArrowDropDownIcon
                            style={{
                              fontSize: "14px",
                              opacity:
                                stationSortConfig.key === "name" &&
                                stationSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px", // ลดช่องว่างระหว่างลูกศร
                            }}
                          />
                        </div>
                      </th>

                      <th
                        className="px-2 py-1 text-center cursor-pointer"
                        onClick={() => handleSortStation("brand")}
                      >
                        Brand Name
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
                                stationSortConfig.key === "brand" &&
                                stationSortConfig.direction === "asc"
                                  ? 1
                                  : 0.3,
                              marginBottom: "-2px",
                            }}
                          />
                          <ArrowDropDownIcon
                            style={{
                              fontSize: "14px",
                              opacity:
                                stationSortConfig.key === "brand" &&
                                stationSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px",
                            }}
                          />
                        </div>
                      </th>

                      <th
                        className="px-2 py-1 text-center cursor-pointer"
                        onClick={() => handleSortStation("address")}
                      >
                        Address
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
                                stationSortConfig.key === "address" &&
                                stationSortConfig.direction === "asc"
                                  ? 1
                                  : 0.3,
                              marginBottom: "-2px",
                            }}
                          />
                          <ArrowDropDownIcon
                            style={{
                              fontSize: "14px",
                              opacity:
                                stationSortConfig.key === "address" &&
                                stationSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px",
                            }}
                          />
                        </div>
                      </th>

                      <th
                        className="px-2 py-1 text-center cursor-pointer"
                        onClick={() => handleSortStation("chargerCount")}
                      >
                        Count of Charger
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
                                stationSortConfig.key === "chargerCount" &&
                                stationSortConfig.direction === "asc"
                                  ? 1
                                  : 0.3,
                              marginBottom: "-2px",
                            }}
                          />
                          <ArrowDropDownIcon
                            style={{
                              fontSize: "14px",
                              opacity:
                                stationSortConfig.key === "chargerCount" &&
                                stationSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px",
                            }}
                          />
                        </div>
                      </th>

                      <th
                        className="px-2 py-1 text-center"
                        onClick={() => handleSortStation("status")}
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
                                stationSortConfig.key === "status" &&
                                stationSortConfig.direction === "asc"
                                  ? 1
                                  : 0.3,
                              marginBottom: "-2px",
                            }}
                          />
                          <ArrowDropDownIcon
                            style={{
                              fontSize: "14px",
                              opacity:
                                stationSortConfig.key === "status" &&
                                stationSortConfig.direction === "desc"
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
                    {currentStationData.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-2 py-4 text-center text-gray-500 dark:text-gray-400"
                        >
                          Station not found
                        </td>
                      </tr>
                    ) : (
                      currentStationData.map((record, index) => {
                        const highlightText = (text) => {
                          if (!text || !searchQuery) return text; // ถ้าไม่มีข้อความหรือ searchQuery ให้คืนค่าข้อความเดิม
                          const textString = String(text); // แปลงข้อความเป็น string
                          const parts = textString.split(
                            new RegExp(`(${searchQuery})`, "gi")
                          ); // แยกข้อความตาม searchQuery
                          return parts.map((part, i) =>
                            part.toLowerCase() === searchQuery.toLowerCase() ? (
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
                            key={record.id}
                            className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              index % 2 === 0
                                ? "bg-gray-100 dark:bg-gray-900"
                                : "bg-white dark:bg-gray-800"
                            }`}
                            style={{ borderBottom: "1px solid #e0e0e0" }}
                          >
                            <td className="px-2 py-1 text-left">
                              <div
                                className="text-[#33BFBF] underline cursor-pointer hover:text-[#28A9A9] dark:text-[#33BFBF] dark:hover:text-[#28A9A9] text-base mb-1"
                                onClick={() => {
                                  // getdevicebyId(record.id);
                                  // setActiveTab("detail");
                                  // setSelectedLocation({
                                  //   lat: record.latitude,
                                  //   lng: record.longitude,
                                  // });
                                  // setMapZoomLevel(15);
                                  // GetHistoryGraph(record.id);
                                  // GetEnergyHistoryGraph(record.id);
                                  handleStationClick(record.id, record.name);
                                }}
                              >
                                {highlightText(record.name)}{" "}
                                {/* Highlight the search term */}
                              </div>
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.brand)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.address)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.chargerCount)}
                            </td>
                            <td className="px-2 py-1 text-center">
                              <span
                                className={`inline-block px-2 py-1 text-sm font-bold ${
                                  record.status === "open"
                                    ? "text-[#12B981] dark:text-[#12B981]"
                                    : "text-[#FF3D4B] dark:text-[#FF3D4B]"
                                }`}
                              >
                                {highlightText(record.status)}{" "}
                                {/* Highlight the search term */}
                              </span>
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
                    <ArrowBackIosNewIcon style={{ fontSize: "12px" }} />
                  </button>
                  <span className="text-sm">
                    {currentPage} / {totalStationPages}
                  </span>
                  <button
                    onClick={() => handleChangePage(currentPage + 1)}
                    disabled={
                      currentPage === totalStationPages ||
                      filteredStationList.length === 0
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

      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
        <div>
          <span className="text-lg font-bold block mb-2 mt-4">
            Charging Session History
          </span>
          <div className="flex justify-between">
            <p className="text-sm ">SiteName | StationName</p>
            {/* <p className="text-sm ">Lasted Updated 2025/04/03 08:00</p> */}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-60 flex-1">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2 mt-5">
                <div className="flex gap-2 mt-5 items-center">
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
                        (current.isBefore(
                          dayjs(startDate, "YYYY/MM/DD"),
                          "day"
                        ) || // น้อยกว่า startDate
                          current.isAfter(
                            dayjs(maxEndDate1, "YYYY/MM/DD"),
                            "day"
                          )) // มากกว่า maxEndDate1
                      );
                    }}
                    allowClear={false}
                  />
                </div>
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
                        className="px-2 py-1 text-center cursor-pointer"
                        onClick={() => handleSortCharging("carBrand")}
                      >
                        Car Brand
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
                                chargingSortConfig.key === "carBrand" &&
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
                                chargingSortConfig.key === "carBrand" &&
                                chargingSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px",
                            }}
                          />
                        </div>
                      </th>

                      <th
                        className="px-2 py-1 text-center cursor-pointer"
                        onClick={() => handleSortCharging("carModel")}
                      >
                        Car Model
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
                                chargingSortConfig.key === "carModel" &&
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
                                chargingSortConfig.key === "carModel" &&
                                chargingSortConfig.direction === "desc"
                                  ? 1
                                  : 0.3,
                              marginTop: "-2px",
                            }}
                          />
                        </div>
                      </th>

                      <th
                        className="px-2 py-1 text-center cursor-pointer"
                        onClick={() => handleSortCharging("stationName")}
                      >
                        Station Name
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
                                chargingSortConfig.key === "stationName" &&
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
                                chargingSortConfig.key === "stationName" &&
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
                        onClick={() => handleSortCharging("chargerName")}
                      >
                        Charger Name
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
                                chargingSortConfig.key === "chargerName" &&
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
                                chargingSortConfig.key === "chargerName" &&
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
                        onClick={() => handleSortCharging("chargeHeadName")}
                      >
                        Charge Head Name
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
                                chargingSortConfig.key === "chargeHeadName" &&
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
                                chargingSortConfig.key === "chargeHeadName" &&
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
                        onClick={() => handleSortCharging("electricityAmount")}
                      >
                        Electricity Amount
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
                                chargingSortConfig.key === "electricityAmount" &&
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
                                chargingSortConfig.key === "electricityAmount" &&
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
                        onClick={() => handleSortCharging("price")}
                      >
                        Price
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
                                chargingSortConfig.key === "price" &&
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
                                chargingSortConfig.key === "price" &&
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
                        onClick={() => handleSortCharging("startTime")}
                      >
                        Start Time
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
                                chargingSortConfig.key === "startTime" &&
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
                                chargingSortConfig.key === "startTime" &&
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
                        onClick={() => handleSortCharging("endTime")}
                      >
                        End Time
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
                                chargingSortConfig.key === "endTime" &&
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
                                chargingSortConfig.key === "endTime" &&
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
                                ? "bg-gray-100 dark:bg-gray-900"
                                : "bg-white dark:bg-gray-800"
                            }`}
                            style={{ borderBottom: "1px solid #e0e0e0" }}
                          >
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.displayIndex)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.carBrand)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.carModel)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.stationName)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.chargerName)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.chargeHeadName)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.electricityAmount)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.price)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.startTime)}
                            </td>
                            <td className="px-2 py-1 text-center dark:text-white">
                              {highlightText(record.endTime)}
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
    </div>
  );
};

export default Dashboard;
