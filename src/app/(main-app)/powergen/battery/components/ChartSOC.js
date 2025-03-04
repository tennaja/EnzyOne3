"use client";
import dynamic from "next/dynamic";

import React, { useState } from "react";
// import ReactApexChart from "react-apexcharts";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

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
        return "MMM";
    }
}

export const ChartSOC = ({
    data,
    timestamp,
    timeRange,
    unit,
    colors,
    legend,
    className,
    height,
}) => {
    let ChartConfig = {
        series: data,
        options: {
            chart: {
                background: "transparent",

                offsetX: -10,
                offsetY: -5,
                zoom: {
                    enabled: true,
                    type: "x",
                    autoScaleYaxis: true,
                },
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
            stroke: {
                width: 1.5,
                dashArray: 0,
            },
            dataLabels: {
                enabled: false,
            },

            xaxis: {
                type: "datetime",
                categories: timestamp,
                tooltip: {
                    enabled: false,
                },
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
                    format: getFormatDate(timeRange),
                },
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                title: {
                    // text: "Time",
                    style: {
                        fontSize: "16px",
                        fontWeight: 600,
                        fontFamily: "Inter",
                        color: "#000000",
                    },
                    offsetX: 0,
                    offsetY: 0,
                    align: "center",
                    floating: true,
                },
            },

            yaxis: {
                title: {
                    // text: "Battery SOC",
                    style: {
                        fontSize: "16px",
                        fontWeight: 600,
                        fontFamily: "Inter",
                        color: "#000000",
                    },
                    offsetX: -5,
                    offsetY: 0,
                    align: "center",
                    floating: true,
                },
            },

            legend: {
                show: true, 
                position: "bottom", 
              },
        },
    };

    return (
        <div className={className}>
            {ChartConfig.options && ChartConfig.series ? (
                <ReactApexChart
                    options={ChartConfig.options}
                    series={ChartConfig.series}
                    type="area"
                    height={height || "100%"}
                // width={props.width}
                />
            ) : (
                <></>
            )}
        </div>
    );
};
