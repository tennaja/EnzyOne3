"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter,usePathname } from "next/navigation";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getDropdownSite, getDropdownStation,getStationList } from "@/utils/api";
import { FaChargingStation } from "react-icons/fa";
import { RiBatteryChargeLine } from "react-icons/ri";
import { FaTriangleExclamation } from "react-icons/fa6";
import dynamic from "next/dynamic";
const MapTH = dynamic(() => import("../component/MapSmSt"), { ssr: false })

const Dashboard = () => {
  const pathname = usePathname(); // ดึง Path ปัจจุบันจาก Next.js App Router
  const router = useRouter();
  const [siteDropdwonlist, setSiteDropdwonlist] = useState();
  const [stationDropdwonlist, setStationDropdwonlist] = useState();
  const [siteid, setSiteid] = useState();
  const [stationid, setStatonid] = useState();
  const [siteName, setSiteName] = useState("");
  const [stationName, setstationName] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedStationId, setSelectedStationId] = useState("");
  const [selectedSiteName, setSelectedSiteName] = useState("");
  const [stationList,setStationList] = useState([]);
  const [selectedStationName, setSelectedStationName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isfirst, setIsfirst] = useState(true);
  const [mapZoomLevel, setMapZoomLevel] = useState(15); // กำหนดค่า zoom เริ่มต้น
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState({
    key: "device",
    direction: "asc",
  });
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  useEffect(() => {
    getSiteDropdown();
  }, []);
  //Get site
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
        setSiteid(siteId);
        setSelectedSiteId(siteId);
        setSelectedSiteName(result[0].name);
      }

      getStationDropdown(siteId);
    }
  };
  //Get station
  
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

  const GetStationList = async (site) => {
    // setLoading(true);
    try {
      const result = await getStationList(site);
      console.log("Station List:", result);
      setStationList(result?.length > 0 ? result : []);
    } catch (error) {
      console.error("Error fetching schedule list:", error);
    } finally {
      // setLoading(false);
    }
  };

  const data = [
    {
      title: "In-Use",
      count: 186,
      total: 1112,
      icon: <RiBatteryChargeLine fontSize="30px" />,
    },
    {
      title: "Out Of Service",
      count: 308,
      total: 1112,
      icon: <FaTriangleExclamation fontSize="30px" />,
    },
    {
      title: "Available",
      count: 618,
      total: 1112,
      icon: <FaChargingStation fontSize="30px" />,
    },
  ];

  // // โหลดค่าที่เก็บไว้ใน localStorage เมื่อหน้าโหลด
  useEffect(() => {
    if (typeof window !== "undefined") {
    const storedSite = localStorage.getItem("selectedSite"); // ดึงค่าจาก localStorage

    if (storedSite && siteDropdwonlist?.length > 0) {
      // ตรวจสอบว่า storedSite มีอยู่ใน siteDropdwonlist หรือไม่
      const matchedSite = siteDropdwonlist.find(
        (site) => site.name === storedSite
      );
      if (matchedSite) {
        // ถ้าตรงกัน ให้ตั้งค่า siteid และ selectedSite
        setSiteid(matchedSite.id);
        setSelectedSite(matchedSite.name);
        setSiteName(matchedSite.name);
        getStationDropdown(matchedSite.id); // โหลด Station Dropdown ตาม Site ที่เลือกไว้
        console.log('DDDDDDDDDDD')
      }
    }}
  }, [siteDropdwonlist]); // ทำงานเมื่อ siteDropdwonlist ถูกอัปเดต

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSite = localStorage.getItem("selectedSite");
      if (storedSite && siteDropdwonlist?.length > 0) {
        const matchedSite = siteDropdwonlist.find(
          (site) => site.name === storedSite
        );
        if (matchedSite) {
          setSiteid(matchedSite.id);
          setSelectedSite(matchedSite.name);
          setSiteName(matchedSite.name);
          getStationDropdown(matchedSite.id);
        }
      }
    }
  }, [siteDropdwonlist]);

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

    // อัปเดต Breadcrumb
    const breadcrumb = [
      { label: selectedSite, path: "ev-charger/stationdetail" },
    ];
    localStorage.setItem("breadcrumb", JSON.stringify(breadcrumb));

    // เปลี่ยนหน้าไปยัง StationDetail
    router.push("ev-charger/stationdetail");
  };

  const handleSearchquery = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
      console.log("Searching with:", selectedStationName);
  
      setSiteName(selectedSiteName);
      setstationName(selectedStationName);
      setSiteid(selectedSiteId);
      setStatonid(selectedStationId);
      GetStationList(selectedSiteId);
    };
  const filteredData = stationList?.filter((item) =>
    item.name?.toString().toLowerCase().includes(searchQuery.toLowerCase())
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
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
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
    const label = event.target.options[event.target.selectedIndex].text;
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
          <p className="text-sm ">{siteName} | {stationName}</p>
          <p className="text-sm ">Lasted Updated 2025/04/03 08:00</p>
        </div>
      </div>
      {/* Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {data.map((item, index) => (
          <div key={index} className="p-6 shadow-md rounded-xl bg-white border">
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
        ))}
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
              {filteredData.length} Stations
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
                    onClick={() => handleSort("name")}
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
                            sortConfig.key === "name" &&
                            sortConfig.direction === "asc"
                              ? 1
                              : 0.3,
                          marginBottom: "-2px", // ลดช่องว่างระหว่างลูกศร
                        }}
                      />
                      <ArrowDropDownIcon
                        style={{
                          fontSize: "14px",
                          opacity:
                            sortConfig.key === "name" &&
                            sortConfig.direction === "desc"
                              ? 1
                              : 0.3,
                          marginTop: "-2px", // ลดช่องว่างระหว่างลูกศร
                        }}
                      />
                    </div>
                  </th>

                  <th
                    className="px-2 py-1 text-center cursor-pointer"
                    onClick={() => handleSort("brand")}
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
                            sortConfig.key === "brand" &&
                            sortConfig.direction === "asc"
                              ? 1
                              : 0.3,
                          marginBottom: "-2px",
                        }}
                      />
                      <ArrowDropDownIcon
                        style={{
                          fontSize: "14px",
                          opacity:
                            sortConfig.key === "brand" &&
                            sortConfig.direction === "desc"
                              ? 1
                              : 0.3,
                          marginTop: "-2px",
                        }}
                      />
                    </div>
                  </th>

                  <th
                    className="px-2 py-1 text-center cursor-pointer"
                    onClick={() => handleSort("address")}
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
                            sortConfig.key === "address" &&
                            sortConfig.direction === "asc"
                              ? 1
                              : 0.3,
                          marginBottom: "-2px",
                        }}
                      />
                      <ArrowDropDownIcon
                        style={{
                          fontSize: "14px",
                          opacity:
                            sortConfig.key === "address" &&
                            sortConfig.direction === "desc"
                              ? 1
                              : 0.3,
                          marginTop: "-2px",
                        }}
                      />
                    </div>
                  </th>

                  <th
                    className="px-2 py-1 text-center cursor-pointer"
                    onClick={() => handleSort("chargerCount")}
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
                            sortConfig.key === "chargerCount" &&
                            sortConfig.direction === "asc"
                              ? 1
                              : 0.3,
                          marginBottom: "-2px",
                        }}
                      />
                      <ArrowDropDownIcon
                        style={{
                          fontSize: "14px",
                          opacity:
                            sortConfig.key === "chargerCount" &&
                            sortConfig.direction === "desc"
                              ? 1
                              : 0.3,
                          marginTop: "-2px",
                        }}
                      />
                    </div>
                  </th>

                  <th
                    className="px-2 py-1 text-center"
                    onClick={() => handleSort("status")}
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
                            sortConfig.key === "status" &&
                            sortConfig.direction === "asc"
                              ? 1
                              : 0.3,
                          marginBottom: "-2px",
                        }}
                      />
                      <ArrowDropDownIcon
                        style={{
                          fontSize: "14px",
                          opacity:
                            sortConfig.key === "status" &&
                            sortConfig.direction === "desc"
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
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-2 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      Station not found
                    </td>
                  </tr>
                ) : (
                  currentData.map((record, index) => {
                    // Function to highlight the search query
                    const highlightText = (text) => {
                      if (!text || !searchQuery) return text;
                      const textString = String(text); // Convert to string if it's not already a string
                      const parts = textString.split(
                        new RegExp(`(${searchQuery})`, "gi")
                      ); // Split by search query, keeping it in the result
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
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handleChangePage(currentPage + 1)}
                disabled={
                  currentPage === totalPages || filteredData.length === 0
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
