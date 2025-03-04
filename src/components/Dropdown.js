"use client";
import React, { Fragment, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";

const Dropdown = ({
  dataList,
  setSelected,
  selected = [],
  isShowPleaseSelect = true,
  isShowSelectAll = true,
  fieldName = "Name",
  className,
  width,
}) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div
        className={classNames({ "min-w-fit": true }, width, {
          "relative w-full": className == null,
        })}
      >
        <Listbox.Button
          className={classNames({ "min-w-fit": true }, className, width, {
            "relative cursor-default rounded-lg py-2.5 px-3 text-left leading-tight bg-[#f0fafa] border border-gray-300 text-enzy-dark active:border-primary": true,
            "bg-[#f0fafa]": dataList.length > 0,
            "text-gray-400": dataList.length == 0,
            "w-full": className == null,
          })}
        >
          {isShowPleaseSelect && !selected && (
            <span className="block truncate text-slate-400">
              Please select ..
            </span>
          )}

          <span className="block truncate text-enzy-dark">
            {selected == "all" ? "ทั้งหมด" : selected[fieldName]}
          </span>
          <span
            className={classNames({
              "pointer-events-none absolute  inset-y-0 right-0 flex items-center pr-2": true,
              "": className == null,
            })}
          >
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        {dataList.length > 0 && (
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={classNames({
                "absolute z-50 mt-1  overflow-auto rounded-lg bg-white py-1 text-enzy-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm": true,
                "w-full": className == null,
              },width)}
            >
              {isShowSelectAll && (
                <Listbox.Option
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-[#f0fafa] text-enzy-dark" : "text-enzy-dark"
                    }`
                  }
                  value="all"
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        ทั้งหมด
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              )}

              {dataList?.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-pointer select-none p-2.5 pl-10 pr-4 ${
                      active ? "bg-[#f0fafa] text-enzy-dark" : "text-enzy-dark"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item[fieldName]}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        )}
      </div>
    </Listbox>
  );
};

export default Dropdown;
