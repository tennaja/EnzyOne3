"use client";
import { getEmsModelData } from "@/utils/api";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

var buddhistEra = require("dayjs/plugin/buddhistEra");
var th = require("dayjs/locale/th");

dayjs.extend(buddhistEra);
dayjs.locale(th);

function getFormatDate(time) {
  if (time === "D") {
    return "HH:mm";
  } else if (time === "W") {
    return "ddd";
  } else if (time === "M") {
    return "d MMM";
  } else if (time === "Y") {
    return "MMM";
  } else {
    return "d MMM HH:mm";
  }
}

function Chart({
  totalIn,
  totalOut,
  timestamp,
  height,
  className,
  colors = ["#9C27B0", "#E91E63"],
}) {
  let ChartConfig = {
    series: [
      {
        name: "เข้า",
        data: totalIn,
      },
      {
        name: "ออก",
        data: totalOut,
      },
    ],
    options: {
      dataLabels: {
        enabled: false,
      },
      chart: {
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: false,
            zoom: '<button class="d-none"></button>',
            zoomin: false,
            zoomout: false,
            pan: false,
            reset:
              '<button class="absolute -top-6 -left-12 rounded p-2 bg-gray-300 text-xs whitespace-nowrap">Reset zoom</button>',
            customIcons: [],
          },
          autoSelected: "zoom",
        },
      },
      tooltip: {
        x: {
          format: getFormatDate(),
        },
      },
      colors: colors,
      xaxis: {
        type: "datetime",
        categories: timestamp,
        labels: {
          show: true,
          hideOverlappingLabels: true,
          showDuplicates: false,
          trim: true,
          datetimeUTC: false,
          offsetY: -5,
          style: {
            fontSize: "10px",
          },
          datetimeFormatter: {
            year: "yyyy",
            month: "MMM yy",
            day: "ddd",
            hour: "HH:mm",
          },
          format: "d MMM HH:mm",
        },
      },
    },
  };
  return (
    <div className={className}>
      {ChartConfig.options && ChartConfig.series ? (
        <ReactApexChart
          options={ChartConfig.options}
          series={ChartConfig.series}
          type="bar"
          height={height || "100%"}
          // width={props.width}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default function PeopleCountingChart() {
  const [timestamp, setTimestamp] = useState([]);
  const [totalIn, setTotalIn] = useState([]);
  const [totalOut, setTotalOut] = useState([]);

  useEffect(() => {
    let isLoaded = true;

    prepareData();
    return () => {
      isLoaded = false;
    };
  }, []);

  async function prepareData() {
    getModel6();
  }

  async function getModel6() {
    const params = {
      dateFrom: dayjs().subtract(5, "day").format("YYYY-MM-DD"),
      dateTo: dayjs().add(1, "day").format("YYYY-MM-DD"),
    };
    const response = await getEmsModelData(6, params);

    var timeStampArray = [];
    var totalInArray = [];
    var totalOutArray = [];
    response.forEach((item) => {
      timeStampArray.push(item.datetime);
      totalInArray.push(item.total_in);
      totalOutArray.push(item.total_out);
    });
    setTimestamp(timeStampArray);
    setTotalIn(totalInArray);
    setTotalOut(totalOutArray);
  }

  return (
    <div className="grid rounded-xl bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
      <span className="text font-bold">จำนวนคนเข้าออกอาคาร</span>

      <Chart
        totalIn={totalIn}
        totalOut={totalOut}
        timestamp={timestamp}
        colors={["#0F5AAE", "#FFC700"]}
        height={350}
      />
    </div>
  );
}
