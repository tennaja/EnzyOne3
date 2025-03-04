import ExecuteQuery from "@/utils/db";
import axios from "axios";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateToken } from "@/utils/function";

export async function POST(request) {
  try {
    /*  const data = await request.json();
    const { token } = data; */

    const headersList = headers();
    const authorization = headersList.get("authorization");
    if (!authorization)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = authorization.replace("Bearer ", "");

    const result = await validateToken(token);

    if (result.status != false) return NextResponse.json({ message: "Ok" });
    else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
}
