import Image from 'next/image'
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import DynamicDonutChart from './DynamicDonutChart';

const BatteryStates = ({ data, title, subTitle, colors, deviceKey}) => {
    const [stateValue, setStateValue] = useState([]);
    const [arrowImage, setArrowImage] = useState("");
    const prevValueRef = useRef(null);

    useEffect(() => {
        setStateValue(data);
    }, [data]);

    useEffect(() => {
        prevValueRef.current = null; // Reset the prevValueRef when deviceKey changes
      }, [deviceKey]);

    useEffect(() => {
        // console.log("stateValue: ", stateValue);
        // console.log("prevValue: ", prevValueRef.current);
        // console.log("DeviceKay: ", deviceKey);
        
        // Calculate the arrow direction when stateValue changes
        if ((stateValue > prevValueRef.current) && (prevValueRef.current > 0)) {
          setArrowImage("/images/arrow_upward.png");
        } else if (stateValue < prevValueRef.current) {
          setArrowImage("/images/arrow_downward.png");
        } else {
          setArrowImage(null);
        }
    
        prevValueRef.current = stateValue; // Update the prevValueRef with the new stateValue
      }, [stateValue]);

    return (
        <div 
        key={deviceKey}
        className={classNames("flex flex-col rounded-xl justify-between border border-stroke bg-white p-4 shadow-default dark:border-slate-800 dark:bg-dark-box")}>
            <div className="grid grid-cols-2 justify-between items-start dark:border-strokedark">
                <div className="col-span-1">

                    <div className='grid grid-rows-2 gap-y-8'>
                        <div>
                            <h4 className="font-bold text-xl text-enzy-dark dark:text-white">
                                {title}
                            </h4>
                            <h4 className="font-semibold text-sm text-enzy-dark dark:text-white">
                                {subTitle}
                            </h4>
                        </div>

                        <div className='grid content-end'>
                            <div className='flex flex-row justify-start'>
                                <h4 className="font-semibold text-xl text-enzy-dark dark:text-white">
                                    {stateValue + "%"}
                                </h4>
                                <div className="ml-2">
                                    {arrowImage && (
                                        <Image src={arrowImage} alt="" height={30} width={30} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-span-1">
                    <div className="flex justify-end item-end">
                        <DynamicDonutChart value={stateValue} color={colors} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BatteryStates;