import React, { useState, useEffect } from "react";
import Image from "next/image";
import classNames from "classnames";

import { BoltIcon } from "@heroicons/react/24/outline";
import { BsGraphUpArrow } from "react-icons/bs";
import numeral from "numeral";
import { useSelector } from "react-redux";

const EnergySummary = ({ data }) => {
  const companyModule = useSelector((state) => state.userData.navigationItems);

  const setValue = (value, type = "kW") => {
    let color = "text-enzy-dark";
    // if (value.status == "danger") {
    //   color = "text-red-500";
    // } else if (value.status == "normal") {
    //   color = "text-enzy-success";
    // } else {
    //   color = "dark:text-slate-200";
    // }

    return (
      <span>
        {type == "kW"
          ? numeral(value.value).format("0,0.[00]")
          : numeral(value.value).format("0,0")}{" "}
        {type}
      </span>
    );
  };

  return (
    <div className="grid rounded-xl text-dark-base bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box">
      <div className="flex items-center justify-between mx-5 xl:mx-10">
        <div className="rounded-full p-3 bg-[#FEF3F2] dark:bg-[#21424E]">
          <BsGraphUpArrow className="w-6 h-6 text-red-500 dark:text-dark-foreground-focus" />
        </div>
        <div className="flex flex-col py-1 items-end justify-center">
          <div className="text-sm text-enzy-dark font-normal dark:text-dark-foreground">
            Current Power
          </div>
          <div className="text-2xl text-enzy-dark font-bold tracking-wide dark:text-dark-foreground-focus">
            {setValue(data.currentDemand, "kW")}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-3 text-right justify-end mx-5 xl:mx-10">
        <div className="flex flex-col pl-5">
          <div className="text-xs text-gray-500 font-normal dark:text-dark-foreground">
            Energy Consumption
          </div>
          <div className="text-sm text-enzy-dark font-semibold dark:text-dark-foreground-focus">
            {setValue(data.energyConsumption, "kWh")}
          </div>
        </div>
      </div>
      {companyModule.find((module) => module.name == "PowerGeneration") && (
        <>
          <div className="flex items-center justify-between mx-10 border-t border-dashed pt-3 ">
            <div className="rounded-full p-2 bg-[#E9F9F6] dark:bg-[#21424E] text-primary ">
              <BoltIcon className="w-8 h-8 dark:text-dark-foreground-focus" />
            </div>
            <div className="flex flex-col py-1 items-end justify-center">
              <div className="text-sm text-enzy-dark font-normal dark:text-dark-foreground">
                Power Generation
              </div>
              <div className="text-2xl text-enzy-dark font-bold tracking-wide dark:text-dark-foreground-focus">
                {setValue(data.powerGeneration)}
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-3 text-right justify-end mx-5 xl:mx-10">
            <div className="flex flex-col pl-5">
              <div className="text-xs text-gray-500 font-normal dark:text-dark-foreground">
                Energy Generation
              </div>
              <div className="text-sm text-enzy-dark font-semibold dark:text-dark-foreground-focus">
                {setValue(data.energyGeneration, "kWh")}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EnergySummary;
