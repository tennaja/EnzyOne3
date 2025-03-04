import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { Image } from "@mantine/core";
import dayjs from "dayjs";
import numeral from "numeral";
import React from "react";
// import dayjs plugin buddhistEra from "dayjs/plugin/buddhistEra"
var buddhistEra = require("dayjs/plugin/buddhistEra");
var th = require("dayjs/locale/th");

dayjs.extend(buddhistEra);
dayjs.locale(th);

const RenderImage = ({ type }) => {
  switch (type) {
    case "energy":
      return <Image src="/images/solar_pv.png" radius={"md"} fit="contain" />;
    case "yield":
      return <Image src="/images/money-512.png" radius={"md"} fit="contain" />;
    case "tree":
      return (
        <Image src="/images/bigtree-512.png" radius={"md"} fit="contain" />
      );
    case "carbon":
      return <Image src="/images/co2-512.png" radius={"md"} fit="contain" />;
    default:
      return <Image src="/images/solar_sun.png" radius={"md"} fit="contain" />;
  }
};
export default function StatCard({
  data,
  type = "energy",
  title,
  unit,
  decimalPlaces = 0,
}) {
  const value = data ?? 0;
  return (
    <div className="flex rounded-xl text-white bg-[#202e3e] bg-opacity-60  p-3    shadow-default   dark:text-slate-200">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-1 flex-col   gap-8 xl:gap-0 text-center xl:text-right justify-center items-center xl:items-start  xl:justify-between  ">
          <div className="flex w-32 xl:w-36 xl:mt-8 xl:ml-8   xl:items-start">
            <RenderImage type={type} />
          </div>
          <div className="flex flex-col gap-4 xl:mr-8 xl:mb-8 xl:self-end">
            <span className="font-semibold text-xl xl:text-3xl">{title}</span>
            <div className="flex flex-col">
              <span
                className="text-4xl xl:text-7xl font-bold custom-shadow dark:text-white"
                style={{
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                {formatToNumberWithDecimalPlaces(value, decimalPlaces)}
              </span>
              <span>{unit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
