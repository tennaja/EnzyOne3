import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? 0;

  const { data } = await axios.get(
    `https://enzyenergy.egat.co.th/api/v1/energy/meterPower/pm3d04?t=1d&sampling=1h`
  );
  console.log("data", data);
  return NextResponse.json(data);
}
