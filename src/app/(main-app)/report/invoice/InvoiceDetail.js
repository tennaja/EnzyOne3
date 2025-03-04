"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import classNames from "classnames";
import { unique } from "@/utils/function";
import { RiBillLine } from "react-icons/ri";
import { BiDownload } from "react-icons/bi";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import Image from 'next/image'
import { getInvoicePDF } from "@/utils/api";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


export default function InvoiceDetail({ month, year }) {
  console.log(month.month)
  console.log(year)

  const [dataPDF, setDataPDF] = useState({
    month: 'พฤศจิกายน',
    year: '2566'
  })

  const download = () => {
    const div = document.getElementById('div_invoicePDF');
    const pdf = new jsPDF();

    html2canvas(div).then((canvas) => {
      const now = dayjs();
      const datetimeNow = now.format("YYYYMMDDHHmmss");

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'JPEG', 0, 0);
      pdf.save(`invoice_${month.month}_${year}_${datetimeNow}.pdf`);
    });
  }

  // const download = async () => {
  // const pdf = new jsPDF();

  // getInvoicePDF(year, month.month).then((result) => {
  //   console.log('getInvoicePDF')
  //   console.log(result)
  // });
  // }

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <button
        className="bg-[#F7D555] text-sm font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={() => download()}>
        <div className="flex items-center gap-2">
          <BiDownload className="h-5 w-5" />
          <span className="text-xs">Download</span>
        </div>
      </button>

      <div className="flex flex-col gap-4" id="div_invoicePDF" style={{ width: 800 }}>

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
                <div className="font-semibold text-lg text-enzy-dark">ใบแจ้งค่าใช้บริการสำหรับลูกค้าประเภท GSA รายเดือน</div>
                <div className="text-sm">ประจำเดือน {month.name} {year}  (งวด 4 / 180)</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-8 gap-4 px-3">
            <div className="col-span-1 xl:col-span-5 mt-5 border-2 border-slate-100 rounded-lg">
              <div className="flex flex-col gap-4 ">
                <div>
                  <div className="bg-slate-100 px-3 py-2 ">
                    <p className="font-normal text-sm">ข้อมูลผู้ใช้บริการ</p>
                  </div>

                  <div className="flex flex-col xl:flex-row gap-4 p-3 border-slate-100">
                    <div>
                      <p className="font-semibold text-sm text-enzy-dark mb-2">ผู้ใช้บริการ</p>
                      <div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">ชื่อ-สกุล</div>
                          <div className="text-xs">นายกอไก่ ขอไข่</div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">ที่อยู่</div>
                          <div className="text-xs">55 , Moo. 6 ,Thung Song-Huai Yot Rd. , Tambon Thi Wang, Amphoe Thung Song,</div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">เลขประจำตัวผู้เสียภาษีอากร</div>
                          <div className="text-xs">14567890099754</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 xl:border-l border-slate-100 xl:pl-4 xl:pt-0 xl:border-t-0">
                      <p className="font-semibold text-sm text-enzy-dark mb-2">รายละเอียดสัญญา</p>
                      <div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">เลขที่สัญญา</div>
                          <div className="text-xs">10-001-1010</div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">ชื่อสัญญา</div>
                          <div className="text-xs">สัญญาให้บริการบริหารจัดการพลังงานไฟฟ้า โดยระบบผลิตไฟฟ้าพลังงานหมุนเวียนแบบรับประกันผลงานในพื้นที่</div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">ค่าบริการรายเดือน</div>
                          <div className="text-xs">14,000 บาท</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 xl:col-span-3 border-2 border-slate-100 mt-5 rounded-lg">
              <div className="p-0">

                <div className="p-2 rounded-lg">
                  <div className="bg-primary px-3 py-1 rounded-t-lg">
                    <p className="font-normal text-sm text-white">สรุปค่าบริการ</p>
                  </div>

                  <div className="bg-slate-100 rounded-b-lg py-3">
                    <div className="flex justify-between px-3 py-1">
                      <div className="text-xs">ค่าบริการรายเดือน</div>
                      <div className="text-xs">14,000 บาท</div>
                    </div>
                    <div className="flex justify-between px-3 py-1">
                      <div className="text-xs">ภาษีมูลค่าเพิ่ม 7%</div>
                      <div className="text-xs">980 บาท</div>
                    </div>
                    <div className="flex justify-between px-3 py-1 font-bold">
                      <div className="text-xs">รวมค่าบริการรายเดือน</div>
                      <div className="text-xs">14,900 บาท</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 px-2">
                  <p className="font-semibold text-sm text-enzy-dark mb-2">การชำระเงิน</p>
                  <div className="flex items-center justify-around">
                    <Image
                      src="/images/barcode-sample.png"
                      alt="" height={150} width={150}
                    />
                    <Image
                      src="/images/qrcode-sample.png"
                      alt="" height={50} width={50}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* รายละเอียดการให้บริการ */}
          <div className="mt-5 px-3">
            <div className="bg-slate-100 px-3 py-2 rounded-t-lg">
              <p className="font-normal text-sm">รายละเอียดการใช้บริการ</p>
            </div>

            <div className="border-x-2 border-b-2 border-slate-100 p-3 rounded-b-lg">
              <div className="flex justify-between px-3 py-1">
                <div className="text-xs">ค่าบริการงวดที่</div>
                <div className="text-xs">4 / 180</div>
              </div>
              <div className="flex justify-between px-3 py-1">
                <div className="text-xs">รอบการคิดบริการ</div>
                <div className="text-xs">1 พ.ค. 2566 - 31 พ.ค. 2566</div>
              </div>
              <div className="flex justify-between px-3 py-1">
                <div className="text-xs">จำนวนหน่วยไฟฟ้าตามการรับประกัน</div>
                <div className="text-xs">5,100 บาท</div>
              </div>
              <div className="flex justify-between px-3 py-1">
                <div className="text-xs">วัน-เวลา ที่อ่านหน่วย</div>
                <div className="text-xs">31 พ.ค. 2566 เวลา 12:30 น.</div>
              </div>
              <div className="flex justify-between px-3 py-1">
                <div className="text-xs">จำนวนหน่วยไฟฟ้าที่ผลิตได้</div>
                <div className="text-xs">4,257 บาท</div>
              </div>
              <div className="flex justify-between px-3 py-1">
                <div className="text-xs">เกินเกณฑ์/ต่ำเกณฑ์ รายเดือน</div>
                <div className="flex gap-4 items-center">
                  <BiSolidDownArrow className="text-red-500" />
                  <span className="text-xs">ต่ำเกณฑ์ 843 หน่วย</span>
                </div>
              </div>
              <div className="flex justify-between px-3 py-1">
                <div className="text-xs">เกินเกณฑ์/ต่ำเกณฑ์ สะสมรายปี</div>
                <div className="flex gap-4 items-center">
                  <BiSolidUpArrow className=" text-green-500" />
                  <span className="text-xs">เกินเกณฑ์ 214 หน่วย</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
