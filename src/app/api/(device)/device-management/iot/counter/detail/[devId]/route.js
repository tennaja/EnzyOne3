import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const ahuData = {
  counter01: {
    id: 1,
    devId: "counter01",
    deviceTypeId: 13,
    deviceTypeName: "iot_counter",
    deviceName: "Counter 1",
    position: { x: 450, y: 440 },
    status: "on",
    pieces: formatToNumberWithDecimalPlaces(2),
  },
  counter02: {
    id: 2,
    devId: "counter02",
    deviceTypeId: 13,
    deviceTypeName: "iot_counter",
    deviceName: "Counter 2",
    position: { x: 510, y: 280 },
    status: "offline",
    pieces: "-",
  },
  counter03: {
    id: 3,
    devId: "counter03",
    deviceTypeId: 13,
    deviceTypeName: "iot_counter",
    deviceName: "Counter 3",
    position: { x: 250, y: 510 },
    status: "offline",
    pieces: "-",
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
