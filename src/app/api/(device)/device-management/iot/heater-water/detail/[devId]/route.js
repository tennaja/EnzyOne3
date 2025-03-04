import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const ahuData = {
  heater_water01: {
    id: 1,
    devId: "heater_water01",
    deviceTypeId: 7,
    deviceTypeName: "iot_heater_water",
    deviceName: "Gauge 1",
    position: { x: 450, y: 440 },
    status: "on",
    temp: formatToNumberWithDecimalPlaces(101.3, 2),
  },
  heater_water02: {
    id: 2,
    devId: "heater_water02",
    deviceTypeId: 7,
    deviceTypeName: "iot_heater_water",
    deviceName: "Gauge 2",
    position: { x: 510, y: 280 },
    status: "offline",
    temp: "-",
  },
  heater_water03: {
    id: 3,
    devId: "heater_water03",
    deviceTypeId: 7,
    deviceTypeName: "iot_heater_water",
    deviceName: "Gauge 3",
    position: { x: 250, y: 510 },
    status: "offline",
    temp: "-",
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
