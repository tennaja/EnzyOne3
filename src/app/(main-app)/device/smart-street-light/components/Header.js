import React, { useState, useEffect } from "react";
import Map from "./Thaimap";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import DvrIcon from "@mui/icons-material/Dvr";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Dashboard from "./Dashboard";
import DeviceControl from "./Control";
import ScheduleComponent from "./Schedul";
import {
    getSiteListData,
    getGroupListData,
    getDeviceListData
} from "@/utils/api";


const data = [
    { id: "1", device: "หลอด 1 ลานจอดรถชั้น 2", kW: 10, kWh: 100, runningHrs: 500, status: "On", dimming: 80, lastupdate: "2025-02-18 15:00:00", lat: 13.7563, lng: 100.5018 },
    { id: "2", device: "หลอด 2 ลานจอดรถชั้น 2", kW: 12, kWh: 120, runningHrs: 400, status: "Off", dimming: 60, lastupdate: "2025-02-18 15:00:00", lat: 13.7500, lng: 100.5016 },
    { id: "3", device: "หลอด 3 ลานจอดรถชั้น 2", kW: 8, kWh: 90, runningHrs: 600, status: "On", dimming: 90, lastupdate: "2025-02-18 15:00:00", lat: 13.7450, lng: 100.5020 },
    { id: "4", device: "หลอด 4 ลานจอดรถชั้น 2", kW: 15, kWh: 150, runningHrs: 550, status: "On", dimming: 85, lastupdate: "2025-02-18 15:00:00", lat: 13.7600, lng: 100.5030 },
    { id: "5", device: "หลอด 5 ลานจอดรถชั้น 2", kW: 9, kWh: 95, runningHrs: 450, status: "Offline", dimming: 70, lastupdate: "2025-02-18 15:00:00", lat: 13.7550, lng: 100.5005 },
    { id: "6", device: "หลอด 6 ลานจอดรถชั้น 2", kW: 11, kWh: 110, runningHrs: 620, status: "On", dimming: 75, lastupdate: "2025-02-18 15:00:00", lat: 13.7480, lng: 100.4998 },
    { id: "7", device: "หลอด 7 ลานจอดรถชั้น 2", kW: 13, kWh: 130, runningHrs: 580, status: "Off", dimming: 65, lastupdate: "2025-02-18 15:00:00", lat: 13.7525, lng: 100.5025 },
    { id: "8", device: "หลอด 8 ลานจอดรถชั้น 2", kW: 7, kWh: 85, runningHrs: 530, status: "On", dimming: 95, lastupdate: "2025-02-18 15:00:00", lat: 13.7445, lng: 100.5012 },
    { id: "9", device: "หลอด 9 ลานจอดรถชั้น 2", kW: 14, kWh: 140, runningHrs: 470, status: "Offline", dimming: 78, lastupdate: "2025-02-18 15:00:00", lat: 13.7510, lng: 100.5001 },
    { id: "10", device: "หลอด 10 ลานจอดรถชั้น 2", kW: 6, kWh: 80, runningHrs: 410, status: "Off", dimming: 55, lastupdate: "2025-02-18 15:00:00", lat: 13.7475, lng: 100.5035 },
    { id: "11", device: "หลอด 11 ลานจอดรถชั้น 2", kW: 16, kWh: 160, runningHrs: 590, status: "On", dimming: 88, lastupdate: "2025-02-18 15:00:00", lat: 13.7590, lng: 100.5040 },
    { id: "12", device: "หลอด 12 ลานจอดรถชั้น 2", kW: 5, kWh: 75, runningHrs: 480, status: "Off", dimming: 50, lastupdate: "2025-02-18 15:00:00", lat: 13.7430, lng: 100.4990 },
    { id: "13", device: "หลอด 13 ลานจอดรถชั้น 2", kW: 17, kWh: 170, runningHrs: 620, status: "On", dimming: 92, lastupdate: "2025-02-18 15:00:00", lat: 13.7625, lng: 100.5055 },
    { id: "14", device: "หลอด 14 ลานจอดรถชั้น 2", kW: 18, kWh: 180, runningHrs: 640, status: "Offline", dimming: 85, lastupdate: "2025-02-18 15:00:00", lat: 13.7640, lng: 100.5070 },
    { id: "15", device: "หลอด 15 ลานจอดรถชั้น 2", kW: 7, kWh: 87, runningHrs: 510, status: "On", dimming: 98, lastupdate: "2025-02-18 15:00:00", lat: 13.7415, lng: 100.4985 },
    { id: "16", device: "หลอด 16 ลานจอดรถชั้น 2", kW: 12, kWh: 125, runningHrs: 575, status: "Off", dimming: 63, lastupdate: "2025-02-18 15:00:00", lat: 13.7508, lng: 100.5062 },
    { id: "17", device: "หลอด 17 ลานจอดรถชั้น 2", kW: 9, kWh: 100, runningHrs: 540, status: "On", dimming: 77, lastupdate: "2025-02-18 15:00:00", lat: 13.7533, lng: 100.5010 },
    { id: "18", device: "หลอด 18 ลานจอดรถชั้น 2", kW: 15, kWh: 155, runningHrs: 600, status: "On", dimming: 90, lastupdate: "2025-02-18 15:00:00", lat: 13.7577, lng: 100.5050 },
    { id: "19", device: "หลอด 19 ลานจอดรถชั้น 2", kW: 10, kWh: 110, runningHrs: 430, status: "Offline", dimming: 55, lastupdate: "2025-02-18 15:00:00", lat: 13.7492, lng: 100.4995 },
    { id: "20", device: "หลอด 20 ลานจอดรถชั้น 2", kW: 14, kWh: 145, runningHrs: 615, status: "On", dimming: 88, lastupdate: "2025-02-18 15:00:00", lat: 13.7611, lng: 100.5080 },
    { id: "21", device: "หลอด 21 ลานจอดรถชั้น 2", kW: 11, kWh: 115, runningHrs: 590, status: "Off", dimming: 70, lastupdate: "2025-02-18 15:00:00", lat: 13.7540, lng: 100.4970 },
    { id: "22", device: "หลอด 22 ลานจอดรถชั้น 2", kW: 16, kWh: 165, runningHrs: 570, status: "On", dimming: 82, lastupdate: "2025-02-18 15:00:00", lat: 13.7585, lng: 100.5028 },
    { id: "23", device: "หลอด 23 ลานจอดรถชั้น 2", kW: 8, kWh: 90, runningHrs: 460, status: "Off", dimming: 58, lastupdate: "2025-02-18 15:00:00", lat: 13.7422, lng: 100.4965 },
    { id: "24", device: "หลอด 24 ลานจอดรถชั้น 2", kW: 13, kWh: 135, runningHrs: 625, status: "On", dimming: 94, lastupdate: "2025-02-18 15:00:00", lat: 13.7568, lng: 100.5065 },
    { id: "25", device: "หลอด 25 ลานจอดรถชั้น 2", kW: 9, kWh: 95, runningHrs: 450, status: "Off", dimming: 60, lastupdate: "2025-02-18 15:00:00", lat: 13.7478, lng: 100.4980 },
    { id: "26", device: "หลอด 26 ลานจอดรถชั้น 2", kW: 17, kWh: 175, runningHrs: 655, status: "On", dimming: 96, lastupdate: "2025-02-18 15:00:00", lat: 13.7655, lng: 100.5095 },
    { id: "27", device: "หลอด 27 ลานจอดรถชั้น 2", kW: 6, kWh: 85, runningHrs: 490, status: "Offline", dimming: 53, lastupdate: "2025-02-18 15:00:00", lat: 13.7447, lng: 100.4955 },
    { id: "28", device: "หลอด 28 ลานจอดรถชั้น 2", kW: 19, kWh: 195, runningHrs: 680, status: "On", dimming: 99, lastupdate: "2025-02-18 15:00:00", lat: 13.7680, lng: 100.5105 },
    { id: "29", device: "หลอด 29 ลานจอดรถชั้น 2", kW: 10, kWh: 120, runningHrs: 520, status: "Off", dimming: 65, lastupdate: "2025-02-18 15:00:00", lat: 13.7515, lng: 100.5038 },
    { id: "30", device: "หลอด 30 ลานจอดรถชั้น 2", kW: 15, kWh: 160, runningHrs: 660, status: "On", dimming: 87, lastupdate: "2025-02-18 15:00:00", lat: 13.7602, lng: 100.5072 }
];



