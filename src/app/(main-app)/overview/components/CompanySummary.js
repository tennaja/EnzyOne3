import React, { useState, useEffect } from "react";
import Image from "next/image";
import classNames from "classnames";

import { numberWithCommas } from "@/utils/utils";

const CompanySummary = ({ data }) => {
  const setValue = (value) => {
    let color = "";
    if (value.status == "danger") {
      color = "text-red-500";
    } else if (value.status == "normal") {
      color = "text-enzy-success";
    }

    return (
      <h4 className={`text-sm sm:text-2xl font-bold text-right ${color}`}>
        {numberWithCommas(value.value)}
      </h4>
    );
  };

  return (
    <div className="grid rounded-xl text-dark-base bg-white p-3 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
      <div className="flex flex-col xl:flex-row gap-6 p-2 items-center">
        <div className="pt-1">
          {data?.id ? (
            <Image
              src={`/images/profile/${data.id}_profile_img.png`}
              height={100}
              width={120}
              alt="profile image"
              className="rounded"
            />
          ) : (
            <Image
              src="/images/profile/noimg.png"
              height={100}
              width={120}
              alt="profile image"
              className="rounded"
            />
          )}
        </div>
        <div className="text-center xl:text-left">
          <div className="font-semibold text-md">{data?.name}</div>
          <div className="font-normal text-sm text-gray-400">
            {data?.description}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 my-3 items-center">
        <div className="flex flex-col items-center border-r">
          <div className="text-xl font-bold">{data?.branch}</div>
          <div className="text-gray-400 text-xs">
            {data?.branch > 1 ? "Branches" : "Branch"}
          </div>
        </div>
        <div className="flex flex-col items-center border-r">
          <div className="text-xl font-bold">{data?.area}</div>
          <div className="text-gray-400 text-xs">
            {data?.area > 1 ? "Areas" : "Area"}
          </div>
        </div>
        <div className="flex flex-col items-center border-r">
          <div className="text-xl font-bold">{data?.building}</div>
          <div className="text-gray-400 text-xs">
            {data?.building > 1 ? "Buildings" : "Building"}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold">{data?.floor}</div>
          <div className="text-gray-400 text-xs">
            {data?.floor > 1 ? "Floors" : "Floor"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySummary;
