import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const ahuData = {
    pressure01: {
      id: 1,
      devId: "pressure01",
      deviceTypeId: 7,
      deviceTypeName: "iot_pressure_gauge",
      deviceName: "Gauge 1",
      position: {
        x: Math.floor(Math.random() * 100 + 100), // for x between 0 and 500
        y: Math.floor(Math.random() * 100 + 150), // for y between 0 and 500
      },
      status: "on",
      pressure: numeral(Math.random() * 4 + 3).format("0.00"),
    },
    pressure02: {
      id: 2,
      devId: "pressure02",
      deviceTypeId: 7,
      deviceTypeName: "iot_pressure_gauge",
      deviceName: "Gauge 2",
      position: {
        x: Math.floor(Math.random() * 350 + 200), // for x between 0 and 500
        y: Math.floor(Math.random() * 300 + 250), // for y between 0 and 500
      },
      status: "offline",
      pressure: "-",
    },
    pressure03: {
      id: 3,
      devId: "pressure03",
      deviceTypeId: 7,
      deviceTypeName: "iot_pressure_gauge",
      deviceName: "Gauge 3",
      position: { x: 250, y: 510 },
      status: "offline",
      pressure: "-",
    },
  };
  const id = params.devId;
  const responseData = ahuData[id];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
