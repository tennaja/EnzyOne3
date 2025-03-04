"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Image from "next/image";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options = {
  colors: ["#002060", "#FFA70B"],
  labels: ["ค่าพลังงานไฟฟ้า", "ค่าความต้องการไฟฟ้า"],
  legend: {
    show: true,
    position: "bottom",
  },
  chart: {
    animations: {
      enabled: false,
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: true,
  },
  responsive: [
    {
      breakpoint: 280,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

export default function SummaryDetail({ month, year }) {
  const sampleEnergyDetail = [
    {
      id: 1,
      date: "2023-11-01",
      peak_time: "11:00",
      peak_avg_in_15min: "2134.00",
      energy_onpeak: "18500.00",
      energy_offpeak: "14080.00",
      energy_total_kwh: "32580.00",
      energy_total_baht: "135855.01",
      energy_avg: "4.17",
    },
    {
      id: 2,
      date: "2023-11-01",
      peak_time: "11:00",
      peak_avg_in_15min: "2134.00",
      energy_onpeak: "18500.00",
      energy_offpeak: "14080.00",
      energy_total_kwh: "32580.00",
      energy_total_baht: "135855.01",
      energy_avg: "4.17",
    },
    {
      id: 3,
      date: "2023-11-01",
      peak_time: "11:00",
      peak_avg_in_15min: "2134.00",
      energy_onpeak: "18500.00",
      energy_offpeak: "14080.00",
      energy_total_kwh: "32580.00",
      energy_total_baht: "135855.01",
      energy_avg: "4.17",
    },
  ];

  const [state, setState] = useState({
    series: [60, 40],
  });

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div
        className="flex flex-col gap-4"
        id="div_summaryPDF"
        style={{ width: "100%" }}
      >
        <div className="rounded-xl bg-white p-3 pb-10 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
          <div className="grid grid-cols-6 p-3 items-center">
            <div className="col-span-2">
              <Image
                src={"/images/enzy_logo_b.png"}
                alt=""
                height={100}
                width={150}
              />
            </div>

            <div className="col-span-4">
              <div>
                <div className="font-semibold text-lg text-enzy-dark">
                  ใบสรุปค่าไฟฟ้าสำหรับลูกค้าในนิคมฯ
                </div>
                <div className="text-sm">
                  ประจำเดือน {month?.name} {year}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-10 gap-4 px-3">
            <div className="col-span-1 xl:col-span-6 border-0 border-slate-100 mt-5 rounded-lg">
              <div className="p-0">
                {/* <p className="font-semibold text-md text-enzy-dark mb-2">อัตราค่าไฟฟ้า</p> */}
                <div className="flex flex-col gap-4">
                  <div className="border-2 border-slate-100 rounded-lg p-4">
                    <p className="font-semibold text-sm text-enzy-dark mb-2">
                      อัตราค่าไฟฟ้า
                    </p>
                    <div>
                      <div className="flex justify-between px-3 py-1">
                        <div className="text-xs">อัตราค่าความต้องการไฟฟ้า</div>
                        <div className="text-xs">132.93 บาท / kWh</div>
                      </div>
                      <div className="flex justify-between px-3 py-1">
                        <div className="text-xs">อัตราค่าพลังงานไฟฟ้า</div>
                      </div>
                      <div className="flex justify-between px-3 py-1">
                        <div className="text-xs">- Peak</div>
                        <div className="text-xs">4.1839 บาท / kWh</div>
                      </div>
                      <div className="flex justify-between px-3 py-1">
                        <div className="text-xs">- Off-Peak</div>
                        <div className="text-xs">2.6037 บาท / kWh</div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="border-2 border-slate-100 rounded-lg p-4"> */}
                  <div className="border-slate-100 rounded-lg">
                    <p className="font-semibold text-sm text-enzy-dark mb-2">
                      ค่าใช้ไฟฟ้าตามความต้องการไฟฟ้า
                    </p>
                    <div className="rounded-lg border">
                      <div className="grid grid-cols-4 text-center border-b rounded-t-lg bg-slate-100 p-2">
                        <div className="text-xs font-medium">วันที่</div>
                        <div className="text-xs font-medium">เวลา</div>
                        <div className="text-xs font-medium">
                          จำนวนหน่วย (kWh)
                        </div>
                        <div className="text-xs font-medium">
                          จำนวนเงิน (บาท)
                        </div>
                      </div>
                      <div className="grid grid-cols-4 text-center p-2 border-b">
                        <div className="text-xs">21 Apr 23</div>
                        <div className="text-xs">21:30</div>
                        <div className="text-xs">2,185</div>
                        <div className="text-xs">290,452.05</div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="border-2 border-slate-100 rounded-lg p-4"> */}
                  <div className="border-slate-100 rounded-lg">
                    <p className="font-semibold text-sm text-enzy-dark mb-2">
                      ค่าใช้ไฟฟ้าตามปริมาณหน่วยไฟฟ้า
                    </p>
                    <div className="rounded-lg border">
                      <div className="grid grid-cols-5 text-center border-b rounded-t-lg bg-slate-100 p-2">
                        <div className="col-span-1"></div>
                        <div className="col-span-2 text-xs font-medium">
                          จำนวนหน่วย (kWh)
                        </div>
                        <div className="col-span-2 text-xs font-medium">
                          จำนวนเงิน (บาท)
                        </div>
                      </div>
                      <div className="grid grid-cols-5 text-center p-2 border-b font-medium">
                        <div></div>
                        <div className="text-xs">Peak</div>
                        <div className="text-xs">Off-Peak</div>
                        <div className="text-xs">Peak</div>
                        <div className="text-xs">Off-Peak</div>
                      </div>
                      <div className="grid grid-cols-5 text-center p-2 border-b">
                        <div className="text-xs">ค่าพลังงานไฟฟ้า</div>
                        <div className="text-xs">189,729</div>
                        <div className="text-xs">216,759</div>
                        <div className="text-xs">793,807.16</div>
                        <div className="text-xs">564,375.41</div>
                      </div>
                      <div className="grid grid-cols-5 text-center p-2 font-bold border-b">
                        <div className="text-xs">รวม</div>
                        <div className="text-xs col-span-2">406,488</div>
                        <div className="text-xs col-span-2">1,358,182.57</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 xl:col-span-4 border-2 border-slate-100 mt-5 rounded-lg">
              <div className="p-3">
                <div className="p-2 rounded-lg">
                  <div className="bg-primary px-3 py-1 rounded-t-lg">
                    <p className="font-normal text-sm text-white">
                      สรุปค่าไฟฟ้า
                    </p>
                  </div>

                  <div className="bg-slate-100 rounded-b-lg py-3">
                    <div className="flex justify-between px-3 py-1">
                      <div className="text-xs">ค่าความต้องการไฟฟ้า</div>
                      <div className="text-xs">290,452.05 บาท</div>
                    </div>
                    <div className="flex justify-between px-3 py-1">
                      <div className="text-xs">ค่าพลังงานไฟฟ้า</div>
                      <div className="text-xs">1,358,182.57 บาท</div>
                    </div>
                    <div className="flex justify-between px-3 py-1 font-bold">
                      <div className="text-xs">รวมค่าใช้ไฟฟ้า</div>
                      <div className="text-xs">1,648,634.62 บาท</div>
                    </div>
                    <div className="flex justify-between px-3 py-1">
                      <div className="text-xs">ค่าบริการ</div>
                      <div className="text-xs">300 บาท</div>
                    </div>
                    <div className="flex justify-between px-3 py-1">
                      <div className="text-xs">ภาษีมูลค่าเพิ่ม 7%</div>
                      <div className="text-xs">115,425.42 บาท</div>
                    </div>
                    <div className="flex justify-between px-3 py-1 font-bold">
                      <div className="text-xs">รวมค่าบริการไฟฟ้าทั้งสิ้น</div>
                      <div className="text-xs">1,764,360.04 บาท</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 px-2">
                  <p className="font-semibold text-sm text-enzy-dark mb-2 text-center">
                    สัดส่วนค่าใช้พลังงานไฟฟ้า
                  </p>
                  <div className="flex items-center justify-around">
                    <div
                      id="chartThree"
                      className="mx-auto flex justify-center"
                    >
                      <ReactApexChart
                        options={options}
                        series={state.series}
                        type="pie"
                        width={300}
                        height={300}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div style={{ pageBreakAfter: "always" }}> </div> */}
          {/* ข้อมูลการใช้พลังงานไฟฟ้า */}
          <div className="mt-5 px-3 break-before-page">
            <div className="border-slate-100 rounded-lg">
              <p className="font-semibold text-sm text-enzy-dark mb-2">
                ข้อมูลการใช้พลังงานไฟฟ้า
              </p>
              <div className="rounded-lg border">
                <div className="grid grid-cols-8 text-center border-b rounded-t-lg bg-slate-100 p-2 font-bold">
                  <div className="col-span-1"></div>
                  <div className="col-span-2 text-xs">Peak Demand</div>
                  <div className="col-span-5 text-xs">Energy</div>
                </div>
                <div className="grid grid-cols-8 text-center p-2 border-b font-medium">
                  <div></div>
                  <div className="text-xs">Time</div>
                  <div className="text-xs">15 min. Abg. (kW)</div>
                  <div className="text-xs">On-Peak (kWh)</div>
                  <div className="text-xs">Off-Peak (kWh)</div>
                  <div className="text-xs">Total (kWh)</div>
                  <div className="text-xs">Total (THB)</div>
                  <div className="text-xs">Average (THB/kWh)</div>
                </div>
                {sampleEnergyDetail &&
                  sampleEnergyDetail.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-8 text-center p-2 border-b"
                    >
                      <div className="text-xs">{item.date}</div>
                      <div className="text-xs">{item.peak_time}</div>
                      <div className="text-xs">{item.peak_avg_in_15min}</div>
                      <div className="text-xs">{item.energy_onpeak}</div>
                      <div className="text-xs">{item.energy_offpeak}</div>
                      <div className="text-xs">{item.energy_total_kwh}</div>
                      <div className="text-xs">{item.energy_total_baht}</div>
                      <div className="text-xs">{item.energy_avg}</div>
                    </div>
                  ))}

                <div className="grid grid-cols-8 text-center p-2 border-b font-bold bg-slate-100">
                  <div className="text-xs">Peak</div>
                  <div></div>
                  <div className="text-xs">2134.00</div>
                  <div className="col-span-5"></div>
                </div>
                <div className="grid grid-cols-8 text-center p-2 border-b font-bold bg-slate-100">
                  <div className="text-xs">Total</div>
                  <div></div>
                  <div></div>
                  <div className="text-xs">211,010.00</div>
                  <div className="text-xs">251,010.00</div>
                  <div className="text-xs">462,010.00</div>
                  <div></div>
                  <div className="text-xs">Total Cost</div>
                </div>
                <div className="grid grid-cols-8 text-center p-2 border-b font-bold bg-slate-100">
                  <div className="text-xs">Cost</div>
                  <div></div>
                  <div className="text-xs">283,672.62</div>
                  <div className="col-span-3"></div>
                  <div className="text-xs">283,672.62</div>
                  <div className="text-xs">283,672.62</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
