import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const randomData = Math.random() < 0.3 ? "off" : "on";
  const randomData2 = Math.random() < 0.7 ? "off" : "on";
  const indoorTempHumidData = {
    1: {
      data: [
        {
          id: 1,
          devId: "heater01",
          deviceTypeId: 19,
          deviceTypeName: "iot_heater",
          deviceName: "Heater 1",
          position: { x: 450, y: 440 },
          status: randomData,
          temp: numeral(Math.random() * 4 + 45).format("0.00"),
          power: numeral(Math.random() * 10 + 23).format("0.00"),
          model: 10,
          control: randomData,
          waste: numeral(Math.floor(Math.random() * 50 + 10)).format("0,0"),
          counter: numeral(Math.floor(Math.random() * 1000 + 100)).format(
            "0,0"
          ),
        },
        {
          id: 2,
          devId: "heater02",
          deviceTypeId: 19,
          deviceTypeName: "iot_heater",
          deviceName: "Heater 2",
          position: { x: 510, y: 280 },
          status: randomData2,
          temp: numeral(Math.random() * 4 + 45).format("0.00"),
          power: numeral(Math.random() * 10 + 23).format("0.00"),
          model: 10,
          control: randomData2,
          waste: numeral(Math.floor(Math.random() * 50 + 10)).format("0,0"),
          counter: numeral(Math.floor(Math.random() * 1000 + 100)).format(
            "0,0"
          ),
        },
        {
          id: 3,
          devId: "heater03",
          deviceTypeId: 19,
          deviceTypeName: "iot_heater",
          deviceName: "Heater 3",
          position: { x: 250, y: 510 },
          status: "offline",
          temp: "-",
          power: "-",
          model: "-",
          control: "-",
          waste: "-",
          counter: "-",
        },
      ],
    },
    2: {
      data: [
        {
          id: 4,
          devId: "heater04",
          deviceTypeId: 19,
          deviceTypeName: "iot_heater",
          deviceName: "Heater 4",
          position: { x: 395, y: 630 },
          status: "offline",
          temp: "-",
          power: "-",
          model: "-",
          control: "-",
          waste: "-",
          counter: "-",
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
