"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import classNames from "classnames";
import { Form, Select, Button } from "antd";
import InvoiceDetail from "./InvoiceDetail";

const yearObject = [{ name: "2566" }];
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

  const [form] = Form.useForm();
  form.setFieldValue("year", selectedYear);
  form.setFieldValue("month", selectedMonth);

  const handleSearch = (formValue) => {
    const selectedYear = formValue.year;
    const selectedMonth = formValue.month;
    console.log(selectedYear, selectedMonth);

    setSelectedYear(selectedYear);
    setSelectedMonth(selectedMonth);
  };

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
                  <span className="text-xl font-medium text-dark">
                    ค้นหาใบแจ้งค่าใช้บริการ
                  </span>
                </div>

                <div className="mt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 justify-between sm:gap-4">
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

        <div className="mt-5">
          <InvoiceDetail
            month={monthObject[selectedMonth - 1]}
            year={selectedYear}
          />
        </div>
      </main>
    </div>
  );
}
