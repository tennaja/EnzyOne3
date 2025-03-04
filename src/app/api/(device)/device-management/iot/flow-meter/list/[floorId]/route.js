import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const indoorTempHumidData = {
  1: {
    data: [
      {
        id: 1,
        devId: "flow_meter01",
        deviceTypeId: 10,
        deviceTypeName: "iot_flow_meter",
        deviceName: "Flow Meter 1",
        position: { x: 450, y: 440 },
        status: "on",
        flow: formatToNumberWithDecimalPlaces(4.35, 2),
      },
      {
        id: 2,
        devId: "flow_meter02",
        deviceTypeId: 10,
        deviceTypeName: "iot_flow_meter",
        deviceName: "Flow Meter 2",
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
        devId: "flow_meter03",
        deviceTypeId: 10,
        deviceTypeName: "iot_flow_meter",
        deviceName: "Flow Meter 3",
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
