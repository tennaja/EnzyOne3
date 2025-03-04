import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const ahuData = {
  inv01: {
    id: 1,
    devId: "inv01",
    deviceTypeId: 9,
    deviceTypeName: "iot_inverter",
    deviceName: "Inverter 1",
    position: { x: 450, y: 440 },
    status: "on",
    power: formatToNumberWithDecimalPlaces(6.04, 2),
    current: formatToNumberWithDecimalPlaces(15, 2),
    volt: formatToNumberWithDecimalPlaces(220, 0),
    energy: formatToNumberWithDecimalPlaces(54000, 0),
  },
  inv02: {
    id: 2,
    devId: "inv02",
    deviceTypeId: 9,
    deviceTypeName: "iot_inverter",
    deviceName: "Inverter 2",
    position: { x: 510, y: 280 },
    status: "offline",
    power: "-",
    current: "-",
    volt: "-",
    energy: "-",
  },
  inv03: {
    id: 3,
    devId: "inv03",
    deviceTypeId: 9,
    deviceTypeName: "iot_inverter",
    deviceName: "Inverter 3",
    position: { x: 250, y: 510 },
    status: "offline",
    power: "-",
    current: "-",
    volt: "-",
    energy: "-",
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
