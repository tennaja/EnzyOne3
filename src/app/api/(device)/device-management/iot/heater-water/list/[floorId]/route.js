import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const indoorTempHumidData = {
  1: {
    data: [
      {
        id: 1,
        devId: "heater_water01",
        deviceTypeId: 7,
        deviceTypeName: "iot_heater_water",
        deviceName: "Heater Water 1",
        position: { x: 450, y: 440 },
        status: "on",
        temp: formatToNumberWithDecimalPlaces(101.3, 2),
      },
      {
        id: 2,
        devId: "heater_water02",
        deviceTypeId: 7,
        deviceTypeName: "iot_heater_water",
        deviceName: "Heater Water 2",
        position: { x: 510, y: 280 },
        status: "offline",
        temp: "-",
      },
    ],
  },
  2: {
    data: [
      {
        id: 3,
        devId: "heater_water03",
        deviceTypeId: 7,
        deviceTypeName: "iot_heater_water",
        deviceName: "Gauge 3",
        position: { x: 250, y: 510 },
        status: "offline",
        temp: "-",
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
