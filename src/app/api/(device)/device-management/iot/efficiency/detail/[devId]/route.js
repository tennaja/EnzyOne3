import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const ahuData = {
  efficiency01: {
    id: 1,
    devId: "efficiency01",
    deviceTypeId: 11,
    deviceTypeName: "iot_efficiency",
    deviceName: "Efficiency 1",
    position: { x: 450, y: 440 },
    status: "on",
    efficiency: formatToNumberWithDecimalPlaces(35.09, 2),
  },
  efficiency02: {
    id: 2,
    devId: "efficiency02",
    deviceTypeId: 11,
    deviceTypeName: "iot_efficiency",
    deviceName: "Efficiency 2",
    position: { x: 510, y: 280 },
    status: "offline",
    efficiency: "-",
  },
  efficiency03: {
    id: 3,
    devId: "efficiency03",
    deviceTypeId: 11,
    deviceTypeName: "iot_efficiency",
    deviceName: "Efficiency 3",
    position: { x: 250, y: 510 },
    status: "offline",
    efficiency: "-",
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
