import { useState } from "react";
import { Switch } from "@headlessui/react";
import CreateIcon from "@mui/icons-material/Create";
import SchedulePopup from "./Popupchedule";
const schedules = [
  { id: 1, name: "ประตูทางเข้า เปิดทุกวัน ตอนเช้า", repeat : "everyday",time: "05:00 - 07:00", dimming: 100, enabled: true },
  { id: 2, name: "ประตูทางเข้า เปิดทุกวัน ตอนเที่ยง", repeat : "everyday",time: "12:00 - 13:00", dimming: 10, enabled: true },
  { id: 3, name: "ประตูทางเข้า เปิดทุกวัน ตอนเย็น", repeat : "everyday",time: "18:00 - 21:00", dimming: 10, enabled: false },
];
export default function ScheduleComponent({  }) {
  const [data, setData] = useState(schedules);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const toggleSwitch = (id) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
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

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="grid rounded-xl bg-white p-6 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
    <div>
      <span className="text-lg font-bold block mb-2">Historical</span>
    <div className="p-2 max-w-full mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">{data.length} Schedules</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          onClick={() => setIsPopupOpen(true)}
        >
          Add Schedule
        </button>
      </div>
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
                <td className="p-3">{schedule.time}</td>
                <td className="p-3">{schedule.dimming}%</td>
                <td className="p-3">
                  <Switch
                    checked={schedule.enabled}
                    onChange={() => toggleSwitch(schedule.id)}
                    className={`${schedule.enabled ? "bg-teal-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${
                        schedule.enabled ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform bg-white rounded-full`}
                    />
                  </Switch>
                </td>
                <td className="p-3">
                  <button className="text-gray-500 hover:text-gray-700">
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
      <SchedulePopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div></div></div>
  );
}
