import Image from 'next/image'
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import DynamicDonutChart from './DynamicDonutChart';

const BatteryCharge = ({ data, deviceKey }) => {

    const [chargeValue, setChargeValue] = useState([]);

    useEffect(() => {
        setChargeValue(data);
    }, [data]);

    return (
        <div
            key={deviceKey}
            className={classNames("flex flex-col rounded-xl justify-between border border-stroke bg-white p-4 shadow-default dark:border-slate-800 dark:bg-dark-box")}>
            <div className="grid grid-cols-2 justify-between items-start dark:border-strokedark">
                <div className="col-span-1">

                    <div className='grid grid-rows-1 pt-10 pb-10'>
                        <div className='self-center items-center content-center justify-self-center'>
                            <div className='grid grid-rows-2'>
                                <div className="col-span-1">
                                    <div className="flex flex-row justify-between">
                                        <h4 className="font-bold text-center align-text-bottom self-end text-2xl text-enzy-dark dark:text-white">
                                            {"Charge"}
                                        </h4>
                                        <div className='ml-8'>
                                            <Image src={"/images/charge_icon.png"} alt="" height={53} width={53} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <div className="flex flex-row mt-2 justify-start">
                                        <h4 className="font-bold text-start text-3xl text-green-600 dark:text-green-400">
                                            {chargeValue.charge?.toFixed(2)}
                                        </h4>
                                        <h4 className="font-medium ml-2 self-end text-xl text-enzy-dark dark:text-white">
                                            {"kWh"}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-1">
                    <div className='grid grid-rows-1 pt-10 pb-10'>
                        <div className='self-center items-center content-center justify-self-center'>
                            <div className='grid grid-rows-2'>
                                <div className="col-span-1">
                                    <div className="flex flex-row justify-between">
                                        <h4 className="font-bold text-center align-text-bottom self-end text-2xl text-enzy-dark dark:text-white">
                                            {"Discharge"}
                                        </h4>
                                        <div className='ml-8'>
                                            <Image src={"/images/discharge_icon.png"} alt="" height={40} width={40} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <div className="flex flex-row mt-2 justify-start">
                                        <h4 className="font-bold text-start text-3xl text-red-600 dark:text-red-400">
                                            {chargeValue.discharge?.toFixed(2)}
                                        </h4>
                                        <h4 className="font-medium ml-2 self-end text-xl text-enzy-dark dark:text-white">
                                            {"kWh"}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BatteryCharge;