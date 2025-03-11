import React, { useState } from "react";
import { Modal } from "@mantine/core";
const mockDevices = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Device ${i + 1}`,
  description: "xxxxxxxxxxxxxxxxxxxx",
}));

export default function SchedulePopup({ isOpen, onClose }) {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [dimmingLevel, setDimmingLevel] = useState(10);
  const [repeatOption, setRepeatOption] = useState("Once");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  if (!isOpen) return null;

  // Update the selectedDays based on repeatOption
  const updateSelectedDays = () => {
    if (repeatOption === "Weekday") {
      return {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      };
    } else if (repeatOption === "Weekend") {
      return {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: true,
      };
    } else if (repeatOption === "Everyday") {
      return {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      };
    } else if (repeatOption === "Custom") {
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

  const handleDayChange = (day) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const toggleSelectAll = () => {
    if (selectedDevices.length === mockDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(mockDevices.map((device) => device.id));
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
  const days = updateSelectedDays();

  return (
    <>
    <Modal
        size="xl"
        opened={true}
        onClose={() => onClickOk && onClickOk(false)}
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
            />
          </div>

          {/* Device Table */}
          <div className="mb-3">
  <label className="block text-sm font-medium">Device</label>
  <div className="h-72 overflow-hidden flex flex-col">
    <table className="w-full text-sm border-collapse">
      {/* หัวตาราง (ติดอยู่ด้านบน) */}
      <thead className="border-b sticky top-0 z-10 ">
        <tr>
          <th className="p-2 w-10">
            <input
              type="checkbox"
              onChange={toggleSelectAll}
              checked={selectedDevices.length === mockDevices.length}
            />
          </th>
          <th className="p-2 text-left">Device</th>
          <th className="p-2 text-left
          ">Description</th>
        </tr>
      </thead>
    </table>
    {/* ส่วนที่สามารถเลื่อน (tbody) */}
    <div className="overflow-auto h-full">
      <table className="w-full text-sm">
        <tbody>
          {mockDevices.map((device, index) => (
            <tr
              key={device.id}
              className={`${
                index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
              } border-b`}
            >
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



          <div className="space-y-3 mt-10">
            {/* Repeat Dropdown */}
            <div className="grid grid-cols-[0.5fr_2fr] items-center gap-x-4 mt-3">
              <label className="text-sm font-medium text-left">Repeat</label>
              <select
                className="w-full p-2 border rounded"
                value={repeatOption}
                onChange={(e) => setRepeatOption(e.target.value)}
              >
                <option value="Once">Once</option>
                <option value="Everyday">Everyday</option>
                <option value="Weekday">Weekday</option>
                <option value="Weekend">Weekend</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            {/* Start - Stop Time */}
            <div className="grid grid-cols-[0.5fr_2fr] items-center gap-x-4">
              <label className="text-sm font-medium text-left">Start - Stop Time</label>
              {repeatOption === "Once" && (
                <div className="flex gap-2">
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
              {(repeatOption === "Everyday" || repeatOption === "Weekday" || repeatOption === "Weekend") && (
                <div className="flex flex-col gap-2">
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
              {repeatOption === "Custom" && (
                <div className="flex flex-col gap-2">
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
            <div className="grid grid-cols-[0.5fr_2fr] items-center gap-x-4">
              <label className="text-sm font-medium text-left">Dimming Level</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dimmingLevel}
                  onChange={(e) => setDimmingLevel(e.target.value)}
                  className="w-96"
                />
                <span className="text-sm">{dimmingLevel}%</span>
              </div>
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
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
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
