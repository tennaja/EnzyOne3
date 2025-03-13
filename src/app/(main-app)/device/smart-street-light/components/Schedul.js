import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import CreateIcon from "@mui/icons-material/Create";
import SchedulePopup from "./Popupchedule";
import {
  getSchedulebyid
} from "@/utils/api";
export default function ScheduleComponent({ scheduleData }) {
  const [data, setData] = useState(scheduleData);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ScheduleData, setScheduleData] = useState();
  const [openModalSchedule ,setopenModalSchedule] = useState(false)
  useEffect(() => {
    setData(scheduleData);
  }, [scheduleData]);

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
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map((item) => item.id));
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRemove = () => {
    if (selected.length > 0) {
      setData((prev) => prev.filter((item) => !selected.includes(item.id)));
      setSelected([]);
    }
  };
const getSchedulById = async (id) => {
    console.log("Device Id:", id);

    try {
      const result = await getSchedulebyid(id);
      console.log("Group List Result:", result);

      if (result) {
        
        setScheduleData(result.data);
        setopenModalSchedule(true)
      } else {
        console.log("No groups found!");
      }
    } catch (error) {
      console.error("Error fetching device data:", error);
    }
  };
  const handleCancel = () => setSelected([]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="grid rounded-xl bg-white p-6 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
      

      <div>
        <span className="text-lg font-bold block mb-2">Historical</span>
        <div className="p-2 max-w-full mx-auto mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">{data.length} scheduleData</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              onClick={() => setIsPopupOpen(true)}
            >
              Add Schedule
            </button>
          </div>
          {selected.length > 0 && (
        <div className="bg-green-100 p-2 rounded-lg mb-2 flex justify-between items-center">
          <span>{selected.length} items selected</span>
          <div>
            <button
              onClick={handleRemove}
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
              <thead className="text-left">
                <tr>
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={selected.length === data.length}
                    />
                  </th>
                  <th className="p-3">Schedule Name</th>
                  <th className="p-3">Repeat</th>
                  <th className="p-3">Start-Stop Time</th>
                  <th className="p-3">% Dimming</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((schedule, index) => (
                  <tr
                    key={schedule.id}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b`}
                  >
                    <td className="p-3 w-10">
                      <input
                        type="checkbox"
                        checked={selected.includes(schedule.id)}
                        onChange={() => toggleSelect(schedule.id)}
                      />
                    </td>
                    <td className="p-3">{schedule.name}</td>
                    <td className="p-3">{schedule.repeat}</td>
                    <td className="p-3">{schedule.startTime +" - " +schedule.endTime}</td>
                    <td className="p-3">{schedule.percentDimming}%</td>
                    <td className="p-3">
                    <Switch
  checked={schedule.status === "active"}
  onChange={() => toggleSwitch(schedule.id)}
  className={`${
    schedule.status === "active" ? "bg-teal-500" : "bg-gray-300"
  } relative inline-flex h-6 w-11 items-center rounded-full`}
>
  <span
    className={`${
      schedule.status === "active" ? "translate-x-6" : "translate-x-1"
    } inline-block h-4 w-4 transform bg-white rounded-full`}
  />
</Switch>

                    </td>
                    <td className="p-3">
                      <button onClick={() => {
                              getSchedulById(schedule.id);

                            }}className="text-gray-500 hover:text-gray-700">
                        <CreateIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              <span>Rows per page: </span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="border rounded p-1"
              >
                {[10, 20, 50].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-3">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <SchedulePopup 
  isOpen={isPopupOpen || openModalSchedule} 
  onClose={() => {
    setIsPopupOpen(false); 
    setopenModalSchedule(false)
    // You can add any additional logic for closing here, if needed
  }} 
  mockDevices={ScheduleData} 
/>

        </div>
      </div>
    </div>
  );
}
