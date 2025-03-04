import axios from "axios";
import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? 0;
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
  var response = await ExecuteQuery(`SELECT
	Company.Id AS id,
	Company.Name AS name,
	Company.Description AS description,
	COUNT ( DISTINCT Branch.Id ) AS branch,
	COUNT ( DISTINCT Area.Id ) AS area,
	COUNT ( DISTINCT Building.Id ) AS building,
	COUNT ( DISTINCT Floor.Id ) AS floor 
FROM
	dbo.Company
	LEFT JOIN dbo.Branch ON Company.Id = Branch.CompanyId
	LEFT JOIN dbo.Area ON Branch.Id = Area.BranchId
	LEFT JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
	LEFT JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id
	LEFT JOIN dbo.Floor ON Building.Id = Floor.BuildingId 
WHERE
	Company.Id = ${id} ${
    branchIdList.length > 0
      ? ` AND Branch.Id IN ( ${branchIdList.join(",")} )`
      : ""
  }
GROUP BY
	Company.Id,
	Company.Name,
	Company.Description`);

  return NextResponse.json(response);
}
