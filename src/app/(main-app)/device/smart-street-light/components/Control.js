import { useState ,useEffect ,useMemo} from "react";
import { Switch } from "@headlessui/react";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import this for default styling

import {
  DeviceControl
} from "@/utils/api";
import ModalConfirm from "./Popupconfirm";
import ModalDone from "./Popupcomplete";
import ModalFail from "./PopupFali";
import { useDispatch, useSelector} from "react-redux";

export default function DeviceControlPage({ deviceData ,FetchDevice,Sitename,Groupname}) {
  const [selecteddeviceData, setSelecteddeviceData] = useState([]);
  const [powerOn, setPowerOn] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const [rowsPerPage, setRowsPerPage] = useState(20);  // Rows per page
  const [dimming, setDimming] = useState(10);
  const [deviceStatus, setDeviceStatus] = useState("off");
  const [openModalconfirm,setopenModalconfirm] =useState(false)
  const [openModalsuccess,setopenModalsuccess] =useState(false)
  const [openModalfail,setopenModalfail] =useState(false)
  const [modalConfirmProps, setModalConfirmProps] = useState(null);
  const [modalErrorProps, setModalErorProps] = useState(null);
  const [modalSuccessProps, setModalSuccessProps] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const SelectIdSite = useSelector((state) => state.smartstreetlightData.siteId);
      console.log('SelectIdSite:', SelectIdSite);    
  const handleStatusChange = (newStatus) => {
        setDeviceStatus(newStatus);
        console.log(newStatus)
        // You can call a function here to update the device status on the server or in the backend
        // For example, updateStatus(device.id, newStatus);
      };
  
      const handleOpenModalconfirm = () => {
        setopenModalconfirm(true);
        setModalConfirmProps({
          onCloseModal: handleClosePopup,
          onClickConfirmBtn: handleSubmit,
          title: "Confirm Execution",
          content: `
    <div class="mx-auto w-fit px-4 text-left bg-red">
      <p>Device: ${selecteddeviceData?.length} device${selecteddeviceData?.length > 1 ? "s" : ""} selected</p>
      <p>Status: ${deviceStatus ? "on" : "off"}</p>
      ${deviceStatus && dimming ? `<p>% Dimming: ${dimming}%</p>` : ""}
    </div>
  `
  ,
          buttonTypeColor: "primary",
        });
      };
      
      const handleSubmit = async () => {
        const Param = {
          id: selecteddeviceData,
          action: deviceStatus ? "on" : "off",
          dimming: deviceStatus ? Number(dimming) : 0
        };
        const res = await DeviceControl(Param);
    
        if (res.status === 200) {
            // Reset all relevant state variables
            setSelecteddeviceData([]); // Clear selected devices
            setPowerOn(true); // Reset power status
            setDimming(10); // Reset dimming value
            setDeviceStatus("off"); // Reset device status
            setSearchTerm(""); // Clear search term
            setCurrentPage(1); // Reset to the first page
            setRowsPerPage(20); // Reset rows per page
    
            setopenModalconfirm(false);
            notifySuccess(res?.data?.title,res?.data?.message);
            setTimeout(() => {
              FetchDevice(); // Refresh device data
            }, 3000);
        } else {
            setopenModalconfirm(false);
            setopenModalfail(true);
            setModalErorProps({
              onCloseModal: handleClosePopup,
              title: res?.title,
              content: res?.message,
              buttonTypeColor: "danger",
            });
            console.log(res);
        }
    };
    
    const notifySuccess = (title,message) =>
        toast.success(
          <div className="px-2">
          <div className="flex flex-row font-bold">{title}</div>
          <div className="flex flex-row text-xs">{message}</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        const handleClosePopup = () => {
          setopenModalconfirm(false)
          setopenModalsuccess(false)
          setopenModalfail(false)
        }
  const filtereddeviceData = deviceData.filter(item =>
    item.name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kW?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kWh?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.percentDimming?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.runningHour?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lastUpdated?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.groupName?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });
  };
