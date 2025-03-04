"use client";
import { getEmsModelData } from "@/utils/api";
import { getPeopleCounting } from "@/utils/emsService";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Chart from "./components/Chart";
import classNames from "classnames";
var buddhistEra = require("dayjs/plugin/buddhistEra");
var th = require("dayjs/locale/th");

dayjs.extend(buddhistEra);
dayjs.locale(th);

const hexData =
  "8002636e756d70792e636f72652e6d756c746961727261790a5f7265636f6e7374727563740a7100636e756d70790a6e6461727261790a71014b00857102635f636f646563730a656e636f64650a7103580100000062710458060000006c6174696e317105867106527107877108527109284b014b1885710a636e756d70790a64747970650a710b58020000006638710c898887710d52710e284b0358010000003c710f4e4e4e4affffffff4affffffff4b007471106289680358390100001026c3ba3bc3991e67c380c3bec3bfc3bfc3bfc3bfc2a2c287c380c39431c381c2837958c297c3806666666666c285c292c3800ac397c2a370c2a54dc2a0c380703d0ac397c383c396c29fc38047c3a17a140ec28cc29dc380295cc28fc38205c3bec299c380c296c3bc62c389c28f3ec29cc380c39ac3bc33c2a6c299c38dc299c380c29ac299c299c2997934c296c3802606c281c295c3834cc2a1c38052c2b81ec285c39bc2b0c29bc3802b2a2a2a2a2ec29dc3805d6e7fc290c2a1c2bec28ac380295cc28fc382c285c39cc295c380c397c2a3703dc38a28c297c380c3b9c385c2925f6c5fc29cc380c3a17a14c2aec387c2a4c29ac3802b0d39c3b7c38974c29ec38014c2ae47c3a1c2ba03c29dc380c29ac299c299c299c2b9c3abc290c380c284c3ab51c2b81ec28a70c380663401c38ec29a3c534071116805867112527113747114622e";
export default function Recommend() {
  const [siteData, setSiteData] = useState([]);

  const [timestamp, setTimestamp] = useState([]);
  const [totalIn, setTotalIn] = useState([]);
  const [totalOut, setTotalOut] = useState([]);

  useEffect(() => {
    let isLoaded = true;

    let buffer = Buffer.from(hexData, "hex");
    let data = parseInt(buffer.toString("hex", 0, 1), 10);
    console.log("data", data);
    // console.log("dataArray", dataArray);
    // setSiteData(dataArray);

    prepareData();
    return () => {
      isLoaded = false;
    };
  }, []);

  async function prepareData() {
    getModel6();
  }

  async function getModel6() {
    const response = await getEmsModelData(6);
    console.log("response", response);

    var timeStampArray = [];
    var totalInArray = [];
    var totalOutArray = [];
    response.forEach((item) => {
      timeStampArray.push(item.datetime);
      totalInArray.push(item.total_in);
      totalOutArray.push(item.total_out);
    });
    setTimestamp(timeStampArray);
    setTotalIn(totalInArray);
    setTotalOut(totalOutArray);
  }
  return (
    <div className="bg-gray-50 min-h-screen flex w-full text-enzy-dark dark:text-slate-200">
      <main className="p-4 lg:p-8 flex flex-1 flex-col bg-light dark:bg-dark-base">
        <div className="flex flex-col gap-4">
          <div
            className={classNames({
              "flex  flex-col   flex-1  rounded-xl   bg-white p-4   shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200": true,
            })}
          >
            <div className="flex flex-col ">
              <div className="font-semibold text-xl">
                จำนวนคนเข้าออกอาคารประจำวันที่ {dayjs().format("D MMMM BBBB")}
              </div>
            </div>
            <Chart
              totalIn={totalIn}
              totalOut={totalOut}
              timestamp={timestamp}
              colors={["#0F5AAE", "#FFC700"]}
              height={350}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
