"use client";
import React, { useEffect, useState } from "react";
import { NumericFormat } from 'react-number-format';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Highlighter from "react-highlight-words";
import Link from "next/link";
import {
  ChangeValueSettempAHU,ChangeAutomationAHU
} from "@/utils/api";
import Loading from "./Loading";
import TextField from '@mui/material/TextField';
import { message } from "antd";
export default function AHUtable(AHUlist) {
  console.log(AHUlist)
  const [searchTable, setSerachTable] = useState("");
  const [DecviceId, setDeviceId] = useState(null);
  const [DeviceName, setDeviceName] = useState('');
  const [Values, setValues] = useState();
  const [OpenSettempModal, setOpenSettempModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ModalError, setModalError] = useState(false);
  const [showModalAutomationstart, setShowModalAutomationstart] = useState(false);
  const [showModalAutomationstop, setShowModalAutomationstop] = useState(false);
  const [alerttitle, setAlertTitle] = useState("");
  const [alertmassage, setAlertmessage] = useState("");
  const min = 10;
  const max = 40;
  function titleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  }
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
  
  


  const onChangeValue = (event) => {
    setValues(event);
  };
  const onclickOPenSettemp = (id, Decvicename, values) => {
    setOpenSettempModal(true)
    setDeviceId(id)
    setDeviceName(Decvicename)
    setValues(values)
  }
  const closeModal = () => {
    setOpenSettempModal(false)
    setModalError(false)
    setDeviceId(null);
    setShowModalAutomationstart(false)
    setShowModalAutomationstop(false)
    setLoading(false)
    // setShowModalStop(false);
    // setShowModalStart(false);
};
const handleChangeValueSettemp = async () => {
  setLoading(true);
  const res = await ChangeValueSettempAHU(DecviceId, Values);
  if (res.status === 200) {
    setAlertTitle(res.data.title);
    setAlertmessage(res.data.message);
    console.log(res.data)
    setLoading(false);
    closeModal();
    notifySuccess(res.data.title,res.data.message);
  } else if (res.response.status === 401) {
    setAlertTitle(res.data.title);
    setAlertmessage(res.data.message);
    setLoading(false);
    closeModal();
    setModalError(true)
  } else if (res.response.status === 500) {
    setAlertTitle(res.data.title);
      setAlertmessage(res.data.message);
    setLoading(false);
    closeModal();
    setModalError(true)
  }
}
const openModalAutomationIsStop = (DecviceId,Decvicename) => {
  setDeviceId(DecviceId)
  setDeviceName(Decvicename)
  setValues('off')
  setShowModalAutomationstop(true);
  
}
const openModalAutomationIsStart = (DecviceId,Decvicename) => {
  setDeviceId(DecviceId)
  setDeviceName(Decvicename)
  setValues('on')
  setShowModalAutomationstart(true);
  
}
async function clickChangestatusAutomation() {
  setLoading(true);
  const res = await ChangeAutomationAHU(DecviceId, Values);
  if (res.status === 200) {
    console.log(res.data)
    setAlertTitle(res.data.title);
    setAlertmessage(res.data.message);
    closeModal();
    setLoading(false);
    notifySuccess(res.data.title,res.data.message);
  } else if (res.response.status === 401) {
    setAlertTitle(res.response.data.title);
    setAlertmessage(res.response.data.message);
    closeModal();
    setLoading(false);
    
  }
  else if (res.response.status === 500) {
    setAlertTitle(res.response.data.title);
    setAlertmessage(res.response.data.message);
    closeModal();
    setLoading(false);
  }
}
  return (
<div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 my-5">
        <div className="flex flex-col gap-4 p-2">
          <div className="flex justify-between">
            <span className="text-lg  font-bold">AHU</span>
            <input
              type="text"
              placeholder="Search Device"
              className="border border-slate-300 rounded-md h-9 px-2"
              onKeyUp={(e) => {
                setSerachTable(e.target.value);
              }}
            />
          </div>

    <div className="flex flex-col ">
      <div className="sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 ">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b  dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Device
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Supply Temp. (°C)
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Supply Temp. Setpoint (°C)
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Return Temp. (°C)
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    VSD %Drive (Hz)
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    VSD Power (kW)
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    VSD Speed (rpm)
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Control Valve (%)
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                  Automation
                  </th>
                </tr>
              </thead>
              <tbody>
                {AHUlist.AHUlist.length > 0 &&
                  AHUlist.AHUlist.filter((item) => {
                    // let data = []
                    //  if (item.power.toString().includes(searchTable)){
                    //   data = item
                    // }
                    // console.log(data)
                    return (
                      item.deviceName.includes(searchTable) ||
                      item.deviceName.toLowerCase().includes(searchTable) ||
                      item.status.toLowerCase().includes(searchTable.toLowerCase()) ||
                      item.status.toUpperCase().includes(searchTable.toUpperCase()) ||
                      String(item.supplyTemp.toFixed(2)).includes(searchTable) ||
                      String(item.supplyTempSetPoint.toFixed(2)).includes(searchTable) ||
                      String(item.returnTemp.toFixed(2)).includes(searchTable) ||
                      String(item.vsdDrive.toFixed(2)).includes(searchTable)||
                      String(item.vsdPower.toFixed(2)).includes(searchTable)||
                      String(item.vsdSpeed.toFixed(2)).includes(searchTable)||
                      String(item.controlValve.toFixed(2)).includes(searchTable)
                    );
                  }).map((item) => {
                    
                    return (
                      <tr
                        className="border-b dark:border-neutral-500"
                        key={item.id}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-extrabold">
                        <Highlighter
                                    highlightClassName="highlight" // Define your custom highlight class
                                    searchWords={[searchTable]}
                                    autoEscape={true}
                                    textToHighlight={item.deviceName}// Replace this with your text
                                  />
                          
                        </td>
                        <td
                           className={
                            item.status == "on"
                              ? "whitespace-nowrap px-6 py-4 text-center text-green-500 font-extrabold"
                              : item.status == "offline" ? "whitespace-nowrap px-6 py-4 text-center text-red-500 font-extrabold"
                              : "whitespace-nowrap px-6 py-4 text-center text-gray-500 font-extrabold"
                          }
                        >
                          <Highlighter
                                    highlightClassName="highlight" // Define your custom highlight class
                                    searchWords={[searchTable]}
                                    autoEscape={true}
                                    textToHighlight={
                                      titleCase(item.status)
                                    }// Replace this with your text
                                  />
                          
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center font-extrabold">
                        {item.status == "offline" ? "-" : <Highlighter
                                    highlightClassName="highlight" // Define your custom highlight class
                                    searchWords={[searchTable]}
                                    autoEscape={true}
                                    textToHighlight={String(item.supplyTemp.toFixed(2))} // Replace this with your text
                                  />}
                        
                        
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center ">
                        {item.status == "offline" ? "-" : item.status == "off" ? <Highlighter
                                    className="font-bold cursor-pointer"
                                    onClick={(event) =>  item.status == "on" ? onclickOPenSettemp(item.id, item.deviceName, item.supplyTempSetPoint ,event.preventDefault()) : null}
                                    highlightClassName="highlight" // Define your custom highlight class
                                    searchWords={[searchTable]}
                                    autoEscape={true}
                                    textToHighlight={String(item.supplyTempSetPoint.toFixed(2))} // Replace this with your text
                                  />: <Highlighter
                                    className="text-[#5eead4] underline font-bold cursor-pointer"
                                    onClick={(event) =>  item.status == "on" ? onclickOPenSettemp(item.id, item.deviceName, item.supplyTempSetPoint ,event.preventDefault()) : null}
                                    highlightClassName="highlight" // Define your custom highlight class
                                    searchWords={[searchTable]}
                                    autoEscape={true}
                                    textToHighlight={String(item.supplyTempSetPoint.toFixed(2))} // Replace this with your text
                                  />}
                        
                          
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center font-extrabold">
                        {item.status == "offline" ? "-" :  <Highlighter
                                    highlightClassName="highlight" // Define your custom highlight class
                                    searchWords={[searchTable]}
                                    autoEscape={true}
                                    textToHighlight={String(item.returnTemp.toFixed(2))} // Replace this with your text
                                  />}
                       
                          
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center font-extrabold">
                        {item.status == "offline" ? "-" : <Highlighter
                                    highlightClassName="highlight" // Define your custom highlight class
                                    searchWords={[searchTable]}
                                    autoEscape={true}
                                    textToHighlight={String(item.vsdDrive.toFixed(2))} // Replace this with your text
                                  />}
                        
                        
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center font-extrabold">
                        {item.status == "offline" ? "-" : <Highlighter
                                    highlightClassName="highlight" // Define your custom highlight class
                                    searchWords={[searchTable]}
                                    autoEscape={true}
                                    textToHighlight={String(item.vsdPower.toFixed(2))} // Replace this with your text
                                  />}
                        
                          
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center font-extrabold">
                        {item.status == "offline" ? "-" :  <Highlighter
                                    highlightClassName="highlight" // Define your custom highlight class
                                    searchWords={[searchTable]}
                                    autoEscape={true}
                                    textToHighlight={String(item.vsdSpeed.toFixed(2))} // Replace this with your text
                                  />}
                       
                
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center font-extrabold">
                        {item.status == "offline" ? "-" : <Highlighter
                                    highlightClassName="highlight" // Define your custom highlight class
                                    searchWords={[searchTable]}
                                    autoEscape={true}
                                    textToHighlight={String(item.controlValve.toFixed(2))} // Replace this with your text
                                  />
                          }
                        
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 flex justify-center items-center font-extrabold">
                                
                        {item.status == "offline" ? "-" : item.status == "off" ? <div className='toggle-container-disable' onClick={() =>
                                item.status == "on" ?
                                item.automation == "on"
                                    ? openModalAutomationIsStop(item.id,item.deviceName)
                                    : openModalAutomationIsStart(item.id,item.deviceName)
                                 :  null }>
                                    <div className={`toggle-btn-disable ${item.automation=="off" ? "disableNone" : ""}`}>
                                        {item.automation=="on" ? "ON" : "OFF"}
                                    </div>
                                </div> 
                                
                                : <div className='toggle-container' onClick={() =>
                                item.status == "on" ?
                                item.automation == "on"
                                    ? openModalAutomationIsStop(item.id,item.deviceName)
                                    : openModalAutomationIsStart(item.id,item.deviceName)
                                 :  null }>
                                    <div className={`toggle-btn ${item.automation=="off" ? "disable" : ""}`}>
                                        {item.automation=="on" ? "ON" : "OFF"}
                                    </div>
                                </div>}

       
                                
                         
                                                       </td>
                        
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div></div>
        {OpenSettempModal ? (
          <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-auto shadow-lg rounded-md bg-white">
              <h5 className="mt-5">Set Supply Temp. Setpoint (°C) : {DeviceName}</h5>
              <NumericFormat 
              type="number" 
              className="border border-slate-300 rounded-md h-9 px-2 mt-2 w-80" 
              min={10}
              max={40}
              value={Values} 
              decimalScale={2}
              onChange={e => setValues(e.target.value)}
    onBlur={e => {
        setValues(Math.min(max, Math.max(min, Values)).toFixed(2));
    }}
              />
             
              <div className="flex justify-center mt-10 gap-5">
                <button
                  className="px-4 py-2 bg-white text-[#14b8a6] border border-teal-300 font-medium rounded-md  focus:outline-none"
                  onClick={() => closeModal()}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#14b8a6] text-white font-medium rounded-md  focus:outline-none"
                  onClick={() => handleChangeValueSettemp()}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {loading ? (
          <Loading />
        ) : null}
        {ModalError ? (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-auto shadow-lg rounded-md bg-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mt-5">
                  Something Went wrong
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-lg text-gray-500 mt-2">We aren&apos;t able to process your requested operation
                    Please try again </p>
                </div>
                <div className="flex justify-center mt-10 gap-5">
                  <button
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-md  focus:outline-none w-62"
                    onClick={() => closeModal()}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {showModalAutomationstart  ? (
          <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-auto shadow-lg rounded-md bg-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mt-5">
                  Are you sure ?
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-lg text-gray-500 mt-2"> Are you sure you want to start {DeviceName} now ? </p>
                </div>
                <div className="flex justify-center mt-10 gap-5">
                  <button
                    className="px-4 py-2 bg-white text-[#14b8a6] border border-teal-300 font-medium rounded-md  focus:outline-none"
                    onClick={() => closeModal()}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-[#14b8a6] text-white font-medium rounded-md  focus:outline-none"
                    onClick={() => clickChangestatusAutomation()}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {showModalAutomationstop  ? (
          <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-auto shadow-lg rounded-md bg-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mt-5">
                  Are you sure ?
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-lg text-gray-500 mt-2"> Are you sure you want to stop {DeviceName} now ? </p>
                </div>
                <div className="flex justify-center mt-10 gap-5">
                  <button
                    className="px-4 py-2 bg-white text-[#14b8a6] border border-teal-300 font-medium rounded-md  focus:outline-none"
                    onClick={() => closeModal()}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-[#14b8a6] text-white font-medium rounded-md  focus:outline-none"
                    onClick={() => clickChangestatusAutomation()}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        </div>
        
  );
}
