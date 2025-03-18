import { useState, useEffect ,useMemo} from "react";
import { Switch } from "@headlessui/react";
import CreateIcon from "@mui/icons-material/Create";
import SchedulePopup from "./Popupchedule";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getSchedulebyid,postCreateSchedule,putUpdateSchedule ,deleteSchedule,changeStatuschedule} from "@/utils/api";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ModalConfirm from "./Popupconfirm";
import ModalDone from "./Popupcomplete";
import ModalFail from "./PopupFali";
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ScheduleComponent({ scheduleData ,
  deviceData, 
  FetchSchedule,
  Sitename,
  Groupname
}) {
  const [data, setData] = useState(scheduleData);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ScheduleData, setScheduleData] = useState();
  const [openModalSchedule, setopenModalSchedule] = useState(false);
  const [action ,setAction] = useState("")
  const [openModalconfirm, setopenModalconfirm] = useState(false)
  const [openModalsuccess, setopenModalsuccess] = useState(false)
  const [openModalfail, setopenModalfail] = useState(false)
  const [modalConfirmProps, setModalConfirmProps] = useState(null);
  const [modalErrorProps, setModalErorProps] = useState(null);
  const [modalSuccessProps, setModalSuccessProps] = useState(null);
  const [sortConfig, setSortConfig] = useState({});
  const [toggleId , setToggleId] = useState(null)
  
  useEffect(() => {
    setData(scheduleData);
    console.log(scheduleData)
    console.log(data)
  }, [scheduleData]);

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
          const handleSort = (column) => {
            let direction = "asc";
            if (sortConfig.key === column && sortConfig.direction === "asc") {
              direction = "desc";
            }
            setSortConfig({ key: column, direction });
          };
        
          // การ sort ข้อมูลที่ใช้ useMemo เพื่อลดการคำนวณซ้ำ
          const sortedData = useMemo(() => {
            const sorted = [...data];
            sorted.sort((a, b) => {
              if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
              if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
              return 0;
            });
            return sorted;
          }, [data, sortConfig]);
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
    const selectableIds = data.filter((item) => item.status !== "active").map((item) => item.id);
    if (selected.length === selectableIds.length) {
      setSelected([]);
    } else {
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
      // Make sure selected is populated
      console.log("Selected Items:", selected);
  
      const id = selected[0]; // Assuming selected now has IDs directly (no objects)
      if (id) {
        console.log("ID to be deleted:", id);
        await DeleteSchedul(id);
        setSelected([]);
      }
    } else {
      console.log("No items selected.");
    }
  };
  
  
  

  const getSchedulById = async (id) => {
    try {
      const result = await getSchedulebyid(id);
      if (result) {
        setScheduleData(result.data);
        setopenModalSchedule(true);
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

const CreateSchedul = async (req) => {
    try {
      console.log("Request Parameters:", req);

      const result = await postCreateSchedule(req);
      console.log("Group List Result:", result);

      if (result.status === 201) {
        console.log("Success");
        notifySuccess(res?.data?.title,res?.data?.message);
        setopenModalconfirm(false)
        onClose()
      } else {
        console.log("No groups found!");
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
        console.log("Success");
        notifySuccess(res?.data?.title,res?.data?.message);
        setopenModalconfirm(false)

        onClose()
      } else {
        console.log("No groups found!");
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
        FetchSchedule()
        onClose();
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
    onClickConfirmBtn: handleCancel,
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
      FetchSchedule()
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
  const schedule = data.find(item => item.id === id); // Assuming `data` contains the schedules
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

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="grid rounded-xl bg-white p-6 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
      <div>
      <div>
        <span className="text-lg font-bold block mb-2">Schedule List</span>
        <p className="text-base mb-4">{Sitename} | {Groupname}</p>

      
    </div>
        <div className="p-2 max-w-full mx-auto mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">{data.length} Schedules</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              onClick={() => {setIsPopupOpen(true); setAction("create");}}
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
                      checked={selected.length > 0 && selected.length === data.filter((item) => item.status !== "active").length}
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
                {data.length === 0 ? (
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
                          onChange={() => handleOpenModalsetToggleconfirm(schedule.id)}
                          className={`${schedule.status === "active" ? "bg-teal-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span className={`${schedule.status === "active" ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full`} />
                        </Switch>
                      </td>
                      <td className="p-3">
                        <button onClick={() => {getSchedulById(schedule.id); setAction("update");}} className="text-gray-500 hover:text-gray-700">
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
      isOpen={isPopupOpen || openModalSchedule} 
      onClose={() => { 
      setIsPopupOpen(false); 
      setopenModalSchedule(false); 
      setScheduleData(null); }} 
      scheduleData={ScheduleData} 
      deviceList={deviceData} 
      onSaveSchedule={CreateSchedul} 
      onUpdateSchedule={UpdateSchedul} 
      onHandleConfirm={handleOpenModalconfirm}
      Isconfirm={openModalconfirm}
      Action={action} 
      groupId={ScheduleData?.groupId}
      FetchData={FetchSchedule}
      />
        {openModalconfirm && <ModalConfirm {...modalConfirmProps} />}
        {openModalsuccess && <ModalDone />}
        {openModalfail && <ModalFail onCloseModal={handleClosePopup} />}
        
    </div>
  );
}
