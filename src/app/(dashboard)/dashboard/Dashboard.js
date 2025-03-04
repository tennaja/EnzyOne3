"use client";
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import useSWR from "swr";
import { fetcher } from "@/utils/utils";
import Link from "next/link";
import StatCardWithTime from "./components/StatCardWithTime";
import StatCard from "./components/StatCard";
import Title from "./components/Title";

const Dashboard = () => {
  const selectedCompany = useSelector((state) => state.companyData.company);
  const username = useSelector((state) => state.userData.username);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/dashboard/company?id=${selectedCompany.Id}&username=${username}`,
    fetcher
  );

  return (
    <div className="min-h-screen flex w-full text-enzy-dark dark:text-slate-200">
      <main className=" flex flex-1 flex-col bg-[url('/images/bg-dashboard.png')] bg-cover  ">
        <div className="p-4 lg:p-8 bg-[#202e3e] bg-opacity-10 backdrop-blur-sm h-full   ">
          {/* create div grid-col-3 */}
          <div className="flex flex-col md:grid md:grid-cols-3 gap-4 h-full   md:max-h-[768px]">
            <div className="grid">
              <StatCardWithTime
                data={data?.energy_generation}
                name={data?.name}
                description={data?.description}
              />
            </div>
            <div className="grid  md:col-span-2 gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* <div>ยอดรวมการผลิตไฟฟ้า</div>
              <div>ยอดรวมการประหยัดไฟฟ้า</div> */}
                <StatCard
                  data={data?.energy_generation_total}
                  type="energy"
                  title={"Accum. electricity generation"}
                  unit={"kWh"}
                />
                <StatCard
                  data={data?.total_yield_up_to_date}
                  type="yield"
                  title={"Accum. electricity savings of"}
                  unit={"baht"}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {/* <div>เทียบเท่าการปลูกต้นไม้</div>
              <div>ประหยัดน้ำ</div>
              <div>ลดการปล่อย CO2</div> */}
                <StatCard
                  data={data?.tree_planted}
                  type="tree"
                  title={"Accum. equivalent to planting"}
                  unit={"trees"}
                />
                <StatCard
                  data={data?.carbon_reduced}
                  type="carbon"
                  title={"Accum. reduce carbon emissions"}
                  unit={"tons"}
                  decimalPlaces={2}
                />
              </div>
            </div>{" "}
            {/*  <span className="text-right text-sm col-span-3 text-white">
              * Calculated from the completed installation date
            </span> */}
          </div>

          <Link
            href={"/overview"}
            className="fixed right-4 bottom-0 m-4 bg-primary hover:scale-110 transition text-white font-bold py-2 px-4 rounded"
          >
            Enter Site
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
