"use client";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { BiDownload, BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import Image from "next/image";
import dynamic from "next/dynamic";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function SummaryFlatDetail({
  title,
  dataSummary,
  isPDF = false,
  selectedBranch = null,
  selectedMonth = null,
  selectedYear = null,
}) {
  const [chartData, setChartData] = useState({});
  const total = parseFloat(dataSummary?.cost?.total.replaceAll(",", ""));
  const energy = parseFloat(dataSummary?.cost?.energy.replaceAll(",", ""));
  const demand = parseFloat(dataSummary?.cost?.peakDemand.replaceAll(",", ""));
  const percentEnergy = Number(parseFloat((energy / total) * 100).toFixed(2));
  const percentPeakDemand = Number(
    parseFloat((demand / total) * 100).toFixed(2)
  );

  useEffect(() => {
    setChartData({
      series: [percentEnergy, percentPeakDemand],
    });
  }, [percentEnergy, percentPeakDemand]);

  const options = {
    colors: ["#002060", "#FFA70B"],
    labels: ["ค่าพลังงานไฟฟ้า", "ค่าความต้องการไฟฟ้า"],
    legend: {
      show: true,
      position: "bottom",
    },
    chart: {
      animations: {
        enabled: !isPDF,
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

  // const download = () => {
  //   const div = document.getElementById('div_summaryPDF');
  //   const pdf = new jsPDF();

  //   html2canvas(div).then((canvas) => {
  //     const now = dayjs();
  //     const datetimeNow = now.format("YYYYMMDDHHmmss");

  //     const imgData = canvas.toDataURL('image/png');
  //     pdf.addImage(imgData, 'JPEG', 0, 0);
  //     pdf.save(`summary_${month.month}_${year}_${datetimeNow}.pdf`);
  //   });
  // }

  const download = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/report/pdf/usageSummary/${selectedBranch}?year=${selectedYear}&month=${selectedMonth}`
    );
  };
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      {!isPDF && (
        <button
          className="bg-[#F7D555] text-sm font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => download()}
        >
          <div className="flex items-center gap-2">
            <BiDownload className="h-5 w-5" />
            <span className="text-xs">Download</span>
          </div>
        </button>
      )}

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
                  รายงานสรุปค่าไฟฟ้า{title}
                </div>
                {/* <div className="text-sm">{title}</div> */}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-10 gap-4 px-3">
            <div className="col-span-1 xl:col-span-6 border-0 border-slate-100 mt-5 rounded-lg">
              <div className="p-0">
                <div className="flex flex-col gap-4">
                  <div className="border-2 border-slate-100 rounded-lg p-4">
                    <p className="font-semibold text-sm text-enzy-dark mb-2">
                      อัตราค่าไฟฟ้า
                    </p>
                    <div>
                      <div className="flex justify-between px-3 py-1">
                        <div className="text-xs">
                          150 หน่วยแรก (หน่วยที่ 0 - 150)
                        </div>
                        <div className="text-xs">
                          {dataSummary?.variables?.flat_rate_level_1_cost} บาท /
                          kWh
                        </div>
                      </div>
                      <div className="flex justify-between px-3 py-1">
                        <div className="text-xs">
                          250 หน่วยต่อไป (หน่วยที่ 151 - 400)
                        </div>
                        <div className="text-xs">
                          {dataSummary?.variables?.flat_rate_level_2_cost} บาท /
                          kWh
                        </div>
                      </div>
                      <div className="flex justify-between px-3 py-1">
                        <div className="text-xs">
                          เกิน 400 หน่วยขึ้นไป (หน่วยที่ 401 เป็นต้นไป)
                        </div>
                        <div className="text-xs">
                          {dataSummary?.variables?.flat_rate_level_3_cost} บาท /
                          kWh
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="border-2 border-slate-100 rounded-lg p-4"> */}
                  <div className="border-slate-100  rounded-lg">
                    <p className="font-semibold text-sm text-enzy-dark mb-2">
                      ค่าใช้ไฟฟ้าตามปริมาณหน่วยไฟฟ้า
                    </p>
                    <div className="rounded-lg border">
                      <div className="grid grid-cols-3 text-center border-b rounded-t-lg bg-slate-100 dark:bg-slate-600 p-2">
                        <div className="col"></div>
                        <div className="col text-xs font-medium">
                          จำนวนหน่วย (kWh)
                        </div>
                        <div className="col text-xs font-medium">
                          จำนวนเงิน (บาท)
                        </div>
                      </div>
                      <div
                        className={classNames({
                          "grid grid-cols-3 text-center text-xs p-2 border-b": true,
                          "text-2xs": isPDF,
                        })}
                      >
                        <div className="">ค่าพลังงานไฟฟ้า</div>
                        <div className="">{dataSummary?.energy?.total}</div>
                        <div className="">{dataSummary?.cost?.energy}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 xl:col-span-4 border-2 border-slate-100 mt-5 rounded-lg">
              <div className="p-3">
                <div className="p-2 rounded-lg">
                  <div className="bg-primary dark:bg-slate-600 px-3 py-1 rounded-t-lg">
                    <p className="font-normal text-sm text-white">
                      สรุปค่าไฟฟ้า
                    </p>
                  </div>

                  <div className="bg-slate-100 dark:bg-dark-box rounded-b-lg py-3">
                    <div className="flex justify-between px-3 py-1">
                      <div className="text-xs">ค่าพลังงานไฟฟ้า</div>
                      <div className="text-xs">
                        {dataSummary?.cost?.energy} บาท
                      </div>
                    </div>

                    <div className="flex justify-between px-3 py-1">
                      <div className="text-xs">ค่าบริการ</div>
                      <div className="text-xs">
                        {dataSummary?.cost?.service} บาท
                      </div>
                    </div>
                    <div className="flex justify-between px-3 py-1">
                      <div className="text-xs">ภาษีมูลค่าเพิ่ม 7%</div>
                      <div className="text-xs">
                        {dataSummary?.cost?.vat} บาท
                      </div>
                    </div>
                    <div className="flex justify-between px-3 py-1 font-bold">
                      <div className="text-xs">รวมค่าบริการไฟฟ้าทั้งสิ้น</div>
                      <div className="text-xs">
                        {dataSummary?.cost?.totalIncVat} บาท
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
