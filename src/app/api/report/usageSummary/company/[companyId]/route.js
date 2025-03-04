import axios from "axios";
import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";

export async function GET(request, { params }) {
  const id = params.companyId;
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") ?? null;
  const month = searchParams.get("month") ?? null;

  const responseVariable = await getVariablesData(year, month);

  const variables = {
    offPeak_cost: 0,
    onPeak_cost: 0,
    peakDemand_cost: 0,
    service_cost: 0,
    ft: 0,
    solarHour: 0,
    solarService_cost: 0,
  };

  for (const { Data, Value } of responseVariable) {
    switch (Data.toLowerCase()) {
      case "offpeak_cost":
        variables.offPeak_cost = Value;
        break;
      case "onpeak_cost":
        variables.onPeak_cost = Value;
        break;
      case "peakdemand_cost":
        variables.peakDemand_cost = Value;
        break;
      case "service_cost":
        variables.service_cost = Value;
        break;
      case "ft":
        variables.ft = Value;
        break;
      case "solarhour":
        variables.solarHour = Value;
        break;
      case "solarservice_cost":
        variables.solarService_cost = Value;
        break;
      default:
        break;
    }
  }

  const returnResponse = {};

  return NextResponse.json(returnResponse);
}

async function getVariablesData(year, month) {
  const variableSql = `SELECT
	VariableData.Data, 
	VariableData.[Value], 
	VariableData.[Year], 
	VariableData.[Month]
FROM
	dbo.VariableData
	WHERE [Year] = '${year}'
	and [Month] = '${month}'`;

  const responseVariable = await ExecuteQuery(variableSql);
  return responseVariable;
}
