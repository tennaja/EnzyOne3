import React, { useState, useEffect ,useImperativeHandle, forwardRef} from "react";
import { Modal } from "@mantine/core";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DatePicker,TimePicker } from 'antd';
import moment from 'moment';
import dayjs from "dayjs";

const SchedulePopup = forwardRef(
  (
    {
      isOpen,
      onClose,
      deviceList,
      scheduleData,
      action,
      groupId,
      onSaveSchedule,
      onUpdateSchedule,
      onHandleConfirm,
     
    },
    ref
  ) => {
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [dimmingLevel, setDimmingLevel] = useState(scheduleData?.percentDimming || 10);
  const [repeatOption, setRepeatOption] = useState(scheduleData?.repeat || "once");
  const [startDatetime, setStartDatetime] = useState(scheduleData?.startTime || null);
  const [endDatetime, setEndDatetime] = useState(scheduleData?.endTime || null);
  const [scheduleName, setScheduleName] = useState(scheduleData?.name || "");
 
  const [executionDateTime, setexecutionDateTime] = useState(() => {
    const date = scheduleData?.executionDateTime?.split(" ")[0] || ""; // ดึงวันที่
    const time = scheduleData?.startTime || ""; // เวลาเริ่มต้น
    return date && time ? `${date} ${time}` : ""; // รวมวันที่กับเวลา
  });
  
  const [executionEndDateTime, setexecutionEndDateTime] = useState(() => {
    const endDate = scheduleData?.executionEndDateTime?.split(" ")[0] || ""; // ดึงวันที่
    const endTime = scheduleData?.endTime || ""; // เวลาเสร็จสิ้น
    return endDate && endTime ? `${endDate} ${endTime}` : ""; // รวมวันที่กับเวลา
  });
  
  
  
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



  
  
 
  const schedule = scheduleData;

  useEffect(() => {
    if (isOpen) {
      setScheduleName(schedule?.name || "");
      
      // แปลง executionDateTime และ startDatetime รวมกันใน setExecutionDateTime
      const executionDate = schedule?.executionDateTime?.split(" ")[0] || ""; // ดึงวันที่จาก executionDateTime และตัดเวลาออก
      const executionTime = schedule?.startTime || ""; // เวลาเริ่มต้น
      setexecutionDateTime(executionDate ? `${executionDate} ${executionTime}` : ""); // รวมวันที่กับเวลา
  
      // แปลง executionEndDateTime และ startDatetime รวมกันใน setExecutionEndDateTime
      const endDate = schedule?.executionEndDateTime?.split(" ")[0] || ""; // ดึงวันที่จาก executionEndDateTime และตัดเวลาออก
      const endTime = schedule?.endTime || ""; // เวลาเริ่มต้น
      setexecutionEndDateTime(endDate ? `${endDate} ${endTime}` : ""); // รวมวันที่กับเวลา
  
      setStartDatetime(schedule?.startTime || null);
      setEndDatetime(schedule?.endTime || null);
      setRepeatOption(schedule?.repeat || "once");
      setDimmingLevel(schedule?.percentDimming || 10);
      setSelectedDevices(schedule?.scheduledDevices?.map(device => device.id) || []);
    
    console.log(executionDateTime)
    console.log(executionEndDateTime)
    
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

  

  

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });
  };

  // การกรองตามคำค้นหา
  const filteredDevices = deviceList.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // การจัดเรียงหลังจากการกรอง
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key].toLowerCase();
      const bValue = b[sortConfig.key].toLowerCase();

      if (sortConfig.direction === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }
    return 0;
  });

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

  const formatDate = date => date ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}` : null;
  const formatTime = date => date ? `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}` : null;
  
  const executionDate = executionDateTime ? formatDate(new Date(executionDateTime)) : null;
  const executionTime = executionDateTime ? formatTime(new Date(executionDateTime)) : null;
  const executionEndDate = executionEndDateTime ? formatDate(new Date(executionEndDateTime)) : null;
  const executionEndTime = executionEndDateTime ? formatTime(new Date(executionEndDateTime)) : null;
  
  


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

  const handleStartTimeChange = (time) => {
    setStartDatetime(time ? time.format("HH:mm") : null);
    console.log("Start Time:", time ? time.format("HH:mm") : null);
  };

  const handleEndTimeChange = (time) => {
    setEndDatetime(time ? time.format("HH:mm") : null);
    console.log("End Time:", time ? time.format("HH:mm") : null);
  };
 
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
          <h2 className="text-xl font-semibold mb-4">{action == "create" ? "Add" : "Edit"} Schedule</h2>
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
                      <th className="p-2 text-left" onClick={() => handleSort("name")}>Device 
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
      </div></th>
                      <th className="p-2 text-left" onClick={() => handleSort("description")}>Description
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
                    </tr>
                  </thead>
                </table>
                <div className="overflow-auto h-full">
                  <table className="w-full text-sm">
                    <tbody>
                      {sortedDevices?.map((device, index) => (
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
                <div className="flex gap-2 mt-2 w-full">
                <DatePicker
                  showTime
                  value={executionDateTime ? dayjs(executionDateTime) : null}
                  onChange={(date) => {
                    setexecutionDateTime(date ? date.toISOString() : null);
                    if (executionEndDateTime && dayjs(date).isAfter(dayjs(executionEndDateTime))) {
                      setexecutionDateTime(null); // Reset end date if start date exceeds end date
                    }
                    console.log("executionDateTime:", date ? date.format("YYYY-MM-DD HH:mm") : null);
                  }}
                  format="YYYY-MM-DD HH:mm"
                  locale="th"
                  className="w-full"
                />
                <span>-</span>
                <DatePicker
                  showTime
                  value={executionEndDateTime ? dayjs(executionEndDateTime) : null}
                  onChange={(date) => {
                    setexecutionEndDateTime(date ? date.toISOString() : null);
                    console.log("executionEndDateTime:", date ? date.format("YYYY-MM-DD HH:mm") : null);
                  }}
                  format="YYYY-MM-DD HH:mm"
                  locale="th"
                  disabledDate={(current) => {
                    return executionDateTime ? current && current.isBefore(dayjs(executionDateTime), "day") : false;
                  }}
                  className="w-full"
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
                  <TimePicker
        value={startDatetime ? dayjs(startDatetime, "HH:mm") : null}
        onChange={handleStartTimeChange}
        format="HH:mm"
        minuteStep={1}
        className="w-full p-2 border rounded"
      />
      <span>-</span>
      <TimePicker
        value={endDatetime ? dayjs(endDatetime, "HH:mm") : null}
        onChange={handleEndTimeChange}
        format="HH:mm"
        minuteStep={1}
        className="w-full p-2 border rounded"
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
                  <TimePicker
        value={startDatetime ? dayjs(startDatetime, "HH:mm") : null}
        onChange={handleStartTimeChange}
        format="HH:mm"
        minuteStep={1}
        className="w-full p-2 border rounded"
      />
      <span>-</span>
      <TimePicker
        value={endDatetime ? dayjs(endDatetime, "HH:mm") : null}
        onChange={handleEndTimeChange}
        format="HH:mm"
        minuteStep={1}
        className="w-full p-2 border rounded"
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
                className="px-6 py-2 w-40 bg-[#33BFBF] text-white rounded-md"
                onClick={onHandleConfirm}
              >
                Save
              </button>
              <button
  type="button"
  className="px-6 py-2 w-40 rounded-md border border-[#33BFBF] text-[#33BFBF]"
  onClick={onClose}
>
  Cancel
</button>

              
            </div>
          </form>
        </div>
      </Modal>

    </div>
)}
);
export default SchedulePopup;