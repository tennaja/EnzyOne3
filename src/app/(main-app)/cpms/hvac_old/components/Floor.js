"use client";
import Image from "next/image";
import React, { useState } from "react";
import { PathLine } from "react-svg-pathline";
import DataPoint from "./DataPoint";
import { fetcher, formatToNumberWithDecimalPlaces } from "@/utils/utils";
import useSWR from "swr";
import classNames from "classnames";
import DataPointIR from "./DataPointIR";

export default function Floor() {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/hvac/vav`;
  const { data, error } = useSWR(url, fetcher);

  const urlIR = `${process.env.NEXT_PUBLIC_APP_URL}/api/hvac/ir`;
  const { data: dataIr, error: errorIr } = useSWR(urlIR, fetcher);
  let vavDataPoints = [];
  let irDataPoints = [];

  if (data) {
    const dataPointArray = [];
    for (const item of data) {
      const dataPoint = {
        label: item.vav_id,
        position: item.position,
        labelPosition: item.labelPosition,
        connectorPosition: item.connectorPosition,
        data: item.data,
      };
      dataPointArray.push(dataPoint);
    }

    vavDataPoints = dataPointArray;
  }

  if (dataIr) {
    const dataPointArray = [];
    for (const item of dataIr) {
      const dataPoint = {
        label: item.ir_id,
        position: item.position,
        labelPosition: item.labelPosition,
        connectorPosition: item.connectorPosition,
        data: item.data,
      };
      dataPointArray.push(dataPoint);
    }

    irDataPoints = dataPointArray;
  }

  const pointStyle = {
    position: "absolute",

    width: "8px",
    height: "8px",
    borderRadius: "50%",
  };

  const lineStyle = {
    position: "absolute",
    border: "1px solid blue",
  };

  return (
    <div className="flex flex-col rounded-xl  bg-white dark:bg-dark-box">
      <span className="p-3 text-sm  font-bold">HVAC Floor 4 T102</span>
      <div
        className="relative h-[700px] w-[1100px] self-center"
        style={{ padding: "64px 160px 64px 160px" }}
      >
        {/* Your floor plan SVG or image with labels */}
        <Image
          src="/images/floor.png"
          alt=""
          height={700}
          width={700}
          className="relative"
        />

        {vavDataPoints.map((point, index) => (
          <React.Fragment key={index}>
            {/* Data point */}
            <div
              className={classNames({
                "border-[0.5px] border-white z-10": true,
                "bg-primary": point?.data?.["AIR FLOW ACTUAL(cfm)"] > 0,
                "bg-gray-300": point?.data?.["AIR FLOW ACTUAL(cfm)"] <= 0,
              })}
              style={{
                ...pointStyle,

                left: `${point?.position?.x}px`,
                top: `${point?.position?.y}px`,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                left: `${point?.labelPosition?.x}px`,
                top: `${point?.labelPosition?.y}px`,
              }}
            >
              <DataPoint
                id={point?.label}
                temp={point?.data?.["ZONE TEMPERATURE TEMP"]}
                airFlow={point?.data?.["AIR FLOW ACTUAL(cfm)"]}
                damper={point?.data?.["% DAMPER"]}
              />
            </div>

            {/* Line connecting data point to outside the image frame */}
          </React.Fragment>
        ))}

        {irDataPoints.map((point, index) => (
          <React.Fragment key={index}>
            {/* Data point */}
            <div
              className={classNames({
                "border-[0.5px] border-white z-10 bg-green-400": true,
              })}
              style={{
                ...pointStyle,
                left: `${point?.position?.x}px`,
                top: `${point?.position?.y}px`,
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                left: `${point?.labelPosition?.x}px`,
                top: `${point?.labelPosition?.y}px`,
              }}
            >
              <DataPointIR
                id={point?.label}
                temp={point?.data?.["temp"]}
                rh={point?.data?.["rh"]}
              />
            </div>

            {/* Line connecting data point to outside the image frame */}
          </React.Fragment>
        ))}

        <svg
          className="absolute"
          style={{ top: "0", left: "0", width: "100%", height: "100%" }}
        >
          {vavDataPoints.map((point, index) => (
            <PathLine
              key={index}
              points={point?.connectorPosition}
              style={{
                stroke:
                  point?.data?.["AIR FLOW ACTUAL(cfm)"] > 0
                    ? "#33bfbf"
                    : "#d1d5db",
              }}
              strokeWidth="1.5"
              fill="none"
              r={3}
              //   strokeDasharray={"5,5"}
            />
          ))}

          {irDataPoints.map((point, index) => (
            <PathLine
              key={index}
              points={point?.connectorPosition}
              style={{
                stroke: "#4ade80",
              }}
              strokeWidth="1.5"
              fill="none"
              r={3}
              //   strokeDasharray={"5,5"}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
