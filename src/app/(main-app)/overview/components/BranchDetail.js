import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import numeral from "numeral";
import React, { useEffect, useState } from "react";
import "../overview.css";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mantine/hooks";

const AreaHeader = ({ branchData }) => {
  const companyModule = useSelector((state) => state.userData.navigationItems);
  const matchesLarge = useMediaQuery("(min-width: 1024px)");
  return (
    <div
      className={classNames({
        "grid grid-cols-3 lg:grid-cols-5 py-2 px-2 items-center": true,
        "grid-cols-5 lg:grid-cols-7": companyModule.find(
          (module) => module.name == "PowerGeneration"
        ),
      })}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full p-3 bg-[#93C5FD] text-white dark:bg-[#21424E]">
            <BuildingOffice2Icon className="w-6 h-6" />
          </div>
          <span className="font-semibold text-xl text-enzy-dark">
            {branchData?.length > 1 ? "Areas" : "Area"}
          </span>
        </div>
      </div>

      {companyModule.find((module) => module.name == "PowerGeneration") && (
        <>
          <div className="flex flex-col">
            <span className="text-sm text-enzy-dark dark:text-slate-300">
              Power Generation (kW)
            </span>
            {/* <div>
    <span className="font-semibold text-lg ">
      {numeral(branchData?.power_generation).format("0,0.[00]")}
    </span>
  </div> */}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-enzy-dark dark:text-slate-300">
              Energy Generation (kWh)
            </span>
            {/* <div>
    <span className="font-semibold text-lg ">
      {numeral(branchData?.power_generation).format("0,0.[00]")}
    </span>
  </div> */}
          </div>
        </>
      )}

      <div className="flex flex-col">
        <span className="text-sm text-enzy-dark dark:text-slate-300">
          Current Power (kW)
        </span>
        {/* <div>
          <span className="font-semibold text-lg ">
            {numeral(branchData?.current_demand).format("0,0.[00]")}
          </span>
        </div> */}
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-enzy-dark dark:text-slate-300">
          Energy Consumption (kWh)
        </span>
        {/* <div>
          <span className="font-semibold text-lg ">
            {numeral(branchData?.energy).format("0,0.[00]")}
          </span>
        </div> */}
      </div>
      {matchesLarge && (
        <>
          <div className="flex flex-col">
            <span className="text-sm text-enzy-dark dark:text-slate-300">
              On-Peak (kWh)
            </span>
            {/* <div>
          <span className="font-semibold text-lg ">
            {numeral(branchData?.energy).format("0,0.[00]")}
          </span>
        </div> */}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-enzy-dark dark:text-slate-300">
              Off-Peak (kWh)
            </span>
            {/* <div>
        <span className="font-semibold text-lg ">
          {numeral(branchData?.energy).format("0,0.[00]")}
        </span>
      </div> */}
          </div>
        </>
      )}

      {/* <div className="flex flex-col">
        <span className="text-sm text-enzy-dark dark:text-slate-300">
          Cost Saving (baht)
        </span>
        <div>
          <span className="font-semibold text-lg ">
            {numeral(branchData?.cost_saving).format("0,0.[00]")}
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-enzy-dark dark:text-slate-300">
          CO2 Saving (Ton)
        </span>
        <div>
          <span className="font-semibold text-lg ">
            {numeral(branchData?.co2_saving).format("0,0.[00]")}
          </span>
        </div>
      </div> */}
    </div>
  );
};

const DataLabel = ({ title, value, unit }) => {
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

const ProgressBar = ({ progressColor, value, totalValue }) => {
  return (
    <div className="grid grid-cols-5 items-center mr-4 border-r">
      <div className="h-3 w-[80%] col-span-4 bg-white">
        <div
          style={{ width: `${(value / totalValue) * 100}%` }}
          className={`h-full flex justify-end pr-4 items-center rounded text-white ${progressColor}`}
        ></div>
      </div>
      <div className="col-span-1">{numeral(value).format("0,0.[00]")}</div>
    </div>
  );
};

export default function BranchDetail({
  areaData = [],
  selectedBranch,
  setSelectedArea,
}) {
  const companyModule = useSelector((state) => state.userData.navigationItems);
  const matchesLarge = useMediaQuery("(min-width: 1024px)");
  const [selectedAreaId, setSelectedAreaId] = useState([]);
  const handleChangeArea = (event) => {
    // var selectedAreaArray = [...selectedAreaId];
    var selectedAreaArray = [];
    if (event.target.checked) {
      selectedAreaArray = [parseInt(event.target.value)];
    } else {
      selectedAreaArray.splice(
        selectedAreaId.indexOf(parseInt(event.target.value)),
        1
      );
    }
    setSelectedAreaId(selectedAreaArray);
  };

  useEffect(() => {
    var tmpAreaData = areaData?.data?.filter((item) => {
      return selectedAreaId.indexOf(item.id) >= 0;
    });

    setSelectedArea(tmpAreaData);
  }, [selectedAreaId]);

  return (
    <div
      className={classNames({
        "flex  flex-col   flex-1  rounded-xl  text-dark-base bg-white p-4   shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200": true,
      })}
    >
      <AreaHeader branchData={selectedBranch} />

      <div className="px-2 mt-3 mb-6">
        <div className="text-sm font-bold">{selectedBranch?.name}</div>
        <div className="text-xs">{selectedBranch?.description}</div>
      </div>

      {areaData?.data?.map((area) => (
        <div
          key={area.id}
          className={classNames({
            "grid grid-cols-3 lg:grid-cols-5   items-center": true,
            "grid-cols-5 lg:grid-cols-7": companyModule.find(
              (module) => module.name == "PowerGeneration"
            ),
          })}
        >
          <label className="flex gap-2 pl-4" htmlFor={`area_${area.id}`}>
            <div className="cb-container">
              <input
                type="checkbox"
                defaultChecked={true}
                id={`area_${area.id}`}
                value={area.id}
                onChange={handleChangeArea}
              />
              <span className="checkmark"></span>
            </div>
            <div className="flex flex-col">
              <div>{area.name}</div>
              <div className="text-xs">{area.description}</div>
            </div>
          </label>

          {companyModule.find((module) => module.name == "PowerGeneration") && (
            <>
              <DataLabel
                title={"Power Generation (kW)"}
                value={area.power_generation}
                unit={"kW"}
              />
              <DataLabel
                title={"Energy Generation (kWh)"}
                value={area.energy_generation}
                unit={"kW"}
              />
            </>
          )}
          <DataLabel
            title={"Current Demand (kW)"}
            value={area.current_demand}
            unit={"kW"}
          />
          <DataLabel
            title={"Energy (kWh)"}
            value={area.energy_total}
            unit={"kWh"}
          />
          {matchesLarge && (
            <>
              <DataLabel
                title={"Energy On-Peak (kWh)"}
                value={area.energy_onpeak}
                unit={"kWh"}
              />
              <DataLabel
                title={"Energy Off-Peak (kWh)"}
                value={area.energy_offpeak}
                unit={"kWh"}
              />
            </>
          )}

          {/* <DataLabel
            progressColor={"bg-red-300"}
            value={area.cost_saving}
            totalValue={selectedBranch.cost_saving}
          />
          <DataLabel
            progressColor={"bg-slate-300"}
            value={area.co2_saving}
            totalValue={selectedBranch.co2_saving}
          /> */}
        </div>
      ))}
    </div>
  );
}
