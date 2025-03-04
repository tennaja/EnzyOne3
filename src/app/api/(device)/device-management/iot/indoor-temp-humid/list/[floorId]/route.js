import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const indoorTempHumidData = {
    1: {
      data: [
        {
          id: 1,
          devId: "tmp01",
          deviceTypeId: 5,
          deviceTypeName: "iot_indoor_temp_humid",
          deviceName: "ห้องโถงกลาง",
          position: {
            x: Math.floor(Math.random() * 100 + 100), // for x between 0 and 500
            y: Math.floor(Math.random() * 100 + 150), // for y between 0 and 500
          },
          status: "on",
          roomTemp: numeral(Math.floor(Math.random() * 4 + 23)).format("0.00"),
          humidity: numeral(Math.floor(Math.random() * 15 + 55)).format("0"),
        },
        {
          id: 2,
          devId: "tmp02",
          deviceTypeId: 5,
          deviceTypeName: "iot_indoor_temp_humid",
          deviceName: "ห้อง AHU",
          position: {
            x: Math.floor(Math.random() * 350 + 200), // for x between 0 and 500
            y: Math.floor(Math.random() * 300 + 250), // for y between 0 and 500
          },
          status: "offline",
          roomTemp: "-",
          humidity: "-",
        },
      ],
    },
    2: {
      data: [
        {
          id: 3,
          devId: "tmp03",
          deviceTypeId: 5,
          deviceTypeName: "iot_indoor_temp_humid",
          deviceName: "ห้องน้ำ",
          position: { x: 250, y: 510 },
          status: "offline",
          roomTemp: "-",
          humidity: "-",
        },
      ],
    },
  };
  const id = params.floorId;
  const responseData = indoorTempHumidData[id]?.data;

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
