"use client";
import { fetcher, formatToNumberWithDecimalPlaces } from "@/utils/utils";
import React from "react";
import useSWR from "swr";

export default function Ahu({ params }) {
  const { ahuId, title } = params;
  const url = `https://enzy-chiller.egat.co.th/api/get-ahu-fl4?id=${ahuId}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return (
    <div className="grid rounded-xl bg-white p-3 shadow-default text-dark dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
      <div className="flex flex-col text-left gap-2 p-2 w-64">
        <span className="text-lg font-bold">{ahuId}</span>
        <div className="flex gap-3 text-left">
          <span className="text-sm text-slate-500 dark:text-slate-400 ">
            Supply Temp:
          </span>
          <span>
            {formatToNumberWithDecimalPlaces(
              data?.["SUPPLY TEMPERATURE TEMP"],
              2,
              false
            )}{" "}
            &deg;C
          </span>
        </div>
        <div className="flex gap-3 text-left">
          <span className="text-sm text-slate-500 dark:text-slate-400 ">
            Supply Temp. Setpoint:
          </span>
          <span>
            {formatToNumberWithDecimalPlaces(
              data?.["SUPPLY TEMPERATURE SETPOINT"],
              2,
              false
            )}{" "}
            &deg;C
          </span>
        </div>
        <div className="flex gap-3 text-left">
          <span className="text-sm text-slate-500 dark:text-slate-400 ">
            Return Temp:
          </span>
          <span>
            {formatToNumberWithDecimalPlaces(data?.["RETURN TEMP"], 2, false)}{" "}
            &deg;C
          </span>
        </div>
        <div className="flex gap-3 text-left">
          <span className="text-sm text-slate-500 dark:text-slate-400 ">
            VSD % Drive:
          </span>
          <span>
            {formatToNumberWithDecimalPlaces(
              data?.["VSD % DRIVE(Hz)"],
              2,
              false
            )}{" "}
            Hz
          </span>
        </div>
        <div className="flex gap-3 text-left">
          <span className="text-sm text-slate-500 dark:text-slate-400 ">
            VSD Power:
          </span>
          <span>
            {formatToNumberWithDecimalPlaces(data?.["VSD POWER(kW)"], 2, false)}{" "}
            kW
          </span>
        </div>
        <div className="flex gap-3 text-left">
          <span className="text-sm text-slate-500 dark:text-slate-400 ">
            VSD Speed (rpm):
          </span>
          <span>
            {formatToNumberWithDecimalPlaces(
              data?.["VSD SPEED(rpm)"],
              2,
              false
            )}
          </span>
        </div>
        <div className="flex gap-3 text-left">
          <span className="text-sm text-slate-500 dark:text-slate-400 ">
            Control Valve:
          </span>
          <span>
            {formatToNumberWithDecimalPlaces(data?.["VALVE_POSIN"], 2, false)} %
          </span>
        </div>
      </div>
    </div>
  );
}
