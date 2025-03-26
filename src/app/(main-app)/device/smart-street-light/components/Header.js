"use client";
import React, { useState, useEffect,useRef } from "react";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import DvrIcon from "@mui/icons-material/Dvr";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Dashboard from "./Dashboard";
import DeviceControlPage from "./Control";
import ScheduleComponent from "./Schedul";
import { useDispatch, useSelector} from "react-redux";
import {
    getSiteListData,
    getGroupListData,
    getDeviceListData,
    getScheduleListData
} from "@/utils/api";
import { ClipLoader } from "react-spinners";

import {
    setSiteId,setGroupId,clearAll
} from "@/redux/slicer/smartstreetlightSlice"

const Header1 = () => {
    const dispatch = useDispatch();
    
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sitelist, setSitelist] = useState();
    const [grouplist, setGrouplist] = useState();
    const [devcielist , setDevicelist] = useState([]);
    const [schedulelist , setSchedulelist] = useState([]);
    const [siteid, setSiteid] = useState(0);
    const [groupid, setGroupid] = useState(0);
    const [siteName , setSiteName] = useState('');
    const [groupName , setGroupName] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedSiteId, setSelectedSiteId] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [selectedSiteName, setSelectedSiteName] = useState('');
    const [selectedGroupName, setSelectedGroupName] = useState('');
    const [isfirst,setIsfirst] = useState(true)
    const hasFetchedSchedule = useRef(false); // ใช้เพื่อป้องกันการเรียกซ้ำ
    
    const SelectIdSite = useSelector((state) => state.smartstreetlightData.siteId);
    const SelectIdGroup = useSelector((state) => state.smartstreetlightData.groupId);
    


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
            
            if (isfirst) { // ใช้ isfirst จาก useState
                setSiteName(result[0].name);
                setSiteid(siteId);
                setSelectedSiteId(siteId)
                setSelectedSiteName(result[0].name)
                setIsfirst(false); // เซ็ตให้เป็น false หลังจากใช้งานครั้งแรก
            }else{
                setSiteid(siteId);
                setSelectedSiteId(siteId)
                setSelectedSiteName(result[0].name)
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
            setGrouplist(result);
            const firstGroupId = result[0].id ?? 0;
            console.log("First Group ID:", firstGroupId);
            if (isfirst ) { // ใช้ isfirst จาก useState
                setGroupName(result[0].name);
                setGroupid(firstGroupId);
                setSelectedGroupId(firstGroupId)
                setSelectedGroupName(result[0].name);
                setIsfirst(false); // เซ็ตให้เป็น false หลังจากใช้งานครั้งแรก
            }else{
                setGroupid(firstGroupId);
                setSelectedGroupId(firstGroupId)
                setSelectedGroupName(result[0].name);
                console.log(result[0].name);
            }
            
        } else {
            console.log("No groups found!");
        }
    };
    
    
    

    const Groupchange = (groupid) => {
        console.log(groupid)
        setGroupid(groupid);
      };

    
    


      const handleSearch = () => {
        console.log(selectedSiteName)
        console.log(selectedGroupName)
        // กดปุ่มค้นหาจะทำการเรียกทั้ง GetDeviceList และ GetScheduleList
        setSiteName(selectedSiteName);
        setGroupName(selectedGroupName);
        setSiteid(selectedSiteId)
        setGroupid(selectedGroupId)
        dispatch(setSiteId(selectedSiteId));
        dispatch(setGroupId(selectedGroupId));
       
    };
      

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <Dashboard 
                Sitename={siteName}
                Groupname={groupName}
                />;
            case "control":
                return <DeviceControlPage 
                deviceData={devcielist} 
                
                Sitename={siteName}
                Groupname={groupName}
                />;
            case "schedule":
                return <ScheduleComponent  
                GroupId={groupid}
                Sitename={siteName}
                Groupname={groupName}
                />
            default:
                return null;
        }
    };

    
    
    
    useEffect(() => {
        if (activeTab === "schedule" && sitelist?.length > 0) {
          const filteredSiteList = sitelist.filter((item) => item.name !== "All sites");
      
          if (filteredSiteList.length > 0 && (!siteid || siteid === "0")) {
            const newSiteId = filteredSiteList[0]?.id;
            setSiteId(newSiteId);
            setSelectedSiteId(newSiteId);
            dispatch(setSiteId(newSiteId));
            setSiteName(filteredSiteList[0]?.name || "");
            setSelectedSiteName(filteredSiteList[0]?.name || "");
      
            if (siteid !== newSiteId) {
              getGroupList(newSiteId); // เรียกเฉพาะเมื่อ siteId เปลี่ยนจริง ๆ
            }
      
            hasFetchedSchedule.current = false;
          }
        }
      }, [activeTab, sitelist, siteid]); // เพิ่ม siteid เพื่อลดการเซ็ตค่าใหม่โดยไม่จำเป็น
      
      useEffect(() => {
        if (activeTab === "schedule" && grouplist?.length > 0) {
          const filteredGroupList = grouplist.filter((item) => item.name !== "All groups");
      
          if (filteredGroupList.length > 0 && (!groupid || groupid === "0")) {
            const newGroupId = filteredGroupList[0]?.id;
            setSelectedGroupId(newGroupId);
            dispatch(setGroupId(newGroupId));
            setGroupName(filteredGroupList[0]?.name || "");
            setSelectedGroupName(filteredGroupList[0]?.name || "");
      
            if (groupid !== newGroupId) {
              Groupchange(newGroupId); // เรียกเฉพาะเมื่อ groupId เปลี่ยนจริง ๆ
            }
      
            hasFetchedSchedule.current = false;
          }
        }
      }, [activeTab, grouplist, groupid]); // เพิ่ม groupid เพื่อลดการเซ็ตค่าใหม่โดยไม่จำเป็น
      
      useEffect(() => {
        if (activeTab === "schedule" && siteid && groupid) {
          if (!hasFetchedSchedule.current) {
            console.log("Fetching schedule list for the first time...");
            hasFetchedSchedule.current = true;
          }
        }
      }, [activeTab, siteid, groupid]);
      
      useEffect(() => {
        if (activeTab === "schedule") {
          console.log("Resetting fetch flag due to site or group list change...");
          hasFetchedSchedule.current = false;
        }
      }, [sitelist, grouplist]); // ตัด activeTab ออกเพราะไม่จำเป็น
      
    return (
        <>
            <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Smart Street Light</span>
                    <div className="flex gap-3">
                        <button
                            className={`px-4 py-2 rounded-lg transition ${activeTab === "dashboard" ? "bg-[#33BFBF] text-white" : "border border-[#33BFBF] text-[#33BFBF]"}`}
                            onClick={() => setActiveTab("dashboard")}
                        >
                            <DvrIcon className="mr-2" /> Dashboard
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg transition ${activeTab === "control" ? "bg-[#33BFBF] text-white" : "border border-[#33BFBF] text-[#33BFBF]"}`}
                            onClick={() => setActiveTab("control")}
                        >
                            <TuneIcon className="mr-2" /> Control
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg transition ${activeTab === "schedule" ? "bg-[#33BFBF] text-white" : "border border-[#33BFBF] text-[#33BFBF]"}`}
                            onClick={() => setActiveTab("schedule")}
                        >
                            <CalendarMonthOutlinedIcon className="mr-2" /> Schedule
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
                <div className="flex gap-5">
                    <div>
                        <span className="text-sm">Site: </span>
                        <select
  className="w-44 border border-slate-300 mx-2 rounded-md h-9"
  onChange={(event) => {
    const selectedValue = event.target.value || "0"; // ถ้าเป็น null หรือ undefined ให้ใช้ "0"
    setSelectedSiteId(selectedValue); // เก็บค่า siteId ใน Redux
    getGroupList(selectedValue);
    setSelectedSiteName(event.target.selectedOptions[0]?.text || ""); // ป้องกัน undefined
  }}
  value={siteid ?? "0"} // ถ้า siteid เป็น null ให้ใช้ "0"
