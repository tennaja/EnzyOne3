import ExecuteQuery from "@/utils/db";
import { checkAuthorization } from "@/utils/function";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  checkAuthorization(request);
  const { searchParams } = new URL(request.url);
  const id = params.companyId;

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

  try {
    const responseBranch = await getBranch(id, branchIdList);
    return NextResponse.json(responseBranch);
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

async function getBranch(id, branchIdList) {
  const branchSql = `SELECT Id , Name  FROM Branch 
    WHERE CompanyId = '${id}' ${
    branchIdList.length > 0
      ? ` AND Branch.Id IN ( ${branchIdList.join(",")} )`
      : ""
  }`;

  const responseBranch = await ExecuteQuery(branchSql);
  return responseBranch;
}