// การ sort ข้อมูลที่ใช้ useMemo เพื่อลดการคำนวณซ้ำ
  const sortedData = useMemo(() => {
    const sorted = [...filtereddeviceData];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filtereddeviceData, sortConfig]);
  const toggleDevice = (id) => {
    setSelecteddeviceData((prev) => {
      const updateddeviceData = prev.includes(id)
        ? prev.filter((deviceId) => deviceId !== id)
        : [...prev, id];
  
      console.log("Selected deviceData after toggle:", updateddeviceData);  // Log the updated selected deviceData
      return updateddeviceData;
    });
  };
  
  const toggleSelectAll = () => {
    let updateddeviceData;
  
    // ตรวจสอบว่าถ้ามีการเลือก device ทั้งหมดอยู่แล้ว ให้เคลียร์การเลือก
    if (
      selecteddeviceData.length === filtereddeviceData.filter(device => device.status !== "offline").length &&
      filtereddeviceData.length > 0
    ) {
      updateddeviceData = [];
    } else {
      // เลือกเฉพาะ device ที่ status ไม่เป็น "offline"
      updateddeviceData = filtereddeviceData
        .filter(device => device.status !== "offline")
        .map(device => device.id);
    }
  
    console.log("Selected deviceData after select all toggle:", updateddeviceData);
    setSelecteddeviceData(updateddeviceData);
  };
  
  
 const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1 when rows per page change
  };
  

  // Calculate the deviceData to display for the current page
  const indexOfLastDevice = currentPage * rowsPerPage;
  const indexOfFirstDevice = indexOfLastDevice - rowsPerPage;
  const currentdeviceData = sortedData.slice(indexOfFirstDevice, indexOfLastDevice);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filtereddeviceData.length / rowsPerPage);

  useEffect(() => {
    // Reset all keys in the sortConfig when deviceData changes
    setSortConfig({}); // Clear the sortConfig object completely
  }, [deviceData]); // This will trigger when deviceData changes
  return (
    
    <div className="grid rounded-xl bg-white p-6 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
    <div>
        <span className="text-lg font-bold block mb-2">Device List</span>
        <p className="text-base mb-4">{Sitename} | {Groupname}</p>

      
    </div>
    <div className="max-w-full flex flex-col lg:flex-row">
      <div className="lg:w-1/2 w-full  border-r p-2">
      
      <div className="flex items-center justify-between mb-3">
  <h2 className="text-sm font-semibold">{deviceData?.length} Devices</h2>
  <input
    type="text"
    placeholder="ค้นหา"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-1/2 p-2 text-sm border rounded "
  />
</div>

        
        <table className="w-full table-auto mt-5">
        <thead>
  <tr className="text-xs text-gray-500 border-b border-gray-300">
    <th className="py-2 px-4 text-left" onClick={() => handleSort("name")}>
    <input
  type="checkbox"
  checked={
    selecteddeviceData.length === filtereddeviceData.filter(device => device.status !== "offline").length &&
    filtereddeviceData.length > 0
  }
  onChange={toggleSelectAll}
  className="mr-2"
/>

      Device
      <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
        <ArrowDropUpIcon
          style={{
            fontSize: "14px",
            opacity: sortConfig.key === "name" && sortConfig.direction === "asc" ? 1 : 0.3,
            marginBottom: "-2px",
          }}
        />
        <ArrowDropDownIcon
          style={{
            fontSize: "14px",
            opacity: sortConfig.key === "name" && sortConfig.direction === "desc" ? 1 : 0.3,
            marginTop: "-2px",
          }}
        />
      </div>
    </th>

    <th className="py-2 px-4 text-left" onClick={() => handleSort("description")}>
      Description
      <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
        <ArrowDropUpIcon
          style={{
            fontSize: "14px",
            opacity: sortConfig.key === "description" && sortConfig.direction === "asc" ? 1 : 0.3,
            marginBottom: "-2px",
          }}
        />
        <ArrowDropDownIcon
          style={{
            fontSize: "14px",
            opacity: sortConfig.key === "description" && sortConfig.direction === "desc" ? 1 : 0.3,
            marginTop: "-2px",
          }}
        />
      </div>
    </th>

    <th className="py-2 px-4 text-left" onClick={() => handleSort("groupName")}>
      Group
      <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
        <ArrowDropUpIcon
          style={{
            fontSize: "14px",
            opacity: sortConfig.key === "groupName" && sortConfig.direction === "asc" ? 1 : 0.3,
            marginBottom: "-2px",
          }}
        />
        <ArrowDropDownIcon
          style={{
            fontSize: "14px",
            opacity: sortConfig.key === "groupName" && sortConfig.direction === "desc" ? 1 : 0.3,
            marginTop: "-2px",
          }}
        />
      </div>
    </th>

    <th className="py-2 px-4 text-left" onClick={() => handleSort("status")}>
      Status
      <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
        <ArrowDropUpIcon
          style={{
            fontSize: "14px",
            opacity: sortConfig.key === "status" && sortConfig.direction === "asc" ? 1 : 0.3,
            marginBottom: "-2px",
          }}
        />
        <ArrowDropDownIcon
          style={{
            fontSize: "14px",
            opacity: sortConfig.key === "status" && sortConfig.direction === "desc" ? 1 : 0.3,
            marginTop: "-2px",
          }}
        />
      </div>
    </th>

    <th className="py-2 px-4 text-right" onClick={() => handleSort("lastUpdated")}>
      Last Updated
      <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
        <ArrowDropUpIcon
          style={{
            fontSize: "14px",
            opacity: sortConfig.key === "lastUpdated" && sortConfig.direction === "asc" ? 1 : 0.3,
            marginBottom: "-2px",
          }}
        />
        <ArrowDropDownIcon
          style={{
            fontSize: "14px",
            opacity: sortConfig.key === "lastUpdated" && sortConfig.direction === "desc" ? 1 : 0.3,
            marginTop: "-2px",
          }}
        />
      </div>
    </th>
  </tr>
</thead>

  <tbody>
  {currentdeviceData.map((device, index) => (
    <tr
      key={device.id}
      className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} 
        ${device.status === 'offline' ? 'pointer-events-none opacity-50' : ''}`}
    >
      <td className="py-2 px-4">
        <input
          type="checkbox"
          checked={selecteddeviceData.includes(device.id)}
          onChange={() => toggleDevice(device.id)}
          className="mr-2 bg-[#33BFBF]"
          disabled={device.status === 'offline'} // ปิดการใช้งาน checkbox
        />
        {device.name}
      </td>
      <td className="py-2 px-4 text-sm text-gray-600">{device.description}</td>
      <td className="py-2 px-4 text-sm text-gray-600">{device.groupName}</td>
      <td className="py-2 px-4 text-sm text-gray-600">
        <button
          onClick={() => toggleStatus(device.id)}
          className={`px-3 py-1 text-sm font-bold ${
            device.status === "on"
              ? "text-[#33BFBF]"
              : device.status === "offline"
              ? "text-red-500"
              : "text-gray-400"
          }`}
          disabled={device.status === "offline"} // ปิดการใช้งานปุ่มเปลี่ยนสถานะ
        >
          {device.status}
        </button>
      </td>
      <td className="py-2 px-4 text-sm text-gray-600 text-right">{device.lastUpdated}</td>
    </tr>
  ))}
</tbody>

</table>


        
        {/* Pagination Controls */}
        <div className="mt-7 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <label htmlFor="rowsPerPage" className="text-sm">Rows per page</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="p-1 text-sm border rounded"
            >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
            >
              <ArrowBackIosNewIcon style={{ fontSize: '12px' }} />
            </button>
            <span className="text-sm">{currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
            >
              <ArrowForwardIosOutlinedIcon style={{ fontSize: '12px' }} />
            </button>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 w-full p-2">
  <h2 className="text-sm font-semibold mb-3">
    Device Control ({selecteddeviceData.length} Device Selected)
  </h2>

  {/* Power Status */}
  <div className="border p-4 rounded mt-3">
    <div className="flex items-center m-2">
      <span className="text-sm mr-14">Power Status</span>
      <button
        onClick={() => handleStatusChange(!deviceStatus)}
        disabled={selecteddeviceData.length === 0} // Disable if no device is selected
        className={`${
          selecteddeviceData.length === 0 
            ? "bg-gray-300 cursor-not-allowed"
            : deviceStatus
            ? "bg-[#5eead4]"
            : "bg-gray-300"
        } text-white font-semibold py-2 px-2 rounded-full flex items-center gap-2 transition-colors duration-300 ml-4`} 
      >
        <PowerSettingsNewIcon style={{ fontSize: 20 }} />
      </button>
      <span className="ml-2 font-semibold text-sm">{deviceStatus ? "on" : "off"}</span>
    </div>
  </div>

  {/* Dimming Level */}
  {deviceStatus ? 
  <div className="border p-4 rounded mt-3">
    <div className="flex items-center m-2">
      <p className="text-sm mr-14">Dimming Level</p>
      <div className="flex items-center w-80">
        <input
          type="range"
          min="0"
          max="100"
          value={dimming}
          step="1"
          onChange={(e) => setDimming(e.target.value)}
          disabled={selecteddeviceData.length === 0} // Disable if no device is selected
          className={`w-full h-1 accent-[#33BFBF] bg-gray-300 range-sm ${
            selecteddeviceData.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <div className="text-xs">{dimming}%</div>
      </div>
    </div>
  </div>:
  ""
  }

  {/* Execute Button */}
  <div className="flex justify-start mt-3">
    <button
      onClick={handleOpenModalconfirm}
      disabled={selecteddeviceData.length === 0} // Disable if no device is selected
      className={`w-32 py-2 rounded text-sm ${
        selecteddeviceData.length === 0
          ? "bg-gray-300 cursor-not-allowed text-gray-red"
          : "bg-[#33BFBF] text-white"
      }`}
    >
      Execute
    </button>
  </div>
</div>


      {openModalconfirm && <ModalConfirm {...modalConfirmProps}/>}
            {openModalsuccess && <ModalDone {...modalSuccessProps}/>}
            {openModalfail && <ModalFail {...modalErrorProps}/>}
    </div>
    <ToastContainer />
    </div>
  );
}
