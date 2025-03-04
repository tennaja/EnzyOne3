import React, { useState, useEffect } from "react";
import classNames from "classnames";

const BatteryOverview = ({ data, onSelectDevice }) => {
  const [deviceStates, setDeviceStates] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    setDeviceStates(data);
  }, [data]);

  const handleCharge = (batteryId) => {
    // Update the state of the battery to "charge"
    const updatedDeviceStates = deviceStates.map((battery) =>
      battery.id === batteryId ? { ...battery, currentState: "charge" } : battery
    );
    setDeviceStates(updatedDeviceStates);
  };

  const handleDischarge = (batteryId) => {
    // Update the state of the battery to "discharge"
    const updatedDeviceStates = deviceStates.map((battery) =>
      battery.id === batteryId ? { ...battery, currentState: "discharge" } : battery
    );
    setDeviceStates(updatedDeviceStates);
  };

  const handleDeviceClick = (battery) => {
    setSelectedDevice(battery);
    onSelectDevice(battery); // Pass the selected device to the parent component
  };

  return (
    <div className="rounded-xl border border-stroke bg-white px-5 mb-4 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
      <div className="flex justify-start py-4 mb-3 dark:border-strokedark">
        <h4 className="font-semibold text-xl text-black dark:text-white">Devices</h4>
        <div className="flex justify-start items-center pl-2 dark:border-strokedark">
          <h5 className="font-light text-l text-black dark:text-white">
            ({deviceStates.filter((battery) => battery.status === "online").length} Online)
          </h5>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {deviceStates.map((battery) => (
          <div
            key={battery.id}
            className={classNames(
              "flex justify-start items-center rounded-lg p-3 border",
              {
                "bg-enzy-light-blue dark:bg-slate-500 dark:border-slate-500 dark:text-slate-100":
                  battery.status === "online",
                "bg-gray-300 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300":
                  battery.status === "offline",
                "border-2 border-blue-500 dark:border-2 dark:border-blue-500": selectedDevice && selectedDevice.id === battery.id,
              }
            )} onClick={() => handleDeviceClick(battery)} // Handle the click event on the device
          >
            <h6 className="font-semibold text-base text-black dark:text-white">{battery.name}</h6>


            <div className={classNames("rounded-lg", "ml-4", {
              "bg-green-500": battery.status === "online",
              "bg-red-500": battery.status === "offline",
            })}>
              <h6 className="font-semibold px-3 text-base text-white dark:text-white">
                {battery.status === "online" ? "Online" : "Offline"}
              </h6>
            </div>

            <div className="flex-grow"></div>

            <div className="flex dark:border-strokedark">
              <button
                className={classNames("ml-2", {
                  "bg-yellow-400 cursor-not-allowed text-gray font-semibold py-1 px-4 rounded dark:bg-yellow-400 dark:border-slate-500 dark:text-black":
                    battery.currentState === "charge",
                  "bg-white border-solid border-2 border-slate-400 hover:bg-green-400 text-gray font-semibold py-1 px-4 rounded dark:bg-white dark:border-slate-700 dark:text-black dark:hover:bg-green-400":
                    battery.currentState !== "charge",
                })}
                onClick={() => handleCharge(battery.id)}
                disabled={battery.currentState === "charge"}
              >
                Charge
              </button>
              <button
                className={classNames("ml-2", {
                  "bg-yellow-400 cursor-not-allowed text-gray font-semibold py-1 px-4 rounded dark:bg-yellow-400 dark:border-slate-500 dark:text-black":
                    battery.currentState === "discharge",
                  "bg-white border-solid border-2 border-slate-400 hover:bg-red-400 text-gray font-semibold py-1 px-4 rounded dark:bg-white dark:border-slate-700 dark:text-black dark:hover:bg-red-400":
                    battery.currentState !== "discharge",
                })}
                onClick={() => handleDischarge(battery.id)}
                disabled={battery.currentState === "discharge"}
              >
                Discharge
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-5"></div>
    </div>
  );
};

export default BatteryOverview;
