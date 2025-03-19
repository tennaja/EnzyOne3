import React, { useState, useEffect ,useImperativeHandle, forwardRef} from "react";
import { Modal } from "@mantine/core";
import {
  postCreateSchedule, putUpdateSchedule
} from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import ModalConfirm from "./Popupconfirm";
import ModalDone from "./Popupcomplete";
import ModalFail from "./PopupFali";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const SchedulePopup = forwardRef(
  (
    {
      isOpen,
      onClose,
      deviceList,
      scheduleData,
      Action,
      groupId,
      onSaveSchedule,
      onUpdateSchedule,
      onHandleConfirm,
      FetchData
    },
    ref
  ) => {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [dimmingLevel, setDimmingLevel] = useState(scheduleData?.percentDimming || 10);
  const [repeatOption, setRepeatOption] = useState(scheduleData?.repeat || "once");
  const [startDatetime, setStartDatetime] = useState(scheduleData?.startTime || "");
  const [endDatetime, setEndDatetime] = useState(scheduleData?.endTime || "");
  const [scheduleName, setScheduleName] = useState(scheduleData?.name || "");
  const [executionDateTime, setexecutionDateTime] = useState(scheduleData?.executionDateTime)
  const [executionEndDateTime, setexecutionEndDateTime] = useState(scheduleData?.executionEndDateTime)
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [searchQuery, setSearchQuery] = useState('');


  const filteredDevices = deviceList.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const schedule = scheduleData;

  useEffect(() => {
    if (isOpen) {
      setScheduleName(schedule?.name || "")
      setexecutionDateTime(schedule?.executionDateTime || "")
      setexecutionEndDateTime(schedule?.executionEndDateTime || "")
      setStartDatetime(schedule?.startTime || "");
      setEndDatetime(schedule?.endTime || "");
      setRepeatOption(schedule?.repeat || "once");
      setDimmingLevel(schedule?.percentDimming || 10);
      setSelectedDevices(schedule?.scheduledDevices?.map(device => device.id) || []);
    }
  }, [isOpen]);

  const handleDayChange = (day) => {
    setSelectedDays((prevState) => ({
      ...prevState,
      [day]: !prevState[day], // Toggle the value of the selected day
    }));
  };

  const toggleSelectAll = () => {
    if (selectedDevices?.length === deviceList?.length) {
      setSelectedDevices([]); // ยกเลิกการเลือกทั้งหมด
    } else {
      setSelectedDevices(deviceList?.map((device) => device.id)); // เลือกทั้งหมด
    }
  };



  const toggleSelectOne = (id) => {
    setSelectedDevices((prev) =>
      prev.includes(id)
        ? prev.filter((deviceId) => deviceId !== id)
        : [...prev, id]
    );
  };

  // Update selected days based on repeatOption

  // Helper function to map day numbers to days of the week
  const dayNumberToName = (dayNumber) => {
    const daysMap = {
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
      7: 'sunday',
    };
    return daysMap[dayNumber];
  };

  // Function to initialize selectedDays based on repeatOption and scheduleData
  const updateSelectedDays = () => {
    const updatedDays = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    };

    // Set the selected days based on the dayOfWeek array from scheduleData
    if (scheduleData?.dayOfWeek?.length) {
      scheduleData.dayOfWeek.forEach((dayNumber) => {
        const dayName = dayNumberToName(dayNumber);
        updatedDays[dayName] = true;
      });
    }

    if (repeatOption === "weekday") {
      return {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      };
    } else if (repeatOption === "weekend") {
      return {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: true,
      };
    } else if (repeatOption === "everyday") {
      return {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      };
    } else if (repeatOption === "custom") {
      return updatedDays; // Use the selected days from scheduleData
    }
  };

  useEffect(() => {
    setSelectedDays(updateSelectedDays());
  }, [repeatOption, scheduleData]);

  const executionDate = executionDateTime?.split("T")[0]; // ได้ YYYY-MM-DD
  const executionTime = executionDateTime?.split("T")[1]; // ได้ HH:mm

  const executionEndDate = executionEndDateTime?.split("T")[0]; // ได้ YYYY-MM-DD
  const executionEndTime = executionEndDateTime?.split("T")[1]; // ได้ HH:mm

  useImperativeHandle(ref, () => ({
    triggerSave: async () => {
      const param = {
        name: scheduleName,
        groupId: Number(groupId),
        startTime: repeatOption === "once" ? executionTime : startDatetime,
        endTime: repeatOption === "once" ? executionEndTime : endDatetime,
        repeat: repeatOption,
        executionDateTime: executionDate,
        executionEndDateTime: executionEndDate,
        percentDimming: Number(dimmingLevel),
        dayOfWeek: repeatOption === "once"
          ? []
          : Object.keys(selectedDays)
            .filter(day => selectedDays[day])
            .map(day => {
              const daysMap = {
                monday: 1,
                tuesday: 2,
                wednesday: 3,
                thursday: 4,
                friday: 5,
                saturday: 6,
                sunday: 7,
              };
              return daysMap[day];
            }),
        scheduledDevices: selectedDevices,
      };

      console.log("✅ กำลังเรียก onSaveSchedule ด้วย:", param);

      try {
        await onSaveSchedule(param); // เรียก CreateSchedul() จากภายนอก
        console.log("✅ Schedule ถูกบันทึกสำเร็จ!");
      } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการบันทึก Schedule:", error);
      }
    },
    triggerUpdate: async () => {
      if (!scheduleData?.id) {
        console.error("❌ ไม่มี ID ของ Schedule ที่ต้องอัปเดต!");
        return;
      }
  
      const param = {
        name: scheduleName,
        groupId: Number(groupId),
        startTime: repeatOption === "once" ? executionTime : startDatetime,
        endTime: repeatOption === "once" ? executionEndTime : endDatetime,
        repeat: repeatOption,
        executionDateTime: executionDate,
        executionEndDateTime: executionEndDate,
        percentDimming: Number(dimmingLevel),
        dayOfWeek: repeatOption === "once"
          ? []
          : Object.keys(selectedDays)
            .filter(day => selectedDays[day])
            .map(day => {
              const daysMap = {
                monday: 1,
                tuesday: 2,
                wednesday: 3,
                thursday: 4,
                friday: 5,
                saturday: 6,
                sunday: 7,
              };
              return daysMap[day];
            }),
        scheduledDevices: selectedDevices,
      };
  
      console.log("🔄 กำลังเรียก onUpdateSchedule ด้วย:", param);
  
      try {
        await onUpdateSchedule(scheduleData?.id,param);
        console.log("✅ Schedule ถูกอัปเดตสำเร็จ!");
      } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการอัปเดต Schedule:", error);
      }
    }
  }));
 
  const days = updateSelectedDays();

  return (
    <div>
      <Modal
        size="xl"
        opened={isOpen}
        onClose={onClose}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
        style={{
          zIndex: 9999, // Ensure the modal is always on top
          // Fixed position so it stays on top of the page
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        overlayStyle={{
          zIndex: 9998, // Overlay just below the modal
        }}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Add Schedule</h2>
          <form>
            <div className="mb-3 flex items-center justify-between gap-4">
              <label className="text-sm font-medium">Schedule Name</label>
              <div className="flex items-center gap-3">
                <span className="text-red-500">*</span>
                <input
                  type="text"
                  className="w-96 p-2 border rounded"
                  placeholder="Enter schedule name"
                  value={scheduleName} // ใช้ค่า state ในการแสดงผล
                  onChange={(e) => setScheduleName(e.target.value)} // อัพเดต state เมื่อมีการเปลี่ยนแปลง
                  required
                />
              </div>
            </div>

            {/* Device Table */}
            <div className="mb-3">
              <div className="flex justify-between items-center gap-2">
                <label className="text-sm font-medium">Device</label>
                <input
                  type="text"
                  className="w-40 p-2 border rounded"
                  placeholder="ค้นหา"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="h-52 overflow-hidden flex flex-col">
                <table className="w-full text-sm border-collapse">
                  <thead className="border-b sticky top-0 z-10">
                    <tr>
                      <th className="p-2 w-10">
                        <input
                          type="checkbox"
                          onChange={toggleSelectAll}
                          checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
                        />

                      </th>
                      <th className="p-2 text-left">Device</th>
                      <th className="p-2 text-left">Description</th>
                    </tr>
                  </thead>
                </table>
                <div className="overflow-auto h-full">
                  <table className="w-full text-sm">
                    <tbody>
                      {filteredDevices?.map((device, index) => (
                        <tr key={device.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} border-b`}>
                          <td className="p-2 text-center w-10">
                            <input
                              type="checkbox"
                              checked={selectedDevices.includes(device.id)}
                              onChange={() => toggleSelectOne(device.id)}
                            />
                          </td>
                          <td className="p-2">{device.name}</td>
                          <td className="p-2">{device.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


            {/* Repeat Dropdown */}
            <div className="grid grid-cols-[0.5fr_2fr] items-center gap-x-4 mt-3">
              <label className="text-sm font-medium text-left">Repeat</label>
              <select
                className="w-full p-2 border rounded"
                value={repeatOption} // กำหนดค่าเริ่มต้นจาก scheduleData
                onChange={(e) => {
                  const newRepeat = e.target.value;
                  setRepeatOption(newRepeat);

                  // ตรวจสอบว่า schedule มีค่าและเป็นอาเรย์ก่อน
                  if (schedule && schedule.length > 0) {
                    schedule[0] = {
                      ...schedule[0],
                      repeat: newRepeat
                    };
                  }
                }}
              >
                <option value="once">Once</option>
                <option value="everyday">Everyday</option>
                <option value="weekday">Weekday</option>
                <option value="weekend">Weekend</option>
                <option value="custom">Custom</option>
              </select>



            </div>

            {/* Start - Stop Time */}
            <div className="grid grid-cols-[0.5fr_2fr] items-center gap-x-4">
              <label className="text-sm font-medium text-left">Start - Stop Time</label>
              {repeatOption === "once" && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded"
                    value={executionDateTime}
                    onChange={(e) => setexecutionDateTime(e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded"
                    value={executionEndDateTime}
                    onChange={(e) => setexecutionEndDateTime(e.target.value)}
                  />
                </div>
              )}
              {(repeatOption === "everyday" || repeatOption === "weekday" || repeatOption === "weekend") && (
                <div className="flex flex-col gap-2 mt-2 ">
                  <div className="flex flex-wrap gap-2">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                      <label key={day} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name={day}
                          checked={days[day]}
                          disabled
                        />
                        <span className="ml-2">{day.charAt(0).toUpperCase() + day.slice(1, 3)}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      value={startDatetime}
                      onChange={(e) => setStartDatetime(e.target.value)}
                      step="60"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      value={endDatetime}
                      onChange={(e) => setEndDatetime(e.target.value)}
                      step="60"
                    />
                  </div>
                </div>
              )}
              {repeatOption === "custom" && (
                <div className="flex flex-col item-center gap-2 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                      <label key={day} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name={day}
                          checked={selectedDays?.[day] || false}

                          onChange={() => handleDayChange(day)} // Toggle the state for the selected day
                        />
                        <span className="ml-2">{day.charAt(0).toUpperCase() + day.slice(1, 3)}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      value={startDatetime}
                      onChange={(e) => setStartDatetime(e.target.value)}
                      step="60"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      value={endDatetime}
                      onChange={(e) => setEndDatetime(e.target.value)}
                      step="60"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Dimming Level */}
            <div className="grid grid-cols-[0.5fr_2fr] items-center gap-x-4 mt-2">
            <label className="text-sm font-medium">Dimming Level</label>
            <div className="flex items-center w-full">
    <div className="w-full ">
      
      <input
        type="range"
        min="0"
        max="100"
        list="tickmarks"
        value={dimmingLevel}
        onChange={(e) => setDimmingLevel(e.target.value)}
        className="w-full h-1 accent-[#33BFBF] bg-gray-300 range-sm cursor-pointer"
      />
      <datalist id="tickmarks" className="w-full flex justify-between text-xs text-gray-600">
        <option value="0" label="0"></option>
        <option value="25" label="25"></option>
        <option value="50" label="50"></option>
        <option value="75" label="75"></option>
        <option value="100" label="100"></option>
      </datalist>
    </div>
    <div className="text-xs text-center ml-2">{dimmingLevel}%</div>
  </div>
</div>

            <div className="flex justify-center gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={onHandleConfirm}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
)}
);
export default SchedulePopup;