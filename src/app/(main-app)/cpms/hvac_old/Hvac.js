import React from "react";
import Floor from "./components/Floor";
import Ahu from "./components/Ahu";

export default function Hvac() {
  return (
    <div className="min-h-screen flex w-full text-enzy-dark dark:text-slate-200">
      <main className="p-4 lg:p-8 flex flex-1 flex-col bg-[#EDF2F8] dark:bg-dark-base">
        <div className="flex flex-col gap-4">
          <Floor />
          <div className="grid grid-cols-4 gap-4">
            <Ahu params={{ ahuId: "AHU_4_1" }} />
            <Ahu params={{ ahuId: "AHU_4_2" }} />
          </div>
        </div>
      </main>
    </div>
  );
}
