"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Form, Select, Button, Card, Input, Space } from "antd";
import SummaryDetail from "./SummaryDetail";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "@/redux/slicer/loadingSlice";
import { BeatLoader } from "react-spinners";
import {
  getBranchListByCompanyId,
  getReportSummaryByBranch,
  getReportSummaryByCompany,
} from "@/utils/api";
import SummaryFlatDetail from "./SummaryFlatDetail";
import { FaFileExport } from "react-icons/fa6";
import { Checkbox, Tooltip } from "@mantine/core";

// TODO: ทำให้เป็น dynamic ได้ จะได้ไม่ต้อง hardcode
const yearObject = [{ name: "2566" }, { name: "2567" }, { name: "2568" }];
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

export default function Summary({ props }) {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.isLoading.isLoading);
  const username = useSelector((state) => state.userData.username);

  const [selectedYear, setSelectedYear] = useState(yearObject[2].name); // TODO: ทำให้เป็น dynamic ได้ จะได้ไม่ต้อง hardcode
  const [selectedMonth, setSelectedMonth] = useState(
    monthObject[dayjs().month()].month
  );
  const companyId = useSelector((state) => state.companyData.company.Id);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [dataSummary, setDataSummary] = useState();
  const [summaryTitle, setSummaryTitle] = useState("");
  const [isSelectAll, setIsSelectAll] = useState(false);

  const [form] = Form.useForm();
  form.setFieldValue("year", selectedYear);
  form.setFieldValue("month", selectedMonth);

  const getBranchList = async () => {
    const params = {
      companyId: companyId,
      username: username,
    };

    const response = await getBranchListByCompanyId(params);
    if (response.status === 200) {
      setBranchList(response.data);
      setSelectedBranch(response.data[0].Id); // default 1st branch item
      // console.log('getBranchList', response.data[0])
      form.setFieldValue("branch", response.data[0].Id);
    }
  };

  useEffect(() => {
    getBranchList();
  }, [companyId]);

  const handleSearch = (formValue) => {
    dispatch(showLoading());

    const selectedYear = formValue.year;
    const selectedMonth = formValue.month;
    const selectedBranch = formValue.branch;
    console.log("Searching", selectedYear, selectedMonth, selectedBranch);

    setSelectedYear(selectedYear);
    setSelectedMonth(selectedMonth);
    setSelectedBranch(selectedBranch);

    getSummaryDetail(selectedYear, selectedMonth, selectedBranch);
  };

  const getSummaryDetail = async (year, month, branch) => {
    try {
      const params = {
        year: year - 543,
        month: month,
        branchId: branch,
      };
      const response = await getReportSummaryByBranch(params);
      if (response.status === 200) {
        dispatch(hideLoading());
        setDataSummary(response.data);
        setSummaryTitle(`ประจำเดือน ${monthObject[month - 1].name} ${year}`);
        console.log("dataSummary", response.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const exportReport = () => {
    window.open(
      `${
        process.env.NEXT_PUBLIC_APP_URL
      }/api/report/usageSummary/export?companyId=${companyId}&branchId=${selectedBranch}&year=${
        selectedYear - 543
      }&month=${selectedMonth}&username=${username}&allBranches=${isSelectAll}`
    );
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
                <div className="flex gap-2 items-center">
                  <span className="text-xl font-medium text-dark dark:text-slate-300">
                    ค้นหาใบสรุปค่าไฟฟ้า
                  </span>
                </div>

                <div className="mt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-4 justify-between sm:gap-4">
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
                    <Form.Item
                      label="สาขา"
                      name="branch"
                      rules={[{ required: true, message: "กรุณาเลือก สาขา" }]}
                    >
                      <Select size="large">
                        {branchList.map((item, index) => (
                          <Select.Option key={index} value={item.Id}>
                            {item.Name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {isLoading ? (
                      <Button
                        className="btn-primary flex justify-center items-center"
                        type="primary"
                        style={{ height: "40px", width: "150px" }}
                        htmlType="submit"
                        form="search-form"
                        disabled
                      >
                        กำลังค้นหา
                        <BeatLoader color="white" size={5} className="ml-1" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          className="btn-primary"
                          type="primary"
                          style={{ height: "40px", width: "150px" }}
                          htmlType="submit"
                          form="search-form"
                        >
                          ค้นหา
                        </Button>
                      </>
                    )}
                  </div>
                  {dataSummary && companyId == 5 && (
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 justify-end">
                      <div className="flex col-start-11 items-center">
                        <Tooltip
                          position="bottom-end"
                          label="May take a long time to export (approximately 1-2 minutes)."
                          refProp="rootRef"
                        >
                          <Checkbox
                            checked={isSelectAll}
                            onChange={(event) =>
                              setIsSelectAll(event.currentTarget.checked)
                            }
                            label="All branches"
                            color="#33bfbf"
                          />
                        </Tooltip>
                      </div>
                      <button
                        className="bg-[#0F7C41] col-start-12 text-sm font-normal text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => exportReport()}
                      >
                        <div className="flex justify-center items-center gap-2">
                          <FaFileExport className="h-5 w-5" />
                          <span className="text-xs">Export</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </div>
        </div>

        <div className="mt-5">
          {dataSummary &&
            (companyId == 5 ? (
              <>
                <SummaryFlatDetail
                  title={summaryTitle}
                  dataSummary={dataSummary}
                  selectedBranch={selectedBranch}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear - 543}
                />
              </>
            ) : (
              <SummaryDetail
                title={summaryTitle}
                dataSummary={dataSummary}
                selectedBranch={selectedBranch}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear - 543}
              />
            ))}
        </div>
      </main>
    </div>
  );
}
