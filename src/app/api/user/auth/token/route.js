import ExecuteQuery from "@/utils/db";
import { jwtGenerate } from "@/utils/function";
import { NextResponse } from "next/server";
const bcrypt = require("bcrypt");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  const sql = `SELECT Username,Name,Email , UserGroupId , RefreshToken FROM [User] WHERE Username = '${username}'`;

  try {
    const sqlResult = await ExecuteQuery(sql);
    if (sqlResult.length > 0) {
      const response = sqlResult[0];
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ message: "no data" });
    }
  } catch (error) {
    return NextResponse.json({ message: "error occured", error: error });
  }
}

export async function POST(request) {
  const data = await request.json();
  const { username, password } = data;
  // var data = {};

  const sql = `SELECT Username,Password , Name, Email, UserGroupId FROM [User] WHERE Username = '${username}'`;

  const hashPassword = await ExecuteQuery(sql);
  // console.log("hashPassword", hashPassword);
  if (hashPassword.length > 0) {
    const result = await bcrypt.compare(password, hashPassword?.[0].Password);

    if (result == true) {
      hashPassword?.[0].UserGroupId;

      const userObject = {
        username: username,
        user_group_id: hashPassword?.[0].UserGroupId,
        name: hashPassword?.[0].Name,
        email: hashPassword?.[0].Email,
      };

      const accessToken = await jwtGenerate(userObject, "1y");

      /** TODO update token to Database */
      // const updateRefreshTokenSQL = `UPDATE [User] SET RefreshToken = '${refreshToken}' WHERE Username = '${username}'`;
      // await ExecuteQuery(updateRefreshTokenSQL);

      const response = { accessToken: accessToken };

      // console.log("response", response);
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } else {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
