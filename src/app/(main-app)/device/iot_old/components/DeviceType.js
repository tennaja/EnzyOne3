
import React, { useState, useEffect } from "react";
import Image from 'next/image'
import classNames from "classnames";

const DeviceType = () => {   
    const deviceType = [
        {
            id : 1,
            name: 'Air Compressor',
            image: '/images/air-pump.png'
        },
        {
            id : 2,
            name: 'Counter',
            image: '/images/counter.png'
        },
        {
            id : 3,
            name: 'Smart Plug',
            image: '/images/smart-plug.png'
        },
        {
            id : 4,
            name: 'Lightning',
            image: '/images/light.png'
        },
        {
            id : 5,
            name: 'Smart Meter',
            image: '/images/smart-meter.png'
        },
    ]

    const [selectedDeviceType, setSelectedDeviceType] = useState(null);
    const handleDeviceTypeClick = (item) => {
        setSelectedDeviceType(item);
    }

    return (
        deviceType.length > 0 &&
        <div className={`flex flex-col md:gap-2 xl:gap-4`}>
            {deviceType.map((item, index) => {
                return (
                    <button
                        key={index}
                        className={classNames(
                            "flex flex-col items-center justify-center gap-2 cursor-pointer bg-white border text-enzy-dark rounded-lg font-semibold p-2 text-center hover:bg-[#6577f3]/[0.08] hover:border-[#6577f3] hover:text-[#6577f3]", 
                            {
                                "bg-[#6577f3]/[0.08] border-[#6577f3] text-[#6577f3]" : selectedDeviceType && selectedDeviceType.id === item.id
                            }
                        )}
                        onClick={() => handleDeviceTypeClick(item)}>
                        <Image src={item.image} alt="" height={35} width={35} className="md:w-6 md:h-6 xl:w-8 xl:h-8" />
                        <span className="md:text-xs xl:text-base">{item.name}</span>
                    </button>
                )
            })}
        </div>
    )
}

export default DeviceType;