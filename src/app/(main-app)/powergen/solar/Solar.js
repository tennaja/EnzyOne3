"use client";
import React, { Fragment, useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import LineChart from "@/components/LineChart";
import Summary from "./components/Summary";
import axios from "axios";
import numeral from "numeral";
import Image from "next/image";
import BuildingDetails from "./components/BuildingDetails"
import { getAllBranchData, getAreaData, getBuildingData } from "@/utils/api";
import { Form, Select, Button } from 'antd'
import { MdSolarPower } from "react-icons/md";

const company = [
  { id: 1, name: "Samtech Co.Ltd." },
  { id: 2, name: "EGAT" },
];

export default function Solar() {
  const [form] = Form.useForm();
  const [selectedCompany, setSelectedCompany] = useState(company[1]);
  const [branchData, setBranchData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [areaData, setAreaData] = useState([]);
  const [selectedArea, setSelectedArea] = useState();
  const [buildingData, setBuildingData] = useState([]);

  useEffect(() => {
    getAllBranchData(selectedCompany.id).then((result) => {
      setBranchData(result);
      form.setFieldValue('branch', result[0].id) //default 1st
      onSelectBranch(result[0].id)
    });
  }, []);

  useEffect(() => {
    let branchId = selectedBranch;
    if (branchId) {
      getAreaData(branchId).then((result) => {
        const areaData = result?.data;
        setAreaData(areaData);

        if (areaData.length > 0) {
          setSelectedArea(areaData[0].id);
          form.setFieldValue('area', areaData[0].id) //default 1st
        } else {
          setSelectedArea(null);
        }
      });
    }
  }, [selectedBranch]);

  useEffect(() => {
    let areaId = selectedArea;
    if (areaId) {
      getBuildingData(areaId).then((result) => {
        const buildingData = result?.data;
        setBuildingData(buildingData);
      });
    }
  }, [selectedArea]);

  const onSelectBranch = (branchID) => {
    setSelectedBranch(branchID);
  }

  const onSelectArea = (areaID) => {
    setSelectedArea(areaID);
  }


  return (
    <div className="min-h-screen flex w-full text-enzy-dark dark:text-slate-200">
      <main className="p-4 lg:p-8 flex flex-1 flex-col bg-[#EDF2F8] dark:bg-dark-base">

        <div className="rounded-xl bg-white p-4 mb-4 shadow-default dark:border-slate-800 dark:bg-dark-box">
          <div className="flex px-2 flex-col dark:border-strokedark">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-3 bg-enzy-light-yellow text-enzy-dark dark:bg-[#21424E]">
                <MdSolarPower className="w-6 h-6" />
              </div>
              <span className="font-semibold text-xl text-enzy-dark">
                Power Generation - Solar
              </span>
            </div>

            {/* <h4 className="font-semibold text-xl text-enzy-dark dark:text-white">
              Power Generation - Solar
            </h4> */}

            <Form
              id="search-form"
              form={form}
              style={{ maxWidth: '100%' }}
              layout="horizontal"
              labelAlign="left"
              requiredMark={true}
              size="large"
              className="flex flex-col"
            >
              <div>
                <div className='mt-5'>
                  <div className="grid grid-cols-1 sm:grid-cols-3 justify-between sm:gap-4">
                    <Form.Item label="Branch" name="branch" rules={[{ required: true, message: 'กรุณาเลือก Branch' }]}>
                      <Select size="large" onChange={onSelectBranch}>
                        {branchData.map((item, index) => (
                          <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item label="Area" name="area" rules={[{ required: true, message: 'กรุณาเลือก Area' }]}>
                      <Select size="large" onChange={onSelectArea}>
                        {areaData.map((item, index) => (
                          <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>

        {/* <div className="grid grid-cols-3 gap-4">
          <Summary data={summaryData.power} />
          <Summary data={summaryData.etoday} />
          <Summary data={summaryData.etotal} />
        </div> */}

        {buildingData && <BuildingDetails data={buildingData} />}

        <div className="rounded-xl bg-white p-4 my-4 shadow-default dark:border-slate-800 dark:bg-dark-box sm:px-7.5 xl:pb-1">
          <div className="flex justify-between items-center p-3 dark:border-strokedark">
            <h4 className="font-semibold text-xl text-enzy-dark dark:text-white">
              Historical
            </h4>
          </div>
          <div>
            <LineChart />
          </div>
        </div>
      </main >
    </div >
  );
}
