import { formatTimestampData, unique } from "@/utils/function";
import dayjs from "dayjs";
import ExecuteQuery from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request) {}

export async function POST(request) {
  const data = await request.json();
  const { username, type, detail } = data;
  // var data = {};

  var sql = `INSERT INTO EMSLog (Type,Username,Timestamp,Detail) VALUES ('${type}','${username}',GETDATE(), '${detail}')`;

  var insertResult = await ExecuteQuery(sql);

  return NextResponse.json(data);
}
