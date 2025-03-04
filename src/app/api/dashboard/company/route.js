import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";

import dayjs from "dayjs";
import { ceil, floor, formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { format } from "winston";
import { calculateFlatRateCost } from "../../utils/function";

export async function GET(request) {
  dayjs.extend(floor);
  dayjs.extend(ceil);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? 1;
  const username = searchParams.get("username") ?? null;

  let branchIdList = [];
  if (username !== null || username !== undefined) {
    const userBranchQuery = `SELECT
    BranchId 
  FROM
    User_Branch 
  WHERE
    Username = '${username}' `;

    const userBranchResponse = await ExecuteQuery(userBranchQuery);
    for (const userBranchObject of userBranchResponse) {
      branchIdList.push(userBranchObject.BranchId);
    }
  }
  const sql = `SELECT
	Company.Id,
	Company.Name,
	Company.Description,
	Branch.Id AS BranchId,
	Branch.Name AS BranchName,
	Area.Id AS AreaId,
	Area.Name AS AreaName,
	Building.Id AS BuildingId,
	Building.Name AS BuildingName
FROM
	dbo.Company
	INNER JOIN dbo.Branch ON Company.Id = Branch.CompanyId
	INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
	INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
	INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
WHERE
	Company.Id = ${id} ${
    branchIdList.length > 0
      ? ` AND Branch.Id IN ( ${branchIdList.join(",")} )`
      : ""
  }`;

  const response = await ExecuteQuery(sql);

  if (response.length > 0) {
    const companyName = unique(response, "Name")[0];
    const companyDescription = unique(response, "Description")[0];
    const branch = unique(response, "BranchId");
    const area = unique(response, "AreaId");
    const building = unique(response, "BuildingId");

    const now = dayjs();
    // const datetimeNow = now.format("YYYY-MM-DD HH:[00:00]");
    const datetimeNow = now.floor("minute", 5).format("YYYY-MM-DD HH:mm:[00]");
    const datetimeEnd = now.ceil("minute", 5).format("YYYY-MM-DD HH:mm:[00]");

    const variableSql = `SELECT
	VariableData.Data, 
	VariableData.[Value], 
	VariableData.[Year], 
	VariableData.[Month]
FROM
	dbo.VariableData
	WHERE [Year] = ${now.get("year")}
	and [Month] = ${now.get("month") + 1}`;

    const responseVariable = await ExecuteQuery(variableSql);
    let offPeak_cost = 0;
    let onPeak_cost = 0;
    let solar_hour = 0;
    let flat_rate_level_1_cost = 0;
    let flat_rate_level_2_cost = 0;
    let flat_rate_level_3_cost = 0;

    for (const variable of responseVariable) {
      if (variable.Data.toLowerCase() == "offpeak_cost")
        offPeak_cost = variable.Value;
      else if (variable.Data.toLowerCase() == "onpeak_cost")
        onPeak_cost = variable.Value;
      else if (variable.Data.toLowerCase() == "solarhour")
        solar_hour = variable.Value;
      else if (variable.Data.toLowerCase() == "flat_level_1_cost")
        flat_rate_level_1_cost = variable.Value;
      else if (variable.Data.toLowerCase() == "flat_level_2_cost")
        flat_rate_level_2_cost = variable.Value;
      else if (variable.Data.toLowerCase() == "flat_level_3_cost")
        flat_rate_level_3_cost = variable.Value;
    }

    const today = now.format("YYYY-MM-DD");

    const energyGenerationQuery = `SELECT
    Type,
    SUM ( MaxEnergy - MinEnergy ) AS EnergyGeneration 
  FROM
    (
    SELECT
      'Solar' AS Type,
      MAX ( RawData.Value ) AS MaxEnergy,
      MIN ( RawData.Value ) AS MinEnergy 
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${building} ) 
      AND Device.DeviceTypeId LIKE '%gen%' 
      AND (RawData.Field = 'kwh' OR  RawData.Field = 'kwh_import')
      AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) 
    GROUP BY
      RawData.DevId 
    ) t 
  GROUP BY
    Type`;

    const energyGenerationResponse = await ExecuteQuery(energyGenerationQuery);

    const solarGenerationQuery = `SELECT
    Type,
    SUM ( MaxEnergy - MinEnergy ) AS Energy 
  FROM
    (
    SELECT
      'Solar' AS Type,
      MAX ( RawData.Value ) AS MaxEnergy,
      MIN ( RawData.Value ) AS MinEnergy 
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${building} ) 
      AND Device.DeviceTypeId LIKE '%gen_solar%' 
      AND (RawData.Field = 'kwh' OR  RawData.Field = 'kwh_import')
      AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) 
    GROUP BY
      RawData.DevId 
    ) t 
  GROUP BY
    Type`;

    const solarGenerationResponse = await ExecuteQuery(solarGenerationQuery);

    const solarTotalGenerationQuery = `
    SELECT 
    'Solar' AS Type,
SUM (MaxEnergy) AS MaxEnergy
    FROM (
    SELECT
      'Solar' AS Type,
      MAX ( RawData.Value ) AS MaxEnergy
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${building} ) 
      AND Device.DeviceTypeId LIKE '%gen_solar%' 
      AND (RawData.Field = 'kwh' OR  RawData.Field = 'kwh_import')
      AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) 
    GROUP BY
      RawData.DevId) Energy `;

    const solarTotalGenerationResponse = await ExecuteQuery(
      solarTotalGenerationQuery
    );

    const energy_generation =
      energyGenerationResponse?.[0]?.EnergyGeneration ?? 0;
    const solar_energy = solarGenerationResponse?.[0]?.Energy ?? 0;

    const solar_total_energy =
      solarTotalGenerationResponse?.[0]?.MaxEnergy ?? 0;

    const yield_solar = solar_energy * solar_hour;
    const yield_solar_up_to_date = solar_total_energy * solar_hour;

    const totalYield = yield_solar;
    const totalYieldUpToDate = yield_solar_up_to_date;
    const carbon_reduced = solar_total_energy * 0.4;
    const carbon_reduced_ton = carbon_reduced / 1000;
    const tree_planted = carbon_reduced / 30;

    const returnResponse = [
      {
        id: id,
        name: companyName,
        description: companyDescription,
        energy_generation: formatToNumberWithDecimalPlaces(
          energy_generation,
          2
        ),
        total_yield: formatToNumberWithDecimalPlaces(totalYield, 2),
        energy_generation_total:
          formatToNumberWithDecimalPlaces(solar_total_energy),
        total_yield_up_to_date:
          formatToNumberWithDecimalPlaces(totalYieldUpToDate),
        carbon_reduced: formatToNumberWithDecimalPlaces(carbon_reduced_ton, 2),
        tree_planted: formatToNumberWithDecimalPlaces(tree_planted),
      },
    ];

    return NextResponse.json(returnResponse[0]);
  } else {
    const returnResponse = [
      {
        message: "no data",
      },
    ];

    return NextResponse.json(returnResponse[0]);
  }
}

export function POST(request) {
  return NextResponse.json();
}
