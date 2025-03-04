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

  const interval = 60000;

  let supplyTemp = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += interval
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 3 + 44).format("0.00")).value(),
    };
    supplyTemp.push(dataObject);
  }

  let returnTemp = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += interval
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 6 + 50).format("0.00")).value(),
    };
    returnTemp.push(dataObject);
  }
  let outdoorTemp = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += interval
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 10 + 77).format("0.0")).value(),
    };
    outdoorTemp.push(dataObject);
  }
  let powerConsumption = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += interval
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 10 + 2).format("0,0.00")).value(),
    };
    powerConsumption.push(dataObject);
  }
  // const responseData = airCompressorData;
  const responseData = [
    {
      id: 1,
      label: "Chiller Supply Temperature",
      data: shouldReturnNull ? null : supplyTemp,
    },
    {
      id: 2,
      label: "Chiller Return Temperature",
      data: shouldReturnNull ? null : returnTemp,
    },
    {
      id: 3,
      label: "Outdoor Temperature",
      data: shouldReturnNull ? null : outdoorTemp,
    },
    {
      id: 4,
      label: "Power",
      data: shouldReturnNull ? null : powerConsumption,
    },
  ];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  // return NextResponse.json({ message: "no data" });
  return NextResponse.json([]);
}
