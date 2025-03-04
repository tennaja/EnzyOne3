import React from "react";
import ChillerChart from "./components/ChillerChart";
import ChillerOverview from "./components/ChillerOverview";
import ChillerTable from "./components/ChillerTable";
import ChillerOverviewChart from "./components/ChillerOverviewChart";
import ChillerTempChart from "./components/ChillerTempChart";
import PeopleCountingChart from "./components/PeopleCountingChart";
import CpmsOverviewChart from "./components/CpmsOverviewChart";

export default function Chiller() {
  return (
    <div className="min-h-screen flex w-full text-enzy-dark dark:text-slate-200">
      <main className="p-4 lg:p-8 flex flex-1 flex-col bg-[#EDF2F8] dark:bg-dark-base">
        <div className="flex flex-col gap-4">
          <ChillerOverview />
          <ChillerTable />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <ChillerChart chillerId={"CH_03"} dataType={"power"} />
            </div>
            <ChillerTempChart />
            <ChillerOverviewChart dataType={"flow"} />
            <PeopleCountingChart />
            <CpmsOverviewChart dataType={"power"} />
            <CpmsOverviewChart dataType={"efficiency"} />
          </div>
        </div>
      </main>
    </div>
  );
}
