import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const ahuData = {
  flow_meter01: {
    id: 1,
    devId: "flow_meter01",
    deviceTypeId: 10,
    deviceTypeName: "iot_flow_meter",
    deviceName: "Flow Meter 1",
    position: { x: 450, y: 440 },
    status: "on",
    flow: formatToNumberWithDecimalPlaces(4.35, 2),
  },
  flow_meter02: {
    id: 2,
    devId: "flow_meter02",
    deviceTypeId: 10,
    deviceTypeName: "iot_flow_meter",
    deviceName: "Flow Meter 2",
    position: { x: 510, y: 280 },
    status: "offline",
    flow: "-",
  },
  flow_meter03: {
    id: 3,
    devId: "flow_meter03",
    deviceTypeId: 10,
    deviceTypeName: "iot_flow_meter",
    deviceName: "Flow Meter 3",
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
