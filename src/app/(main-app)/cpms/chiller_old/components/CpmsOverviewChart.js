"use client";
import { LineChart } from "@/components/Chart";
import { fetcher } from "@/utils/utils";
import dayjs from "dayjs";
const customParseFormat = require("dayjs/plugin/customParseFormat");
import React, { useState } from "react";
import useSWR from "swr";

dayjs.extend(customParseFormat);

export default function CpmsOverviewChart({ dataType }) {
  const [startDate, setStartDate] = useState(
    dayjs().subtract(5, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/chiller/report?dateFrom=${startDate}&dateTo=${endDate}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  let timeAxisData = [];
  let valueData = [];
  let series = [];
  let dataKey, dataName;
  if (data) {
    if (dataType == "power") {
      dataKey = `CPMS Power(kW)`;
      dataName = "CPMS Power(kW)";
    } else if (dataType == "efficiency") {
      dataKey = `CPMS kW/ton`;
      dataName = "CPMS kW/ton";
    }

    for (const item of data?.[dataKey]) {
      timeAxisData.push(item.time);
    }

    for (const i of data?.[dataKey]) {
      valueData.push(i.value ?? null);
    }
    const dataObject = {
      name: dataName,
      data: valueData,
    };
    series.push(dataObject);
  }

  return (
    <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
      <span className="text font-bold">{dataName}</span>
      <LineChart
        className="dark:text-black"
        data={series}
        timestamp={timeAxisData}
        colors={["#0F5AAE", "#FFC700"]}
        height={360}
      />
    </div>
  );
}
