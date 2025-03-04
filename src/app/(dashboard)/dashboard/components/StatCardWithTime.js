import { Divider, Image } from "@mantine/core";

import numeral from "numeral";
import React from "react";
import ClockWidget from "./ClockWidget";
import Title from "./Title";

export default function StatCardWithTime({ data, name, description }) {
  const value = data ?? 0;
  return (
    <div className="flex flex-col rounded-xl text-white bg-[#202e3e] bg-opacity-60 p-3 justify-center   shadow-default   dark:text-slate-200">
      <Title name={name} description={description} />
      <Divider my={"xs"} color={"rgba(255, 255, 255,0.4)"} />
      <ClockWidget />

      <div className="flex flex-1 flex-col -mt-8 gap-8  text-center   items-center justify-center">
        <div className="flex w-32 xl:w-36 m-8">
          <Image src="/images/solar_sun.png" radius={"md"} fit="contain" />
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-semibold text-xl xl:text-3xl">
            Real-time electricity generation
          </span>
          <div className="flex flex-col">
            <span
              className="text-4xl xl:text-7xl font-bold custom-shadow dark:text-white"
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              {numeral(value).format("0,0")}
            </span>
            <span> kWh</span>
          </div>
        </div>
      </div>
    </div>
  );
}
