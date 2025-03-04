import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import classNames from "classnames";
import React from "react";

export default function DataPointIR({ id, temp = 0, rh = 0 }) {
  return (
    <div
      className="flex flex-col rounded-sm w-16 border border-green-400 text-[7px] bg-white  
     dark:border-slate-200 dark:bg-dark-box dark:text-slate-200"
    >
      <span
        className={classNames({
          "p-[2px] text-[8px] text-center bg-green-400 text-black": true,
        })}
      >
        {id}
      </span>
      <div className="flex flex-col p-[2px] justify-center">
        <span>
          {formatToNumberWithDecimalPlaces(temp, 2, false)} <span>&deg;C</span>
        </span>
        <span>Humid: {formatToNumberWithDecimalPlaces(rh, 2, false)} %</span>
      </div>
    </div>
  );
}
