"use client";
import { LineChart } from "@/components/Chart";
import { fetcher, formatToNumberWithDecimalPlaces } from "@/utils/utils";
import dayjs from "dayjs";
import numeral from "numeral";
const customParseFormat = require("dayjs/plugin/customParseFormat");
import React, { useState } from "react";
import useSWR from "swr";

dayjs.extend(customParseFormat);

export default function ChillerTempChart() {
  const [startDate, setStartDate] = useState(
    dayjs().subtract(5, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/chiller/plant?dateFrom=${startDate}&dateTo=${endDate}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  let timeAxisData = [];

  let series = [];
  let dataKey;
  if (data) {
    let valueData = [];
    for (const item of data.CH_SUPPLY_TEMP) {
      timeAxisData.push(item.time);
      valueData.push(formatToNumberWithDecimalPlaces(item.value, 2, false));
    }
    const chillerSupply = {
      name: "Chiller Supply Temp",
      data: valueData,
    };
    series.push(chillerSupply);

    valueData = [];
    for (const item of data.CH_RETURN_TEMP) {
      valueData.push(formatToNumberWithDecimalPlaces(item.value, 2, false));
    }
    const chillerReturn = {
      name: "Chiller Return Temp",
      data: valueData,
    };
    series.push(chillerReturn);
  }

  return (
    <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
      <span className="text font-bold">Chiller Supply & Return Temp</span>
      <LineChart
        className="dark:text-black"
        data={series}
        timestamp={timeAxisData}
        // colors={["#0F5AAE", "#FFC700"]}
        height={360}
      />
    </div>
  );
}
