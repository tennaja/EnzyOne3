"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  getBranch,
  getBulding,
  getFloor,
  getFloorplan,
  getAHU,
  getVAV,
  getSplittype,
  getIOT,
  getSplittypeGraph,
  getAHUGraph,
} from "@/utils/api";
import FloorPlan from "./FloorPlan";
import AHUtable from "./AHUtable";
import VAVtable from "./VAVtable";
import SplitTypetable from "./SplitTypetable";
import SmartIRtable from "./SmartIRtable";
import ChartAHU from "./chartAHU";
import ChartSplittype from "./chartSplittype";
import { ToastContainer, toast } from "react-toastify";
import ExternalList from "./ExternalList";

export default function FilterCard() {
  const [chartListAHU1, setChartListAHU1] = useState([]);
  const [chartListAHU2, setChartListAHU2] = useState([]);
  const [chartListAHU3, setChartListAHU3] = useState([]);
  const [chartListSplittype1, setChartListSplittype1] = useState([]);
  const [chartListSplittype2, setChartListSplittype2] = useState([]);
  const [chartListSplittype3, setChartListSplittype3] = useState([]);
  const [chartListSplittype4, setChartListSplittype4] = useState([]);
  const [isFirst, setIsFirst] = useState(true);
  const companyData = useSelector((state) => state.companyData.company);
  const username = useSelector((state) => state.userData.username);
  const [branchList, setBranchList] = useState([]);
  const [buildingList, setBuildingList] = useState([]);
  const [floorList, setFloorList] = useState([]);
  const [AHUList, setAHUList] = useState([]);
  const [VAVList, setVAVList] = useState([]);
  const [SplittypeList, setSplittypeList] = useState([]);
  const [IOTList, setIOTList] = useState([]);
  const [floorplanList, setFloorplanList] = useState([]);
  const [branchId, setBranchId] = useState(0);
  const [buildingId, setBuildingId] = useState(0);
  const [floorId, setFloorId] = useState(0);
  const [ListLabelAHU, setListLabelAHU] = useState([0]);
  const [ListLabelSplittype, setListLabelSplittype] = useState([0]);
  const [loadingGraph, setLoadingGraph] = useState(false);

  useEffect(() => {
    getBranchList();
  }, []);

  useEffect(() => {
    if (isFirst && floorId != 0) {
      onSearchData();
      // GetAHUGraph(floorId);
      // GetSplittypeGraph(floorId);
    }
  }, [floorId]);

  const notifySuccess = () =>
    toast.success(
      `Operation Complete
  `,
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
  const onTableChange = async (floorId) => {
    setFloorId(floorId);
  };
  //สาขา
  const getBranchList = async () => {
    const params = {
      Id: companyData.Id,
      username: username,
    };
    const result = await getBranch(params);

    if (result.data.length != 0) {
      setBranchList(result.data);

      setBranchId(result.data[0].Id);
      getBuldingList(result.data[0].Id);
    }
  };
  //อาคาร
  const getBuldingList = async (branchId) => {
    setBranchId(branchId);
    const result = await getBulding(branchId);

    setBuildingList(result.data);
    setBuildingId(result.data[0].Id);
    getFloorLit(result.data[0].Id);
  };
  //ชั้น
  const getFloorLit = async (buildingId) => {
    setBuildingId(buildingId);
    console.log(buildingId);
    const result = await getFloor(buildingId);
    // console.log(result.data)
    if (result.data.length != 0) {
      setFloorList(result.data);
      setFloorId(result.data[0].Id);

      // onSearchTable(result.data[0].Id);
    }
    // getTableAirCompressorList(result.data[0].Id)
  };

  // async function GetAHUGraph(floorId, dateFrom, dateTo) {
  //   setFloorId(floorId);
  //   const paramsNav = {
  //     floorId: floorId,
  //     dateFrom: "2024-02-02",
  //     dateTo: "2024-02-02",
  //   };
  //   const res = await getAHUGraph(paramsNav);
  //   console.log(paramsNav);
  //   if (res.status === 200) {
  //     if (res.data.controlValve.length > 0) {
  //       setChartListAHU1(res.data.controlValve);
  //       let label = [];
  //       let modday = 0;
  //       console.log(res.data.controlValve);
  //       for (let j = 0; j < res.data.controlValve[0].data.length; j++) {
  //         label.push(res.data.controlValve[0].data[j].time);
  //       }
  //       setListLabelAHU(label);
  //       // console.log(label);
  //     }
  //     if (res.data.supplyTemp.length > 0) {
  //       setChartListAHU2(res.data.supplyTemp);
  //       let label = [];
  //       let modday = 0;
  //       console.log(res.data.supplyTemp);
  //     }
  //     if (res.data.returnTemp.length > 0) {
  //       setChartListAHU3(res.data.returnTemp);
  //       let label = [];
  //       let modday = 0;
  //       console.log(res.data.returnTemp);
  //     }
  //   }
  // }

  const onSearchData = async () => {
    setFloorId(floorId);
    // const result = await getFloorplan(floorId);
    // console.log(floorId);
    // console.log(result.data)
    // let data = [];
    // data.push(result.data);
    // setFloorplanList(data);
    // console.log(result.data)
    setIsFirst(false);
    // getAHUList(floorId);
    // getVAVList(floorId);
    getSplittypeList(floorId);
    getIOTList(floorId);
    // GetAHUGraph(floorId)
    // GetSplittypeGraph(floorId)
  };

  const getAHUList = async (floorId) => {
    setFloorId(floorId);
    console.log(floorId);
    const result = await getAHU(floorId);
    // console.log(result.data)
    setAHUList(result.data);
  };

  const getVAVList = async (floorId) => {
    setFloorId(floorId);
    const result = await getVAV(floorId);
    // console.log(result.data)
    setVAVList(result.data);
  };

  const getSplittypeList = async (floorId) => {
    setFloorId(floorId);
    const result = await getSplittype(floorId);
    // console.log(result.data)
    setSplittypeList(result.data);
  };

  const getIOTList = async (floorId) => {
    setFloorId(floorId);
    const result = await getIOT(floorId);
    // console.log(result.data)
    setIOTList(result.data);
  };

  return (
    <div>
      <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
        <div className="flex flex-col gap-4 p-2">
          <span className="text-lg  font-bold">HVAC</span>
          <div className="w-full py-1 pb-2">
            <div className="inline-flex">
              <div className="flex justify-center bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
                <p className=" text-red-700 mx-2 ">*</p>
                <label>
                  Branch :
                  <select
                    className="w-44 border border-slate-300 mx-2 rounded-md h-9"
                    onChange={(event) => {
                      getBuldingList(event.target.value);
                    }}
                    value={branchId}
                  >
                    {branchList.map((item) => {
                      return (
                        <option key={item.id} value={item.Id}>
                          {item.Name}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>

              <div className="flex justify-center bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
                <p className=" text-red-700 mx-2 ">*</p>
                <label>
                  Building :
                  <select
                    className="w-44 border border-slate-300 mx-2 rounded-md h-9"
                    onChange={(event) => {
                      getFloorLit(event.target.value);
                    }}
                    value={buildingId}
                  >
                    {buildingList.map((item) => {
                      return (
                        <option key={item.id} Value={item.Id}>
                          {item.Name}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>
              <div className="flex justify-center bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
                <p className=" text-red-700 mx-2">*</p>
                <label>
                  Floor :
                  <select
                    className="w-44 border border-slate-300 mx-2 rounded-md h-9"
                    onChange={(event) => {
                      onTableChange(event.target.value);
                    }}
                    value={floorId}
                  >
                    {floorList.map((item) => {
                      return (
                        <option key={item.id} Value={item.Id}>
                          {item.Name}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>
              <div className="flex justify-center bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 items-center"></div>
              <button
                type="button"
                className="text-white bg-[#14b8a6] rounded-md text-lg px-10 h-9 mt-3 
                "
                onClick={onSearchData}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {floorplanList.id}
      </div>
      {/* <ExternalList FloorId={floorId} /> */}
      {/*  <FloorPlan
        FloorId={floorId}
        // Data={floorplanList}
        // AHUlist={AHUList}
        // VSVlist={VAVList}
        // Splittypelist = {SplittypeList}
        // IOTlist = {IOTList}
      /> */}

      <SplitTypetable SplittypeList={SplittypeList} />
      {/* <AHUtable AHUlist={AHUList} /> */}
      {/* <VAVtable VAVList={VAVList} /> */}
      <SmartIRtable IotList={IOTList} />

      <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 my-5">
        <div className="flex flex-col gap-4 p-2">
          <span className="text-lg  font-bold">Graph Split Type</span>
          <ChartSplittype
            FloorId={floorId}
            // power={chartListSplittype1}
            // temp={chartListSplittype2}
            // roomtemp={chartListSplittype3}
            // external={chartListSplittype4}
            // label={ListLabelSplittype}
          />
        </div>
      </div>
      {/*  <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 my-5">
        <div className="flex flex-col gap-4 p-2">
          <span className="text-lg  font-bold">Graph AHU</span>
          <ChartAHU
            FloorId={floorId}
            // chartControle={chartListAHU1}
            // chartSupplytemp={chartListAHU2}
            // returntemp={chartListAHU3}
            // label={ListLabelAHU}
          />
        </div>
      </div> */}
      <ToastContainer />
    </div>
  );
}
