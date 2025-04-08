"use client";
import React, { useState, useEffect, useRef } from "react";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import DvrIcon from "@mui/icons-material/Dvr";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Dashboard from "./Dashboard";
import DeviceControlPage from "./Control";
import ScheduleComponent from "./Schedul";
import { useDispatch, useSelector } from "react-redux";
import {
  getSiteListData,
  getGroupListData,
  getDeviceListData,
  getScheduleListData,
} from "@/utils/api";
import { ClipLoader } from "react-spinners";

import {
  setSiteId,
  setGroupId,
  clearAll,
} from "@/redux/slicer/smartstreetlightSlice";
import Select from 'react-select';

const Header = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sitelist, setSitelist] = useState();
  const [grouplist, setGrouplist] = useState();
  const [devcielist, setDevicelist] = useState([]);
  const [schedulelist, setSchedulelist] = useState([]);
  const [siteid, setSiteid] = useState(0);
  const [groupid, setGroupid] = useState(0);
  const [siteName, setSiteName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedSiteName, setSelectedSiteName] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [isfirst, setIsfirst] = useState(true);
  const hasFetchedSchedule = useRef(false); // ใช้เพื่อป้องกันการเรียกซ้ำ

  const SelectIdSite = useSelector(
    (state) => state.smartstreetlightData.siteId
  );
  const SelectIdGroup = useSelector(
    (state) => state.smartstreetlightData.groupId
  );

  useEffect(() => {
    const clearAndFetch = async () => {
      dispatch(clearAll()); // Dispatch clearAll first
      await getSiteList(); // Wait for the data to be fetched (if it's async)
    };

    clearAndFetch();
  }, [dispatch]);

  //Get site
  const getSiteList = async () => {
    const result = await getSiteListData();
    console.log(result);
    console.log(result.length);

    if (result.length > 0) {
      setSitelist(result);
      const siteId = result[0].id ?? 0; // ถ้า id เป็น null ให้ใช้ 0

      if (isfirst) {
        // ใช้ isfirst จาก useState
        setSiteName(result[0].name);
        setSiteid(siteId);
        setSelectedSiteId(siteId);
        setSelectedSiteName(result[0].name);
        setIsfirst(false); // เซ็ตให้เป็น false หลังจากใช้งานครั้งแรก
      } else {
        setSiteid(siteId);
        setSelectedSiteId(siteId);
        setSelectedSiteName(result[0].name);
      }

      getGroupList(siteId);
    }
  };

  const getGroupList = async (siteid) => {
    console.log("Site ID:", siteid);
    setSiteid(siteid ?? 0);
    const result = await getGroupListData(siteid);
    console.log("Group List Result:", result);

    if (result.length > 0) {
      // กรองค่า "0" เฉพาะเมื่ออยู่ในแท็บ "schedule"
      const filteredGroupList =
        activeTab === "schedule"
          ? result.filter((item) => item.id !== "0" && item.id !== null)
          : result;

      setGrouplist(filteredGroupList);

      const firstGroupId = filteredGroupList[0]?.id ?? 0;
      console.log("First Group ID:", firstGroupId);

      if (isfirst) {
        // ใช้ isfirst จาก useState
        setGroupName(filteredGroupList[0]?.name || "");
        setGroupid(firstGroupId);
        setSelectedGroupId(firstGroupId);
        setSelectedGroupName(filteredGroupList[0]?.name || "");
        setIsfirst(false); // เซ็ตให้เป็น false หลังจากใช้งานครั้งแรก
      } else if (firstGroupId !== "0") {
        // ป้องกันการตั้งค่า groupid เป็น "0"
        setGroupid(firstGroupId);
        setSelectedGroupId(firstGroupId);
        setSelectedGroupName(filteredGroupList[0]?.name || "");
        console.log(filteredGroupList[0]?.name || "");
      }
    } else {
      console.log("No groups found!");
      setGrouplist([]); // ตั้งค่า grouplist เป็นว่างถ้าไม่มีข้อมูล
    }
  };

  const Groupchange = (groupid) => {
    console.log(groupid);
    setGroupid(groupid);
  };

  const optionsSite = Array.isArray(sitelist) ? sitelist
    .filter(
      (item) => !(activeTab === "schedule" && item.name === "All sites")
    )
    .map((item) => ({
      value: item.id ?? "0",
      label: item.name
    })) : [];

    const optionsGroup = Array.isArray(grouplist) ? grouplist
  .filter(
    (item) => !(activeTab === "schedule" && item.name === "All groups")
  )
  .map((item) => ({
    value: item.id ?? "0",
    label: item.siteName ? `${item.siteName} - ${item.name}` : item.name,

    // หรือถ้าต้องการรวมใน value ก็สามารถทำได้:
    // value: `${item.id}-${selectsitename}`,
  })) : [];


  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard Sitename={siteName} Groupname={groupName} />;
      case "control":
        return (
          <DeviceControlPage
            deviceData={devcielist}
            Sitename={siteName}
            Groupname={groupName}
          />
        );
      case "schedule":
        return (
          <ScheduleComponent
            GroupId={groupid}
            Sitename={siteName}
            Groupname={groupName}
          />
        );
      default:
        return null;
    }
  };

  const hasDispatchedSite = useRef(false);
  const hasDispatchedGroup = useRef(false);

  // กำหนด prevSiteId และ prevGroupId เพื่อเก็บค่าที่เคยเลือกไว้ก่อนหน้า
  const prevSiteId = useRef(null);
  const prevGroupId = useRef(null);

  useEffect(() => {
    if (activeTab === "schedule" && sitelist?.length > 0) {
      console.log("Checking site list...");

      const filteredSiteList = sitelist.filter(
        (item) => item.id !== "0" && item.id !== null
      );
      const firstValidSiteId = filteredSiteList[0]?.id;

      if (filteredSiteList.length > 0 && (!siteid || siteid === "0")) {
        console.log("Replacing '0' with new site ID:", firstValidSiteId);

        // Only dispatch if the current siteid is not equal to the first valid site ID
        if (siteid !== firstValidSiteId) {
          dispatch(setSiteId(firstValidSiteId)); // Dispatch only when the siteid is not the first valid site ID
          setSiteName(filteredSiteList[0]?.name || "");
          setSiteId(firstValidSiteId);
          setSelectedSiteId(firstValidSiteId);
          setSelectedSiteName(filteredSiteList[0]?.name || "");
          console.log("Fetching group list for new site ID:", firstValidSiteId);
          getGroupList(firstValidSiteId);

          hasFetchedSchedule.current = false;
        }

        if (!hasDispatchedSite.current) {
          console.log("SITEID is 000000");
          hasDispatchedSite.current = true;
        }
      } else if (
        siteid &&
        siteid !== "0" &&
        siteid !== firstValidSiteId &&
        siteid !== prevSiteId.current
      ) {
        console.log("User manually selected site ID:", siteid);
        prevSiteId.current = siteid; // Update prevSiteId when manually selected
        hasDispatchedSite.current = true; // Prevent dispatch when the user manually selects a site ID
      }
    }
  }, [activeTab, sitelist, siteid]);

  useEffect(() => {
    if (activeTab === "schedule" && grouplist?.length > 0) {
      console.log("Checking group list...");

      const filteredGroupList = grouplist.filter(
        (item) => item.id !== "0" && item.id !== null
      );
      const firstValidGroupId = filteredGroupList[0]?.id;

      if (filteredGroupList.length > 0 && (!groupid || groupid === "0")) {
        console.log("Replacing '0' with new group ID:", firstValidGroupId);

        // เพิ่มเงื่อนไขเพื่อป้องกัน dispatch เมื่อ groupid เท่ากับ "0"
        if (firstValidGroupId && firstValidGroupId !== "0") {
          dispatch(setGroupId(firstValidGroupId));
          setGroupName(filteredGroupList[0]?.name || "");
          setSelectedGroupId(firstValidGroupId);
          setSelectedGroupName(filteredGroupList[0]?.name || "");

          console.log(
            "Calling Groupchange for new group ID:",
            firstValidGroupId
          );
          Groupchange(firstValidGroupId);

          hasFetchedSchedule.current = false;

          if (!hasDispatchedGroup.current) {
            console.log("GROUPID is 000000000000");
            hasDispatchedGroup.current = true;
          }
        }
      } else if (
        groupid &&
        groupid !== "0" &&
        groupid !== prevGroupId.current
      ) {
        console.log("User manually selected group ID:", groupid);
        prevGroupId.current = groupid;
        hasDispatchedGroup.current = true;
      }
    }
  }, [activeTab, grouplist, groupid]);

  const handleSearch = () => {
    console.log("Searching with:", selectedSiteName, selectedGroupName);

    setSiteName(selectedSiteName);
    setGroupName(selectedGroupName);

    setSiteid(selectedSiteId);
    dispatch(setSiteId(selectedSiteId));

    setGroupid(selectedGroupId);
    dispatch(setGroupId(selectedGroupId));

    // รีเซ็ตให้ useEffect สามารถ dispatch ได้อีกถ้ารายการถูกตัดอีกรอบ
    hasDispatchedSite.current = false;
    hasDispatchedGroup.current = false;
    prevSiteId.current = selectedSiteId; // รีเซ็ต prevSiteId เมื่อค้นหา
    prevGroupId.current = selectedGroupId; // รีเซ็ต prevGroupId เมื่อค้นหา
  };

  return (
    <>
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Smart Street Light</span>
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === "dashboard"
                  ? "bg-[#33BFBF] text-white"
                  : "border border-[#33BFBF] text-[#33BFBF]"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <DvrIcon className="mr-2" /> Dashboard
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === "control"
                  ? "bg-[#33BFBF] text-white"
                  : "border border-[#33BFBF] text-[#33BFBF]"
              }`}
              onClick={() => setActiveTab("control")}
            >
              <TuneIcon className="mr-2" /> Control
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === "schedule"
                  ? "bg-[#33BFBF] text-white"
                  : "border border-[#33BFBF] text-[#33BFBF]"
              }`}
              onClick={() => setActiveTab("schedule")}
            >
              <CalendarMonthOutlinedIcon className="mr-2" /> Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
      <div className="flex gap-5 items-center">
  <div className="flex items-center gap-2">
    <span className="text-sm">Site:</span>
    <Select
    className="w-44"
      options={optionsSite}
      isSearchable={true}
      value={optionsSite.find(option => option.value === siteid) || optionsSite[0] || null}
      onChange={(selectedOption) => {
        const selectedValue = selectedOption?.value || "0";
        setSelectedSiteId(selectedValue);
        getGroupList(selectedValue);
        setSelectedSiteName(selectedOption?.label || "");
      }}
      styles={{
        control: (provided) => ({
          ...provided,
          height: '2.25rem',
          borderColor: 'rgb(203 213 225)',
          borderRadius: '0.375rem',
          zIndex: 10,  // เพิ่ม z-index ที่ control
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,  // เพิ่ม z-index ที่เมนูเลือก
          position: 'absolute',  // ตั้ง position เป็น absolute
        }),
      }}
    />
  </div>

  <div className="flex items-center gap-2">
    <span className="text-sm">Groups:</span>
    <Select
      className="w-60"
      options={optionsGroup}
      isSearchable={true}
      value={optionsGroup.find(option => option.value === groupid) || optionsGroup[0] || null}
      onChange={(selectedOption) => {
        const selectedValue = selectedOption?.value || "0";
        setSelectedGroupId(selectedValue);
        Groupchange(selectedValue);
        setSelectedGroupName(
          selectedOption?.label?.includes(" - ") ? selectedOption.label.split(" - ")[1] : selectedOption?.label || ""
        );
        
      }}
      styles={{
        control: (provided) => ({
          ...provided,
          height: '2.25rem',
          borderColor: 'rgb(203 213 225)',
          borderRadius: '0.375rem',
          zIndex: 10,  // เพิ่ม z-index ที่ control
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,  // เพิ่ม z-index ที่เมนูเลือก
          position: 'absolute',  // ตั้ง position เป็น absolute
        }),
      }}
    />
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

      {renderContent()}
    </>
  );
};

export default Header;

