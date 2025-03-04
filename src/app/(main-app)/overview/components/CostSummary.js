import React, { useState, useEffect } from "react";
import Image from "next/image";
import classNames from "classnames";
import { BoltIcon } from "@heroicons/react/24/outline";
import { BsGraphUpArrow } from "react-icons/bs";
import { PiMoneyBold } from "react-icons/pi";
import numeral from "numeral";

import { useSelector } from "react-redux";

const CostSummary = ({ data }) => {
  const companyModule = useSelector((state) => state.userData.navigationItems);

  const setValue = (value) => {
    let color = "";
    if (value.status == "danger") {
      color = "text-red-500";
    } else if (value.status == "normal") {
      color = "text-enzy-success";
    } else {
      color = "dark:text-slate-200";
    }

    return (
      <div className="flex flex-col items-center">
        <div className="text-xl">{value.value}</div>
        <div className="text-sm">THB</div>
      </div>
    );
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div
      className={classNames({
        "grid grid-cols-1": true,
        "grid-cols-2 gap-4": companyModule.find(
          (module) => module.name == "PowerGeneration"
        ),
      })}
    >
      <div className="grid rounded-lg text-dark-base bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full p-3 bg-[#F5F4E9] text-[#87BE33] dark:bg-[#21424E]">
            <PiMoneyBold className="w-6 h-6 dark:text-dark-foreground-focus" />
          </div>
          <div className="flex flex-col py-1 items-center justify-center">
            <div className="text-sm text-enzy-dark font-normal dark:text-dark-foreground">
              Energy Cost
            </div>
            <div className="text-enzy-dark font-bold tracking-wide dark:text-dark-foreground-focus">
              {setValue(data.costEnergy)}
            </div>
          </div>
        </div>
      </div>

      {companyModule.find((module) => module.name == "PowerGeneration") && (
        <div className="grid rounded-lg text-dark-base bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-full p-3 bg-[#F5F4E9] text-[#87BE33] dark:bg-[#21424E]">
              <PiMoneyBold className="w-6 h-6 dark:text-dark-foreground-focus" />
            </div>
            <div className="flex flex-col py-1 items-center justify-center">
              <div className="text-sm text-enzy-dark font-normal dark:text-dark-foreground">
                Yield
              </div>
              <div className="text-enzy-dark font-bold tracking-wide dark:text-dark-foreground-focus">
                {setValue(data.totalYield)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostSummary;