>
  {sitelist
    ?.filter((item) => !(activeTab === "schedule" && item.name === "All sites"))
    .map((item) => (
      <option key={item.id} value={item.id ?? "0"}>
        {item.name}
      </option>
    ))}
</select>



                    </div>
                    <div>
                        <span className="text-sm">Groups: </span>
                        <select
  className="w-44 border border-slate-300 mx-2 rounded-md h-9"
  onChange={(event) => {
    const selectedValue = event.target.value || "0"; // ถ้าเป็น null หรือ undefined ให้ใช้ "0"
    setSelectedGroupId(selectedValue); // เก็บค่า groupId ใน Redux
    Groupchange(selectedValue);
    setSelectedGroupName(event.target.selectedOptions[0]?.text || ""); // ป้องกัน undefined
  }}
  value={groupid ?? "0"} // ถ้า groupid เป็น null ให้ใช้ "0"
>
  {grouplist
    ?.filter((item) => !(activeTab === "schedule" && item.name === "All groups"))
    .map((item) => (
      <option key={item.id} value={item.id ?? "0"}>
        {item.name}
      </option>
    ))}
</select>

                    </div>

            
            <button type="button" className="text-white bg-[#33BFBF] rounded-md text-lg px-10 h-9" onClick={handleSearch}>Search</button>
                </div>
            </div>

            
                    {renderContent()}
               
        </>
    );
};

export default Header1;
