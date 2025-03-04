import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const indoorTempHumidData = {
  1: {
    data: [
      {
        id: 1,
        devId: "cctv01",
        deviceTypeId: 16,
        deviceTypeName: "iot_cctv",
        deviceName: "CCTV 1",
        position: { x: 450, y: 440 },
        status: "on",
      },
      {
        id: 2,
        devId: "cctv02",
        deviceTypeId: 16,
        deviceTypeName: "iot_cctv",
        deviceName: "CCTV 2",
        position: { x: 510, y: 280 },
        status: "offline",
      },
    ],
  },
  2: {
    data: [
      {
        id: 3,
        devId: "cctv03",
        deviceTypeId: 16,
        deviceTypeName: "iot_cctv",
        deviceName: "CCTV 3",
        position: { x: 250, y: 510 },
        status: "offline",
      },
    ],
  },
};
export async function GET(request, { params }) {
  const id = params.floorId;
  const responseData = indoorTempHumidData[id]?.data;

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
