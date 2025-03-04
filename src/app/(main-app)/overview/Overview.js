"use client";
import React, { useEffect, useState } from "react";
import FilterCard from "./components/FilterCard";
import EnergySummary from "./components/EnergySummary";
import BranchList from "./components/BranchList";
import BranchDetail from "./components/BranchDetail";
import Dropdown from "./components/Dropdown";
import axios from "axios";
import CostSummary from "./components/CostSummary";
import CompanySummary from "./components/CompanySummary";
import BuildingList from "./components/BuildingList";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { BiLineChart } from "react-icons/bi";
import {
  getCompanyData,
  getAllBranchData,
  getAreaData,
  getCompanyInfo,
} from "@/utils/api";
import { LineChart } from "@/components/Chart";
import dayjs from "dayjs";
import classNames from "classnames";
import { unique } from "@/utils/function";
import { useSelector } from "react-redux";
import { DatePicker } from "antd";

export default function Overview({ props }) {
  const [energySummary, setEnergySummary] = useState({
    currentDemand: { value: 0, status: "normal" },
    powerGeneration: { value: 0, status: "normal" },
    energyGeneration: { value: 0, status: "normal" },
    energyConsumption: { value: 0, status: "normal" },
    onPeakEnergy: { value: 0, status: "" },
    offPeakEnergy: { value: 0, status: "" },
  });

  const [costSummary, setCostSummary] = useState({
    costOnPeak: { value: "0", status: "" },
    costOffPeak: { value: "0", status: "" },
    costEnergy: { value: "0", status: "" },
    savingCO2: { value: "0", status: "" },
    REC: { value: "0", status: "" },
    totalYield: { value: "", status: "" },
  });

  const [companyData, setCompanyData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [buildingData, setBuildingData] = useState([]);

  const [areaOptions, setAreaOptions] = useState([]);

  const updateSelectedBranch = (branch) => {
    setSelectedBranch(branch);
  };

  const selectedCompany = useSelector((state) => state.companyData.company);
  const username = useSelector((state) => state.userData.username);
  const companyModule = useSelector((state) => state.userData.navigationItems);
  const [selectedBranch, setSelectedBranch] = useState();
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState([]);

  const [startDate, setStartDate] = useState(dayjs().startOf("day"));

  const [chartData, setChartData] = useState([]);
  const [timeAxisData, setTimeAxisData] = useState([]);

  useEffect(() => {
    // console.log("call effect selectedCompany");
    const paramCompanyId = {
      companyId: selectedCompany.Id,
      username: username,
    };
    getCompanyInfo(paramCompanyId).then((result) => {
      console.log("result", result);
      if (result.status === 200) setCompanyData(result.data[0]);
      else {
        const noResultObject = {
          name: "ไม่พบข้อมูล",
        };
        setCompanyData(noResultObject);
      }
    });

    getCompanyData(selectedCompany.Id, username).then((result) => {
      // setCompanyData(result);
      if (result.status === 200) {
        var energySummaryObj = {
          ...energySummary,
          currentDemand: {
            value: result?.data?.current_demand,
            status: "normal",
          },
          powerGeneration: {
            value: result?.data?.power_generation,
            status: "normal",
          },
          onPeakEnergy: {
            value: result?.data?.energy_onpeak,
            status: "normal",
          },
          offPeakEnergy: {
            value: result?.data?.energy_offpeak,
            status: "normal",
          },
          energyConsumption: {
            value: result?.data?.energy_consumption,
            status: "normal",
          },
          energyGeneration: {
            value: result?.data?.energy_generation,
            status: "normal",
          },
        };

        var costSummaryObj = {
          ...costSummary,
          costOnPeak: { value: result?.data?.energy_onpeak_cost, status: "" },
          costOffPeak: { value: result?.data?.energy_offpeak_cost, status: "" },
          costEnergy: { value: result?.data?.energy_total_cost, status: "" },
          totalYield: { value: result?.data?.total_yield, status: "" },
        };
        setEnergySummary(energySummaryObj);
        setCostSummary(costSummaryObj);
      }
    });
    getAllBranchData(selectedCompany.Id, username).then((result) => {
      setBranchData(result);
      setSelectedBranch(result[0]);
    });
  }, [selectedCompany]);

  useEffect(() => {
    let branchId = selectedBranch?.id;
    if (branchId) {
      getAreaData(selectedBranch?.id).then((result) => {
        setAreaData(result);
      });
    }

    // Fetch area data based on the selected branch
    if (selectedBranch) {
      setBuildingData([]);

      const branchId = selectedBranch.id;
      axios.get(`/api/area?branch_id=${branchId}`).then((res) => {
        const areaData = res.data;
        setAreaOptions(areaData);

        if (areaData?.data?.length > 0) {
          setSelectedArea(areaData.data);
        } else {
          setSelectedArea(null);
        }
        // console.log("selected area : ", areaData);
      });
    }

    // return () => {};
  }, [selectedBranch]);

  useEffect(() => {
    // console.log("selectedArea Effect :", selectedArea);
    async function getBuildingData(areaId) {
      const res = await axios.get(`/api/building?area_id=${areaId}`);
      let responseData = res.data;
      var tmpBuildingArray = [responseData];
      setBuildingData(tmpBuildingArray);

      if (responseData?.data?.length > 0) {
        setSelectedBuilding(responseData.data);
      } else {
        setSelectedBuilding(null);
      }
    }

    if (selectedArea) {
      for (const area of selectedArea) {
        getBuildingData(area?.id);
      }
    }
  }, [selectedArea]);

  useEffect(() => {
    if (selectedBuilding?.length > 0 && startDate !== null) {
      var buildingIdText = unique(selectedBuilding, "id").join();
      getMeterData(buildingIdText);
    }
  }, [selectedBuilding, startDate]);

  function onChangeDay(date, dateString) {
    console.log("date", date);
    console.log("dateString", dateString);
    setStartDate(date);
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf("day");
  };
  async function getMeterData(building_id) {
    const res = await axios.get(
      `/api/meterPower/building?id=${building_id}&startDate=${startDate.format(
        "YYYY-MM-DD"
      )}&endDate=${startDate.add(1, "day").format("YYYY-MM-DD")}`
    );
    let responseData = res.data;

    let currentDemand = responseData?.current_demand;
    let powerGeneration = responseData?.power_generation;
    let actualDemand = responseData?.actual_demand;
    let t = [];
    // สร้างแกน x
    for (let c of currentDemand) {
      t.push(c.date);
    }

    let valueData = [];
    let series = [];

    for (let i of currentDemand) {
      valueData.push(i.value);
    }
    let currentDemandObj = {
      name: "Current power",
      data: valueData,
    };
    series.push(currentDemandObj);

    if (companyModule.find((module) => module.name == "PowerGeneration")) {
      valueData = [];
      for (let i of powerGeneration) {
        valueData.push(i.value);
      }
      let powerGenerationObj = {
        name: "Power generation",
        data: valueData,
      };
      series.push(powerGenerationObj);

      if (selectedCompany.Id != 6) {
        valueData = [];
        for (let i of actualDemand) {
          valueData.push(i.value);
        }
        let actualDemandObj = {
          name: "Actual power",
          data: valueData,
        };
        series.push(actualDemandObj);
      }
    }
    setTimeAxisData(t);
    setChartData(series);

    // console.log("t", t);
    // console.log("series", series);
  }

  return (
    <div className="min-h-screen flex w-full text-enzy-dark dark:text-slate-200">
      <main className="p-4 lg:p-8 flex flex-1 flex-col bg-[#EDF2F8] dark:bg-dark-base">
        <div className="flex flex-col gap-4">
          {/* <div className="w-64">
            <Listbox
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e)}
            >
              <Listbox.Button className="flex w-full justify-between items-center rounded bg-white px-4 py-2 text-left dark:bg-dark-box dark:text-slate-200">
                <span className="block truncate">{selectedCompany.name}</span>
                <span className="pointer-events-none  inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon
                    className="h-5 w-5 text-enzy-dark dark:text-slate-200"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options className="dark:bg-dark-box dark:text-slate-200  mt-1  w-full overflow-auto rounded-md bg-white gap-4 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {company.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    value={item}
                    className="p-4 cursor-pointer hover:bg-enzy-light-green"
                  >
                    {item.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div> */}

          <div className="grid  grid-cols-1 lg:grid-cols-3 gap-4">
            <CompanySummary data={companyData} />
            <EnergySummary data={energySummary} />
            <CostSummary data={costSummary} />
          </div>

          {/* เดี๋ยวปรับ ui filter ใหม่ */}
          {/* <div className=" ">
            <FilterCard />
          </div> */}
          {/* <div className="grid grid-cols-2 gap-4">
            <EnergySummary data={energySummary} />
            <CostSummary data={costSummary} />
          </div> */}

          {/* Dropdown */}
          {/* <div className="flex flex-row">
            <div className="mr-3">
              <Dropdown data={branchData} selected={selectedBranch} onItemSelected={updateSelectedBranch} />
            </div>
            <div className="mr-3">
              <Dropdown data={areaOptions} selected={selectedArea} />
            </div>
          </div> */}

          <div>
            <BranchList
              branchData={branchData}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />
          </div>
          <div>
            <BranchDetail
              areaData={areaData}
              selectedBranch={selectedBranch}
              setSelectedArea={setSelectedArea}
            />
          </div>
          {selectedArea?.length > 0 && (
            <>
              <div>
                {/* <BranchDetail areaData={areaData} selectedBranch={selectedBranch} /> */}
                <BuildingList
                  key={buildingData}
                  buildingData={buildingData}
                  setSelectedBuilding={setSelectedBuilding}
                />
              </div>

              {selectedBuilding?.length > 0 && (
                <div
                  className={classNames({
                    "flex flex-col flex-1 gap-4 rounded-xl text-dark-base bg-white p-7 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200": true,
                  })}
                >
                  <div className="flex items-center gap-2">
                    <div className="rounded-full p-3 bg-[#FDBA74] text-white dark:bg-[#21424E]">
                      <BiLineChart className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-xl text-enzy-dark">
                      Historical
                    </span>
                  </div>
                  <div className="flex gap-5">
                    <DatePicker
                      className="bg-white border shadow-default dark:border-slate-300 dark:bg-dark-box dark:text-slate-200"
                      onChange={onChangeDay}
                      format={"YYYY/MM/DD"}
                      allowClear={false}
                      disabledDate={disabledDate}
                      defaultValue={startDate}
                    />
                  </div>

                  <LineChart
                    className="dark:text-black"
                    data={chartData}
                    timeRange={"D"}
                    timestamp={timeAxisData}
                    colors={["#0F5AAE", "#FFC700", "#ff8400"]}
                    height={360}
                    unit={"kW"}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
