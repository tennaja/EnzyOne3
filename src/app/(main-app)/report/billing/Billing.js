"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import classNames from "classnames";
import { Form, Select, Button } from "antd";
import BillingDetail from "./BillingDetail";
import _ from "lodash";
import { getBillingData } from "@/utils/api";
import BillingDetailForm2 from "./BillingDetailForm2";

const yearObject = [{ name: "2567" }];
const monthObject = [
  { month: 1, name: "มกราคม" },
  { month: 2, name: "กุมภาพันธ์" },
  { month: 3, name: "มีนาคม" },
  { month: 4, name: "เมษายน" },
  { month: 5, name: "พฤษภาคม" },
  { month: 6, name: "มิถุนายน" },
  { month: 7, name: "กรกฎาคม" },
  { month: 8, name: "สิงหาคม" },
  { month: 9, name: "กันยายน" },
  { month: 10, name: "ตุลาคม" },
  { month: 11, name: "พฤศจิกายน" },
  { month: 12, name: "ธันวาคม" },
];

export default function Invoice({ props }) {
  const [selectedYear, setSelectedYear] = useState(yearObject[0].name);
  const [selectedMonth, setSelectedMonth] = useState(
    monthObject[dayjs().month()].month
  );

  const [submitted, setSubmitted] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [summaryData, setSummaryData] = useState({
    subTotal: "0.00",
    vat: "0.00",
    grandTotal: "0.00",
  });

  const [selectedCustomer, setSelectedCustomer] = useState(1);

  const [form] = Form.useForm();
  form.setFieldValue("year", selectedYear);
  form.setFieldValue("month", selectedMonth);

  const handleSearch = (formValue) => {
    const selectedYear = formValue.year;
    const selectedMonth = formValue.month;
    console.log(selectedYear, selectedMonth);

    setSelectedYear(selectedYear);
    setSelectedMonth(selectedMonth);

    getBillingDetail(selectedYear, selectedMonth);
  };

  async function getBillingDetail(year, month) {
    year = year - 543;

    const customerId = selectedCustomer;
    /*   const url = `/api/report/billing/${customerId}?year=${year}&month=${month}`;
    const response = await axios.get(url); */

    const params = {
      customerId: customerId,
      year: year,
      month: month,
    };
    const response = await getBillingData(params);
    const data = response.data;

    if (!_.isEmpty(data)) {
      console.log("data", data);

      for (const transaction of data?.transaction) {
        if (transaction?.transactionType == "sub-total") {
          setSummaryData((prevState) => ({
            ...prevState,
            subTotal: transaction?.transactionAmount,
          }));
        } else if (transaction?.transactionType == "vat") {
          setSummaryData((prevState) => ({
            ...prevState,
            vat: transaction?.transactionAmount,
          }));
        } else if (transaction?.transactionType == "grand-total") {
          setSummaryData((prevState) => ({
            ...prevState,
            grandTotal: transaction?.transactionAmount,
          }));
        }
      }
    }

    setInvoiceData(data);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex w-full text-enzy-dark dark:text-slate-200">
      <main className="p-4 lg:p-8 flex flex-1 flex-col bg-[#EDF2F8] dark:bg-dark-base">
        <div className="rounded-xl bg-white p-4 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
          <div className="p-3">
            <Form
              id="search-form"
              form={form}
              style={{ maxWidth: "100%" }}
              initialValues={{}}
              layout="horizontal"
              labelAlign="left"
              onFinish={handleSearch}
              requiredMark={true}
              size="large"
              className="flex flex-col"
            >
              <div>
                <div className="items-center">
                  <span className="text-xl font-medium text-dark dark:text-slate-300">
                    ค้นหาใบแจ้งค่าใช้บริการ
                  </span>
                </div>

                <div className="mt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 justify-between sm:gap-4 ">
                    <Form.Item
                      label="ปี"
                      name="year"
                      rules={[{ required: true, message: "กรุณาเลือก ปี" }]}
                    >
                      <Select size="large">
                        {yearObject.map((item, index) => (
                          <Select.Option key={index} value={item.name}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="เดือน"
                      name="month"
                      rules={[{ required: true, message: "กรุณาเลือก เดือน" }]}
                    >
                      <Select size="large">
                        {monthObject.map((item, index) => (
                          <Select.Option key={index} value={item.month}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Button
                      className="btn-primary"
                      type="primary"
                      style={{ height: "40px", width: "100px" }}
                      htmlType="submit"
                      form="search-form"
                    >
                      ค้นหา
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>

        {submitted &&
          (invoiceData?.transaction ? (
            <div className="mt-5">
              <BillingDetail
                invoiceData={invoiceData}
                summaryData={summaryData}
                selectedCustomer={selectedCustomer}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear - 543}
              />
              {/* <BillingDetailForm2
                invoiceData={invoiceData}
                summaryData={summaryData}
                selectedCustomer={selectedCustomer}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear - 543}
              /> */}
            </div>
          ) : (
            <div className="mt-5">
              <div className="rounded-xl bg-white p-3 dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
                ไม่มีข้อมูลในปีและเดือนที่เลือก
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}
