import { useState, useEffect, useMemo, useRef } from "react";
import { Switch } from "@headlessui/react";
import CreateIcon from "@mui/icons-material/Create";
import SchedulePopup from "./Popupchedule";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getSchedulebyid, postCreateSchedule, putUpdateSchedule,getDeviceListData, deleteSchedule, changeStatuschedule,getScheduleListData } from "@/utils/api";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ModalConfirm from "./Popupconfirm";
import ModalDone from "./Popupcomplete";
import ModalFail from "./PopupFali";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector} from "react-redux";
import Loading from "./Loading";

export default function ScheduleComponent({ 
  scheduleData,
  deviceData,
  FetchSchedule,
  Sitename,
  Groupname,
  GroupId
}) {
  const [data, setData] = useState(scheduleData);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [devcielist , setDevicelist] = useState([]);
  const [schedulelist , setSchedulelist] = useState([]);
  const [ScheduleData, setScheduleData] = useState();
  const [openModalSchedule, setopenModalSchedule] = useState(false);
  const [action, setAction] = useState("")
  const [openModalconfirm, setopenModalconfirm] = useState(false)
  const [openModalsuccess, setopenModalsuccess] = useState(false)
  const [openModalfail, setopenModalfail] = useState(false)
  const [deviceForSchedule,setDeviceforSchedule] = useState([])
  const [modalConfirmProps, setModalConfirmProps] = useState(null);
  const [modalErrorProps, setModalErorProps] = useState(null);
  const [modalSuccessProps, setModalSuccessProps] = useState(null);
  const [sortConfig, setSortConfig] = useState({});
  const [toggleId, setToggleId] = useState(null)
  const SelectIdSite = useSelector((state) => state.smartstreetlightData.siteId);
  const SelectIdGroup = useSelector((state) => state.smartstreetlightData.groupId);
console.log("Select ID : " ,SelectIdSite , SelectIdGroup)
  const schedulePopupRef = useRef();

  const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับ loading
  
  const latestIds = useRef({ siteId: null, groupId: null });

useEffect(() => {
  if (SelectIdSite && SelectIdGroup) {
    latestIds.current = { siteId: SelectIdSite, groupId: SelectIdGroup };
    fetchData();
  }
}, [SelectIdSite, SelectIdGroup]);

const fetchData = () => {
  const { siteId, groupId } = latestIds.current;
  GetDeviceList(siteId, groupId);
  GetScheduleList(siteId, groupId);
};

const GetScheduleList = async (site, group) => {
  setLoading(true);
  try {
    const paramsNav = { siteId: site, groupId: group };
    const result = await getScheduleListData(paramsNav);
    setSchedulelist(result?.data?.length > 0 ? result.data : []);
  } catch (error) {
    console.error("Error fetching schedule list:", error);
  } finally {
    setLoading(false);
  }
};

const GetDeviceList = async (site, group) => {
  setLoading(true);
  try {
    const paramsNav = { siteId: site, groupId: group };
    const result = await getDeviceListData(paramsNav);
    setDevicelist(result?.data?.length > 0 ? result.data : []);
  } catch (error) {
    console.error("Error fetching device list:", error);
  } finally {
    setLoading(false);
  }
};

    const getSchedulById = async (id) => {
      console.log("Device Id:", id);
    
      try {
        const result = await getSchedulebyid(id);
        console.log("Group List Result:", result);
    
        if (result) {
          setScheduleData(result.data);
          setopenModalSchedule(true);
          
          // ดึง siteId และ groupId จาก result
          const paramsNav = {
            siteId: result.data.siteId,
            groupId: result.data.groupId,
          };
    
          // เรียก getDeviceListData ด้วยค่าที่ได้มา
          const deviceResult = await getDeviceListData(paramsNav);
          if (deviceResult?.data?.length > 0) {
            setDeviceforSchedule(deviceResult.data);
          } else {
            setDeviceforSchedule([]);
          }
        } else {
          console.log("No groups found!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
       
          setLoading(false);
        
      }
    };

  const handleClosePopup = () => {
    setopenModalconfirm(false)
    setopenModalsuccess(false)
    setopenModalfail(false)
  }
  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });
  };

  // การ sort ข้อมูลที่ใช้ useMemo เพื่อลดการคำนวณซ้ำ
  const sortedData = useMemo(() => {
    const sorted = [...schedulelist];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [schedulelist, sortConfig]);


  const toggleSwitch = (id) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "active" ? "inactive" : "active" }
          : item
      )
    );
  };

  const toggleSelectAll = () => {
    const selectableIds = schedulelist.filter((item) => item.status !== "active").map((item) => item.id);
    if (selected.length === selectableIds.length) {
      setSelected([]);
    } else {
      console.log(selectableIds)
      setSelected(selectableIds);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };


  const handleRemove = async () => {
    if (selected.length > 0) {
      // ตรวจสอบค่าที่เลือก
      console.log("Selected Items:", selected);
  
      // แปลง array เป็น string แบบ comma-separated
      const selectedIds = selected.join(",");
      console.log("ID to be deleted:", selectedIds);
  
      // ส่งค่าเป็น 1,2 แทน [1,2]
      await DeleteSchedul(selectedIds);
      setSelected([]);
    } else {
      console.log("No items selected.");
    }
  };
  




  


  const handleExternalSave = () => {
    if (schedulePopupRef.current) {
      console.log("🚀 กำลังเรียก triggerSave() จากภายนอก");
      schedulePopupRef.current.triggerSave(); // ✅ เรียก triggerSave() ใน SchedulePopup.js
    } else {
      console.log("❌ schedulePopupRef.current เป็น null");
    }
  };

  const handleExternalUpdate = () => {

    if (schedulePopupRef.current) {
      console.log("🚀 กำลังเรียก triggerSave() จากภายนอก");
      schedulePopupRef.current.triggerUpdate(); // ✅ เรียก triggerSave() ใน SchedulePopup.js
    } else {
      console.log("❌ schedulePopupRef.current เป็น null");
    }
  };

  const CreateSchedul = async (req) => {
    try {
      console.log("Request Parameters:", req);

      const result = await postCreateSchedule(req);
      console.log("Group List Result:", result);

      if (result.status === 201) {
        console.log(result);
        setopenModalconfirm(false)
        setIsPopupOpen(false)
        setopenModalSchedule(false)
        notifySuccess(result?.data?.title, result?.data?.message);
        GetScheduleList(SelectIdSite,SelectIdGroup)
        setScheduleData(null);
      } else {
        console.log(result);
        setModalErorProps({
          onCloseModal: handleClosePopup,
          title: result?.response?.data?.error,  // ใช้ title จาก error ถ้ามี
          content: result?.response?.data?.message || error.message || "Something went wrong!",  // ใช้ message จาก error ถ้ามี
          buttonTypeColor: "primary",
      });
        setopenModalfail(true)
      }
    } catch (error) {
      
      console.log("Error creating schedule:", error);
    }
  };
  const UpdateSchedul = async (id, req) => {
    try {
      console.log("Request Parameters:", req);

      const result = await putUpdateSchedule(id, req);
      console.log("Group List Result:", result);

      if (result.status === 200) {
        setopenModalconfirm(false)
        setIsPopupOpen(false)
        setopenModalSchedule(false)
        notifySuccess(result?.data?.title, result?.data?.message);
        GetScheduleList(SelectIdSite,SelectIdGroup)
        setScheduleData(null);
      } else {
        setModalErorProps({
          onCloseModal: handleClosePopup,
          title: result?.response?.data?.error,  // ใช้ title จาก error ถ้ามี
          content: result?.response?.data?.message || error.message || "Something went wrong!",  // ใช้ message จาก error ถ้ามี
          buttonTypeColor: "primary",
      });
        setopenModalfail(true)
      }
    } catch (error) {
      console.log("Error creating schedule:", error);
    }
  };

  const DeleteSchedul = async (id) => {
    try {
      console.log("Request Parameters:", id);

      const result = await deleteSchedule(id);  // Assuming deleteSchedule is the function to call your API
      console.log("Group List Result:", result);

      if (result.status === 200) {
        console.log("Success");
        setopenModalconfirm(false);
        notifySuccess(result?.data?.title, result?.data?.message);
        GetScheduleList(SelectIdSite,SelectIdGroup)
      } else {
        console.log("No groups found!");
        setopenModalfail(true);
      }
    } catch (error) {
      console.log("Error creating schedule:", error);
    }
  };
  const handleOpenModalconfirm = () => {
    setopenModalconfirm(true);
    setModalConfirmProps({
      onCloseModal: handleClosePopup,
      onClickConfirmBtn: action == "create" ? handleExternalSave : handleExternalUpdate,
      title: "Edit/Save Schedule",
      content: "Are you sureyou want to save this schedule ?"
      ,
      buttonTypeColor: "primary",
    });
  };
  const handleOpenModalDeleteconfirm = () => {
    setopenModalconfirm(true);
    setModalConfirmProps({
      onCloseModal: handleClosePopup,
      onClickConfirmBtn: handleRemove,
      title: "Remove Schedule",
      content: "Are you sureyou want to remove he selected items?"
      ,
      buttonTypeColor: "primary",
    });
  };

  const handleOpenModalsetToggleconfirm = (id) => {
    setToggleId(id); // Set the selected schedule id to use later
    setopenModalconfirm(true); // Open the confirmation modal
    setModalConfirmProps({
      onCloseModal: handleClosePopup, // Close the modal
      onClickConfirmBtn: () => handleToggleStatus(id), // Pass the id to the handleToggleStatus function
      title: "Change Schedule Status", // Modal title
      content: "Are you sure you want to change the status of the selected item?", // Modal content
      buttonTypeColor: "primary", // Button color type
    });
  };

  const handleToggleStatus = async (id) => {
    // Prepare the status toggle request
    const status = getCurrentStatus(id); // A function to determine the current status (active/inactive)
    const req = { status: status === "active" ? "inactive" : "active" }; // Toggle status

    try {
      console.log("Request Parameters:", req);

      const result = await changeStatuschedule(id, req); // Send the PUT request
      console.log("Result:", result);

      if (result.status === 200) {
        console.log("Success");
        notifySuccess(result?.data?.title, result?.data?.message); // Show success message
        GetScheduleList(SelectIdSite,SelectIdGroup)
        setopenModalconfirm(false); // Close the confirmation modal
        onClose(); // Close any other relevant modal or action
      } else {
        console.log("No groups found!");
        setopenModalfail(true); // Open fail modal
      }
    } catch (error) {
      console.log("Error creating schedule:", error); // Handle any errors
    }
  };
  // Helper function to determine current status (active/inactive)
  const getCurrentStatus = (id) => {
    // Replace this with your logic to find the current status of the schedule based on `id`
    const schedule = schedulelist.find(item => item.id === id); // Assuming `data` contains the schedules
    return schedule ? schedule.status : "inactive"; // Return the current status
  };
  const handleCancel = () => setSelected([]);
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastDevice = currentPage * rowsPerPage;
  const indexOfFirstDevice = indexOfLastDevice - rowsPerPage;
  const currentData = sortedData.slice(indexOfFirstDevice, indexOfLastDevice);

  const totalPages = Math.ceil(schedulelist.length / rowsPerPage);
  const paginatedData = schedulelist.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const notifySuccess = (title, message) =>
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
  return (
    <div className="grid rounded-xl bg-white p-6 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
      <div>
        <div>
          <span className="text-lg font-bold block mb-2">Schedule List</span>
          <p className="text-base mb-4">{Sitename} | {Groupname}</p>


        </div>
        
        
        <div className="p-2 max-w-full mx-auto mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">{schedulelist.length} Schedules</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#33BFBF] text-white rounded-lg hover:bg-teal-600"
              onClick={() => { setopenModalSchedule(true); setAction("create"); setDeviceforSchedule([])}}
            >
              Add Schedule
            </button>
          </div>
          {selected.length > 0 && (
            <div className="bg-green-100 p-2 rounded-lg mb-2 flex justify-between items-center">
              <span>{selected.length} items selected</span>
              <div>
                <button
                  onClick={handleOpenModalDeleteconfirm}
                  disabled={selected.length === 0}
                  className={`px-4 py-2 rounded-lg mr-2 ${selected.length === 0 ? "bg-red-300" : "bg-red-500 hover:bg-red-600 text-white"}`}
                >
                  Remove
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="bg-white overflow-hidden">
            <table className="w-full border-collapse text-base">
              <thead className="text-left border-b">
                <tr>
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={selected.length > 0 && selected.length === schedulelist.filter((item) => item.status !== "active").length}
                    />
                  </th>
                  <th className="p-3" onClick={() => handleSort("name")}>Schedule Name
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
                  <th className="p-3" onClick={() => handleSort("repeat")}>Repeat
                    <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
                      <ArrowDropUpIcon
                        style={{
                          fontSize: "14px",
                          opacity: sortConfig.key === "repeat" && sortConfig.direction === "asc" ? 1 : 0.3,
                          marginBottom: "-2px",
                        }}
                      />
                      <ArrowDropDownIcon
                        style={{
                          fontSize: "14px",
                          opacity: sortConfig.key === "repeat" && sortConfig.direction === "desc" ? 1 : 0.3,
                          marginTop: "-2px",
                        }}
                      />
                    </div></th>
                  <th className="p-3" onClick={() => handleSort("startTime")}>Start-Stop Time
                    <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
                      <ArrowDropUpIcon
                        style={{
                          fontSize: "14px",
                          opacity: sortConfig.key === "startTime" && sortConfig.direction === "asc" ? 1 : 0.3,
                          marginBottom: "-2px",
                        }}
                      />
                      <ArrowDropDownIcon
                        style={{
                          fontSize: "14px",
                          opacity: sortConfig.key === "startTime" && sortConfig.direction === "desc" ? 1 : 0.3,
                          marginTop: "-2px",
                        }}
                      />
                    </div>
                  </th>
                  <th className="p-3" onClick={() => handleSort("percentDimming")}>% Dimming
                    <div style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px" }}>
                      <ArrowDropUpIcon
                        style={{
                          fontSize: "14px",
                          opacity: sortConfig.key === "percentDimming" && sortConfig.direction === "asc" ? 1 : 0.3,
                          marginBottom: "-2px",
                        }}
                      />
                      <ArrowDropDownIcon
                        style={{
                          fontSize: "14px",
                          opacity: sortConfig.key === "percentDimming" && sortConfig.direction === "desc" ? 1 : 0.3,
                          marginTop: "-2px",
                        }}
                      />
                    </div>
                  </th>
                  <th className="p-3"></th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {schedulelist.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-500 p-5">Schedule not found</td>
                  </tr>
                ) : (
                  currentData.map((schedule, index) => (
                    <tr key={schedule.id} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b`}>
                      <td className="p-3 w-10">
                        <input
                          type="checkbox"
                          checked={selected.includes(schedule.id)}
                          onChange={() => toggleSelect(schedule.id)}
                          disabled={schedule.status === "active"}
                        />
                      </td>
                      <td className="p-3">{schedule.name}</td>
                      <td className="p-3">{schedule.repeat}</td>
                      <td className="p-3">{schedule.startTime + " - " + schedule.endTime}</td>
                      <td className="p-3">{schedule.percentDimming}%</td>
                      <td className="p-3">
                        <Switch
                          checked={schedule.status === "active"}
                          onChange={() => handleToggleStatus(schedule.id)}
                          className={`${schedule.status === "active" ? "bg-teal-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span className={`${schedule.status === "active" ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full`} />
                        </Switch>
                      </td>
                      <td className="p-3">
                        <button onClick={() => { getSchedulById(schedule.id); setAction("update"); setDevicelist([])}} className="text-gray-500 hover:text-gray-700">
                          <CreateIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
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
                <ArrowBackIosNewIcon style={{ fontSize: '12px' }} />
              </button>
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handleChangePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
              >
                <ArrowForwardIosOutlinedIcon style={{ fontSize: '12px' }} />
              </button>
            </div>
          </div>
        </div>

      </div>
      <SchedulePopup
        ref={schedulePopupRef}
        isOpen={openModalSchedule}
        onClose={() => {
          setopenModalSchedule(false);
          setScheduleData(null);
        }}
        scheduleData={ScheduleData}
        deviceList={deviceForSchedule?.length ? deviceForSchedule : devcielist}
        onSaveSchedule={CreateSchedul}
        onUpdateSchedule={UpdateSchedul}
        onHandleConfirm={handleOpenModalconfirm}
        groupId={ScheduleData?.groupId ? ScheduleData?.groupId : GroupId}
        action={action}

      />
      {openModalconfirm && <ModalConfirm {...modalConfirmProps} />}
      {openModalfail && <ModalFail {...modalErrorProps}/>}
      {loading && <Loading/>} 
      <ToastContainer />
    </div>

  );
}
