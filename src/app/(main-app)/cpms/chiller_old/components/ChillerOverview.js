"use client";
import { fetcher, formatToNumberWithDecimalPlaces } from "@/utils/utils";
import useSWR from "swr";
import React from "react";

export default function ChillerOverview() {
  const url = `https://enzy-chiller.egat.co.th/api/get-plant`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const urlReport = `https://enzy-chiller.egat.co.th/api/get-report`;
  const { data: dataReport, error: errorReport } = useSWR(urlReport, fetcher);

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
        <div className="flex flex-col text-left ">
          <span className="text-sm  font-bold">Flow</span>
          <span>
            {formatToNumberWithDecimalPlaces(data?.["CH_WATER_FLOW"], 2, false)}
          </span>
        </div>
      </div>

      <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
        <div className="flex flex-col text-left ">
          <span className="text-sm  font-bold">Chiller Supply Temperature</span>
          <span>
            {formatToNumberWithDecimalPlaces(
              data?.["CH_SUPPLY_TEMP"],
              2,
              false
            )}
          </span>
        </div>
      </div>

      <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
        <div className="flex flex-col text-left ">
          <span className="text-sm  font-bold">Chiller Return Temperature</span>
          <span>
            {formatToNumberWithDecimalPlaces(
              data?.["CH_RETURN_TEMP"],
              2,
              false
            )}
          </span>
        </div>
      </div>

      <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
        <div className="flex flex-col text-left ">
          <span className="text-sm  font-bold">Outdoor Temperature</span>
          <span>
            {formatToNumberWithDecimalPlaces(data?.["OUTDOOR TEMP"], 2, false)}
          </span>
          <span className="text-sm  font-bold">Humid</span>
          <span>
            {formatToNumberWithDecimalPlaces(data?.["OUTDOOR HUMID"], 2, false)}
          </span>
        </div>
      </div>

      <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
        <div className="flex flex-col text-left ">
          <span className="text-sm  font-bold">KW/Ton</span>
          <span>
            {formatToNumberWithDecimalPlaces(
              dataReport?.["CPMS kW/ton"],
              3,
              false
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
