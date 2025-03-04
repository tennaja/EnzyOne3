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

  let flowArray = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += interval
  ) {
    let value = 0;
    if (dayjs(index).hour() >= 8 && dayjs(index).hour() <= 18)
      value = numeral(
        numeral(Math.random() * 500 + 2600).format("0.00")
      ).value();
    else
      value = numeral(
        numeral(Math.random() * 50 + 2000).format("0.00")
      ).value();
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: value,
    };
    flowArray.push(dataObject);
  }

  let kwPerTon = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += interval
  ) {
    let value = 0;
    if (dayjs(index).hour() >= 8 && dayjs(index).hour() <= 18)
      value = numeral(
        numeral(Math.random() * 0.3 + 0.7).format("0.00")
      ).value();
    else value = numeral(numeral(Math.random() * 0.2).format("0.00")).value();
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: value,
    };
    kwPerTon.push(dataObject);
  }
  let peopleCountArray = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += interval
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 30).format("0")).value(),
    };
    peopleCountArray.push(dataObject);
  }
  // const responseData = airCompressorData;
  const responseData = {
    flow: [
      {
        id: 1,
        label: "Chiller Supply Flow",
        data: shouldReturnNull ? null : flowArray,
      },
    ],
    efficiency: [
      {
        id: 1,
        label: "Chiller Efficiency",
        data: shouldReturnNull ? null : kwPerTon,
      },
    ],
  };

  if (responseData) {
    return NextResponse.json(responseData);
  }
  // return NextResponse.json({ message: "no data" });
  return NextResponse.json([]);
}
