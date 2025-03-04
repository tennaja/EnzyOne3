import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { getChillerAPI } from "./chiller-service";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get("dateFrom") ?? dayjs().format("YYYY-MM-DD");
  const dateTo = searchParams.get("dateTo") ?? dayjs().format("YYYY-MM-DD");

  const paramsCH01 = { id: "CH_01", dateFrom: dateFrom, dateTo: dateTo };
  const responseCH01 = await getChillerAPI(paramsCH01);

  const paramsCH02 = { id: "CH_02", dateFrom: dateFrom, dateTo: dateTo };
  const responseCH02 = await getChillerAPI(paramsCH02);

  const paramsCH03 = { id: "CH_03", dateFrom: dateFrom, dateTo: dateTo };
  const responseCH03 = await getChillerAPI(paramsCH03);

  const paramsCH04 = { id: "CH_04", dateFrom: dateFrom, dateTo: dateTo };
  const responseCH04 = await getChillerAPI(paramsCH04);

  // return NextResponse.json(mergeArray);

  const summedArray = sumArrays([
    responseCH01,
    responseCH02,
    responseCH03,
    responseCH04,
  ]);

  const responseData = {
    total: summedArray,
    chiller_01: responseCH01,
    chiller_02: responseCH02,
    chiller_03: responseCH03,
    chiller_04: responseCH04,
  };
  return NextResponse.json(responseData);
}

function sumArrays(arrays) {
  const result = {};

  arrays.forEach((array) => {
    array.forEach((item) => {
      const { time, value } = item;
      if (result[time] === undefined) {
        result[time] = 0;
      }
      result[time] += value;
    });
  });

  // Convert the result object back to an array if needed
  const summedArray = Object.keys(result).map((time) => ({
    time: time,
    value: result[time],
  }));

  return summedArray;
}
