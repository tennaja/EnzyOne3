import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const ahuData = {
  water_meter01: {
    id: 1,
    devId: "water_meter01",
    deviceTypeId: 18,
    deviceTypeName: "iot_water_meter",
    deviceName: "Water Meter 1",
    position: { x: 450, y: 440 },
    status: "on",
    flow: formatToNumberWithDecimalPlaces(10.5, 2),
  },
  water_meter02: {
    id: 2,
    devId: "water_meter02",
    deviceTypeId: 18,
    deviceTypeName: "iot_water_meter",
    deviceName: "Water Meter 2",
    position: { x: 510, y: 280 },
    status: "offline",
    flow: "-",
  },
  water_meter03: {
    id: 3,
    devId: "water_meter03",
    deviceTypeId: 18,
    deviceTypeName: "iot_water_meter",
    deviceName: "Water Meter 3",
    position: { x: 250, y: 510 },
    status: "offline",
    flow: "-",
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
