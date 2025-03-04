import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";

import dayjs from "dayjs";
import { ceil, floor } from "@/utils/utils";

export async function GET(request) {
  dayjs.extend(floor);
  dayjs.extend(ceil);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? 1;

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
	Company.Id = ${id}`;

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

    const currentDemandQuery = `SELECT RawData.DevId, Device.Name,  Max ( RawData.Value ) AS CurrentDemand 
  FROM
    dbo.Building
    INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
    INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
    INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
  WHERE
    Building.Id IN ( ${building} ) 
    AND Device.DeviceTypeId LIKE '%pm%'
    AND Device.Sequence = 1
    AND RawData.Field = 'kw'
    AND RawData.Timestamp >=Convert(datetime,'${datetimeNow}')
    AND RawData.Timestamp < Convert(datetime,'${datetimeEnd}') GROUP BY RawData.DevId ,Device.Name`;

    const currentDemandResponse = await ExecuteQuery(currentDemandQuery);

    const today = now.format("YYYY-MM-DD");

    let totalCurrentDemand = 0;
    for (const currentDemand of currentDemandResponse) {
      totalCurrentDemand += currentDemand.CurrentDemand;
    }
    const returnResponse = [
      {
        id: id,
        name: companyName,
        total_current_demand: totalCurrentDemand,
        current_demand: currentDemandResponse,
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
