import React, { useState, useEffect } from "react";
import { Modal } from "@mantine/core";

// const mockDevices = [
//   {
//     id: 1,
//     name: "เปิดไฟ 18.00 - 22:00 ทุกวัน",
//     startTime: "18:00",
//     endTime: "22:00",
//     status: "active",
//     repeat: "everyday",
//     executionDateTime: null,
//     percentDimming: 45,
//     lastUpdateTimestamp: "2025-03-13 13:22:26",
//     siteId: 1,
//     groupId: 1,
//     dayOfWeek: [1, 2, 3, 4, 5, 6, 7],
//     scheduledDevices: [
//       {
//         id: 1,
//         name: "หลอดไฟ 1",
//         description: "หลอดไฟถนนหน้าโรงอาหาร 1",
//       },
//       {
//         id: 2,
//         name: "หลอดไฟ 2",
//         description: "หลอดไฟถนนหน้าโรงอาหาร 1",
//       },{
//         id: 2,
//         name: "หลอดไฟ 2",
//         description: "หลอดไฟถนนหน้าโรงอาหาร 1",
//       },{
//         id: 2,
//         name: "หลอดไฟ 2",
//         description: "หลอดไฟถนนหน้าโรงอาหาร 1",
//       },{
//         id: 2,
//         name: "หลอดไฟ 2",
//         description: "หลอดไฟถนนหน้าโรงอาหาร 1",
//       },{
//         id: 2,
//         name: "หลอดไฟ 2",
//         description: "หลอดไฟถนนหน้าโรงอาหาร 1",
//       },{
//         id: 2,
//         name: "หลอดไฟ 2",
//         description: "หลอดไฟถนนหน้าโรงอาหาร 1",
//       },
//     ],
//   },
//   // เพิ่มอุปกรณ์ตัวอื่น ๆ ได้ที่นี่
// ];

export default function SchedulePopup({ isOpen, onClose ,mockDevices}) {
  console.log(mockDevices)
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [dimmingLevel, setDimmingLevel] = useState(mockDevices?.percentDimming || 10);
  const [repeatOption, setRepeatOption] = useState(mockDevices?.repeat || "once");
  const [startDatetime, setStartDatetime] = useState(mockDevices?.startTime || "");
  const [endDatetime, setEndDatetime] = useState(mockDevices?.endTime || "");
  console.log(mockDevices?.repeat)
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  // Use the first schedule from mockDevices
  const schedule = mockDevices;

   useEffect(() => {
    if (isOpen) {
      setStartDatetime(schedule?.startTime || "");
      setEndDatetime(schedule?.endTime || "");
      setRepeatOption(schedule?.repeat || "once");
      setDimmingLevel(schedule?.percentDimming || 10);
      setSelectedDevices();
    }
  }, [isOpen]);

  const handleDayChange = (day) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const toggleSelectAll = () => {
    if (selectedDevices?.length === schedule?.scheduledDevices.length) {
      setSelectedDevices([]); // ยกเลิกการเลือกทั้งหมด
    } else {
      setSelectedDevices(schedule?.scheduledDevices.map((device) => device.id));
      console.log()
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
  const updateSelectedDays = () => {
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
      return {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };
    }
  };

  useEffect(() => {
  const newSelectedDays = updateSelectedDays();
  setSelectedDays(newSelectedDays);
}, [repeatOption]);
const handleSave = () => {
  const param = {
    id: selectedDevices,
    dimming: dimmingLevel,
    repeat: repeatOption,
    startdate: startDatetime,
    enddate: endDatetime,
    dayOfWeek: Object.keys(selectedDays)
      .filter(day => selectedDays[day]) // คัดเลือกวันที่ถูกเลือก
      .map(day => {
        // แปลงชื่อวันเป็นตัวเลข (1-7)
        const daysMap = {
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 7,
        };
        return daysMap[day]; // แปลงชื่อวันเป็นตัวเลข
      }),
  };

  console.log(param); // หรือส่ง param ไปที่ API หรือทำอย่างอื่นตามต้องการ
};


  const days = updateSelectedDays();

  return (
    <>
      <Modal
        size="xl"
        opened={isOpen}
        onClose={onClose}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
       
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Add Schedule</h2>
          <form>
            <div className="mb-3 flex items- justify-between gap-4">
              <label className="text-sm font-medium">Schedule Name</label>
              <input
                type="text"
                className="w-96 p-2 border rounded"
                placeholder="Enter schedule name"
                defaultValue={schedule?.name} // Dynamically set schedule name
              />
            </div>

            {/* Device Table */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Device</label>
              <div className="h-52 overflow-hidden flex flex-col">
                <table className="w-full text-sm border-collapse">
                  <thead className="border-b sticky top-0 z-10 ">
                    <tr>
                      <th className="p-2 w-10">
                      <input
  type="checkbox"
  onChange={toggleSelectAll}
  checked={selectedDevices?.length > 0 && selectedDevices?.length === mockDevices?.scheduledDevices.length}
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
                      {schedule?.scheduledDevices?.map((device, index) => (
                        <tr
                          key={device.id}
                          className={`${
                            index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                          } border-b`}
                        >
                          <td className="p-2 text-center w-10">
                            <input
                              type="checkbox"
                              checked={selectedDevices?.includes(device.id)}
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
  value={repeatOption} // กำหนดค่าเริ่มต้นจาก mockDevices
  onChange={(e) => {
    const newRepeat = e.target.value;
    setRepeatOption(newRepeat);
    
    // อัปเดตค่า repeat ใน mockDevices[0]
    mockDevices[0] = {
      ...mockDevices[0],
      repeat: newRepeat
    };
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
                    value={startDatetime}
                    onChange={(e) => setStartDatetime(e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded"
                    value={endDatetime}
                    onChange={(e) => setEndDatetime(e.target.value)}
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
                    />
                    <span>-</span>
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              )}
              {repeatOption === "custom" && (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                      <label key={day} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name={day}
                          checked={selectedDays[day]}
                          onChange={() => handleDayChange(day)}
                        />
                        <span className="ml-2">{day.charAt(0).toUpperCase() + day.slice(1, 3)}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Dimming Level */}
            <div className="mt-3">
              <label className="text-sm font-medium">Dimming Level</label>
              <input
                type="range"
                min="0"
                max="100"
                value={dimmingLevel}
                onChange={(e) => setDimmingLevel(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>0%</span>
                <span>{dimmingLevel}%</span>
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
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
