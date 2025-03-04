import Image from 'next/image'
import React, { useState, useEffect } from "react";
import classNames from "classnames";

const BatterySpec = ({ data }) => {

    // const [deviceDetails, setDeviceDetails] = useState([]);

    // useEffect(() => {
    //     setDeviceDetails(data);
    // }, [data]);

    return (
        <div className="flex flex-col rounded-xl justify-between border border-stroke bg-white p-4 shadow-default dark:border-slate-800 dark:bg-dark-box">
            {/* {deviceDetails.map((device) => ( */}
            {/* <div key={device.id} className="mb-6"> */}
            <div className="dark:border-strokedark mb-6">
                <h4 className="font-bold text-xl text-center text-black dark:text-white">
                    Specification
                </h4>

            </div>

            <div className='flex justify-center'>
                <Image src={data.image} alt="" height={100} width={100} />
            </div>

            <div className="grid grid-cols-2 gap-1 pl-12 pr-12 pb-8">
                <div className="text-start">
                    <h4 className="font-semibold text-md text-black dark:text-white">
                        {data.name}
                    </h4>
                </div>

                <div></div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">Manufacturer</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">{data.manufacturer}</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">Model</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">{data.model}</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">Type</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">{data.type}</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">Power</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">{data.power} {"kW"}</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">Capacity</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">{data.capacity}</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">Lifetime (Cycle)</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">{data.lifetime}</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">Lastest Charge</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">{data.lastestCharge}</span>
                </div>

                <div className="text-start">
                    <span className="text-sm font-semibold dark:text-white">Status</span>
                </div>

                <div className="text-start">
                    {/* <span className="text-sm font-semibold">{data.status}</span> */}
                    <div className='flex justify-start'>
                        <div className={classNames("rounded-lg", {
                            "bg-green-500": data.status === "online",
                            "bg-red-500": data.status === "offline",
                            "px-4": true,
                        })}>
                            <h6 className="justify-items-start font-semibold text-center text-white dark:text-white">
                                {data.status === "online" ? "Online" : "Offline"}
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            {/* </div> */}
            {/* ))} */}
        </div>
    )
}

export default BatterySpec;