"use client";
import React, { useEffect, useState } from "react";

import { unique } from "@/utils/function";

import { BiDownload } from "react-icons/bi";

import Image from "next/image";
import { Table } from "@mantine/core";

import "../css/style.css";

const tableData = [
  {
    id: 1,
    date: "1 มิ.ย. 2567",
    energy: "5,371.27",
    actual: "1,102.46",
    estimate: "2,146.28",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(51.37%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 2,
    date: "2 มิ.ย. 2567",
    energy: "4,360.76",
    actual: "939.28",
    estimate: "1,742.49",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(53.90%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 3,
    date: "3 มิ.ย. 2567",
    energy: "4,731.43",
    actual: "900.09",
    estimate: "1,890.61",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "วันหยุดนักขัตฤกษ์",
  },
  {
    id: 4,
    date: "4 มิ.ย. 2567",
    energy: "5,166.13",
    actual: "1,098.33",
    estimate: "2,064.31",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(53.21%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 5,
    date: "5 มิ.ย. 2567",
    energy: "4,746.47",
    actual: "1,190.42",
    estimate: "1,896.62",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 6,
    date: "6 มิ.ย. 2567",
    energy: "5,599.76",
    actual: "1,196.09",
    estimate: "2,237.58",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(53.45%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 7,
    date: "7 มิ.ย. 2567",
    energy: "4,876.78",
    actual: "1,055.46",
    estimate: "1,948.68",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(54.16%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 8,
    date: "8 มิ.ย. 2567",
    energy: "5,323.35",
    actual: "1,184.49",
    estimate: "2,127.13",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(55.69%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 9,
    date: "9 มิ.ย. 2567",
    energy: "5,448.34",
    actual: "1,300.22",
    estimate: "2,177.07",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(59.72%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 10,
    date: "10 มิ.ย. 2567",
    energy: "3,799.88",
    actual: "1,066.15",
    estimate: "1,518.37",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 11,
    date: "11 มิ.ย. 2567",
    energy: "4,794.82",
    actual: "1,262.48",
    estimate: "1,915.93",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 12,
    date: "12 มิ.ย. 2567",
    energy: "4,092.61",
    actual: "950.43",
    estimate: "1,635.34",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(58.12%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 13,
    date: "13 มิ.ย. 2567",
    energy: "6,998.64",
    actual: "1,560.04",
    estimate: "2,796.55",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(55.78%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 14,
    date: "14 มิ.ย. 2567",
    energy: "6,620.03",
    actual: "1,553.26",
    estimate: "2,645.26",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(58.72%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 15,
    date: "15 มิ.ย. 2567",
    energy: "6,656.19",
    actual: "1,258.90",
    estimate: "2,659.71",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(47.33%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 16,
    date: "16 มิ.ย. 2567",
    energy: "6,973.17",
    actual: "1,096.18",
    estimate: "2,786.37",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(39.34%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 17,
    date: "17 มิ.ย. 2567",
    energy: "5,776.86",
    actual: "1,385.98",
    estimate: "2,308.34",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 18,
    date: "18 มิ.ย. 2567",
    energy: "6,292.18",
    actual: "1,178.38",
    estimate: "2,514.26",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(46.87%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 19,
    date: "19 มิ.ย. 2567",
    energy: "6,146.73",
    actual: "1,557.58",
    estimate: "2,456.14",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 20,
    date: "20 มิ.ย. 2567",
    energy: "6,495.80",
    actual: "1,381.24",
    estimate: "2,595.62",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(53.21%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 21,
    date: "21 มิ.ย. 2567",
    energy: "5,862.23",
    actual: "1,715.17",
    estimate: "2,342.45",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 22,
    date: "22 มิ.ย. 2567",
    energy: "5,903.44",
    actual: "1,940.72",
    estimate: "2,358.92",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 23,
    date: "23 มิ.ย. 2567",
    energy: "4,557.49",
    actual: "980.77",
    estimate: "1,821.10",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(53.86%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 24,
    date: "24 มิ.ย. 2567",
    energy: "4,010.94",
    actual: "1,336.10",
    estimate: "1,602.71",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 25,
    date: "25 มิ.ย. 2567",
    energy: "4,030.88",
    actual: "1,090.98",
    estimate: "1,610.68",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 26,
    date: "26 มิ.ย. 2567",
    energy: "3,079.84",
    actual: "866.41",
    estimate: "1,230.66",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 27,
    date: "27 มิ.ย. 2567",
    energy: "5,662.34",
    actual: "1,147.13",
    estimate: "2,262.58",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(50.70%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 28,
    date: "28 มิ.ย. 2567",
    energy: "5,947.59",
    actual: "1,438.65",
    estimate: "2,376.56",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "-",
  },
  {
    id: 29,
    date: "29 มิ.ย. 2567",
    energy: "4,248.04",
    actual: "935.98",
    estimate: "1,697.45",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(55.14%) ต่ำกว่าที่ระบุในสัญญา",
  },
  {
    id: 30,
    date: "30 มิ.ย. 2567",
    energy: "5,343.49",
    actual: "948.92",
    estimate: "2,135.18",
    onPeak: "-",
    offPeak: "-",
    holiday: "-",
    remark: "(44.44%) ต่ำกว่าที่ระบุในสัญญา",
  },
];
export default function BillingDetailForm2({
  invoiceData,
  summaryData,
  isPDF = false,
  selectedCustomer,
  selectedYear,
  selectedMonth,
}) {
  const [dataPDF, setDataPDF] = useState({
    month: "พฤศจิกายน",
    year: "2566",
  });

  const download = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/report/pdf/mock-billing/ScanInter`
    );
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center bg-slate-50">
      {!isPDF && (
        <>
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
        </>
      )}

      <div
        className="flex flex-col gap-4"
        id="div_invoicePDF"
        style={{ width: 800 }}
      >
        <div className="rounded-xl bg-white p-3 pb-10 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
          {/* bill */}
          <div className="grid grid-cols-12 p-3 gap-2 items-center">
            <div className="col-span-8">
              <div>
                <div className="text-left text-xs mt-3 mb-1 leading-tight">
                  บริษัท สแกน แอดวานซ์ เพาเวอร์ จำกัด<br></br>
                  SCAN ADVANCE POWER CO., LTD.<br></br>
                  ห้อง 2304, ชั้น 23, เลขที่ 202 อาคารเดอคองคอร์ด
                  <br></br>
                  ถ.รัชดาภิเษก เขตห้วยขวาง แขวงห้วยขวาง กรุงเทพมหานคร 10310
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 p-3 gap-2 items-center">
            <div className="col-start-7 col-span-6">
              <div>
                <div className="text-left text-xs mt-3 mb-1 leading-tight">
                  ใบวางบิล
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 p-3 gap-5 items-center">
            <div className="col-span-6">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-2">
                  <div className="text-left text-xs">เรียน</div>
                </div>
                <div className="col-span-10">
                  <div className="text-left text-xs">
                    ท่านผู้จัดการฝ่ายบัญชี/ฝ่ายซื้อ
                  </div>
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-10">
                  <div className="text-left text-xs">
                    บริษัท ห้องเย็นท่าข้าม จำกัด สำนักงานใหญ่ 369 หมู่ 4
                    ต.บางโทรัด อ.เมืองสมุทรสาคร จ.สมุทรสาคร 74000
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-span-6">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <div className="text-left text-xs">เลขที่วางบิล</div>
                </div>
                <div className="col-span-8">
                  <div className="text-left text-xs">BI670176</div>
                </div>
                <div className="col-span-4">
                  <div className="text-left text-xs">วันที่</div>
                </div>
                <div className="col-span-8">
                  <div className="text-left text-xs">03/07/2024</div>
                </div>
                <div className="col-span-4">
                  <div className="text-left text-xs">เงื่อนไขการชำระเงิน</div>
                </div>
                <div className="col-span-8">
                  <div className="text-left text-xs">เครดิต 30 วัน</div>
                </div>
              </div>
            </div>
          </div>

          {/* ตาราง bill */}

          <div className="mt-5 border-slate-100 rounded-lg">
            <div className="rounded-lg border">
              <Table withColumnBorders>
                <Table.Thead className="bg-slate-100 dark:bg-slate-600 ">
                  <Table.Tr className=" text-xs font-bold">
                    <Table.Th className="text-center">ลำดับ</Table.Th>
                    <Table.Th className="text-center">
                      เลขที่ใบแจ้งหนี้
                    </Table.Th>
                    <Table.Th className="text-center">วันที่</Table.Th>
                    <Table.Th className="text-center">จำนวนเงิน</Table.Th>
                    <Table.Th className="text-center">VAT 7%</Table.Th>
                    <Table.Th className="text-center">รวมเงิน</Table.Th>
                    <Table.Th className="text-center">กำหนดชำระเงิน</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="">
                  <Table.Tr className="text-center text-xs h-64 align-top">
                    <Table.Td>1</Table.Td>
                    <Table.Td>IV67-000201</Table.Td>
                    <Table.Td>30/06/2024</Table.Td>
                    <Table.Td className="text-right">113,233.35</Table.Td>
                    <Table.Td className="text-right">7,926.33</Table.Td>
                    <Table.Td className="text-right">121,159.68</Table.Td>
                    <Table.Td className="text-center">02/08/2024</Table.Td>
                  </Table.Tr>
                  <Table.Tr className="text-xs">
                    <Table.Td colSpan={3}>ยอดรวม</Table.Td>
                    <Table.Td className="text-right">113,233.35</Table.Td>
                    <Table.Td className="text-right">7,926.33</Table.Td>
                    <Table.Td className="text-right">121,159.68</Table.Td>
                    <Table.Td></Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={7} className="font-bold text-xs">
                      หนึ่งแสนสองหมื่นหนึ่งพันหนึ่งร้อยห้าสิบเก้าบาทหกสิบแปดสตางค์
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr className="">
                    <Table.Td colSpan={7}>
                      <div className="grid grid-cols-7 h-10">
                        <div className="flex col-span-5 justify-center items-center">
                          จ่ายสุทธิ (Net Amount)
                        </div>
                        <div className="flex col-span-2 text-right  items-center underline">
                          121,159.68
                        </div>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <div className="flex flex-col gap-3">
                        <div className="text-xs">
                          หมายเหตุ: กรุณาเซ็นต์รับและส่งกลับ E-mail:
                          natthapat@scanadvancepower.com
                        </div>
                        <div className="text-xs">
                          หากมีข้อสงสัยกรุณาติดต่อ คุณมด โทร.02-5034116-21 ต่อ
                          408
                        </div>
                        <div className="mt-5 grid grid-cols-12">
                          <div className=" gap-3 col-span-6">
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-6">ชื่อผู้รับวางบิล</div>
                              <div className="col-span-6">
                                ...........................
                              </div>
                              <div className="col-span-6">วันที่รับ</div>
                              <div className="col-span-6">
                                ......../......../........
                              </div>
                              <div className="col-span-6">วันที่นัดรับเช็ค</div>
                              <div className="col-span-6">
                                ......../......../........
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3 col-span-6">
                            <div>ในนาม บริษัท สแกน แอดวานซ์ เพาเวอร์ จำกัด</div>
                            <div>
                              ชื่อผู้วางบิล{" "}
                              <span className="underline">ณัฐพัชร์</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
          </div>

          <div className="flex justify-center mt-5 break-before-page">
            <p className="font-semibold text-lg text-enzy-dark mt-5 ">
              ใบแจ้งค่าบริการ
            </p>
          </div>
          <div className="grid grid-cols-12 p-3 gap-2 items-center">
            <div className="col-span-2">
              <Image
                src={"/images/logo/logo-scaninter.png"}
                alt=""
                height={100}
                width={150}
              />
            </div>

            <div className="col-span-6">
              <div>
                <div className="text-left text-xs mt-3 mb-1 leading-tight">
                  บริษัท สแกน แอดวานซ์ เพาเวอร์ จำกัด<br></br>
                  SCAN ADVANCE POWER CO., LTD.<br></br>
                  ห้อง 2304, ชั้น 23, เลขที่ 202 อาคารเดอคองคอร์ด ถนนรัชดาภิเษก
                  <br></br>
                  เขตห้วยขวาง แขวงห้วยขวาง กรุงเทพมหานคร 10310<br></br>
                  โทรศัพท์ 02-503-4116-21 โทรสาร 02-503-4116-21 ต่อ 500<br></br>
                  (เลขประจำตัวผู้เสียภาษี: 0125562010495) สำนักงานใหญ่
                </div>
              </div>
            </div>
            <div className="col-span-4 ">
              <div className="flex justify-end">
                <div className="text-right text-xs sm mt-1 mb-2 leading-tight">
                  Invoice No.
                </div>
                <div className="w-32 text-right text-xs sm mt-1 mb-2 leading-tight"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 px-3">
            <div className="col-span-12 mt-5 border-2 border-slate-100 rounded-lg">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="bg-slate-100 px-3 py-2">
                    <p className="font-semibold text-sm">ข้อมูลผู้ใช้บริการ</p>
                  </div>
                  <div className="flex  flex-col gap-3 p-3 border-slate-100">
                    <div className="grid grid-cols-3">
                      <div className="flex col-span-2 pb-2 gap-3">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-3 text-xs text-slate-500">
                            ชื่อลูกค้า/ที่อยู่
                          </div>
                          <div className="col-span-9 text-xs">
                            บริษัท ห้องเย็นท่าข้าม จำกัด สำนักงานใหญ่<br></br>
                            369 หมู่ที่ 4 ต.บางโทรัด อ.เมืองสมุทรสาคร
                            จ.สมุทรสาคร 74000
                          </div>
                          <div className="col-span-3 text-xs text-slate-500">
                            ชื่อผู้ประสานงาน
                          </div>
                          <div className="col-span-9 text-xs">
                            คุณแคท Tel. 063-1921237 Email
                            thakamcold.cat369@gmail.com
                          </div>
                          <div className="col-span-3 text-xs text-slate-500">
                            ชื่อโครงการ
                          </div>
                          <div className="col-span-9 text-xs">
                            โครงการระบบผลิตพลังงานไฟฟ้าจากพลังงานแสงอาทิตย์แบบติดตั้งบนหลังคา
                            (Solar PV Rooftop) ขนาด 511.56 kW
                          </div>
                        </div>
                      </div>
                      <div className="flex col-span-1 pb-2 gap-3">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-6 text-xs text-slate-500">
                            Tel
                          </div>
                          <div className="col-span-6 text-xs">0-3443-4152</div>
                          <div className="col-span-6 text-xs text-slate-500">
                            เลขประจำตัวผู้เสียภาษี
                          </div>
                          <div className="col-span-6 text-xs">
                            0105532016274
                          </div>
                          <div className="col-span-12"></div>
                          <div className="col-span-12"></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <div className="grid grid-cols-2">
                        <div className="text-xs text-slate-500">
                          เลขที่สัญญา
                        </div>
                        <div className="text-xs">003/2563</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className=" text-xs text-slate-500">ลงวันที่</div>
                        <div className=" text-xs">28 มกราคม 2563</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className=" text-xs text-slate-500">อายุสัญญา</div>
                        <div className=" text-xs">15 ปี (180 เดือน)</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="flex flex-col items-center justify-between gap-1">
                        <div className="text-xs text-slate-500">
                          รหัสหมายเลขผู้ใช้ไฟฟ้า
                        </div>
                        <div className="text-xs text-slate-500">(Ref. No)</div>
                        <div className="text-xs">2003197265</div>
                      </div>
                      <div className="flex flex-col items-center justify-between gap-1">
                        <div className=" text-xs text-slate-500">
                          วัน - เวลาอ่านหน่วย
                        </div>
                        <div className=" text-xs text-slate-500">
                          (Meter Reading Date)
                        </div>
                        <div className=" text-xs">01 กรกฎาคม เวลา 00:01 น.</div>
                      </div>
                      <div className="flex flex-col items-center justify-between gap-1">
                        <div className=" text-xs text-slate-500">
                          ประจำเดือน
                        </div>
                        <div className=" text-xs text-slate-500">
                          (Bill Period)
                        </div>
                        <div className=" text-xs">มิถุนายน 2567</div>
                      </div>
                      <div className="flex flex-col items-center justify-between gap-1">
                        <div className=" text-xs text-slate-500">
                          ประจำงวดที่
                        </div>

                        <div className=" text-xs">44/180</div>
                      </div>
                    </div>

                    <div className="border-t pt-4 xl:border-l border-slate-100 xl:pl-4 xl:pt-0 xl:border-t-0 "></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* การชำระเงิน*/}
          <div className="mt-5 px-3">
            <div className="bg-slate-100 px-3 py-2 rounded-t-lg">
              <p className="font-semibold text-sm">การชำระเงิน</p>
            </div>
            <div className="grid grid-cols-12 border-x-2 border-b-2 border-slate-100 p-3 rounded-b-lg">
              <div className="flex flex-col col-span-8 gap-3">
                <div className="flex flex-col">
                  <div className="text-xs text-slate-500">
                    เงื่อนไขการชำระเงิน (Term of Payment)
                  </div>
                  <div className="text-xs">
                    ชำระค่าบริการภายใน 30 วันหลังจากวันที่ระบุในใบเรียกเก็บเงิน
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-slate-500">
                    เงื่อนไขการเรียกเก็บเงิน (Billing Term)
                  </div>
                  <div className="text-xs">
                    กำหนดชำระค่าบริการภายใน 30
                    วันนับจากวันที่ระบุในใบเรียกเก็บเงินหากกำหนดดังกล่าวตรงกับวันหยุดเสาร์
                    - อาทิตย์ หรือวันหยุดราชการ
                    ลูกค้าสามารถชำระเงินได้ในวันทำการถัดไป
                  </div>
                </div>
              </div>

              <div className="flex flex-col col-span-4 gap-3 justify-center">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-slate-500">
                    วันครบกำหนด (Due Date)
                  </div>
                  <div className="text-xs">ชำระเงินภายใน</div>
                  <div className="text-xs">30 กรกฎาคม 2567</div>
                </div>
              </div>
            </div>
          </div>

          {/* ตารางปริมาณการใช้ไฟ */}
          <div className="mt-5 px-3">
            <div className="border-slate-100 rounded-lg">
              <div className="rounded-lg border">
                <Table withColumnBorders>
                  <Table.Thead className="bg-slate-100 dark:bg-slate-600 ">
                    <Table.Tr className=" text-xs font-bold">
                      <Table.Th className="text-center">
                        รหัสเครื่องวัด
                      </Table.Th>
                      <Table.Th className="text-center">
                        ช่วงเวลาที่อ่านเครื่องวัด
                      </Table.Th>
                      <Table.Th className="text-center">
                        Time of Use Period
                      </Table.Th>
                      <Table.Th className="text-center">
                        เลขที่อ่านได้ครั้งนี้
                      </Table.Th>
                      <Table.Th className="text-center">
                        เลขที่อ่านได้ครั้งที่แล้ว
                      </Table.Th>
                      <Table.Th className="text-center">
                        ปริมาณการใช้ไฟฟ้าครั้งนี้
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td rowSpan={3}>2003197265</Table.Td>
                      <Table.Td rowSpan={3}>
                        01 มิถุนายน 2567 ถึง 30 มิถุนายน 2567
                      </Table.Td>
                      <Table.Td>On Peak</Table.Td>
                      <Table.Td className="text-right">1,525,724.99</Table.Td>
                      <Table.Td className="text-right">1,505,639.47</Table.Td>
                      <Table.Td className="text-right">20,031.52</Table.Td>
                    </Table.Tr>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td>Off Peak</Table.Td>
                      <Table.Td className="text-right">183,694.79</Table.Td>
                      <Table.Td className="text-right">179,696.03</Table.Td>
                      <Table.Td className="text-right">3,998.76</Table.Td>
                    </Table.Tr>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td>Holiday</Table.Td>
                      <Table.Td className="text-right">800,232.21</Table.Td>
                      <Table.Td className="text-right">787,644.18</Table.Td>
                      <Table.Td className="text-right">12,588.03</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
            </div>
          </div>

          {/* ตารางรวมเงิน */}
          <div className="mt-5 px-3">
            <div className="border-slate-100 rounded-lg">
              <div className="rounded-lg border">
                <Table withColumnBorders>
                  <Table.Tbody>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td rowSpan={2}>หมายเหตุ</Table.Td>
                      <Table.Td rowSpan={2} className="text-left text-2xs">
                        1.
                        จำนวนสะสมวันที่ผู้ประกอบการใช้พลังงานไฟฟ้าน้อยกว่าร้อยละ
                        60 ของไฟฟ้าที่ผลิตได้คือ 118 วัน
                        <br />
                        2.โปรดตรวจสอบรายการก่อนชำระเงิน
                        หากมีข้อสงสัยโปรดแจ้งภายใน 7 วัน
                        <br />
                        3.โปรดชำระเงินภายในวันที่กำหนดข้างต้นมิฉะนั้นบริษัทฯ
                        ขอสงวนสิทธิ์ในการคำนวณดอกเบี้ยอัตราร้อยละ 15 ต่อปี
                      </Table.Td>
                      <Table.Td>รวมเงิน</Table.Td>
                      <Table.Td className="text-right">113,233.35</Table.Td>
                    </Table.Tr>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td>ภาษีมูลค่าเพิ่ม 7%</Table.Td>
                      <Table.Td className="text-right">7,926.33</Table.Td>
                    </Table.Tr>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td colSpan={2}>
                        หนึ่งแสนสองหมื่นหนึ่งพันหนึ่งร้อยห้าสิบเก้าบาทหกสิบแปดสตางค์
                      </Table.Td>
                      <Table.Td className="text-right">
                        รวมเงินค่าบริการ *****
                      </Table.Td>
                      <Table.Td className="text-right">121,159.68</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
            </div>
          </div>

          <div className="flex flex-col  mt-5 px-3  text-2xs text-slate-500">
            <div>
              การโอนเงินค่าไฟฟ้าเข้าบัญชีบริษัท สแกน แอดวานซ์ เพาเวอร์ จำกัด
            </div>
            <div>
              {`สามารถชำระผ่านบัญชี "ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย"
              เลขที่บัญชี 001-2-00764-9`}
            </div>
            <div>โดยการสแกนคิวอาร์โค้ด หรือ PAY-IN ผ่านเคาเตอร์ธนาคาร</div>
            <div>
              กรุณาส่งหลักฐานการชำระเงินมาที่ Email:
              natthapat@scanadvancepower.com Tel.02-5034116-21#408
            </div>
          </div>

          <div className="mt-5 px-3 break-before-page">
            {isPDF && (
              <div className="grid grid-cols-12 p-3 gap-2 items-center mb-5">
                <div className="col-span-2">
                  <Image
                    src={"/images/logo/logo-scaninter.png"}
                    alt=""
                    height={100}
                    width={150}
                  />
                </div>

                <div className="col-span-6">
                  <div>
                    <div className="text-left text-xs mt-3 mb-1 leading-tight">
                      บริษัท สแกน แอดวานซ์ เพาเวอร์ จำกัด<br></br>
                      SCAN ADVANCE POWER CO., LTD.<br></br>
                      ห้อง 2304, ชั้น 23, เลขที่ 202 อาคารเดอคองคอร์ด
                      ถนนรัชดาภิเษก
                      <br></br>
                      เขตห้วยขวาง แขวงห้วยขวาง กรุงเทพมหานคร 10310<br></br>
                      โทรศัพท์ 02-503-4116-21 โทรสาร 02-503-4116-21 ต่อ 500
                      <br></br>
                      (เลขประจำตัวผู้เสียภาษี: 0125562010495) สำนักงานใหญ่
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* รายการคำนวณค่าไฟฟ้า */}
            <div className=" border-slate-100 rounded-lg">
              <div className="rounded-lg border">
                <Table>
                  <Table.Thead className="bg-slate-100 dark:bg-slate-600">
                    <Table.Tr className=" text-xs font-bold">
                      <Table.Th rowSpan={2} className="text-center">
                        Time of Use Period
                      </Table.Th>
                      <Table.Th rowSpan={2} className="text-center">
                        ปริมาณพลังงานไฟฟ้า (หน่วย)
                      </Table.Th>
                      <Table.Th colSpan={2} className="text-center">
                        อัตราค่าไฟฟ้าฐานรวมอัตราค่าไฟฟ้าผันแปร (บาท/หน่วย)
                      </Table.Th>
                      <Table.Th rowSpan={2} className="text-center ">
                        รวมเงิน (บาท)
                      </Table.Th>
                    </Table.Tr>
                    <Table.Tr className=" text-xs font-bold">
                      <Table.Th className="text-center">
                        ประจำเดือน มิถุนายน 2567
                      </Table.Th>
                      <Table.Th className="text-center">
                        พร้อมส่วนลด 20%
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td>On Peak</Table.Td>
                      <Table.Td className="">20,031.52</Table.Td>
                      <Table.Td className="">4.5811</Table.Td>
                      <Table.Td className="">3.6649</Table.Td>
                      <Table.Td className="">73,413.11</Table.Td>
                    </Table.Tr>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td>Off Peak</Table.Td>
                      <Table.Td className="">3,998.76</Table.Td>
                      <Table.Td className="">3.0009</Table.Td>
                      <Table.Td className="">2.4007</Table.Td>
                      <Table.Td className="">9,599.91</Table.Td>
                    </Table.Tr>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td>Holiday</Table.Td>
                      <Table.Td className="">12,588.03</Table.Td>
                      <Table.Td className="">3.0009</Table.Td>
                      <Table.Td className="">2.4007</Table.Td>
                      <Table.Td className="">30,220.33</Table.Td>
                    </Table.Tr>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td colSpan={4} className="text-center underline">
                        รวมค่าพลังงานไฟฟ้าหลังหักส่วนลด
                      </Table.Td>
                      <Table.Td className="text-center underline">
                        113,233.35
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
            </div>

            {/* รายละเอียดการผลิตไฟฟ้า */}
            <div className=" border-slate-100 rounded-lg mt-5">
              <div className="rounded-lg border">
                <Table>
                  <Table.Thead className="bg-slate-100 dark:bg-slate-600">
                    <Table.Tr className=" text-xs font-bold">
                      <Table.Th colSpan={4} className="text-center text-2xs">
                        รายละเอียดการผลิต
                        (จำนวนสะสมวันที่ผู้ประกอบการใช้พลังงานไฟฟ้าน้อยกว่าร้อยละ
                        60% ของยอดการประมาณที่ระบบสามารถผลิตได้ประจำงวดที่
                        43/180 คือ 18 วัน)
                      </Table.Th>
                      <Table.Th colSpan={3} className="text-center">
                        รายการแก้ไขพลังงานไฟฟ้ารายวัน (หน่วย)
                      </Table.Th>
                      <Table.Th rowSpan={3} className="text-center">
                        หมายเหตุ
                      </Table.Th>
                    </Table.Tr>
                    <Table.Tr className=" text-xs font-bold">
                      <Table.Th rowSpan={2} className="text-center">
                        วันที่
                      </Table.Th>
                      <Table.Th rowSpan={2} className="text-center">
                        พลังงานแสง (Wh/m2)
                      </Table.Th>
                      <Table.Th colSpan={2} className="text-center">
                        ปริมาณพลังงานไฟฟ้าจากมิเตอร์ (หน่วย)
                      </Table.Th>
                      <Table.Th className="text-center">On Peak</Table.Th>
                      <Table.Th className="text-center">Off Peak</Table.Th>
                      <Table.Th className="text-center">Holiday</Table.Th>
                    </Table.Tr>
                    <Table.Tr className=" text-xs font-bold">
                      <Table.Th className="text-center">
                        ที่เกิดขึ้นจริง
                      </Table.Th>
                      <Table.Th className="text-center">จากการประมาณ</Table.Th>
                      <Table.Th className="text-center">20,031.52</Table.Th>
                      <Table.Th className="text-center">3,998.76</Table.Th>
                      <Table.Th className="text-center">12,588.03</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {tableData.map((data, index) => (
                      <Table.Tr key={data.id} className="text-center text-xs ">
                        <Table.Td className="p-0 whitespace-nowrap">
                          {data.date}
                        </Table.Td>
                        <Table.Td className="p-0">{data.energy}</Table.Td>
                        <Table.Td className="p-0">{data.actual}</Table.Td>
                        <Table.Td className="p-0">{data.estimate}</Table.Td>
                        <Table.Td className="p-0">{data.onPeak}</Table.Td>
                        <Table.Td className="p-0">{data.offPeak}</Table.Td>
                        <Table.Td className="p-0">{data.holiday}</Table.Td>
                        <Table.Td className="text-2xs">{data.remark}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </div>

            {/* ตารางสรุปจำนวนวัน */}

            <div className=" border-slate-100 rounded-lg mt-5">
              <div className="rounded-lg border">
                <Table>
                  <Table.Thead className="bg-slate-100 dark:bg-slate-600">
                    <Table.Tr className=" text-xs font-bold">
                      <Table.Th className="text-center">ประจำงวดที่</Table.Th>
                      <Table.Th className="text-center">
                        จำนวนวันที่ใช้ไฟฟ้าต่ำกว่า 60%
                      </Table.Th>
                      <Table.Th className="text-center">
                        ตัวคูณเพิ่มระยะเวลาสัญญาในปีที่ 4
                      </Table.Th>
                      <Table.Th className="text-center">
                        จำนวนที่ถูกเพิ่มในงวดนี้
                      </Table.Th>
                      <Table.Th className="text-center">
                        จำนวนวันที่ถูกเพิ่มสะสมในงวดก่อนหน้า
                      </Table.Th>
                      <Table.Th className="text-center">
                        จำนวนวันที่ถูกเพิ่มสะสม
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr className="text-center text-xs ">
                      <Table.Td>44/180</Table.Td>
                      <Table.Td>18</Table.Td>
                      <Table.Td>1</Table.Td>
                      <Table.Td>18</Table.Td>
                      <Table.Td>83</Table.Td>
                      <Table.Td>101</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
            </div>

            {/* หมายเหตุ */}

            <div className="flex gap-5 px-3 mt-5 text-2xs text-slate-500">
              <div className="font-bold">หมายเหตุ</div>
              <ol className="list-decimal">
                <li>
                  ปริมาณพลังงานไฟฟ้าที่ผลิตขึ้นจริงจะถูกควบคุมโดยอุปกรณ์ Zero
                  export
                </li>
                <li>
                  ปริมาณพลังงานไฟฟ้าจากการประมาณโดยคำนวณจาก Performance ratio
                  ตามทีร่ะบุใน private PPA (81.75%)
                </li>
                <li>
                  หากเกิดเหตุการณ์ผิดปกติที่ทำให้ยอดการใช้พลังงานไฟฟ้าไม่ตรงกับตัวเลขที่มิเตอร์บันทึกไว้
                  ยอดการใช้งานจะถูกปรับแก้ลงในตารางรายการแก้ไขพลังงานไฟฟ้ารายวัน
                </li>
                <li>
                  การขยายสัญญาจะเกิดขึ้นโดยอัตโนมัติตามสัญญา
                  หากไม่มีข้อโต้แย้งกลับมาใน 15 วัน
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
