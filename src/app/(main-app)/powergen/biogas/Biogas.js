"use client";
import React, { Fragment, useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import OverView from "./components/Overview";
import Summary from "./components/Summary";
import SummaryBySource from "./components/SummaryBySource";

export default function Biogas() {
  const [branchList, setBranchList] = useState([
    { name: "บางเขน" },
    { name: "ศรีราชา" },
    { name: "กำแพงแสน" },
  ]);

  const [overviewData, setOverviewData] = useState({});
  const [summaryData, setSummaryData] = useState({
    consumtion: {
      title: "Consumption",
      image: "/images/consumption.png",
      today: "3.1",
      total: "19000.00",
    },
    exported: {
      title: "Exported to grid",
      image: "/images/transmittion_tower.png",
      today: "3.1",
      total: "19000.00",
    },
    imported: {
      title: "Imported from grid",
      image: "/images/transmittion_tower.png",
      today: "3.1",
      total: "19000.00",
    },
  });

  const [summaryBySourceData, setSummaryBySourceData] = useState({
    solar: {
      title: "Solar PV",
      image: "/images/solar_pv.png",
      today: "2131.00",
      this_month: "12780.00",
      total: "346540.00",
    },
    battery: {
      title: "Battery",
      image: "/images/battery.png",
      today: "2131.00",
      this_month: "12780.00",
      total: "346540.00",
    },
    biogas: {
      title: "Biogas",
      image: "/images/biogas.png",
      today: "2131.00",
      this_month: "12780.00",
      total: "346540.00",
    },
  });

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <main className="p-4 lg:p-8 bg-light dark:bg-dark-base">
        <div className="rounded-xl border border-stroke bg-white px-5 mb-4 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
          <div className="flex justify-between items-center py-4 dark:border-strokedark">
            <h4 className="font-semibold text-xl text-black dark:text-white">
              Power Generation
            </h4>
            <Dropdown dataList={branchList} />
          </div>
        </div>

        {/* Center content */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left Pane */}
          <div className="col-span-2">
            <OverView />
          </div>

          {/* Right Pane */}
          <div className="col-span-1">
            <div className="grid grid-rows-3 gap-y-4">
              <Summary data={summaryData.consumtion} />
              <Summary data={summaryData.exported} />
              <Summary data={summaryData.imported} />
            </div>
          </div>
        </div>

        {/* Bottom content */}
        <div className="rounded-xl border border-stroke bg-white px-5 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
          <div className="flex items-center py-5 dark:border-strokedark">
            <h4 className="font-semibold text-xl text-black dark:text-white">
              Generated Summary
            </h4>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-5">
            <SummaryBySource data={summaryBySourceData.solar} />
            <SummaryBySource data={summaryBySourceData.battery} />
            <SummaryBySource data={summaryBySourceData.biogas} />
          </div>
        </div>
      </main>
    </div>
  );
}
