import React from "react";
import { Button, Select, Table, Tag } from "antd";
import Map from "./Thaimap";
import DvrIcon from '@mui/icons-material/Dvr';
import TuneIcon from '@mui/icons-material/Tune';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';


const { Option } = Select;

const data = [
  { key: "1", device: "หลอด 1", kW: 0.3, kWh: 30, runningHrs: 2, status: "On", connection: "Connected", dimming: "10%" },
  { key: "2", device: "หลอด 5", kW: 0.3, kWh: 30, runningHrs: 2, status: "Off", connection: "Connected", dimming: "25%" },
  { key: "3", device: "หลอด 9", kW: 0.3, kWh: 30, runningHrs: 2, status: "Offline", connection: "Disconnected", dimming: "25%" },
  { key: "4", device: "หลอด 9", kW: 0.3, kWh: 30, runningHrs: 2, status: "Offline", connection: "Disconnected", dimming: "25%" },
  { key: "5", device: "หลอด 9", kW: 0.3, kWh: 30, runningHrs: 2, status: "Offline", connection: "Disconnected", dimming: "25%" },
  { key: "6", device: "หลอด 9", kW: 0.3, kWh: 30, runningHrs: 2, status: "Offline", connection: "Disconnected", dimming: "25%" },
  { key: "7", device: "หลอด 9", kW: 0.3, kWh: 30, runningHrs: 2, status: "Offline", connection: "Disconnected", dimming: "25%" },
  { key: "8", device: "หลอด 9", kW: 0.3, kWh: 30, runningHrs: 2, status: "Offline", connection: "Disconnected", dimming: "25%" },
  { key: "9", device: "หลอด 5", kW: 0.3, kWh: 30, runningHrs: 2, status: "Off", connection: "Connected", dimming: "25%" },
  { key: "10", device: "หลอด 5", kW: 0.3, kWh: 30, runningHrs: 2, status: "Off", connection: "Connected", dimming: "25%" },
  { key: "11", device: "หลอด 5", kW: 0.3, kWh: 30, runningHrs: 2, status: "Off", connection: "Connected", dimming: "25%" },
  { key: "12", device: "หลอด 5", kW: 0.3, kWh: 30, runningHrs: 2, status: "Off", connection: "Connected", dimming: "25%" },
];

const columns = [
  { title: "Device", dataIndex: "device", key: "device" },
  { title: "kW", dataIndex: "kW", key: "kW" },
  { title: "kWh", dataIndex: "kWh", key: "kWh" },
  { title: "Running Hrs", dataIndex: "runningHrs", key: "runningHrs" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={status === "On" ? "green" : status === "Off" ? "volcano" : "red"}>
        {status}
      </Tag>
    )
  },
  {
    title: "Connection",
    dataIndex: "connection",
    key: "connection",
    render: (connection) => (
      <Tag color={connection === "Connected" ? "blue" : "red"}>{connection}</Tag>
    )
  },
  { title: "% Dimming", dataIndex: "dimming", key: "dimming" },
  {
    title: "",
    key: "action",
    render: () => <ArrowForwardIosOutlinedIcon style={{ color: 'var(--primary)' }}/>,
  },
];

const SmartStreetLight = () => {
  return (
<div>
//header//
<div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
  <div className="flex flex-col gap-4 p-2">
    <div className="flex justify-between items-center">
      <span className="text-lg font-bold">Smart Street Light</span>
      <div className="ml-auto flex gap-5">
        <Button className="text-sm py-4 px-4 border-primary text-primary bg-white dark:border-primary dark:bg-dark-box dark:text-slate-200 hover:bg-primary hover:text-white"><DvrIcon/>Dasboard</Button> {/* Small button */}
        <Button className="text-sm py-4 px-4 border-primary text-primary bg-white dark:border-primary dark:bg-dark-box dark:text-slate-200"><TuneIcon/>Control</Button> {/* Large button */}
        <Button className="text-sm py-4 px-4 border-primary text-primary bg-white dark:border-primary dark:bg-dark-box dark:text-slate-200"><CalendarMonthOutlinedIcon/>Schedule</Button> {/* Medium button */}
      </div>
    </div>
  </div>
</div>


    

    
    <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
      <div className="flex flex-col gap-4 p-2">

        <div className="inline-flex">
          

          <div className="flex justify-start gap-5">
            <div>
              <span className="text-sm">Site: </span>
              <Select defaultValue="EGAT" style={{ width: 120 }} className="pl-3">
                <Option value="EGAT">EGAT</Option>
              </Select>
            </div>
            <div>
              <span className="text-sm">Groups: </span>
              <Select defaultValue="All Groups" style={{ width: 150 }} className="pl-3">
                <Option value="All Groups">All Groups</Option>
                <Option value="กลุ่ม 1">กลุ่ม 1</Option>
              </Select>
            </div>
            <div>
              <span className="text-sm">Device: </span>
              <Select defaultValue="หลอด 1" style={{ width: 150 }} className="pl-3">
                <Option value="หลอด 1">หลอด 1</Option>
                <Option value="หลอด 2">หลอด 2</Option>
              </Select>
            </div>
            <Button type="primary">Search</Button>
          </div>
          
        </div></div></div>
        
        <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
  <div className="flex flex-col gap-4 p-2">
    {/* Search bar */}
    <div className="flex justify-between items-center">
    <div className="flex-1">
  <span className="text-base font-bold block mb-2">Device List</span>
  <p className="text-xs gap-6 mb-1">Egat  |  ลานจอดรถชั้น 2</p>
</div>
//header//

      <input
        type="text"
        placeholder="ค้นหา"
        className="border border-gray-300 p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Map and Table container */}
    <div className="flex justify-center gap-4">
      {/* Centered Map */}
      <div className="flex justify-center items-center w-full max-w-2xl">
        <Map />
      </div>

      {/* Data Table */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold">{data.length} Devices</span>
        </div>
        <Table dataSource={data} columns={columns} />
      </div>
    </div>
  </div>
</div>


       
       
        </div>
  );
};

export default SmartStreetLight;
