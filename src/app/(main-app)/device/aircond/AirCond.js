"use client";
import React, { Fragment, useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import axios from "axios";
import numeral from "numeral";
import Image from "next/image";
import BuildingList from "./components/BuildingList";
import { getCompanyData, getAllBranchData, getAreaData } from "@/utils/api";
import DeviceType from "./components/DeviceType";
import DeviceList from "./components/DeviceList";

export default function AirCond({ companyId = 2 }) {
  const [companyData, setCompanyData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [areaData, setAreaData] = useState([]);
  const [selectedArea, setSelectedArea] = useState();
  const [buildingData, setBuildingData] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState([]);
  const [deviceParameter, setDeviceParameter] = useState([
    {
      deviceTypeID: "1",
      deviceTypeName: "Air Split",
      parameter: [
        "Return Temp",
        "Humidity",
        "VSD (% Drive)",
        "Fan Speed",
        "Mode",
      ],
    },
  ]);

  const [deviceData, setDeviceData] = useState([
    {
      id: 1,
      deviceTypeID: 1,
      deviceName: "Air Split Type 1",
      status: "ON",
      data: [
        { deviceParameterID: 1, value: 120 },
        { deviceParameterID: 2, value: 90 },
        { deviceParameterID: 3, value: 8 },
        { deviceParameterID: 4, value: "Auto" },
        { deviceParameterID: 5, value: "Cold" },
      ],
    },
    {
      id: 2,
      deviceTypeID: 1,
      deviceName: "Air Split Type 2",
      status: "OFF",
      data: [
        { deviceParameterID: 1, value: 220 },
        { deviceParameterID: 2, value: 80 },
        { deviceParameterID: 3, value: 10 },
        { deviceParameterID: 4, value: "Auto" },
        { deviceParameterID: 5, value: "Cold" },
      ],
    },
    {
      id: 3,
      deviceTypeID: 1,
      deviceName: "Air Split Type 3",
      status: "OFF",
      data: [
        { deviceParameterID: 1, value: 220 },
        { deviceParameterID: 2, value: 80 },
        { deviceParameterID: 3, value: 10 },
        { deviceParameterID: 4, value: "Auto" },
        { deviceParameterID: 5, value: "Cold" },
      ],
    },
  ]);

  useEffect(() => {
    getCompanyData(companyId).then((result) => {
      console.log(result);
      setCompanyData(result.data);
    });

    getAllBranchData(companyId).then((result) => {
      setBranchData(result);
      setSelectedBranch(result[0]);
    });
  }, []);

  useEffect(() => {
    console.log("selectedBranch", selectedBranch);

    let branchId = selectedBranch?.id;
    if (branchId) {
      getAreaData(branchId).then((result) => {
        console.log("getAreaData", result.data);
        setAreaData(result.data);
        setSelectedArea(result.data[0]);
      });
    }
  }, [selectedBranch]);

  useEffect(() => {
    console.log("selectedArea", selectedArea);
    setSelectedBuilding("");

    let areaID = selectedArea?.id;
    if (areaID) {
      getBuildingData(areaID).then((result) => {
        setBuildingData(result);
      });
    }
  }, [selectedArea]);

  const getBuildingData = async (areaId) => {
    const res = await axios.get(`/api/building?area_id=${areaId}`);
    let buildingData = res.data.data;
    console.log("getBuildingData", buildingData);
    return buildingData;
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <main className="p-4 lg:p-8 bg-light dark:bg-dark-base">
        <div className="rounded-xl border border-stroke bg-white px-5 mb-4 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
          <div className="flex justify-between items-center py-4 dark:border-strokedark">
            <h4 className="font-semibold text-xl text-black dark:text-white">
              Air Conditioning System
            </h4>
            <div className="flex gap-2">
              {selectedBranch && (
                <Dropdown
                  dataList={branchData}
                  setSelected={setSelectedBranch}
                  selected={selectedBranch}
                />
              )}
              {selectedBranch && (
                <Dropdown
                  dataList={areaData}
                  setSelected={setSelectedArea}
                  selected={selectedArea}
                />
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white px-5 mb-4 py-4 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
          <h4 className="font-semibold text-xl text-black dark:text-white py-4">
            Device Layout
          </h4>

          <div className="grid md:grid-cols-4 xl:grid-cols-6 gap-5 mt-4">
            <div className="md:col-span-1 xl:col-span-1 border-r pr-5">
              <h4 className="font-normal text-sm text-enzy-dark dark:text-white mb-4">
                Building
              </h4>
              <BuildingList buildingData={buildingData} />
            </div>

            <div className="md:col-span-1 xl:col-span-4">
              <h4 className="font-normal text-sm text-enzy-dark dark:text-white mb-4">
                Layout
              </h4>
              <Image
                src="/images/sample_floor.png"
                alt=""
                height={500}
                width={500}
                className="w-full"
              />
            </div>

            <div className="md:col-span-1 xl:col-span-1 border-l pl-5">
              <h4 className="font-normal tracking-wide text-sm text-enzy-dark dark:text-white mb-4">
                Device Type
              </h4>
              <div className="overflow-auto" style={{ height: 500 }}>
                <DeviceType />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white px-5 mb-4 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
          <div className="flex items-center py-5 dark:border-strokedark">
            <h4 className="font-semibold text-xl text-black dark:text-white">
              Device Control
            </h4>
          </div>

          <DeviceList
            deviceParameter={deviceParameter[0].parameter}
            deviceData={deviceData}
          />
        </div>
      </main>
    </div>
  );
}