const Header1 = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sitelist, setSitelist] = useState();
    const [grouplist, setGrouplist] = useState();
    const [devcielist , setDevicelist] = useState([]);
    const [siteid, setSiteid] = useState(0);
    const [groupid, setGroupid] = useState(0);
    const [siteName , setSiteName] = useState('');
    const [groupName , setGroupName] = useState('');



    useEffect(() => {
        getSiteList();
        GetDeviceList();
    }, []);

    //Get site
    const getSiteList = async () => {
        const result = await getSiteListData();
        console.log(result)
        console.log(result.length)
        if (Array.isArray(result) && result.length > 0) {
            setSitelist(result);
            setSiteid(result[0].id)
            console.log(result[0].id)
            getGroupList(result[0].id);
            setSiteName(result[0].name)
        }
    };

    const getGroupList = async (siteid) => {
        console.log("Site ID:", siteid);
        setSiteid(siteid);
        
        const result = await getGroupListData(siteid);
        console.log("Group List Result:", result);
        
        if (Array.isArray(result) && result.length > 0) {
            setGrouplist(result);
            const firstGroupId = result[0].id ?? "" 
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
        setSiteid(siteid)
        setGroupid(groupid);
        const paramsNav = {
            siteId: siteid,
            groupId: groupid
          };
    const result = await getDeviceListData(paramsNav)
    if(result.data.length > 0){
        setDevicelist(result.data)
    }
      };

      

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <Dashboard deviceData={devcielist} FetchDevice={GetDeviceList}/>;
            case "control":
                return <DeviceControl />;
            case "schedule":
                return <ScheduleComponent />;
            default:
                return null;
        }
    };
    useEffect(() => {
        // Check if the active tab is 'dashboard'
        if (activeTab === "dashboard") {
            GetDeviceList();
        }
    }, [activeTab]);  // This will run whenever `activeTab` changes.

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
                                setSiteName(event.target.selectedOptions[0].text);
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
                                setGroupName(event.target.selectedOptions[0].text);
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

                    <button className="text-white bg-[#33BFBF] rounded-md text-lg px-10 h-9" onClick={GetDeviceList}>Search</button>
                </div>
            </div>

            <div className="grid rounded-xl bg-white p-6 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
                <div>
                    <span className="text-lg font-bold block mb-2">Device List</span>
                    <p className="text-base mb-4">{siteName} | {groupName}</p>

                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default Header1;
