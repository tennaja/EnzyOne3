import React, { useState, useEffect } from "react";
import LineChart from "@/components/LineChart";
import FilterCard from "../../../overview/components/FilterCard";

const Overview = () => {
  const [overviewData, setOverviewData] = useState({});

  useEffect(() => {
    onChangeFilter("today");
  }, []);

  const onChangeFilter = (filter) => {
    // get data from api
    let res_overview_data;
    if (filter == "today") {
      res_overview_data = {
        dt_production: {
          total: "63.57",
          self_consumption: "63.57",
          self_consumption_percentage: "35",
          exported_to_grid: "29.99",
          exported_to_grid_percentage: "65",
        },
        dt_consumption: {
          total: "68.61",
          self_consumption: "33.58",
          self_consumption_percentage: "22",
          imported_from_grid: "35.02",
          imported_from_grid_percentage: "78",
        },
        dt_chart: {},
      };
    } else if (filter == "week") {
    }

    setOverviewData(res_overview_data);
  };

  return (
    <div className="rounded-xl border border-stroke bg-white px-5 mb-4 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center py-4 dark:border-strokedark">
        <h4 className="font-semibold text-xl text-black dark:text-white">
          Overview
        </h4>
        <FilterCard />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-enzy-light-blue p-4">
          <h4 className="font-semibold text-sm text-center text-enzy-dark">
            System Production :{" "}
            <span className="font-bold text-[#1dd1a1]">
              {overviewData?.dt_production?.total} kWh
            </span>
          </h4>

          <div className="flex mt-4">
            <div
              style={{
                width: `${overviewData?.dt_production?.self_consumption_percentage}%`,
              }}
              className={`flex items-center justify-start h-5 bg-[#54A0FF] rounded-l-md pl-2`}
            >
              <span className="text-xs font-medium text-white text-left">
                {overviewData?.dt_production?.self_consumption_percentage}%
              </span>
            </div>
            <div
              style={{
                width: `${overviewData?.dt_production?.exported_to_grid_percentage}%`,
              }}
              className={`flex items-center justify-end h-5 bg-[#1dd1a1] rounded-r-md pr-2`}
            >
              <span className="text-xs font-medium text-white">
                {overviewData?.dt_production?.exported_to_grid_percentage}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 ">
            <div className="text-left">
              <div className="text-sm text-black dark:text-white">
                Self-Consumption
              </div>
              <div className="text-sm font-bold text-[#54A0FF]">
                {overviewData?.dt_production?.self_consumption} kWh
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-black dark:text-white">
                Exported To Grid
              </div>
              <div className="text-sm font-bold text-[#1dd1a1]">
                {overviewData?.dt_production?.exported_to_grid} kWh
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-enzy-light-blue p-4">
          <h4 className="font-semibold text-sm text-center text-enzy-dark">
            Consumption :{" "}
            <span className="font-bold text-[#FF6B6B]">
              {overviewData?.dt_consumption?.total} kWh
            </span>
          </h4>

          <div className="flex mt-4">
            <div
              style={{
                width: `${overviewData?.dt_consumption?.self_consumption_percentage}%`,
              }}
              className={`flex items-center justify-start h-5 bg-[#54A0FF] rounded-l-md pl-2`}
            >
              <span className="text-xs font-medium text-white">
                {overviewData?.dt_consumption?.self_consumption_percentage}%
              </span>
            </div>
            <div
              style={{
                width: `${overviewData?.dt_consumption?.imported_from_grid_percentage}%`,
              }}
              className={`flex items-center justify-end h-5 bg-[#FF6B6B] rounded-r-md pr-2`}
            >
              <span className="text-xs font-medium text-white">
                {overviewData?.dt_consumption?.imported_from_grid_percentage}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 ">
            <div className="text-left">
              <div className="text-sm text-black dark:text-white">
                Self-Consumption
              </div>
              <div className="text-sm font-bold text-[#54A0FF]">
                {overviewData?.dt_consumption?.self_consumption} kWh
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-black dark:text-white">
                Exported To Grid
              </div>
              <div className="text-sm font-bold text-[#FF6B6B]">
                {overviewData?.dt_consumption?.imported_from_grid} kWh
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <LineChart />
      </div>
    </div>
  );
};

export default Overview;
