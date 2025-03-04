"use client";
import { LineChart } from "@/components/Chart";
import { fetcher } from "@/utils/utils";
import dayjs from "dayjs";
const customParseFormat = require("dayjs/plugin/customParseFormat");
import React, { useState } from "react";
import useSWR from "swr";

dayjs.extend(customParseFormat);

export default function ChillerOverviewChart({ chillerId, dataType }) {
  const [startDate, setStartDate] = useState(
    dayjs().subtract(5, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/chiller/plant?dateFrom=${startDate}&dateTo=${endDate}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  let timeAxisData = [];
  let valueData = [];
  let series = [];
  let dataKey, dataName;
  if (data) {
    if (dataType == "temp") {
      dataKey = `CH_SUPPLY_TEMP`;
      dataName = "Chiller Supply Temp";
    } else if (dataType == "flow") {
      dataKey = `CH_WATER_FLOW`;
      dataName = "Chiller Water Flow";
    } else if (dataType == "return") {
      dataKey = `CH_RETURN_TEMP`;
      dataName = "Chiller Return Temp";
    } else if (dataType == "ton") {
      dataKey = `TON`;
      dataName = "Ton/kW";
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
