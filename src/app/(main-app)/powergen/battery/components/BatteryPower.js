import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import DynamicDonutChart from './DynamicDonutChart';

const BatteryPower = ({ data, powerColor, voltageColor, deviceKey }) => {

    const [powerValue, setPowerValue] = useState([]);

    useEffect(() => {
        setPowerValue(data);
    }, [data]);

    return (
        <div
            key={deviceKey}
            className={classNames("flex flex-col rounded-xl justify-between border border-stroke bg-white p-4 shadow-default dark:border-slate-800 dark:bg-dark-box")}>
            <div className="grid grid-cols-2 justify-between items-start dark:border-strokedark">
                <div className="col-span-1">

                    <div className='grid grid-rows-1'>
                        <div className='self-center items-center content-center justify-self-center'>
                            <h4 className="font-bold text-center text-xl text-enzy-dark dark:text-white">
                                {"Power (DC)"}
                            </h4>

                            <div className='grid grid-cols-4'>
                                <div className="col-span-1"></div>
                                <div className="col-span-2">
                                    <DynamicDonutChart value={powerValue.power} color={powerColor} />
                                </div>
                                <div className="col-span-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-1">
                    <div className='grid grid-rows-1'>
                        <div className='self-center items-center content-center justify-self-center'>
                            <h4 className="font-bold text-center text-xl text-enzy-dark dark:text-white">
                                {"Voltage"}
                            </h4>

                            <div className='grid grid-cols-4'>
                                <div className="col-span-1"></div>
                                <div className="col-span-2">
                                    <DynamicDonutChart value={powerValue.voltage} color={voltageColor} />
                                </div>
                                <div className="col-span-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BatteryPower;