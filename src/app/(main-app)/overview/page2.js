"use client";
import React, { useState, useEffect } from "react";
import TopNav from "../../components/topnav";
import Card from "@/components/Card";
import DonutChart from "@/components/DonutChart";
import LineChart from "@/components/LineChart";
import Table from "@/components/Table";
import SearchBox from "@/components/SearchBox";
import FilterCard from "./components/FilterCard";
import EnergySummary from "@/app/Overview/component/EnergySummary";
import CostSummary from "./component/CostSummary";
import Dropdown from "./components/Dropdown";

export default function Overview() {

  const [energySummary, setEnergySummary] = useState(
    {
      'currentDemand': { value: '415', status: 'danger' },
      'powerGeneration': { value: '525', status: 'normal' },
      'onPeakDemand': { value: '1785', status: 'normal' },
      'offPeakDemand': { value: '18960', status: 'danger' },
    }
  );

  const [costSummary, setCostSummary] = useState(
    {
      'costOnPeak': { value: '49367', status: 'danger' },
      'costOffPeak': { value: '415', status: 'normal' },
      'savingCO2': { value: '415', status: 'normal' },
      'REC': { value: '415', status: 'normal' },
    }
  );

  const [dropDown, setDropDown] = useState([]);

  // initialize id
  let dropDownId = 0;

  function addDropdown(title){
    const newDrop = {dropDownId, title};
    setDropDown([newDrop, ...dropDown]);
    dropDownId+=1;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex w-full">
      {/* <TopNav /> */}

      <main className="p-4 lg:p-8 flex flex-1 bg-light dark:bg-dark-base">
        <div className="grid grid-cols-2  gap-4">
          {/* Left Pane */}
          <div className="flex  flex-col gap-y-4">
            <FilterCard />

            {/* Input to add new item to dropdown */}
            <div>
                <input
                    type="text"
                    placeholder="New item title"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            addDropdown(e.target.value);
                            e.target.value = '';
                        }
                    }}
                />
            </div>

            {/* Dropdown component */}
            <Dropdown data={dropDown} addDropdown={addDropdown} />
            <Table className="grow" />
          </div>
          {/* Right Pane */}
          <div className="grid grid-rows-1 gap-y-4">
            <div className="grid grid-cols-2 gap-4 ">
              <div className="grid gap-y-4">
                <EnergySummary data={energySummary} />
                <CostSummary data={costSummary} />
                <Card />
              </div>
              <DonutChart />
            </div>
            <LineChart />
          </div>
        </div>
      </main>
    </div>
  );
}
