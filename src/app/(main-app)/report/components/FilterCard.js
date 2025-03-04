import classNames from "classnames";
import React, { useState } from "react";
import PeriodSegment from "./PeriodSegment";
import Flatpickr from "react-flatpickr";

import "flatpickr/dist/themes/light.css";
import { CalendarIcon } from "@heroicons/react/24/outline";
const list = [
  { id: 1, title: "Today", textDescription: "Today" },
  { id: 2, title: "Week", textDescription: `This Week` },
  { id: 3, title: "Month", textDescription: `This Month` },
  { id: 4, title: "Year", textDescription: "This Year" },
  { id: 5, title: "Custom", textDescription: "Custom Period" },
];

export default function FilterCard() {
  const [period, setPeriod] = useState(list);
  const [selectedPeriod, setSelectedPeriod] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <div
      className={classNames({
        "flex    flex-1 items-center rounded-xl bg-white py-6 px-8 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200": true,
      })}
    >
      <PeriodSegment period={period} setSelectedPeriod={setSelectedPeriod} />
      {period[selectedPeriod].title == "Custom" && (
        <div
          className={classNames({
            "grid grid-cols-2 mt-2 gap-4 items-center  ": true,
          })}
        >
          <div className="flex flex-col">
            From
            <Flatpickr
              value={startDate}
              options={{ maxDate: endDate }}
              onChange={([date]) => {
                setStartDate(date);
              }}
              render={({ defaultValue }, ref) => {
                return (
                  <div className="flex rounded p-2 border border-primary dark:bg-slate-500">
                    <input
                      className="flex flex-1 focus-visible:outline-none bg-transparent"
                      defaultValue={defaultValue}
                      ref={ref}
                    />
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                );
              }}
            />
          </div>
          <div className="flex flex-col">
            To
            <Flatpickr
              className="rounded p-1 border border-primary "
              value={endDate}
              options={{ minDate: startDate }}
              onChange={([date]) => {
                setEndDate(date);
              }}
              render={({ defaultValue }, ref) => {
                return (
                  <div className="flex rounded p-2 border border-primary dark:bg-slate-500">
                    <input
                      className="flex flex-1 focus-visible:outline-none bg-transparent "
                      defaultValue={defaultValue}
                      ref={ref}
                    />
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
