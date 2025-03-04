import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  //   const { searchParams } = new URL(request.url);

  const { id, value } = await request.json();
  //   const dateFrom = searchParams.get("dateFrom") ?? dayjs().format("YYYY-MM-DD");
  //   const dateTo = searchParams.get("dateTo") ?? dayjs().format("YYYY-MM-DD");

  const https = require("https");

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  const url = `https://enzy-chiller.egat.co.th/api/set_point`;
  const params = {
    id: `CH_${id}`,
    value: value,
  };

  // console.log("params", params);
  try {
    const res = await axios.post(url, params, {
      headers: {
        token: process.env.CHILLER_SETPOINT_TOKEN,
      },
      httpsAgent: agent,
    });
    if (res.status === 201) return NextResponse.json({ message: "success" });
    else {
      return NextResponse.json(res, { status: 400 });
    }
  } catch (error) {
    console.log("error on setpoint", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
