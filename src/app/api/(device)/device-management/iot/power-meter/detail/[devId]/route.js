import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const ahuData = {
    power_meter01: {
      id: 1,
      devId: "power_meter01",
      deviceTypeId: 8,
      deviceTypeName: "iot_power_meter",
      deviceName: "MDB 1",
      position: {
        x: Math.floor(Math.random() * 100 + 100), // for x between 0 and 500
        y: Math.floor(Math.random() * 100 + 150), // for y between 0 and 500
      },
      status: "on",
      power: numeral(Math.random() * 4 + 2).format("0.00"),
      current: numeral(Math.random() * 4 + 13).format("0.00"),
      volt: numeral(Math.random() * 3 + 219).format("0"),
      energy_import: numeral(Math.random() * 10000 + 120000).format("0,0"),
      energy_export: numeral(Math.random() * 1000 + 6000).format("0,0"),
    },
    power_meter02: {
      id: 2,
      devId: "power_meter02",
      deviceTypeId: 8,
      deviceTypeName: "iot_power_meter",
      deviceName: "MDB 2",
      position: {
        x: Math.floor(Math.random() * 350 + 200), // for x between 0 and 500
        y: Math.floor(Math.random() * 300 + 250), // for y between 0 and 500
      },
      status: "offline",
      power: "-",
      current: "-",
      volt: "-",
      energy_import: "-",
      energy_export: "-",
    },
    power_meter03: {
      id: 3,
      devId: "power_meter03",
      deviceTypeId: 8,
      deviceTypeName: "iot_power_meter",
      deviceName: "MDB 3",
      position: { x: 250, y: 510 },
      status: "offline",
      power: "-",
      current: "-",
      volt: "-",
      energy_import: "-",
      energy_export: "-",
    },
  };
  const id = params.devId;
  const responseData = ahuData[id];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
