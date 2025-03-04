import ExecuteQuery from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const id = params.buildingId;
  try {
    const responseFloor = await getFloor(id);
    return NextResponse.json(responseFloor);
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

async function getFloor(id) {
  const branchSql = `SELECT
	Floor.Id,
	Floor.Name 
FROM
	dbo.Building
	INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId 
WHERE
	Building.Id =  '${id}'`;

  const responseFloor = await ExecuteQuery(branchSql);
  return responseFloor;
}
