import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { CheckIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { Disclosure } from '@headlessui/react'
import { Listbox, Transition } from '@headlessui/react'
import numeral from "numeral";

const people = [
  { name: 'Area 1' },
  { name: 'Area 2' },
  { name: 'Area 3' },
  { name: 'Other' },
]

const BuildingList = ({ buildingData }) => {

  return (

    <div className="w-full">
      <div className="w-full rounded-2xl">

        {buildingData?.map((item, index) => {
          return (
            <Disclosure as="div" className="mb-2" key={index}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-md bg-blue-50 px-4 py-3 text-left text-sm font-medium text-enzy-dark hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                    <span>{item.name}</span>
                    <ChevronUpIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-slate-500`}
                    />
                  </Disclosure.Button>

                  <Disclosure.Panel className="px-4 pb-2 text-sm bg-gray-100 text-gray-500">

                    {/* {item.floor?.map((item, index) => {
                        return (
                          <div key={index} className="border-b py-1">
                            <div className="flex items-start gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
                              <Image src={item.image} alt="" height={100} width={100} className="rounded-md" />

                              <div className="w-full">
                                <div>
                                  <h5 className="font-medium text-lg text-black dark:text-white">
                                    {item.building_name}
                                  </h5>

                                  <div className="grid grid-rows-2 grid-flow-col gap-1 mt-2">
                                    <div className="grid grid-cols-2 gap-5">
                                      <div>
                                        <h5 className="text-xs font-medium xsm:text-base">Demand (kW)</h5>
                                        <span className="text-sm font-medium text-black dark:text-white">{(item.demand)}</span>
                                      </div>
                                      <div>
                                        <h5 className="text-xs font-medium xsm:text-base">Energy (kWh)</h5>
                                        <span className="text-sm font-medium text-black dark:text-white">{(item.energy)}</span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                      <div>
                                        <h5 className="text-xs font-medium xsm:text-base">Power Generation (kW)</h5>
                                        <span className="text-sm font-medium text-black dark:text-white">{(item.power_generation)}</span>
                                      </div>
                                      <div>
                                        <h5 className="text-xs font-medium xsm:text-base">Energy Cost (Baht)</h5>
                                        <span className="text-sm font-medium text-black dark:text-white">{(item.energy_cost)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        )
                      })} */}


                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          )
        })}
      </div>
    </div>
  );
};

export default BuildingList;
