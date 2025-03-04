import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import { unique, validateToken } from "@/utils/function";
import { headers } from "next/headers";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

export async function GET(request) {
  const headersList = headers();
  const authorization = headersList.get("authorization");
  if (!authorization)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const token = authorization.replace("Bearer ", "");
    const result = await validateToken(token);
    if (result.status !== false) {
      const decoded = jwtDecode(token);

      const sql = `SELECT
	Company.Id,
	Company.Name,
	Company.Description 
FROM
	dbo.UserGroupCompanyMapping
	INNER JOIN dbo.Company ON UserGroupCompanyMapping.CompanyId = Company.Id 
WHERE
	UserGroupId = ${decoded?.data?.user_group_id}`;

      const response = await ExecuteQuery(sql);

      if (response.length > 0) {
        const returnResponse = response;
        return NextResponse.json(returnResponse);
      } else {
        var returnResponse = [
          {
            message: "no data",
          },
        ];

        return NextResponse.json(returnResponse[0]);
      }
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 500 });
  }
}

export function POST(request) {
  return NextResponse.json();
}
