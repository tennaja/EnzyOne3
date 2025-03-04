import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const indoorTempHumidData = {
    1: {
      data: [
        {
          id: 1,
          devId: "out_tmp01",
          deviceTypeId: 6,
          deviceTypeName: "iot_outdoor_temp_humid",
          deviceName: "ประตูทางเข้า 1",
          position: {
            x: Math.floor(Math.random() * 100 + 100), // for x between 0 and 500
            y: Math.floor(Math.random() * 100 + 150), // for y between 0 and 500
          },
          status: "on",
          temp: numeral(Math.floor(Math.random() * 4 + 23)).format("0.00"),
          humidity: numeral(Math.floor(Math.random() * 15 + 55)).format("0"),
        },
        {
          id: 2,
          devId: "out_tmp02",
          deviceTypeId: 6,
          deviceTypeName: "iot_outdoor_temp_humid",
          deviceName: "ประตูทางเข้า 2",
          position: {
            x: Math.floor(Math.random() * 350 + 200), // for x between 0 and 500
            y: Math.floor(Math.random() * 300 + 250), // for y between 0 and 500
          },
          status: "offline",
          temp: "-",
          humidity: "-",
        },
      ],
    },
    2: {
      data: [
        {
          id: 3,
          devId: "out_tmp03",
          deviceTypeId: 6,
          deviceTypeName: "iot_outdoor_temp_humid",
          deviceName: "ประตูทางออก",
          position: { x: 250, y: 510 },
          status: "offline",
          temp: "-",
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
