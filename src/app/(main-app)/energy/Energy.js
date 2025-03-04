"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import classNames from "classnames";
import { unique } from "@/utils/function";
import { BsSpeedometer } from "react-icons/bs";
import { ImPower } from "react-icons/im";
import { LuSettings2 } from "react-icons/lu";
import { HiOutlineLightBulb } from "react-icons/hi";
import { Tooltip } from "antd";

export default function Energy({ props }) {
  return (
    <div className="min-h-screen flex w-full text-enzy-dark dark:text-slate-200">
      <main className="p-4 lg:p-8 flex flex-1 flex-col bg-[#EDF2F8] dark:bg-dark-base">
        <div className="rounded-xl bg-white p-2 mb-4 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
          <div className="flex items-center gap-2 py-2 px-4">
            <div className="rounded-full p-3 bg-enzy-light-yellow text-whenzy-darkite dark:bg-[#21424E]">
              <HiOutlineLightBulb className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xl text-enzy-dark">
              Energy Consumtion
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-2 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
          <div className="py-4">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="flex gap-2 p-2 items-center">
                <div className="w-3 h-3 rounded-full bg-enzy-success"></div>
                <div className="text-3xl font-bold">Main</div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 justify-center px-4">
                  <BsSpeedometer className="w-5 h-5 text-enzy-dark-green" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-enzy-dark">
                      Energy
                    </span>
                    <span className="font-semibold text-sm text-enzy-dark">
                      542,140 kWh
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-200 px-4">
                  <ImPower className="w-5 h-5 text-enzy-yellow" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-enzy-dark">
                      Power
                    </span>
                    <span className="font-semibold text-sm text-enzy-dark">
                      881 kW
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-200 px-4">
                  <LuSettings2 className="w-5 h-5 text-purple-500" />

                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-enzy-dark">
                      Power Factor
                    </span>
                    <span className="font-semibold text-sm text-enzy-dark">
                      0.33
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="grid w-full">
                <div className="bg-enzy-dark-green px-3 py-2 rounded-t-lg text-center">
                  <div className="flex items-center justify-between">
                    <div className="font-normal text-md text-white ">MDB1</div>
                    <div className="font-normal text-md rounded-full px-3 bg-enzy-light-yellow text-enzy-dark">
                      Load
                    </div>
                  </div>
                </div>

                <div className="border-2 border-slate-200 p-2 rounded-b-lg text-center">
                  <Tooltip title="This is ....">
                    <div className="flex flex-col items-center gap-2 my-3">
                      <BsSpeedometer className="w-12 h-12 text-primary" />
                      <div className="text-md font-semibold">
                        Energy : 86,140 kWh
                      </div>
                    </div>
                  </Tooltip>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Tooltip title="This is ....">
                      <div className="rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex gap-2 p-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-enzy-success"></div>
                          <div className="text-sm font-semibold">MDB1 Sub1</div>
                        </div>
                        <div className="p-2 text-xs font-medium">
                          Power : 66.10 kW
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="This is ....">
                      <div className="rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex gap-2 p-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-enzy-success"></div>
                          <div className="text-sm font-semibold">
                            Air Compressor1
                          </div>
                        </div>
                        <div className="p-2 text-xs font-medium">
                          Power : 66.10 kW
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="This is ....">
                      <div className="rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex gap-2 p-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-enzy-success"></div>
                          <div className="text-sm font-semibold">
                            MDB 1 Sub3
                          </div>
                        </div>
                        <div className="p-2 text-xs font-medium">
                          Power : 66.10 kW
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="bg-enzy-dark-green px-3 py-2 rounded-t-lg text-center">
                  <div className="flex items-center justify-between">
                    <div className="font-normal text-md text-white ">MDB2</div>
                    <div className="font-normal text-md rounded-full px-3 bg-enzy-light-yellow text-enzy-dark">
                      Load
                    </div>
                  </div>
                </div>

                <div className="border-2 border-slate-200 p-2 rounded-b-lg text-center">
                  <Tooltip title="This is ....">
                    <div className="flex flex-col items-center gap-2 my-3">
                      <BsSpeedometer className="w-12 h-12 text-primary" />
                      <div className="text-md font-semibold">
                        Energy : 86,140 kWh
                      </div>
                    </div>
                  </Tooltip>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Tooltip title="This is ....">
                      <div className="rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex gap-2 p-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-enzy-success"></div>
                          <div className="text-sm font-semibold">MDB2 Sub1</div>
                        </div>
                        <div className="p-2 text-xs font-medium">
                          Power : 66.10 kW
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="This is ....">
                      <div className="rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex gap-2 p-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-enzy-success"></div>
                          <div className="text-sm font-semibold">
                            Air Compressor1
                          </div>
                        </div>
                        <div className="p-2 text-xs font-medium">
                          Power : 66.10 kW
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="bg-enzy-dark-green px-3 py-2 rounded-t-lg text-center">
                  <div className="flex items-center justify-between">
                    <div className="font-normal text-md text-white ">MDB3</div>
                    <div className="font-normal text-md rounded-full px-3 bg-enzy-light-yellow text-enzy-dark">
                      Load
                    </div>
                  </div>
                </div>

                <div className="border-x-2 border-b-2 border-slate-200 p-2 rounded-b-lg text-center">
                  <Tooltip title="This is ....">
                    <div className="flex flex-col items-center gap-2 my-3">
                      <BsSpeedometer className="w-12 h-12 text-primary" />
                      <div className="text-md font-semibold">
                        Energy : 86,140 kWh
                      </div>
                    </div>
                  </Tooltip>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Tooltip title="This is ....">
                      <div className="rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex gap-2 p-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-enzy-success"></div>
                          <div className="text-sm font-semibold">MDB3 Sub1</div>
                        </div>
                        <div className="p-2 text-xs font-medium">
                          Power : 66.10 kW
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="This is ....">
                      <div className="rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex gap-2 p-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-enzy-success"></div>
                          <div className="text-sm font-semibold">
                            Air Compressor1
                          </div>
                        </div>
                        <div className="p-2 text-xs font-medium">
                          Power : 66.10 kW
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="This is ....">
                      <div className="rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex gap-2 p-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-enzy-success"></div>
                          <div className="text-sm font-semibold">
                            Air Compressor3
                          </div>
                        </div>
                        <div className="p-2 text-xs font-medium">
                          Power : 66.10 kW
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="This is ....">
                      <div className="rounded-lg border border-slate-200 bg-slate-50">
                        <div className="flex gap-2 p-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-enzy-success"></div>
                          <div className="text-sm font-semibold">
                            Air Compressor3
                          </div>
                        </div>
                        <div className="p-2 text-xs font-medium">
                          Power : 66.10 kW
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
