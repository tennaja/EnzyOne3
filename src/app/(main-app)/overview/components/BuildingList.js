import ImageWithFallback from "@/components/ImageWithFallback";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "@mantine/hooks";
import classNames from "classnames";
import Image from "next/image";
import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BuildingDataLabel = ({ title, value, unit }) => {
  return (
    <div className="flex flex-col">
      <div>
        <span className="font-semibold text-lg ">
          {numeral(value).format("0,0.[00]")}
        </span>
        {/* <span className=" text-xs "> {unit}</span> */}
      </div>
    </div>
  );
};
export default function BuildingList({
  buildingData = [],
  setSelectedBuilding,
}) {
  const companyModule = useSelector((state) => state.userData.navigationItems);
  const matchesLarge = useMediaQuery("(min-width: 1024px)");
  const [selectedBuildingId, setSelectedBuildingId] = useState([]);
  const handleChangeBuilding = (event) => {
    var selectedBuildingArray = [...selectedBuildingId];
    // var selectedBuildingArray = [];
    if (event.target.checked) {
      selectedBuildingArray = [
        ...selectedBuildingId,
        parseInt(event.target.value),
      ];
    } else {
      selectedBuildingArray.splice(
        selectedBuildingId.indexOf(parseInt(event.target.value)),
        1
      );
    }
    setSelectedBuildingId(selectedBuildingArray);
  };

  useEffect(() => {
    var selectedBuildingArray = [...selectedBuildingId];
    var allSelectedBuilding = [];
    if (buildingData.length > 0) {
      var tmpArray = [];
      for (const building of buildingData?.[0]?.data) {
        tmpArray.push(parseInt(building.id));

        // setSelectedBuildingId(selectedBuildingArray);
      }
      selectedBuildingArray = [...selectedBuildingArray, ...tmpArray];

      allSelectedBuilding = [...new Set(selectedBuildingArray)];

      setSelectedBuildingId(allSelectedBuilding);
    }
    return () => {};
  }, [buildingData]);

  useEffect(() => {
    // console.log("selectedBuildingId", selectedBuildingId);
    var tmpBuildingData = buildingData?.[0]?.data?.filter((item) => {
      return selectedBuildingId.indexOf(item.id) >= 0;
    });

    setSelectedBuilding(tmpBuildingData);
  }, [selectedBuildingId]);

  return (
    <div
      className={classNames({
        "flex  flex-col   flex-1  rounded-xl   bg-white p-4 text-dark-base  shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200": true,
      })}
    >
      <div
        className={classNames({
          "grid grid-cols-3 lg:grid-cols-5 py-2 px-2 items-center": true,
          "grid-cols-5 lg:grid-cols-7": companyModule.find(
            (module) => module.name == "PowerGeneration"
          ),
        })}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-full p-3 bg-[#92d496] text-white dark:bg-[#21424E]">
            <BuildingOfficeIcon className="w-6 h-6" />
          </div>
          <span className="font-semibold text-xl text-enzy-dark">
            {buildingData?.length > 1 ? "Buildings" : "Building"}
          </span>
        </div>
        {companyModule.find((module) => module.name == "PowerGeneration") && (
          <>
            <div className="flex flex-col">
              <span className="text-sm text-enzy-dark dark:text-slate-300">
                Power Generation (kW)
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-enzy-dark dark:text-slate-300">
                Energy Generation (kWh)
              </span>
            </div>
          </>
        )}
        <div className="flex flex-col">
          <span className="text-sm text-enzy-dark dark:text-slate-300">
            Current Power (kW)
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-enzy-dark dark:text-slate-300">
            Energy Consumption (kWh)
          </span>
        </div>
        {matchesLarge && (
          <>
            <div className="flex flex-col">
              <span className="text-sm text-enzy-dark dark:text-slate-300">
                On-Peak (kWh)
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-enzy-dark dark:text-slate-300">
                Off-Peak (kWh)
              </span>
            </div>
          </>
        )}

        {/* <div className="flex flex-col">
          <span className="text-sm text-enzy-dark dark:text-slate-300">
            Cost Saving (baht)
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-enzy-dark dark:text-slate-300">
            CO2 Saving (Ton)
          </span>
        </div> */}
      </div>

      {buildingData?.map((buildingItem, index) => (
        <div key={index} className="mt-3">
          <div className="flex flex-col ">
            <div className="text-sm px-2 mb-2 font-bold">
              {buildingItem?.area_name}
            </div>
          </div>
          {buildingItem?.data.map((building, index) => (
            <label
              htmlFor={`building_${building.id}`}
              key={index}
              className={classNames({
                "grid grid-cols-3 lg:grid-cols-5  py-2 items-center border-b last:border-b-0": true,
                "grid-cols-5 lg:grid-cols-7": companyModule.find(
                  (module) => module.name == "PowerGeneration"
                ),
              })}
            >
              <div className="flex items-center gap-2 pl-4">
                <div className="cb-container">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    id={`building_${building.id}`}
                    value={building.id}
                    onChange={handleChangeBuilding}
                  />
                  <span className="checkmark"></span>
                </div>
                {matchesLarge && (
                  <ImageWithFallback
                    src={building.image_url ?? "/images/profile/noimg.png"}
                    fallbackSrc="/images/profile/noimg.png"
                    height={36}
                    width={48}
                    alt="profile image"
                    className="rounded bg-red-200"
                  />
                )}

                <div className="flex flex-col">
                  <div>{building.name}</div>
                </div>
              </div>
              {companyModule.find(
                (module) => module.name == "PowerGeneration"
              ) && (
                <>
                  <BuildingDataLabel
                    title={"Power Generation (kW)"}
                    value={building.power_generation}
                    unit={"kW"}
                  />
                  <BuildingDataLabel
                    title={"Energy Generation (kWh)"}
                    value={building.energy_generation}
                    unit={"kW"}
                  />
                </>
              )}
              <BuildingDataLabel
                title={"Current Demand (kW)"}
                value={building.current_demand}
                unit={"kW"}
              />
              <BuildingDataLabel
                title={"Energy (kWh)"}
                value={building.energy_total}
                unit={"kWh"}
              />
              {matchesLarge && (
                <>
                  <BuildingDataLabel
                    title={"Energy On-Peak (kWh)"}
                    value={building.energy_onpeak}
                    unit={"kWh"}
                  />
                  <BuildingDataLabel
                    title={"Energy Off-Peak (kWh)"}
                    value={building.energy_offpeak}
                    unit={"kWh"}
                  />
                </>
              )}

              {/* <BuildingDataLabel
                title={"Power Generation (kW)"}
                value={building.cost_saving}
                unit={"baht"}
              />
              <BuildingDataLabel
                title={"Power Generation (kW)"}
                value={building.co2_saving}
                unit={"ton"}
              /> */}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
