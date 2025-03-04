import { NextResponse } from "next/server";
import { headers } from "next/headers";
import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";
import { jwtDecode } from "jwt-decode";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const sql = `SELECT
  VariableData.Data, 
  VariableData.[Value], 
  VariableData.[Year], 
  VariableData.[Month]
FROM
  dbo.VariableData
  WHERE [Year] = ${year}
  and [Month] = ${month} `;

  const responseVariable = await ExecuteQuery(sql);

  if (responseVariable.length > 0) {
    return NextResponse.json(responseVariable);
  } else {
    const returnResponse = {
      message: "no data",
    };
    return NextResponse.json(returnResponse);
  }
}
