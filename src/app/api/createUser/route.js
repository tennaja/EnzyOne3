import ExecuteQuery from "@/utils/db";
import axios from "axios";
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

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    var sql = `INSERT INTO [User] (username,password) VALUES ( '${username}', '${hash}')`;

    var createUser = await ExecuteQuery(sql);
    console.log("sql", sql);
  });

  return NextResponse.json(data);
}

export async function PUT(request) {
  // const { searchParams } = new URL(request.url);
  // const id = searchParams.get("id") ?? 0;
  const data = await request.json();
  const { username, password } = data;

  const user = `SELECT username FROM [User] WHERE username = '${username}'`;
  const response = await ExecuteQuery(user);

  if (response.length > 0) {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      const sql = `UPDATE  [User] SET password =  '${hash}'  WHERE username = '${username}'`;

      const createUser = await ExecuteQuery(sql);
      console.log("createUser", response);
    });

    return NextResponse.json(data);
  }
}
