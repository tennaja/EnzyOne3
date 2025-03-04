"use client";
import { fetcher, formatToNumberWithDecimalPlaces } from "@/utils/utils";
import useSWR from "swr";
import React from "react";

export default function ChillerCard({ params }) {
  const { chillerId, title } = params;
  const url = `https://enzy-chiller.egat.co.th/api/get-chiller?id=${chillerId}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return (
    <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
      <div className="flex flex-col gap-4 p-2 items-center">
        <span className="text-lg font-bold">{title}</span>
        <div className="flex flex-col text-left w-60">
          <span className="text font-bold">Command Start/Stop</span>
          <span>{data?.Control}</span>
        </div>
        <div className="flex flex-col text-left w-60">
          <span className="text font-bold">Chiller Water Set Point</span>
          <span>{data?.chilledWaterSetpoint}</span>
        </div>
        <div className="flex flex-col text-left w-60">
          <span className="text font-bold">Power Consumption</span>
          <span>
            {formatToNumberWithDecimalPlaces(
              (data?.["Avg Current % RLA"] * data?.["Voltage AB"]) / 1000,
              2,
              false
            )}
          </span>
        </div>
        <div className="flex flex-col text-left w-60">
          <span className="text font-bold">Evaporator Circuit</span>
          <span>-</span>
        </div>
      </div>
    </div>
  );
}
