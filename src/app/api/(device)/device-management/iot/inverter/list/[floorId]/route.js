import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

const indoorTempHumidData = {
  1: {
    data: [
      {
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
      {
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
    ],
  },
  2: {
    data: [
      {
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
