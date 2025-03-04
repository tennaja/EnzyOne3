import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { CheckIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { Disclosure } from '@headlessui/react'
import { Listbox, Transition } from '@headlessui/react'
import { numberWithCommas } from "../../utils";

const people = [
  { name: 'Area 1' },
  { name: 'Area 2' },
  { name: 'Area 3' },
  { name: 'Other' },
]

const BuildingList = () => {

  const [buildings, setBuildings] = useState(
    [{
      site_id: '1',
      site_name: 'กฟผ. บางกรวย',
      buildings: [
        {
          site_id: '1',
          building_id: '1',
          building_name: 'อาคาร ท.100',
          battery_tatus: 'Discharge',
          temperature: '25.0',
          humidity: '50%',
          demand: '215',
          power_generation: '215',
          energy: '11265',
          energy_cost: '24891',
          image: 'https://img.freepik.com/premium-photo/urban-architectural-landscape-lujiazui-shanghai_1417-3701.jpg',
        },
        {
          site_id: '1',
          building_id: '2',
          building_name: 'อาคาร ท.101',
          battery_tatus: 'Discharge',
          temperature: '25.0',
          humidity: '50%',
          demand: '215',
          power_generation: '215',
          energy: '11265',
          energy_cost: '24891',
          image: 'https://img.freepik.com/premium-photo/urban-architectural-landscape-lujiazui-shanghai_1417-3701.jpg',
        },

      ]
    },
    {
      site_id: '2',
      site_name: 'กฟผ. แม่เมาะ',
      buildings: [
        {
          site_id: '1',
          building_id: '1',
          building_name: 'อาคารแม่เมาะ 1',
          battery_tatus: 'Discharge',
          temperature: '25.0',
          humidity: '50%',
          demand: '215',
          power_generation: '215',
          energy: '11265',
          energy_cost: '24891',
          image: 'https://img.freepik.com/premium-photo/urban-architectural-landscape-lujiazui-shanghai_1417-3701.jpg',
        },
        {
          site_id: '1',
          building_id: '2',
          building_name: 'อาคารแม่เมาะ 2',
          battery_tatus: 'Discharge',
          temperature: '25.0',
          humidity: '50%',
          demand: '215',
          power_generation: '215',
          energy: '11265',
          energy_cost: '24891',
          image: 'https://img.freepik.com/premium-photo/urban-architectural-landscape-lujiazui-shanghai_1417-3701.jpg',
        },

      ]
    }]
  );

  const [selected, setSelected] = useState(people[0])

  return (
    <div className="rounded-xl border h-full border-stroke bg-white px-5 py-4 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center border-b border-stroke mb-6 pb-4 dark:border-strokedark">
        <h4 className="font-semibold text-xl text-black dark:text-white">
          Building
        </h4>

        <div className="relative">
          <input type="text" placeholder="Building name.." className="form-input" />
          <span className="absolute right-4 top-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </span>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full rounded-2xl bg-white">

          {buildings?.map((item, index) => {
            return (
              <Disclosure as="div" className="mt-2" key={index}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium text-enzy-dark hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                      <span>{item.site_name}</span>
                      <ChevronUpIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-slate-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pb-2 text-sm bg-gray-100 text-gray-500">

                      {/* Area filter */}
                      <div className="flex justify-end">
                        <Listbox value={selected} onChange={setSelected} className="w-72">
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left ring-1 ring-slate-300 ring-primary sm:text-sm active:border-primary">
                              <span className="block truncate">{selected.name}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {people.map((person, personIdx) => (
                                  <Listbox.Option
                                    key={personIdx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                      }`
                                    }
                                    value={person}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                            }`}
                                        >
                                          {person.name}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                      {item.buildings?.map((item, index) => {
                        return (
                          <div key={index} className="border-b py-1">
                            <div className="flex items-start gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4">
                              <Image src={item.image} alt="" height={100} width={100} className="rounded-md" />

                              <div className="w-full">
                                <div>
                                  <h5 className="font-medium text-lg text-black dark:text-white">
                                    {item.building_name}
                                  </h5>


                                  {/* <div className="grid grid-cols-3 gap-5 py-3">
                                    <div>
                                      <h5 className="text-sm font-medium xsm:text-base">Battery Status</h5>
                                      <span className="text-sm font-medium text-black dark:text-white">{item.battery_tatus}</span>
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-medium xsm:text-base">Temperature</h5>
                                      <span className="text-sm font-medium text-black dark:text-white">{item.temperature}</span>
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-medium xsm:text-base">Humidity</h5>
                                      <span className="text-sm font-medium text-black dark:text-white">{item.humidity}</span>
                                    </div>
                                  </div> */}

                                  <div className="grid grid-rows-2 grid-flow-col gap-1 mt-2">
                                    <div className="grid grid-cols-2 gap-5">
                                      <div>
                                        <h5 className="text-xs font-medium xsm:text-base">Demand (kW)</h5>
                                        <span className="text-sm font-medium text-black dark:text-white">{numberWithCommas(item.demand)}</span>
                                      </div>
                                      <div>
                                        <h5 className="text-xs font-medium xsm:text-base">Energy (kWh)</h5>
                                        <span className="text-sm font-medium text-black dark:text-white">{numberWithCommas(item.energy)}</span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                      <div>
                                        <h5 className="text-xs font-medium xsm:text-base">Power Generation (kW)</h5>
                                        <span className="text-sm font-medium text-black dark:text-white">{numberWithCommas(item.power_generation)}</span>
                                      </div>
                                      <div>
                                        <h5 className="text-xs font-medium xsm:text-base">Energy Cost (Baht)</h5>
                                        <span className="text-sm font-medium text-black dark:text-white">{numberWithCommas(item.energy_cost)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        )
                      })}


                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default BuildingList;
