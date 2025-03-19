"use client";
import React, { useState, useEffect } from "react";
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
    setSiteId
} from "@/redux/slicer/smartstreetlightSlice"

const Header1 = () => {
    
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
    const [selectedSiteName, setSelectedSiteName] = useState('');
const [selectedGroupName, setSelectedGroupName] = useState('');
    const dispatch = useDispatch();
    const SelectIdSite = useSelector((state) => state.smartstreetlightData.siteId);
    console.log('SelectIdSite:', SelectIdSite);


    useEffect(() => {
        getSiteList();
    }, []);
    

    //Get site
    const getSiteList = async () => {
        const result = await getSiteListData();
        console.log(result);
        console.log(result.length);
        
        if (result.length > 0) {
            setSitelist(result);
    
            const siteId = result[0].id ?? 0; // ถ้า id เป็น null ให้ใช้ 0
            setSiteid(siteId);
            setSiteName(result[0].name);
            dispatch(setSiteId(siteId)); // dispatch action setId กับค่า siteId
            getGroupList(siteId);

        }
    };
    

    const getGroupList = async (siteid) => {
        console.log("Site ID:", siteid);
        setSiteid(siteid);
        const result = await getGroupListData(siteid);
        console.log("Group List Result:", result);
        if (result.length > 0) {
            setGrouplist(result);
            const firstGroupId = result[0].id ?? 0 
            console.log("First Group ID:", firstGroupId);
            setGroupid(firstGroupId);
            setGroupName(result[0].name)
        } else {
            console.log("No groups found!");
        }
    };
    
    

    const Groupchange = (groupid) => {
        console.log(groupid)
        setGroupid(groupid);
      };

    
    //Get DeviceList use in search button 
    const GetDeviceList = async () => {
        setLoading(true); // เริ่มโหลด
        setSiteid(siteid);
        setGroupid(groupid);
    
        const paramsNav = {
            siteId: siteid,
            groupId: groupid
        };
    
        try {
            const result = await getDeviceListData(paramsNav);
            if (result.data.length > 0) {
                setDevicelist(result.data);
            }
        } catch (error) {
            console.error("Error fetching device list:", error);
        } finally {
            setLoading(false); // หยุดโหลด ไม่ว่า success หรือ error
        }
    };
    

    const GetScheduleList = async () => {
        setSiteid(siteid)
        setGroupid(groupid);
        const paramsNav = {
            siteId: siteid,
            groupId: groupid
          };
    const result = await getScheduleListData(paramsNav)
    console.log(result)
    if(result?.data?.length > 0){
        setSchedulelist(result.data)
    }else{
        setSchedulelist([])
    }
      };
      const handleSearch = () => {
        console.log(selectedSiteName)
        console.log(selectedGroupName)
        // กดปุ่มค้นหาจะทำการเรียกทั้ง GetDeviceList และ GetScheduleList
        setSiteName(selectedSiteName);
        setGroupName(selectedGroupName);
        GetDeviceList();
        GetScheduleList();
    };
      

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <Dashboard 
                deviceData={devcielist} 
                // FetchDevice={GetDeviceList}
                Sitename={siteName}
                Groupname={groupName}
                />;
            case "control":
                return <DeviceControlPage 
                deviceData={devcielist} 
                FetchDevice={GetDeviceList}
                Sitename={siteName}
                Groupname={groupName}
                />;
            case "schedule":
                return <ScheduleComponent  
                deviceData={devcielist} 
                scheduleData ={schedulelist} 
                FetchSchedule={GetScheduleList} 
                GroupId={groupid}
                Sitename={siteName}
                Groupname={groupName}
                />
            default:
                return null;
        }
    };

    
    useEffect(() => {
        if (activeTab === "dashboard" ) {
            GetDeviceList();
        }
        else if(activeTab === "schedule"){
            GetScheduleList();
        }
    }, [activeTab]); // ให้แน่ใจว่า `activeTab` เป็น dependency ตัวเดียว

    // useEffect(() => {
    //     // ตั้งค่าการรีเฟรชทุก 1 นาที (60000 มิลลิวินาที)
    //     const interval = setInterval(() => {
    //         GetDeviceList();
    //     }, 60000);
    
    //     // เคลียร์ interval เมื่อ component ถูก unmount
    //     return () => clearInterval(interval);
    // }, []);
    return (
        <>
            <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Smart Street Light</span>
                    <div className="flex gap-3">
                        <button
                            className={`px-4 py-2 rounded-lg transition ${activeTab === "dashboard" ? "bg-[#33BFBF] text-white" : "bg-gray-100"}`}
                            onClick={() => setActiveTab("dashboard")}
                        >
                            <DvrIcon className="mr-2" /> Dashboard
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg transition ${activeTab === "control" ? "bg-[#33BFBF] text-white" : "bg-gray-100"}`}
                            onClick={() => setActiveTab("control")}
                        >
                            <TuneIcon className="mr-2" /> Control
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg transition ${activeTab === "schedule" ? "bg-[#33BFBF] text-white" : "bg-gray-100"}`}
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
                                getGroupList(event.target.value);
                                setSelectedSiteName(event.target.selectedOptions[0].text);
                            }}
                            value={siteid}
                        >
                            {sitelist?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))
                            }
                        </select>

                    </div>
                    <div>
                        <span className="text-sm">Groups: </span>
                        <select className="w-44 border border-slate-300 mx-2 rounded-md h-9"
                            onChange={(event) => {
                                Groupchange(event.target.value)
                                setSelectedGroupName(event.target.selectedOptions[0].text);
                            }}
                            value={groupid}
                            >
                            {grouplist?.map((item) => {
                                return (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                );
                            })}
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
