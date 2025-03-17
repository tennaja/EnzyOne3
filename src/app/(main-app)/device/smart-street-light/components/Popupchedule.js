import React, { useState, useEffect } from "react";
import { Modal } from "@mantine/core";
import {
  postCreateSchedule, putUpdateSchedule
} from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import ModalConfirm from "./Popupconfirm";
import ModalDone from "./Popupcomplete";
import ModalFail from "./PopupFali";
export default function SchedulePopup({
  isOpen,
  onClose,
  deviceList,
  scheduleData,
  Action,
  groupId,
  onHandleConfirm,
  FetchData
}) {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [dimmingLevel, setDimmingLevel] = useState(scheduleData?.percentDimming || 10);
  const [repeatOption, setRepeatOption] = useState(scheduleData?.repeat || "once");
  const [startDatetime, setStartDatetime] = useState(scheduleData?.startTime || "");
  const [endDatetime, setEndDatetime] = useState(scheduleData?.endTime || "");
  const [scheduleName, setScheduleName] = useState(scheduleData?.name || "");
  const [openModalconfirm, setopenModalconfirm] = useState(false)
  const [openModalsuccess, setopenModalsuccess] = useState(false)
  const [openModalfail, setopenModalfail] = useState(false)
  const [modalConfirmProps, setModalConfirmProps] = useState(null);
  const [modalErrorProps, setModalErorProps] = useState(null);
  const [modalSuccessProps, setModalSuccessProps] = useState(null);
  const [dateTime,setDatetime] = useState(scheduleData?.executionDateTime)
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  
  // Use the first schedule from scheduleData
  const schedule = scheduleData;

  useEffect(() => {
    if (isOpen) {
      setScheduleName(schedule?.name || "")
      setDatetime(schedule?.executionDateTime || "")
      setStartDatetime(schedule?.startTime || "");
      setEndDatetime(schedule?.endTime || "");
      setRepeatOption(schedule?.repeat || "once");
      setDimmingLevel(schedule?.percentDimming || 10);
      setSelectedDevices(schedule?.scheduledDevices?.map(device => device.id) || []);
    }
  }, [isOpen]);

  const handleDayChange = (day) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
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

  const handleOpenModalconfirm = () => {
    setopenModalconfirm(true);
    setModalConfirmProps({
      onCloseModal: handleClosePopup,
      onClickConfirmBtn: Action === "create" ? handleSaveCreate : handleSaveUpdate,
      title: "Edit/Save Schedule",
      content: "Are you sureyou want to save this schedule ?"
      ,
      buttonTypeColor: "primary",
    });
  };
  const handleClosePopup = () => {
    setopenModalconfirm(false)
    setopenModalsuccess(false)
    setopenModalfail(false)
  }
  const CreateSchedul = async (req) => {
    try {
      console.log("Request Parameters:", req);

      const result = await postCreateSchedule(req);
      console.log("Group List Result:", result);

      if (result.status === 201) {
        console.log("Success");
        setopenModalconfirm(false)
        
        onClose()
        FetchData()
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
        setopenModalconfirm(false)

        onClose()
        FetchData()
      } else {
        console.log("No groups found!");
        setopenModalfail(true)
      }
    } catch (error) {
      console.log("Error creating schedule:", error);
    }
  };

  const handleSaveCreate = () => {
    const param = {
      name: scheduleName,
      groupId: Number(groupId),
      startTime: startDatetime,
      endTime: endDatetime,
      repeat: repeatOption,
      executionDateTime: "null",
      percentDimming: Number(dimmingLevel),
      dayOfWeek: repeatOption === "once"
        ? [] // หากเลือก "once" ให้เป็น []
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

    console.log("Generated Parameters:", param);

    // ส่ง param ไปยัง CreateSchedul
    CreateSchedul(param);
  };

  const handleSaveUpdate = () => {
    const param = {
      name: scheduleName,
      groupId: Number(groupId),
      startTime: startDatetime,
      endTime: endDatetime,
      repeat: repeatOption,
      executionDateTime: "null",
      percentDimming: Number(dimmingLevel),
      dayOfWeek: repeatOption === "once"
        ? [] // หากเลือก "once" ให้เป็น []
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

    console.log("Generated Parameters:", param);

    // ส่ง param ไปยัง CreateSchedul
    UpdateSchedul(scheduleData.id, param);
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
                value={scheduleName} // ใช้ค่า state ในการแสดงผล
                onChange={(e) => setScheduleName(e.target.value)} // อัพเดต state เมื่อมีการเปลี่ยนแปลง
              />
            </div>

            {/* Device Table */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Device</label>
              <div className="h-52 overflow-hidden flex flex-col">
                <table className="w-full text-sm border-collapse">
                  <thead className="border-b sticky top-0 z-10">
                    <tr>
                      <th className="p-2 w-10">
                        <input
                          type="checkbox"
                          onChange={toggleSelectAll}
                          checked={(selectedDevices || []).length > 0 && (selectedDevices || []).length === (deviceList || []).length}
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
                      {deviceList?.map((device, index) => (
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
                  } else {
                    console.error('schedule is undefined or empty');
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
                    value={dateTime}
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
                      value={startDatetime}
                      onChange={(e) => setStartDatetime(e.target.value)}
                    />
                    <span>-</span>
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      value={endDatetime}
                      onChange={(e) => setEndDatetime(e.target.value)}
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
                      value={startDatetime}
                      onChange={(e) => setStartDatetime(e.target.value)}
                    />
                    <span>-</span>
                    <input
                      type="time"
                      className="w-full p-2 border rounded"
                      value={endDatetime}
                      onChange={(e) => setEndDatetime(e.target.value)}
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
                onClick={handleOpenModalconfirm}
              >
                Save
              </button>
            </div>
          </form>
        </div>
        {openModalconfirm && <ModalConfirm {...modalConfirmProps} />}
        {openModalsuccess && <ModalDone />}
        {openModalfail && <ModalFail onCloseModal={handleClosePopup} />}
      </Modal>
    </>
  );
}
