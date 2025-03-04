import ExecuteQuery from "@/utils/db";
import axios from "axios";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateRefreshToken } from "@/utils/function";
import { jwtDecode } from "jwt-decode";
import { jwtGenerate, jwtRefreshTokenGenerate } from "@/utils/function";

export async function POST(request) {
  try {
    /*  const data = await request.json();
    const { token } = data; */

    const headersList = headers();
    const authorization = headersList.get("authorization");
    if (!authorization)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = authorization.replace("Bearer ", "");

    // valid refresh token ที่ส่งเข้ามา
    const result = await validateRefreshToken(token);
    console.log("result validate token", result);
    if (result.status != false) {
      const decoded = jwtDecode(token);

      const sql = `SELECT Username,UserGroupId , RefreshToken FROM [User] WHERE Username = '${decoded?.data?.username}' AND RefreshToken = '${token}' `;

      const user = await ExecuteQuery(sql);
      console.log("user", user);
      if (user.length > 0) {
        const userObject = {
          username: user?.[0].Username,
          user_group_id: hashPassword?.[0].UserGroupId,
        };
        const accessToken = await jwtGenerate(userObject);
        const refreshToken = await jwtRefreshTokenGenerate(userObject);

        const updateRefreshTokenSQL = `UPDATE [User] SET RefreshToken = '${refreshToken}' WHERE Username = '${username}'`;
        await ExecuteQuery(updateRefreshTokenSQL);

        const response = {
          accessToken: accessToken,
          refreshToken: refreshToken,
        };

        console.log("response", response);
        return NextResponse.json(response);
      } else {
        return NextResponse.json({ message: "Token expired" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
}
