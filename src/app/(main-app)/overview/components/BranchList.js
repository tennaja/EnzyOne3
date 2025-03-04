import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mantine/hooks";

const BranchDataLabel = ({ title, value, unit }) => {
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

export default function BranchList({
  branchData = [],
  selectedBranch,
  setSelectedBranch,
}) {
  const companyModule = useSelector((state) => state.userData.navigationItems);
  const matchesLarge = useMediaQuery("(min-width: 1024px)");

  return (
    <div
      className={classNames({
        "flex  flex-col   flex-1  rounded-xl  text-dark-base bg-white p-4  gap-2 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200": true,
      })}
    >
      <div className="lg:hidden flex items-center gap-2">
        <div className="rounded-full p-3 bg-[#DBCDF0] text-white dark:bg-[#21424E]">
          <GlobeAsiaAustraliaIcon className="w-6 h-6" />
        </div>
        {/* <div className="w-2 h-8 bg-primary rounded-full"></div> */}
        <span className="font-semibold text-xl text-enzy-dark">
          {branchData?.length > 1 ? "Branches" : "Branch"}
        </span>
      </div>
      <div
        className={classNames({
          "grid grid-cols-3 lg:grid-cols-5 py-2 px-2   items-center": true,
          "grid-cols-5 lg:grid-cols-7": companyModule.find(
            (module) => module.name == "PowerGeneration"
          ),
        })}
      >
        {matchesLarge ? (
          <div className=" flex items-center gap-2">
            <div className="rounded-full p-3 bg-[#DBCDF0] text-white dark:bg-[#21424E]">
              <GlobeAsiaAustraliaIcon className="w-6 h-6" />
            </div>
            {/* <div className="w-2 h-8 bg-primary rounded-full"></div> */}
            <span className="font-semibold text-xl text-enzy-dark">
              {branchData?.length > 1 ? "Branches" : "Branch"}
            </span>
          </div>
        ) : (
          <div></div>
        )}

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
          <div className="flex flex-col">
            <span className="text-sm text-enzy-dark dark:text-slate-300">
              On-Peak (kWh)
            </span>
          </div>
        )}
        {matchesLarge && (
          <div className="flex flex-col">
            <span className="text-sm text-enzy-dark dark:text-slate-300">
              Off-Peak (kWh)
            </span>
          </div>
        )}
        {/* <div className="flex flex-col">
          <span className="text-sm text-enzy-dark dark:text-slate-300">
            Cost Saving
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-enzy-dark dark:text-slate-300">
            CO2 Saving
          </span>
        </div> */}
      </div>

      {branchData.length > 0 &&
        branchData?.map((site) => (
          <div
            key={site.id}
            className={classNames({
              "grid grid-cols-3 lg:grid-cols-5   py-2 px-2 rounded-md border items-center hover:bg-enzy-light-green hover:cursor-pointer dark:hover:bg-[#21424E]": true,
              "text-enzy-dark bg-enzy-light-green border-primary border-dashed dark:bg-primary dark:border-slate-400 dark:text-slate-100":
                selectedBranch?.id == site.id,
              "grid-cols-5 lg:grid-cols-7": companyModule.find(
                (module) => module.name == "PowerGeneration"
              ),
            })}
            onClick={() => setSelectedBranch(site)}
          >
            <div className="flex flex-col">
              <div>{site.name}</div>
              <div className="text-xs">{site.description}</div>
            </div>
            {companyModule.find(
              (module) => module.name == "PowerGeneration"
            ) && (
              <>
                <BranchDataLabel
                  title={"Power Generation (kW)"}
                  value={site.power_generation}
                  unit={"kW"}
                />
                <BranchDataLabel
                  title={"Power Generation (kW)"}
                  value={site.energy_generation}
                  unit={"kW"}
                />
              </>
            )}
            <BranchDataLabel
              title={"Current Demand (kW)"}
              value={site.current_demand}
              unit={"kW"}
            />
            <BranchDataLabel
              title={"Energy (kWh)"}
              value={site.energy_total}
              unit={"kWh"}
            />
            {matchesLarge && (
              <BranchDataLabel
                title={"Energy On-Peak (kWh)"}
                value={site.energy_onpeak}
                unit={"kWh"}
              />
            )}
            {matchesLarge && (
              <BranchDataLabel
                title={"Energy Off-Peak (kWh)"}
                value={site.energy_offpeak}
                unit={"kWh"}
              />
            )}

            {/* <BranchDataLabel
            title={"Cost Saving"}
            value={site.cost_saving}
            unit={"baht"}
          />
          <BranchDataLabel
            title={"CO2 Saving"}
            value={site.co2_saving}
            unit={"ton"}
          /> */}
          </div>
        ))}
    </div>
  );
}
