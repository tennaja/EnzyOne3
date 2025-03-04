"use client";
import React, { Fragment, useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import BatteryOverview from "./components/BatteryOverview";
import BatterySpec from "./components/BatterySpec";
import Summary from "./components/Summary";
import SummaryBySource from "./components/SummaryBySource";
import BatteryStates from "./components/BatteryStates";
import BatteryPower from "./components/BatteryPower";
import BatteryCharge from "./components/BatteryCharge";
// import LineChart from "@/components/LineChart";
import BatteryChart from "./components/BatteryChart";

// import { LineChart } from "@/components/Chart";
import axios from "axios";
import { ChartSOC } from "./components/ChartSOC";
import FilterCard from "../../overview/components/FilterCard";

export default function Battery() {
  const [branchList, setBranchList] = useState([
    { name: "บางเขน" },
    { name: "ศรีราชา" },
    { name: "กำแพงแสน" },
  ]);

  const [batteryData, setBatteryData] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState([]);

  const handleDeviceSelection = (device) => {
    setSelectedDevice(device);
  };

  useEffect(() => {
    // Simulating API call to fetch battery data
    fetchBatteryData().then((data) => {
      setBatteryData(data);
      setSelectedDevice(data[0]);
    });
  }, []);

  const fetchBatteryData = () => {
    // Simulating API response
    return new Promise((resolve) => {
      // setTimeout(() => {
      const batteryData = [
        {
          id: "battery1",
          name: "Battery 1",
          image: "/images/battery_spec.png",
          status: "online",
          currentState: "charge",
          manufacturer: "Tesla",
          model: "Powerwall plus",
          type: "Lithium-ion",
          power: "60.6",
          capacity: "<= 250",
          lifetime: "1000-4500",
          lastestCharge: "2021-08-01 14:00:00",
          stateOfCharge: 40,
          stateOfHealth: 70,
          cycles: 38,
          bmsTemp: 55,
          voltage: 50,
          charge: 314.02,
          discharge: 272.59,
        },
        {
          id: "battery2",
          name: "Battery 2",
          image: "/images/battery_spec.png",
          status: "online",
          currentState: "discharge",
          manufacturer: "Tesla",
          model: "Powerwall plus",
          type: "Lithium-ion",
          power: "20.6",
          capacity: "<= 250",
          lifetime: "1000-4500",
          lastestCharge: "2021-08-01 14:00:00",
          stateOfCharge: 50,
          stateOfHealth: 8,
          cycles: 60,
          bmsTemp: 30,
          voltage: 30,
          charge: 214.0,
          discharge: 172.0,
        },
        {
          id: "battery3",
          name: "Battery 3",
          image: "/images/battery_spec.png",
          status: "online",
          currentState: "charge",
          manufacturer: "Tesla",
          model: "Powerwall plus",
          type: "Lithium-ion",
          power: "80.6",
          capacity: "<= 250",
          lifetime: "1000-4500",
          lastestCharge: "2021-08-01 14:00:00",
          stateOfCharge: 70,
          stateOfHealth: 40,
          cycles: 20,
          bmsTemp: 50,
          voltage: 100,
          charge: 114.0,
          discharge: 72.0,
        },
        {
          id: "battery4",
          name: "Battery 4",
          image: "/images/battery_spec.png",
          status: "offline",
          currentState: "discharge",
          manufacturer: "Tesla",
          model: "Powerwall plus",
          type: "Lithium-ion",
          power: "100",
          capacity: "<= 250",
          lifetime: "1000-4500",
          lastestCharge: "2021-08-01 14:00:00",
          stateOfCharge: 80,
          stateOfHealth: 20,
          cycles: 30,
          bmsTemp: 60,
          voltage: 20,
          charge: 1014.0,
          discharge: 572.0,
        },
        {
          id: "battery5",
          name: "Battery 5",
          image: "/images/battery_spec.png",
          status: "offline",
          currentState: "discharge",
          manufacturer: "Tesla",
          model: "Powerwall plus",
          type: "Lithium-ion",
          power: "75",
          capacity: "<= 250",
          lifetime: "1000-4500",
          lastestCharge: "2021-08-01 14:00:00",
          stateOfCharge: 90,
          stateOfHealth: 100,
          cycles: 40,
          bmsTemp: 70,
          voltage: 44,
          charge: 554.0,
          discharge: 202.0,
        },
      ];
      resolve(batteryData);
      // }, 1000); //delay for API response
    });
  };

  const [chartData, setChartData] = useState([]);
  const [timeAxisData, setTimeAxisData] = useState([]);

  useEffect(() => {
    // Call getMeterData when the component mounts
    getMeterData();

    async function getMeterData() {
      console.log("run getMeterData");

      const res = await axios.get(`/api/meterPower`);
      let responseData = res.data;
      console.log("responseData", responseData);
      let currentDemand = responseData?.current_demand;
      // let powerGeneration = responseData?.power_generation;
      let t = [];
      // Create x-axis data
      for (let c of currentDemand) {
        t.push(c.date);
      }

      let valueData = [];
      let series = [];
      for (let i of currentDemand) {
        valueData.push(i.value);
      }
      let currentDemandObj = {
        name: "Battery SOC",
        data: valueData,
      };
      series.push(currentDemandObj);

      // valueData = [];
      // for (let i of powerGeneration) {
      //   valueData.push(i.value);
      // }
      // let powerGenerationObj = {
      //   name: "Power generation",
      //   data: valueData,
      // };
      // series.push(powerGenerationObj);
      setTimeAxisData(t);
      setChartData(series);

      console.log("t", t);
      console.log("series", series);
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen w-full text-enzy-dark">
      <main className="p-4 lg:p-8 bg-light dark:bg-dark-base">
        <div className="rounded-xl border border-stroke bg-white px-5 mb-4 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
          <div className="flex justify-between items-center py-4 dark:border-strokedark">
            <h4 className="font-semibold text-xl text-black dark:text-white">
              Power Generation - Battery
            </h4>
            <Dropdown dataList={branchList} />
          </div>
        </div>

        {/* Center content */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left Pane */}
          <div className="col-span-2">
            <BatteryOverview
              data={batteryData}
              onSelectDevice={handleDeviceSelection}
            />
          </div>

          {/* Right Pane */}
          <div className="col-span-1">
            <BatterySpec data={selectedDevice} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 pb-4">
          {/* State of Charge */}
          <div className="col-span-1">
            <BatteryStates
              data={selectedDevice.stateOfCharge}
              title={"SOC"}
              subTitle={"State of Charge"}
              colors={"#F45E4A"}
              deviceKey={selectedDevice.id}
            />
          </div>

          <div className="col-span-1">
            <BatteryStates
              data={selectedDevice.stateOfHealth}
              title={"SOH"}
              subTitle={"State of Health"}
              colors={"#009C50"}
              deviceKey={selectedDevice.id}
            />
          </div>

          <div className="col-span-1">
            <BatteryStates
              data={selectedDevice.cycles}
              title={"Cycles"}
              subTitle={"Lifetime (cycles)"}
              colors={"#3582B4"}
              deviceKey={selectedDevice.id}
            />
          </div>

          <div className="col-span-1">
            <BatteryStates
              data={selectedDevice.bmsTemp}
              title={"BMS Temp"}
              subTitle={"Temperature"}
              colors={"#F45E4A"}
              deviceKey={selectedDevice.id}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-4">
          <div className="col-span-1">
            <BatteryPower
              data={selectedDevice}
              powerColor={"#f5bd1b"}
              voltageColor={"#3582B4"}
              deviceKey={selectedDevice.id}
            />
          </div>

          <div className="col-span-1">
            <BatteryCharge
              data={selectedDevice}
              deviceKey={selectedDevice.id}
            />
          </div>
        </div>

        {/* Bottom content */}
        <div className="rounded-xl border border-stroke bg-white px-5 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
          <div className="grid grid-cols-2 items-center py-5 dark:border-strokedark">
            <h4 className="font-bold text-2xl text-enzy-dark dark:text-white">
              Historical
            </h4>
            {/* <div className="glow"></div> */}
            {/* <div className=""> */}
            <FilterCard />
            {/* </div> */}
          </div>
          <div className="grid grid-cols-2 gap-6 pb-5">
            {/* <LineChart /> */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-base text-enzy-dark dark:text-white">
                Battery Information
              </h4>
              {/* <div className="gap-y-2"></div> */}

              <h4 className="pl-2 mt-4 font-normal text-sm text-enzy-dark dark:text-white">
                Battery Charged and Discharged
              </h4>
              <BatteryChart />
            </div>

            <div className="flex flex-col">
              <h4 className="pl-4 mt-4 font-normal text-sm text-enzy-dark dark:text-white">
                Battery SOC
              </h4>
              <ChartSOC
                data={chartData}
                timeRange={"D"}
                timestamp={timeAxisData}
                colors={["#1DC15B", "#FFC700"]}
                height={360}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
