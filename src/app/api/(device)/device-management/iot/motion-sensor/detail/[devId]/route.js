import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const ahuData = {
  motion_sensor01: {
    id: 1,
    devId: "motion_sensor01",
    deviceTypeId: 11,
    deviceTypeName: "iot_motion_sensor",
    deviceName: "Motion Sensor 1",
    position: { x: 450, y: 440 },
    status: "on",
    detect: true,
  },
  motion_sensor02: {
    id: 2,
    devId: "motion_sensor02",
    deviceTypeId: 11,
    deviceTypeName: "iot_motion_sensor",
    deviceName: "Motion Sensor 2",
    position: { x: 510, y: 280 },
    status: "offline",
    detect: "-",
  },
  motion_sensor03: {
    id: 3,
    devId: "motion_sensor03",
    deviceTypeId: 11,
    deviceTypeName: "iot_motion_sensor",
    deviceName: "Motion Sensor 3",
    position: { x: 250, y: 510 },
    status: "offline",
    detect: "-",
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
