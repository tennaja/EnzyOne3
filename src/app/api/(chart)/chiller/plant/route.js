import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { getChillerPlantAPI } from "./chillerPlant-service";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get("dateFrom") ?? dayjs().format("YYYY-MM-DD");
  const dateTo = searchParams.get("dateTo") ?? dayjs().format("YYYY-MM-DD");

  const params = { dateFrom: dateFrom, dateTo: dateTo };
  const response = await getChillerPlantAPI(params);

  return NextResponse.json(response);
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
