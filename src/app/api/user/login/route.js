import ExecuteQuery from "@/utils/db";
import { jwtGenerate, jwtRefreshTokenGenerate } from "@/utils/function";
import { NextResponse } from "next/server";

const bcrypt = require("bcrypt");
const saltRounds = 10;

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? 0;
  var data = {
    id: id,
    name: "test",
  };
  return NextResponse.json(data);
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

      const accessToken = await jwtGenerate(userObject);
      const refreshToken = await jwtRefreshTokenGenerate(userObject);

      const updateRefreshTokenSQL = `UPDATE [User] SET RefreshToken = '${refreshToken}' WHERE Username = '${username}'`;
      await ExecuteQuery(updateRefreshTokenSQL);

      const response = { accessToken: accessToken, refreshToken: refreshToken };

      // console.log("response", response);
      return NextResponse.json(response);
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } else {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
