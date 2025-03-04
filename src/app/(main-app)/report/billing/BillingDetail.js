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
import { Button, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function BillingDetail({
  invoiceData,
  summaryData,
  isPDF = false,
  selectedCustomer,
  selectedYear,
  selectedMonth,
  invoiceNumber = null,
}) {
  const [dataPDF, setDataPDF] = useState({
    month: "พฤศจิกายน",
    year: "2566",
  });

  const [invoiceNo, setInvoiceNo] = useState(invoiceNumber ?? "");
  const [loading, loadingHandler] = useDisclosure();

  const download = () => {
    /*   window.open(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/report/pdf/billing/${selectedCustomer}?year=${selectedYear}&month=${selectedMonth}`
    ); */
    loadingHandler.open();
    axios
      .get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/report/pdf/billing/${selectedCustomer}?year=${selectedYear}&month=${selectedMonth}&invoiceNumber=${invoiceNo}`,
        { responseType: "blob" }
      )
      .then((response) => {
        loadingHandler.close();

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `invoice_${selectedCustomer}_${selectedYear}_${selectedMonth}.pdf`
        );
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      {!isPDF && (
        <>
          <Button
            loading={loading}
            className="bg-[#F7D555] text-sm text-slate-600 font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => download()}
          >
            <div className="flex items-center gap-2">
              <BiDownload className="h-5 w-5" />
              <span className="text-xs">Download</span>
            </div>
          </Button>
        </>
      )}

      <div
        className="flex flex-col gap-4"
        id="div_invoicePDF"
        style={{ width: 800 }}
      >
        <div className="rounded-xl bg-white p-3 pb-10 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
          <div className="flex justify-center mt-5">
            <p className="font-semibold text-lg text-enzy-dark">
              ใบแจ้งค่าไฟฟ้า Solar Rooftop สำหรับลูกค้า PPA รายเดือน
            </p>
          </div>
          <div className="grid grid-cols-8 p-3 items-center">
            <div className="col-span-2">
              <Image
                src={"/images/profile/6_profile_img.png"}
                alt=""
                height={100}
                width={150}
              />
            </div>

            <div className="col-span-4">
              <div>
                <div className="text-left text-xs mt-3 mb-1 leading-tight">
                  EGCO Cogeneration Company Limited <br></br>222 EGCO Tower
                  Vibhavadi Rangsit Road,<br></br>
                  Tungsonghong, Laksi District, Bangkok 10210<br></br>
                  Tel: 662-998-5801-04 Tax ID no. 0105533055079
                </div>
              </div>
            </div>
            <div className="col-span-8 ">
              <div className="flex justify-end items-center gap-3">
                <div className="text-right text-xs sm mt-1 mb-2 leading-tight">
                  Invoice No.
                </div>

                {!isPDF ? (
                  <div className="w-48 text-right text-xs sm mt-1 mb-2 leading-tight">
                    <TextInput
                      value={invoiceNo}
                      onChange={(event) =>
                        setInvoiceNo(event.currentTarget.value)
                      }
                    />
                  </div>
                ) : (
                  <div className="w-32 text-right text-xs sm mt-1 mb-2 leading-tight">
                    <b>{invoiceNumber}</b>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <p className="font-normal text-sm">
              ประจำเดือน{" "}
              <span className="font-semibold">{invoiceData.displayMonth}</span>{" "}
              ปี{" "}
              <span className="font-semibold">{invoiceData.displayYear}</span>{" "}
            </p>
          </div>
          <div className="grid grid-cols-3 xl:grid-cols-8 gap-4 px-3">
            <div className="col-span-2 xl:col-span-5 mt-5 border-2 border-slate-100 rounded-lg">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="bg-slate-100 px-3 py-2">
                    <p className="font-semibold text-sm">ข้อมูลผู้ใช้บริการ</p>
                  </div>
                  <div className="flex    flex-row gap-4 p-3 border-slate-100">
                    <div className="border-t pt-4   border-slate-100 xl:pl-0 xl:pt-0 xl:border-t-0 ">
                      <p className="font-semibold text-sm text-enzy-dark mb-2">
                        ผู้ใช้บริการ
                      </p>
                      <div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            ชื่อบริษัท
                          </div>

                          <div className="text-xs">
                            {invoiceData.customer?.customerName}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">ที่อยู่</div>
                          <div className="text-xs">
                            {invoiceData.customer?.customerAddress}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            เลขประจำตัวผู้เสียภาษีอากร
                          </div>
                          <div className="text-xs">
                            {invoiceData.customer?.customerTaxId}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">โทร</div>
                          <div className="text-xs">
                            {invoiceData.customer?.customerTelephone}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 xl:border-l border-slate-100 xl:pl-4 xl:pt-0 xl:border-t-0 ">
                      <p className="font-semibold text-sm text-enzy-dark mb-2">
                        รายละเอียดสัญญา
                      </p>
                      <div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            เลขที่สัญญา
                          </div>
                          <div className="text-xs">
                            {invoiceData.contract?.contractNumber}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            ชื่อสัญญา
                          </div>
                          <div className="text-xs">
                            {invoiceData.contract?.contractName}
                          </div>
                        </div>
                        {/* <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            ระยะเวลาสัญญา
                          </div>
                          <div className="text-xs">
                            {invoiceData.contract?.contractPeriod}
                          </div>
                        </div> */}
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            อัตรา Discount rate (%)
                          </div>
                          <div className="text-xs">
                            {invoiceData.contract?.contractDiscountRate}
                          </div>
                        </div>
                        <div className="pb-2">
                          <div className="text-xs text-slate-500">
                            วันที่ COD
                          </div>
                          <div className="text-xs">
                            {invoiceData.contract?.contractCOD}
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
                    <p className="font-semibold text-sm">สรุปค่าไฟฟ้า</p>
                  </div>
                  <div className="flex flex-col xl:flex-row gap-4 p-3 border-slate-100">
                    <div className="flex-1">
                      <div className="pb-2">
                        <div className="text-xs text-slate-500">ค่าไฟฟ้า</div>
                        <div className="text-xs">
                          {summaryData.subTotal} บาท
                        </div>
                      </div>
                      <div className="pb-2">
                        <div className="text-xs text-slate-500">
                          ภาษีมูลค่าเพิ่ม (7 %)
                        </div>
                        <div className="text-xs">{summaryData.vat} บาท</div>
                      </div>
                      <div className="pb-2">
                        <div className="text-xs text-slate-500">
                          รวมค่าบริการที่ต้องชำระ
                        </div>
                        <div className="text-xs">
                          {summaryData.grandTotal} บาท
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
              <p className="font-semibold text-sm">การชำระเงิน</p>
            </div>
            <div className="border-x-2 border-b-2 border-slate-100 p-3 rounded-b-lg">
              <div className="flex pb-2">
                <div className="text-xs text-slate-500">
                  วางใบแจ้งหนี้วันที่
                </div>
                <div className="text-xs ml-1">
                  {invoiceData.payment?.paymentDueDate}
                </div>
                <div className="text-xs ">
                  <div className="ml-1">{invoiceData.payment?.paymentNote}</div>
                </div>
              </div>
              <div className="flex pb-2">
                <div className="text-xs text-slate-500">ธนาคาร</div>
                <div className="text-xs ml-1">
                  {invoiceData.payment?.paymentBankName}
                </div>
              </div>
              <div className="flex pb-2">
                <div className="text-xs text-slate-500">ชื่อบัญชี</div>
                <div className="text-xs ml-1">
                  {invoiceData.payment?.paymentAccountName}
                </div>
              </div>
              <div className="flex pb-2">
                <div className="text-xs text-slate-500">เลขที่บัญชี </div>
                <div className="text-xs ml-1">
                  {invoiceData.payment?.paymentAccount}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="mt-5 px-3 ">
            <div className="bg-slate-100 px-3 py-2 rounded-t-lg">
              <p className="font-semibold text-sm">รายละเอียดการใช้บริการ</p>
            </div>
            <div className="flex pb-2 border-x-2 border-b-2 border-slate-100 p-3 rounded-b-lg">
              <div className="text-xs text-slate-500">วันที่</div>
              <div className="text-xs ml-1">
                {invoiceData.transactionStartDate}
              </div>
              <div className="text-xs text-slate-500 ml-1">ถึง</div>
              <div className="text-xs text-slate-500"></div>
              <div className="text-xs ml-1 ">
                {invoiceData.transactionEndDate}
              </div>
            </div>
          </div> */}
          {/* <div className="border-x-2 border-b-2 border-slate-100 p-3 rounded-b-lg">
              <div className="flex pb-2">
                <div className="text-xs text-slate-500">ธนาคาร</div>
                <div className="text-xs ml-1">
                  {invoiceData.transactionStartDate} ถึง &nbsp;
                  {invoiceData.transactionEndDate}
                </div>
              </div>
            </div> */}
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
          {invoiceData?.minimumTake && (
            <div className="mt-5 px-3 rounded">
              <div className="bg-slate-100 px-3 py-2 rounded-t-lg">
                <p className="font-semibold text-sm">Minimum take</p>
              </div>
              {invoiceData.minimumTake &&
                invoiceData.minimumTake.map((minimumTake, index) => (
                  <div
                    key={index}
                    className="flex pb-2 border-x-2 border-b-0 border-slate-100 p-3"
                  >
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
              <div className="flex pb-2 border-x-2 border-b-2 rounded-b-lg border-slate-100 p-3 ">
                <div className="text-xs text-slate-500 rounded-b-lg"></div>
              </div>
            </div>
          )}

          <div className="mt-5 px-3 break-before-page">
            <div className="border-slate-100 rounded-lg">
              <div className="rounded-lg border">
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b rounded-t-lg bg-slate-100 dark:bg-slate-600 font-bold">
                  <div>No.</div>
                  <div>Description</div>
                  <div>Quantity</div>
                  <div>Unit</div>
                  <div>Unit Price</div>
                  <div>Amount (THB)</div>
                </div>
                {invoiceData.transaction &&
                  invoiceData.transaction.map((transaction, index) => {
                    if (
                      !["sub-total", "vat", "grand-total"].includes(
                        transaction.transactionType
                      )
                    ) {
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-6 text-center text-xs p-2 border-b"
                        >
                          <div>{index + 1}</div>
                          <div className="text-left">
                            {transaction?.transactionDescription}
                          </div>
                          <div className="text-right">
                            {transaction?.transactionQuantity}
                          </div>
                          <div>{transaction?.transactionUnit}</div>
                          <div className="text-right">
                            {transaction?.transactionRate}
                          </div>
                          <div className="text-right">
                            {transaction?.transactionAmount}
                          </div>
                        </div>
                      );
                    }
                  })}

                {/* Subtotal */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div className="col-span-3"></div>
                  <div className="text-right font-bold">Sub Total</div>
                  <div></div>
                  <div className="text-right font-bold">
                    {summaryData.subTotal}
                  </div>{" "}
                </div>

                {/* VAT */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div className="col-span-3"></div>
                  <div className="text-right">Vat 7%</div>
                  <div></div>
                  <div className="text-right">{summaryData.vat}</div>
                </div>

                {/* Grand Total */}
                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div className="col-span-3"></div>
                  <div className="text-right font-bold">Grand Total</div>
                  <div></div>
                  <div className="text-right font-bold underline">
                    {summaryData.grandTotal}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* รายละเอียดการให้บริการ */}
          {/* <div className="mt-5 px-3 break-before-page">
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
                  <div>1</div>
                  <div className="text-left">Weekday : peak energy usage</div>
                  <div className="text-right">30,000.00</div>
                  <div>kWh</div>
                  <div className="text-right">4.1839</div>
                  <div className="text-right">125,517.00</div>
                </div>

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

                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>3</div>
                  <div className="text-left">Weekday energy usage</div>
                  <div className="text-right">2,500.00</div>
                  <div>kWh</div>
                  <div className="text-right">2.6037</div>
                  <div className="text-right">6,509.25</div>
                </div>

                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>4</div>
                  <div className="text-left">Holiday energy usage</div>
                  <div className="text-right">2,500.00</div>
                  <div>kWh</div>
                  <div className="text-right">2.6037</div>
                  <div className="text-right">6,509.25</div>
                </div>

                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>5</div>
                  <div className="text-right">total energy usage</div>
                  <div className="text-right">45,000</div>
                  <div>kWh</div>
                  <div className="text-right"></div>
                  <div className="text-right"></div>
                </div>

                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div></div>
                  <div className="text-right">Total before discount</div>
                  <div className="text-right"></div>
                  <div></div>
                  <div className="text-right"></div>
                  <div className="text-right">164,572.50</div>
                </div>

                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>6</div>
                  <div className="text-right">Ft.</div>
                  <div className="text-right"></div>
                  <div></div>
                  <div className="text-right">0.0625</div>
                  <div className="text-right">2,812.50</div>
                </div>

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

                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div>8</div>
                  <div className="text-right">Top-Up Factor</div>
                  <div className="col-span-2"></div>
                  <div className="text-right">1.12</div>
                  <div className="text-right">149,776.85</div>
                </div>

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

                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div className="col-span-3"></div>
                  <div className="text-right font-bold">Sub Total</div>
                  <div></div>
                  <div className="text-right">44,636.00</div>
                </div>

                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div className="col-span-3"></div>
                  <div className="text-right">Vat 7%</div>
                  <div></div>
                  <div className="text-right">13,608.90</div>
                </div>

                <div className="grid grid-cols-6 text-center text-xs p-2 border-b">
                  <div className="col-span-3"></div>
                  <div className="text-right font-bold">Grand Total</div>
                  <div></div>
                  <div className="text-right underline">208,021.75</div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
