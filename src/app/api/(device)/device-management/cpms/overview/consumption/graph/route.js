import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const floorId = searchParams.get("floorId") ?? 1;
  const period = searchParams.get("period") ?? "day";
  let dateFrom = searchParams.get("date") ?? dayjs().format("YYYY-MM-DD");
  let dateTo = dayjs();
  if (period === "day") {
    dateTo = dayjs(dateFrom).add(1, "day").format("YYYY-MM-DD");
  } else if (period === "month") {
    dateFrom = dayjs(dateFrom).startOf("month").format("YYYY-MM-DD");

    dateTo = dayjs(dateFrom).endOf("month").format("YYYY-MM-DD");
  } else if (period === "year") {
    dateFrom = dayjs(dateFrom).startOf("year").format("YYYY-MM-DD");
    dateTo = dayjs(dateFrom).endOf("year").format("YYYY-MM-DD");
  }

  // check if datefrom is less than condition
  let shouldReturnNull = false;
  if (dayjs(dateTo).isBefore(dayjs("2024-05-01"))) {
    shouldReturnNull = true;
  }

  const interval =
    period === "day" ? 3600000 : period === "month" ? 86400000 : 60000;

  // for loop to generate random data for each month

  let energyConsumptionArray = [];

  if (period === "year") {
    let month = dayjs(dateFrom);
    while (month.isBefore(dayjs(dateTo))) {
      let value = numeral(
        numeral(Math.random() * 1000 + 4000).format("0.00")
      ).value();
      if (dayjs(month).isAfter(dayjs())) {
        value = null;
      }

      const dataObject = {
        time: month.format("YYYY-MM-DD"),
        value: value,
      };
      energyConsumptionArray.push(dataObject);
      month = month.add(1, "month");
    }
  } else if (period === "day") {
    for (
      let index = dayjs(dateFrom).valueOf();
      index < dayjs(dateTo).valueOf();
      index += interval
    ) {
      let value = numeral(
        numeral(Math.random() * 10 + 20).format("0.00")
      ).value();
      if (dayjs(index).isAfter(dayjs())) {
        value = null;
      }
      const dataObject = {
        time: dayjs(index).format("YYYY-MM-DD HH:mm"),
        value: value,
      };
      energyConsumptionArray.push(dataObject);
    }
  } else {
    for (
      let index = dayjs(dateFrom).valueOf();
      index <= dayjs(dateTo).valueOf();
      index += interval
    ) {
      let value = numeral(
        numeral(Math.random() * 100 + 400).format("0.00")
      ).value();
      if (dayjs(index).isAfter(dayjs())) {
        value = null;
      }
      const dataObject = {
        time: dayjs(index).format("YYYY-MM-DD HH:mm"),
        value: value,
      };
      energyConsumptionArray.push(dataObject);
    }
  }

  const responseData = [
    {
      label: "Energy consumption",
      data: shouldReturnNull ? null : energyConsumptionArray,
    },
  ];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
