"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import classNames from "classnames";
import { unique } from "@/utils/function";
import { RiBillLine } from "react-icons/ri";
import { BiDownload } from "react-icons/bi";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import Image from "next/image";
import { getInvoicePDF } from "@/utils/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoiceDetail({ month, year }) {
  console.log(month.month);
  console.log(year);

  const [dataPDF, setDataPDF] = useState({
    month: "พฤศจิกายน",
    year: "2566",
  });

  const download = () => {
    const div = document.getElementById("div_invoicePDF");
    const pdf = new jsPDF();

    html2canvas(div).then((canvas) => {
      const now = dayjs();
      const datetimeNow = now.format("YYYYMMDDHHmmss");

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save(`invoice_${month.month}_${year}_${datetimeNow}.pdf`);
    });
  };

  // const download = async () => {
  // const pdf = new jsPDF();

  // getInvoicePDF(year, month.month).then((result) => {
  //   console.log('getInvoicePDF')
  //   console.log(result)
  // });
  // }

  const seriesData = {
    id: 1,
    invoiceNumber: "INV-456",
    invoiceDate: "1 มิถุนายน 2567",
    year: "2567",
    month: "พฤษภาคม",
    transactionStartDate: "1 พฤษภาคม 2567",
    transactionEndDate: "31 พฤษภาคม 2567",
    subTotal: "194,412.85",
    vat: "13,608.90",
    grandTotal: "208,021.75",
    contract: {
      contractId: 1,
      contractNumber: "CN-101",
      contractName: "Solar PPA",
      contractPeriod: "มิถุนายน 2567 - พฤษภาคม 2570",
      contractDiscountRate: 20,
      contractCOD: "1 พฤษภาคม 2567",
    },
    customer: {
      customerId: 1,
      customerName: "TUNTEX TEXTILE (THAILAND) CO., LTD.",
      customerAddress:
        "Rayong Industrial Park No.1, Moo 8, 3191 Rd., Mapkha, Nikhom Phatthana, Rayong, Thailand, 21180",
      customerTaxId: "TAX1234567",
      customerTelephone: "123-456-7890",
    },
    payment: {
      paymentMethod: "Bank Transfer",
      paymentBankName: "ธนาคารทหารไทยธนชาต จำกัด (มหาชน) สาขาสำนักพหลโยธิน",
      paymentAccount: "123-456-7890",
      paymentAccountName: "บริษัท เอ็กโก โคเจนเนอเรชั่น จำกัด",
      paymentDueDate: "2024-06-30",
      paymentNote:
        "(มีระยะเวลาในการชำระ  1 เดือน กรณีเกินกำหนดชำระเงิน มีค่าปรับเป็น 15% ต่อปี)",
    },
    minimumTake: [
      {
        minimumTakeId: 1,
        minimumTakeDescription:
          "จำนวนพลังงานไฟฟ้าที่ผลิตได้สะสมงวดที่ 1 ระหว่างเดือน ม.ค. - มิ.ย.",
        minimumTakeQuantity: "1,000,000.00",
        minimumTakeUnit: "kWh",
      },
      {
        minimumTakeId: 2,
        minimumTakeDescription:
          "จำนวนพลังงานไฟฟ้าที่ต้องใช้สะสมงวดที่ 1 ระหว่างเดือน ม.ค. - มิ.ย. (90%)",
        minimumTakeQuantity: "900,000.00",
        minimumTakeUnit: "kWh",
      },
      {
        minimumTakeId: 3,
        minimumTakeDescription:
          "จำนวนพลังงานไฟฟ้าที่ใช้จริงสะสมงวดที่ 1 ระหว่างเดือน ม.ค. - มิ.ย.",
        minimumTakeQuantity: "885,000.00",
        minimumTakeUnit: "kWh",
      },
    ],
    transaction: [
      {
        transactionId: 1,
        transactionDescription: "Weekday: peak energy usage",
        transactionQuantity: "30,000.00",
        transactionUnit: "kWh",
        transactionRate: "4.1839",
        transactionAmount: "125,517.00",
      },
      {
        transactionId: 2,
        transactionDescription: "Weekday: off-peak energy usage",
        transactionQuantity: "10,000.00",
        transactionUnit: "kWh",
        transactionRate: "2.6037",
        transactionAmount: "26,037.00",
      },
      {
        transactionId: 3,
        transactionDescription: "Weekend energy usage",
        transactionQuantity: "2,500.00",
        transactionUnit: "kWh",
        transactionRate: "2.6037",
        transactionAmount: "6,509.25",
      },
      {
        transactionId: 4,
        transactionDescription: "Holiday energy usage",
        transactionQuantity: "2,500.00",
        transactionUnit: "kWh",
        transactionRate: "2.6037",
        transactionAmount: "6,509.25",
      },
      {
        transactionId: 5,
        transactionDescription: "Total energy usage",
        transactionQuantity: "45,000.00",
        transactionUnit: "kWh",
        transactionRate: null,
        transactionAmount: null,
      },
      {
        transactionId: 6,
        transactionDescription: "Total before discount",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: "2,000,000.50",
      },
      {
        transactionId: 6,
        transactionDescription: "Ft.",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: "0.0625",
        transactionAmount: "2,000,000.50",
      },
      {
        transactionId: 7,
        transactionDescription: "Discount rate",
        transactionQuantity: "20",
        transactionUnit: "%",
        transactionRate: "0.0625",
        transactionAmount: "2,000,000.50",
      },
      {
        transactionId: 8,
        transactionDescription: "Total after discount",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: "133,908.00",
      },
      {
        transactionId: 9,
        transactionDescription: "Top-Up Factor",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: "1.12",
        transactionAmount: "149,776.85",
      },
      {
        transactionId: 10,
        transactionDescription:
          "ค่าชดเชยจาก Minimum take งวดที่ 1 (ม.ค. - มิ.ย. 2567)",
        transactionQuantity: "15,000.00",
        transactionUnit: "kWh",
        transactionRate: "2.98",
        transactionAmount: "44,636.00",
      },
      {
        transactionId: 11,
        transactionDescription: "Sub Total",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: "194,412.85",
      },
      {
        transactionId: 12,
        transactionDescription: "Vat 7%",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: "13,608.90",
      },
      {
        transactionId: 12,
        transactionDescription: "Grand Total",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: "208,021.75",
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
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

      <div
        className="flex flex-col gap-4"
        id="div_invoicePDF"
        style={{ width: 800 }}
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
                  ใบแจ้งค่าไฟฟ้า Solar Rooftop สำหรับลูกค้า PPA รายเดือน
                </div>
                <div className="text-right sm mt-5 mb-5">
                  Invoice No. {seriesData.invoiceNumber}
                </div>

                <div className="text-sm">
                  ประจำเดือน {seriesData.month} ปี {seriesData.year} ลงวันที่
                  {seriesData.invoiceDate}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-8 gap-4 px-3">
            <div className="col-span-1 xl:col-span-5 mt-5 border-2 border-slate-100 rounded-lg">
              <div className="flex flex-col gap-4 ">
                <div>
                  <div className="bg-slate-100 px-3 py-2">
                    <p className="font-normal text-sm">ข้อมูลผู้ใช้บริการ</p>
                  </div>
                  <div className="flex flex-col xl:flex-row gap-4 p-3 border-slate-100">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-enzy-dark mb-2">
                        ผู้ใช้บริการ
                      </p>
                      <div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            ชื่อบริษัท
                          </div>

                          <div className="text-xs">
                            {seriesData.customer.customerName}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">ที่อยู่</div>
                          <div className="text-xs">
                            {seriesData.customer.customerAddress}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            เลขประจำตัวผู้เสียภาษีอากร
                          </div>
                          <div className="text-xs">
                            {seriesData.customer.customerTaxId}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">โทร</div>
                          <div className="text-xs">
                            {seriesData.customer.customerTelephone}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 xl:border-l border-slate-100 xl:pl-4 xl:pt-0 xl:border-t-0">
                      <p className="font-semibold text-sm text-enzy-dark mb-2">
                        รายละเอียดสัญญา
                      </p>
                      <div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            เลขที่สัญญา
                          </div>
                          <div className="text-xs">
                            {seriesData.contract.contractNumber}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            ชื่อสัญญา
                          </div>
                          <div className="text-xs">
                            {seriesData.contract.contractName}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            ระยะเวลาสัญญา
                          </div>
                          <div className="text-xs">
                            {seriesData.contract.contractPeriod}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            อัตรา Discount rate (%)
                          </div>
                          <div className="text-xs">
                            {seriesData.contract.contractDiscountRate}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            วันที่ COD
                          </div>
                          <div className="text-xs">
                            {seriesData.contract.contractCOD}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 xl:col-span-3 border-2 border-slate-100 mt-5 rounded-lg">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="bg-slate-100 px-3 py-2">
                    <p className="font-normal text-sm">สรุปค่าไฟฟ้า</p>
                  </div>
                  <div className="flex flex-col xl:flex-row gap-4 p-3 border-slate-100">
                    <div className="flex-1">
                      <div className="pb-2">
                        <div className="text-xs text-slate-500">ค่าไฟฟ้า</div>
                        <div className="text-xs">{seriesData.subTotal} บาท</div>
                      </div>
                      <div className="pb-2">
                        <div className="text-xs text-slate-500">
                          ภาษีมูลค่าเพิ่ม (7 %)
                        </div>
                        <div className="text-xs">{seriesData.vat} บาท</div>
                      </div>
                      <div className="pb-2">
                        <div className="text-xs text-slate-500">
                          รวมค่าบริการที่ต้องชำระ
                        </div>
                        <div className="text-xs">
                          {seriesData.grandTotal} บาท
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* การชำระเงิน*/}
          <div className="mt-5 px-3">
            <div className="bg-slate-100 px-3 py-2 rounded-t-lg">
              <p className="font-normal text-sm">การชำระเงิน</p>
            </div>
            <div className="border-x-2 border-b-2 border-slate-100 p-3 rounded-b-lg">
              <div className="flex pb-2">
                <div className="text-xs text-slate-500">
                  กรุณาชำระเงินภายในวันที่
                </div>
                <div className="text-xs ml-1">
                  {seriesData.payment.paymentDueDate}
                </div>
                <div className="text-xs ">
                  <div className="ml-1">{seriesData.payment.paymentNote}</div>
                </div>
              </div>
              <div className="flex pb-2">
                <div className="text-xs text-slate-500">ธนาคาร</div>
                <div className="text-xs ml-1">
                  {seriesData.payment.paymentBankName}
                </div>
              </div>
              <div className="flex pb-2">
                <div className="text-xs text-slate-500">ชื่อบัญชี</div>
                <div className="text-xs ml-1">
                  {seriesData.payment.paymentAccountName}
                </div>
              </div>
              <div className="flex pb-2">
                <div className="text-xs text-slate-500">เลขที่บัญชี </div>
                <div className="text-xs ml-1">
                  {seriesData.payment.paymentAccount}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 px-3">
            <div className="bg-slate-100 px-3 py-2 rounded-t-lg">
              <p className="font-normal text-sm">รายละเอียดการใช้บริการ</p>
            </div>
            <div className="border-x-2 border-b-2 border-slate-100 p-3 rounded-b-lg">
              <div className="flex pb-2">
                <div className="text-xs text-slate-500">ธนาคาร</div>
                <div className="text-xs ml-1">
                  {seriesData.transactionStartDate} ถึง &nbsp;
                  {seriesData.transactionEndDate}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex justify-center mt-5">
            <div className="w-full max-w-xs px-3">
              <div className="bg-slate-100 px-3 py-2 rounded-t-lg">
                <p className="font-normal text-sm">รายละเอียดการใช้บริการ</p>
              </div>
              <div className="border-x-2 border-b-2 border-slate-100 p-3 rounded-b-lg">
                <div className="flex pb-2">
                  <div className="text-xs text-slate-500">วันที่&nbsp;</div>
                  <div className="text-xs">1 มิถุนายน 2567&nbsp;</div>
                  <div className="text-xs text-slate-500">ถึง&nbsp;</div>
                  <div className="text-xs">30 มิถุนายน 2567</div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="mt-5 px-3 rounded">
            <div className="bg-slate-100 px-3 py-2 rounded-t-lg">
              <p className="font-normal text-sm">Minimum take</p>
            </div>
            {seriesData.minimumTake &&
              seriesData.minimumTake.map((minimumTake) => (
                <div className="flex pb-2 border-x-2 border-b-0 border-slate-100 p-3">
                  <div className="text-xs text-slate-500">
                    {minimumTake.minimumTakeDescription}
                  </div>
                  <div className="text-xs ml-1">
                    {minimumTake.minimumTakeQuantity}
                  </div>
                  <div className="text-xs ml-1 text-slate-500">
                    {minimumTake.minimumTakeUnit}
                  </div>
                </div>
              ))}
            <div className="flex pb-2 border-x-2 border-b-2 rounded border-slate-100 p-3">
              <div className="text-xs text-slate-500 rounded"></div>
            </div>
          </div>

          <div className="mt-5 px-3 break-before-page">
            <div className="border-slate-100 rounded-lg">
              <div className="rounded-lg border">
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b rounded-t-lg bg-slate-100 dark:bg-slate-600 p-2 font-bold">
                  <div>No.</div>
                  <div>Description</div>
                  <div>Quantity</div>
                  <div>Unit</div>
                  <div>Unit Price</div>
                  <div>Amount (THB)</div>
                </div>
                {seriesData.transaction &&
                  seriesData.transaction.map((transaction, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 text-center text-xs p-2 border-b"
                    >
                      <div> {transaction.transactionId}</div>
                      <div className="text-left">
                        {transaction.transactionDescription}
                      </div>
                      <div className="text-right">
                        {transaction.transactionQuantity}
                      </div>
                      <div className="text-right">
                        {transaction.transactionUnit}
                      </div>
                      <div>{transaction.transactionRate}</div>
                      <div className="text-right">
                        {transaction.transactionAmount}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* รายละเอียดการให้บริการ */}

          <div className="mt-5 px-3 break-before-page">
            <div className="border-slate-100 rounded-lg">
              <div className="rounded-lg border">
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b rounded-t-lg bg-slate-100 dark:bg-slate-600 p-2 font-bold">
                  <div>No.</div>
                  <div>Description</div>
                  <div>Quantity</div>
                  <div>Unit</div>
                  <div>Unit Price</div>
                  <div>Amount (THB)</div>
                </div>
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  {/* no.1 */}
                  <div>1</div>
                  <div className="text-left">Weekday : peak energy usage</div>
                  <div className="text-right">30,000.00</div>
                  <div>kWh</div>
                  <div className="text-right">4.1839</div>
                  <div className="text-right">125,517.00</div>
                </div>
                {/* no.2 */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>2</div>
                  <div className="text-left">
                    Weekday : Off-peak energy usage
                  </div>
                  <div className="text-right">10,000.00</div>
                  <div>kWh</div>
                  <div className="text-right">2.6037</div>
                  <div className="text-right">26,037.00</div>
                </div>
                {/* no.3 */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>3</div>
                  <div className="text-left">Weekday energy usage</div>
                  <div className="text-right">2,500.00</div>
                  <div>kWh</div>
                  <div className="text-right">2.6037</div>
                  <div className="text-right">6,509.25</div>
                </div>
                {/* no.4 */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>4</div>
                  <div className="text-left">Holiday energy usage</div>
                  <div className="text-right">2,500.00</div>
                  <div>kWh</div>
                  <div className="text-right">2.6037</div>
                  <div className="text-right">6,509.25</div>
                </div>
                {/* no.5 */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>5</div>
                  <div className="text-right">total energy usage</div>
                  <div className="text-right">45,000</div>
                  <div>kWh</div>
                  <div className="text-right"></div>
                  <div className="text-right"></div>
                </div>
                {/* {no.5.1} */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div></div>
                  <div className="text-right">Total before discount</div>
                  <div className="text-right"></div>
                  <div></div>
                  <div className="text-right"></div>
                  <div className="text-right">164,572.50</div>
                </div>
                {/* no.6 */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>6</div>
                  <div className="text-right">Ft.</div>
                  <div className="text-right"></div>
                  <div></div>
                  <div className="text-right">0.0625</div>
                  <div className="text-right">2,812.50</div>
                </div>
                {/* no.7 */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>7</div>
                  <div className="text-left">Discount rate</div>
                  <div>20</div>
                  <div>%</div>
                  <div></div>
                  <div className="flex justify-between">
                    <div className="text-left">-</div>
                    <div className="text-right">33,477.00</div>
                  </div>
                </div>
                {/* no.7.1 */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div></div>
                  <div className="text-right">Total after discount</div>
                  <div className="col-span-3"></div>
                  <div className="flex">
                    <div className="flex-grow text-right underline">
                      133,908.00
                    </div>
                  </div>
                </div>
                {/* no.8.1 */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>8</div>
                  <div className="text-right">Top-Up Factor</div>
                  <div className="col-span-2"></div>
                  <div className="text-right">1.12</div>
                  <div className="text-right">149,776.85</div>
                </div>
                {/* no.9 */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>9</div>
                  <div className="text-left">
                    ค่าชดเชยจาก Minimum take งวดที่ 1 (ม.ค. - มิ.ย. 2567)
                  </div>
                  <div>15,000.00</div>
                  <div>kWh</div>
                  <div className="text-right">2.9757</div>
                  <div className="text-right">44,636.00</div>
                </div>
                {/* sub Total */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div className="col-span-3"></div>
                  <div className="text-right font-bold">Sub Total</div>
                  <div></div>
                  <div className="text-right">44,636.00</div>
                </div>
                {/* Vat 7% */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div className="col-span-3"></div>
                  <div className="text-right">Vat 7%</div>
                  <div></div>
                  <div className="text-right">13,608.90</div>
                </div>
                {/* Grand Total */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div className="col-span-3"></div>
                  <div className="text-right font-bold">Grand Total</div>
                  <div></div>
                  <div className="text-right underline">208,021.75</div>
                </div>
                {/* <div
                  className={classNames({
                    "grid grid-cols-6 text-center p-2 text-xs border-b font-bold bg-slate-100 dark:bg-slate-600": true,
                    "py-1 text-2xs": true,
                  })}
                >
                  <div>test</div>
                  <div></div>
                  <div>test</div>
                  <div></div>
                  <div>test</div>
                  <div className="text-right">test</div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
