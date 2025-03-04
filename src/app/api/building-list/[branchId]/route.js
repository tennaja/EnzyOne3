import ExecuteQuery from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const id = params.branchId;
  try {
    const responseBuilding = await getBuilding(id);
    return NextResponse.json(responseBuilding);
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

async function getBuilding(id) {
  const branchSql = `SELECT
	Building.Id,
	Building.Name 
FROM
	dbo.Branch
	INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
	INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
	INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
WHERE
	Branch.Id = '${id}'`;

  const responseBuilding = await ExecuteQuery(branchSql);
  return responseBuilding;
}
