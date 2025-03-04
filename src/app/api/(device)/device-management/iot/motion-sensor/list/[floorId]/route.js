import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const indoorTempHumidData = {
  1: {
    data: [
      {
        id: 1,
        devId: "motion_sensor01",
        deviceTypeId: 11,
        deviceTypeName: "iot_motion_sensor",
        deviceName: "Motion Sensor 1",
        position: { x: 450, y: 440 },
        status: "on",
        detect: true,
      },
      {
        id: 2,
        devId: "motion_sensor02",
        deviceTypeId: 11,
        deviceTypeName: "iot_motion_sensor",
        deviceName: "Motion Sensor 2",
        position: { x: 510, y: 280 },
        status: "offline",
        detect: "-",
      },
    ],
  },
  2: {
    data: [
      {
        id: 3,
        devId: "motion_sensor03",
        deviceTypeId: 11,
        deviceTypeName: "iot_motion_sensor",
        deviceName: "Motion Sensor 3",
        position: { x: 250, y: 510 },
        status: "offline",
        detect: "-",
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
