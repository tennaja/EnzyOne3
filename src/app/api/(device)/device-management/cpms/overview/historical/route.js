import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const floorId = searchParams.get("floorId") ?? 1;
  let dateFrom = searchParams.get("dateFrom") ?? dayjs().format("YYYY-MM-DD");
  let dateTo = searchParams.get("dateTo") ?? dayjs().format("YYYY-MM-DD");

  if (dateFrom == dateTo) {
    dateTo = dayjs(dateTo).add(1, "day").format("YYYY-MM-DD");
  }

  // check if datefrom is less than condition
  let shouldReturnNull = false;
  if (dayjs(dateTo).isBefore(dayjs("2024-05-01"))) {
    shouldReturnNull = true;
  }

  const interval = 3600000;

  let powerArray = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += interval
  ) {
    let value = numeral(numeral(Math.random() * 6 + 3).format("0.00")).value();
    if (dayjs(index).isAfter(dayjs())) {
      value = null;
    }
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: value,
    };
    powerArray.push(dataObject);
  }

  let powerArray2 = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += interval
  ) {
    let value = numeral(numeral(Math.random() * 6 + 3).format("0.00")).value();
    if (dayjs(index).isAfter(dayjs())) {
      value = null;
    }
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: value,
    };
    powerArray2.push(dataObject);
  }
  let peopleCountArray = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += interval
  ) {
    let value = numeral(numeral(Math.random() * 30).format("0")).value();
    if (dayjs(index).isAfter(dayjs())) {
      value = null;
    }
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: value,
    };
    peopleCountArray.push(dataObject);
  }
  // const responseData = airCompressorData;
  const responseData = {
    power: [
      {
        id: 1,
        label: "Current Power",
        data: shouldReturnNull ? null : powerArray,
      },
      {
        id: 2,
        label: "Power Generation",
        data: shouldReturnNull ? null : powerArray2,
      },
    ],
    count: [
      {
        id: 1,
        label: "No. of people",
        data: shouldReturnNull ? null : peopleCountArray,
      },
    ],
  };

  if (responseData) {
    return NextResponse.json(responseData);
  }
  // return NextResponse.json({ message: "no data" });
  return NextResponse.json([]);
}
