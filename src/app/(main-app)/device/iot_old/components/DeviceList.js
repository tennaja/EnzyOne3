
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { Switch } from "@headlessui/react";
import { PowerIcon } from '@heroicons/react/20/solid'

const DeviceList = ({ deviceParameter, deviceData }) => {
    const [enabled, setEnabled] = useState(false)

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500">
                                <tr>
                                    <th scope="col" className="px-6 py-4 ">Name</th>
                                    <th scope="col" className="px-6 py-4 text-center">Status</th>
                                    {deviceParameter.map((item, index) => {
                                        return (
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-sm font-medium xsm:text-base text-center"
                                                key={index}>{item}
                                            </th>
                                        )
                                    })}

                                    <th scope="col" className="px-6 py-4 text-center">Control</th>
                                    <th scope="col" className="px-6 py-4 text-center">Automation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deviceData.map((item, index) => {
                                    return (
                                        <tr key={index} className="border-b dark:border-neutral-500 hover:bg-neutral-100">
                                            <td className="px-6 py-4 font-medium">{item.deviceName}</td>
                                            <td className="px-6 py-4 font-medium text-center">
                                                {item.status == 'ON' ?
                                                    <span className="inline-block rounded bg-[#0FB981]/[0.08] py-0.5 px-2.5 text-sm font-medium text-[#0FB981]">{item.status}</span>
                                                    :
                                                    <span className="inline-block rounded bg-[#FB5454]/[0.08] py-0.5 px-2.5 text-sm font-medium text-[#FB5454]">{item.status}</span>
                                                }
                                            </td>

                                            {item.data.map((d_item, d_index) => {
                                                return (
                                                    <td key={d_index} className="px-6 py-4 font-medium text-center">
                                                        {d_item.value}
                                                    </td>
                                                )
                                            })}

                                            <td className="px-6 py-4 font-medium text-center flex justify-center">
                                                {/* <button
                                                    style={{ width: 50, height: 50 }}
                                                    className={`rounded-full cursor-pointer ${item.status == 'ON' ? 'bg-[#ff5f79]' : 'bg-[#0FB981]'} 
                                                    border font-semibold text-white hover:ring-2 ${item.status == 'ON' ? 'hover:ring-[#fc6a9b]' : 'hover:ring-[#52e9bc]'} `}>

                                                    <div className="flex flex-col items-center justify-start">
                                                        <PowerIcon className="h-5 w-5 text-white" />
                                                        <span className="text-xs">{item.status == 'ON' ? 'OFF' : 'ON'}</span>
                                                    </div>
                                                </button> */}
                                                <Switch
                                                    id={`sw_${item.id}`}
                                                    checked={enabled}
                                                    onChange={setEnabled}
                                                    className={`${enabled ? "bg-[#52e9bc]" : "bg-gray-200"
                                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                                >
                                                    <span className="sr-only">Use setting</span>
                                                    <span
                                                        className={`${enabled ? "translate-x-6" : "translate-x-1"
                                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                    />
                                                </Switch>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-center">
                                                <Switch
                                                    id={`sw_${item.id}`}
                                                    checked={enabled}
                                                    onChange={setEnabled}
                                                    className={`${enabled ? "bg-blue-600" : "bg-gray-200"
                                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                                >
                                                    <span className="sr-only">Use setting</span>
                                                    <span
                                                        className={`${enabled ? "translate-x-6" : "translate-x-1"
                                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                    />
                                                </Switch>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeviceList;