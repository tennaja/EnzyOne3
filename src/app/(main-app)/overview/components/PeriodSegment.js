"use client";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import React, { useState } from "react";

export default function PeriodSegment({ period, setSelectedPeriod }) {
  return (
    <div className="w-full">
      <Tab.Group onChange={(index) => setSelectedPeriod(index)}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-50/50  p-1">
          {period.map((item, index) => (
            <Tab
              key={item.id}
              className={({ selected }) =>
                classNames({
                  "w-full rounded-lg py-1 text-sm font-medium leading-5  text-enzy-blue": true,
                  "bg-enzy-blue text-white shadow  ": selected,
                  "hover:bg-white ": !selected,
                })
              }
            >
              {item.title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2"></Tab.Panels>
      </Tab.Group>
    </div>
  );
}
