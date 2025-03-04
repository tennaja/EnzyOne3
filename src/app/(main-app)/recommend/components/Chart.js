"use client";
import React from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function Chart({
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
          format: "HH:mm",
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
