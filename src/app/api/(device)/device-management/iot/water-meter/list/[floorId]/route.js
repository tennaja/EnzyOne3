import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const indoorTempHumidData = {
  1: {
    data: [
      {
        id: 1,
        devId: "water_meter01",
        deviceTypeId: 18,
        deviceTypeName: "iot_water_meter",
        deviceName: "Water Meter 1",
        position: { x: 450, y: 440 },
        status: "on",
        flow: formatToNumberWithDecimalPlaces(10.5, 2),
      },
      {
        id: 2,
        devId: "water_meter02",
        deviceTypeId: 18,
        deviceTypeName: "iot_water_meter",
        deviceName: "Water Meter 2",
        position: { x: 510, y: 280 },
        status: "offline",
        flow: "-",
      },
    ],
  },
  2: {
    data: [
      {
        id: 3,
        devId: "water_meter03",
        deviceTypeId: 18,
        deviceTypeName: "iot_water_meter",
        deviceName: "Water Meter 3",
        position: { x: 250, y: 510 },
        status: "offline",
        flow: "-",
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
