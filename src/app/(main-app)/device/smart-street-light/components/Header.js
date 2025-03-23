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
    setSiteId,setGroupId
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
    const [selectedSiteId, setSelectedSiteId] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [selectedSiteName, setSelectedSiteName] = useState('');
    const [selectedGroupName, setSelectedGroupName] = useState('');

    const [isfirst,setIsfirst] = useState(true)
    const hasFetchedSchedule = useRef(false); // ใช้เพื่อป้องกันการเรียกซ้ำ
    const dispatch = useDispatch();
    const SelectIdSite = useSelector((state) => state.smartstreetlightData.siteId);
    const SelectIdGroup = useSelector((state) => state.smartstreetlightData.groupId);
    console.log('SelectIdSite:', SelectIdSite);
    console.log('SelectIdGroup:', SelectIdGroup);


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
            
            if (isfirst) { // ใช้ isfirst จาก useState
                setSiteName(result[0].name);
                setSiteid(siteId);
                setIsfirst(false); // เซ็ตให้เป็น false หลังจากใช้งานครั้งแรก
            }else{
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
        setSiteid(selectedSiteId)
        setGroupid(selectedGroupId)
        dispatch(setSiteId(selectedSiteId));
        dispatch(setGroupId(selectedGroupId));
        GetDeviceList();
        GetScheduleList();
    };
      

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <Dashboard 
                deviceData={devcielist} 
                FetchDevice={GetDeviceList}
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
        if (activeTab === "dashboard") {
            GetDeviceList();
        }
    }, [activeTab]); // ให้แน่ใจว่า `activeTab` เป็น dependency ตัวเดียว
    
    useEffect(() => {
        if (activeTab === "control") {
            GetDeviceList();
        }
    }, [activeTab]); // ให้แน่ใจว่า `activeTab` เป็น dependency ตัวเดียว
    

    useEffect(() => {
        if (activeTab === "schedule" && sitelist?.length > 0) {
          // กรองรายการ sitelist
          let filteredSiteList = sitelist.filter((item) => item.name !== "All sites");
          console.log("Filtered Site List:", filteredSiteList);
    
          // ถ้ามีรายการที่กรองแล้วและ siteid ยังไม่ได้ถูกเซ็ต
          if (filteredSiteList.length > 0 && (!siteid || siteid === "0")) {
            const newSiteId = filteredSiteList[0]?.id;
            console.log("Setting site ID:", newSiteId);
    
            // เซ็ต siteid ใหม่
            setSiteId(newSiteId);
            setSelectedSiteId(newSiteId);
            setSiteName(filteredSiteList[0]?.name || "");
            setSelectedSiteName(filteredSiteList[0]?.name || "");
            getGroupList(newSiteId); // เรียก getGroupList ใหม่หลังจากเซ็ต siteid
            hasFetchedSchedule.current = false; // รีเซ็ต fetch flag
          }
        }
      }, [activeTab, sitelist]); // ตรวจสอบการเปลี่ยนแปลงของ activeTab หรือ sitelist
    
      // useEffect สำหรับการเซ็ตค่า groupid
      useEffect(() => {
        if (activeTab === "schedule" && grouplist?.length > 0) {
          let filteredGroupList = grouplist.filter((item) => item.name !== "All groups");
          console.log("Filtered Group List:", filteredGroupList);
    
          // ถ้ามีรายการที่กรองแล้วและ groupid ยังไม่ได้ถูกเซ็ต
          if (filteredGroupList.length > 0 && (!groupid || groupid === "0")) {
            const newGroupId = filteredGroupList[0]?.id;
            console.log("Setting Group ID:", newGroupId);
    
            // เซ็ต groupid ใหม่
            setSelectedGroupId(newGroupId);
            Groupchange(newGroupId); // เรียก Groupchange เพื่ออัพเดตกลุ่ม
            setGroupName(filteredGroupList[0]?.name || "");
            setSelectedGroupName(filteredGroupList[0]?.name || "");
            hasFetchedSchedule.current = false; // รีเซ็ต fetch flag
          }
        }
      }, [activeTab, grouplist]); // ตรวจสอบการเปลี่ยนแปลงของ activeTab หรือ grouplist
    
      // useEffect สำหรับดึงข้อมูล schedule list
      useEffect(() => {
        if (activeTab === "schedule" && siteid && groupid) {
          if (!hasFetchedSchedule.current) {
            console.log("Fetching schedule list for the first time...");
            GetScheduleList(); // เรียก API เพื่อดึงข้อมูล
            hasFetchedSchedule.current = true; // ตั้งค่าให้เป็น true หลังจากเรียก API ครั้งแรก
          }
        }
      }, [activeTab, siteid, groupid]); // ตรวจสอบการเปลี่ยนแปลงของ activeTab, siteid, groupid
    
      // รีเซ็ต `hasFetchedSchedule` ถ้า sitelist หรือ grouplist เปลี่ยน (เช่น ถูกตัดรายการ)
      useEffect(() => {
        if (activeTab === "schedule") {
          console.log("Resetting fetch flag due to site or group list change...");
          hasFetchedSchedule.current = false; // ทำให้สามารถเรียกใหม่ได้
        }
      }, [sitelist, grouplist, activeTab]); // เมื่อ sitelist หรือ grouplist เปลี่ยน
    
      // useEffect ที่จะเซ็ตค่า `siteid` และ `groupid` เป็นค่าแรกเมื่อกลับมาที่หน้า "schedule"
      useEffect(() => {
        if (activeTab === "schedule") {
          // กรองรายการ sitelist
          let filteredSiteList = sitelist.filter((item) => item.name !== "All sites");
          // ถ้ามีรายการที่กรองแล้ว และ siteid เป็น 0 หรือ null ให้เลือกค่าตำแหน่งแรก
          if (filteredSiteList.length > 0 && (!siteid || siteid === "0")) {
            const newSiteId = filteredSiteList[0]?.id;
            setSiteId(newSiteId);
            setSelectedSiteId(newSiteId);
            setSiteName(filteredSiteList[0]?.name || "");
            setSelectedSiteName(filteredSiteList[0]?.name || "");
            getGroupList(newSiteId);
          }
    
          // กรองรายการ grouplist
          let filteredGroupList = grouplist.filter((item) => item.name !== "All groups");
          // ถ้ามีรายการที่กรองแล้ว และ groupid เป็น 0 หรือ null ให้เลือกค่าตำแหน่งแรก
          if (filteredGroupList.length > 0 && (!groupid || groupid === "0")) {
            const newGroupId = filteredGroupList[0]?.id;
            setSelectedGroupId(newGroupId);
            Groupchange(newGroupId);
            setGroupName(filteredGroupList[0]?.name || "");
          }
        }
      }, [activeTab, sitelist, grouplist]);

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
