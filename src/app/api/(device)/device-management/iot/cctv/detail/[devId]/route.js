import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const ahuData = {
  cctv01: {
    id: 1,
    devId: "cctv01",
    deviceTypeId: 16,
    deviceTypeName: "iot_cctv",
    deviceName: "CCTV 1",
    position: { x: 450, y: 440 },
    status: "on",
  },
  cctv02: {
    id: 2,
    devId: "cctv02",
    deviceTypeId: 16,
    deviceTypeName: "iot_cctv",
    deviceName: "CCTV 2",
    position: { x: 510, y: 280 },
    status: "offline",
  },
  cctv03: {
    id: 3,
    devId: "cctv03",
    deviceTypeId: 16,
    deviceTypeName: "iot_cctv",
    deviceName: "CCTV 3",
    position: { x: 250, y: 510 },
    status: "offline",
  },
};
export async function GET(request, { params }) {
  const id = params.devId;
  const responseData = ahuData[id];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
