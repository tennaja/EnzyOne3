import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { getReportAPI } from "./report-service";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get("dateFrom") ?? dayjs().format("YYYY-MM-DD");
  const dateTo = searchParams.get("dateTo") ?? dayjs().format("YYYY-MM-DD");

  const params = { dateFrom: dateFrom, dateTo: dateTo };
  const response = await getReportAPI(params);

  return NextResponse.json(response);
}
