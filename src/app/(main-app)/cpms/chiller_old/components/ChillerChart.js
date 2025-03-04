"use client";
import { LineChart } from "@/components/Chart";
import { fetcher, formatToNumberWithDecimalPlaces } from "@/utils/utils";
import dayjs from "dayjs";
import numeral from "numeral";
const customParseFormat = require("dayjs/plugin/customParseFormat");
import React, { useState } from "react";
import useSWR from "swr";

dayjs.extend(customParseFormat);

export default function ChillerChart() {
  const [startDate, setStartDate] = useState(
    dayjs().subtract(5, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/chiller/power?dateFrom=${startDate}&dateTo=${endDate}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  let timeAxisData = [];

  let series = [];
  let dataKey;
  if (data) {
    let valueData = [];
    for (const item of data.total) {
      timeAxisData.push(item.time);
      valueData.push(formatToNumberWithDecimalPlaces(item.value, 2, false));
    }
    const dataObject = {
      name: "Power Total",
      data: valueData,
    };
    series.push(dataObject);

    valueData = [];
    for (const item of data.chiller_01) {
      valueData.push(formatToNumberWithDecimalPlaces(item.value, 2, false));
    }
    const powerChiller01 = {
      name: "Power CH_01",
      data: valueData,
    };
    series.push(powerChiller01);

    valueData = [];
    for (const item of data.chiller_02) {
      valueData.push(formatToNumberWithDecimalPlaces(item.value, 2, false));
    }
    const powerChiller02 = {
      name: "Power CH_02",
      data: valueData,
    };
    series.push(powerChiller02);

    valueData = [];
    for (const item of data.chiller_03) {
      valueData.push(formatToNumberWithDecimalPlaces(item.value, 2, false));
    }
    const powerChiller03 = {
      name: "Power CH_03",
      data: valueData,
    };
    series.push(powerChiller03);

    valueData = [];
    for (const item of data.chiller_04) {
      valueData.push(formatToNumberWithDecimalPlaces(item.value, 2, false));
    }
    const powerChiller04 = {
      name: "Power CH_04",
      data: valueData,
    };
    series.push(powerChiller04);
  }

  return (
    <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
      <span className="text font-bold">Power</span>
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
