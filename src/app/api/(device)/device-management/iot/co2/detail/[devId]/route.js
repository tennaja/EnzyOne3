import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const ahuData = {
  co2_sensor01: {
    id: 1,
    devId: "co2_sensor01",
    deviceTypeId: 17,
    deviceTypeName: "iot_co2_sensor",
    deviceName: "CO2 Sensor 1",
    position: { x: 450, y: 440 },
    status: "on",
    co2: formatToNumberWithDecimalPlaces(6.04, 2),
  },
  co2_sensor02: {
    id: 2,
    devId: "co2_sensor02",
    deviceTypeId: 17,
    deviceTypeName: "iot_co2_sensor",
    deviceName: "CO2 Sensor 2",
    position: { x: 510, y: 280 },
    status: "offline",
    co2: "-",
  },
  co2_sensor03: {
    id: 3,
    devId: "co2_sensor03",
    deviceTypeId: 17,
    deviceTypeName: "iot_co2_sensor",
    deviceName: "CO2 Sensor 3",
    position: { x: 250, y: 510 },
    status: "offline",
    co2: "-",
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
