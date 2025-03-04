import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const ahuData = {
    1: {
      data: [
        {
          id: 1,
          devId: "chiller01",
          deviceName: "Chiller 01",
          status: "on",
          power: numeral(Math.random() * 100 + 60).format("0,0.00"),
          drawer: numeral(Math.random() * 34 + 50).format("0"),
          chillerSupplyTemp: numeral(Math.random() * 3 + 40).format("0.00"),
          chillerReturnTemp: numeral(Math.random() * 4 + 60).format("0.00"),
          chillerSupplySetTemp: numeral(Math.random() * 3 + 40).format("0.00"),
          control: "on",
        },
        {
          id: 2,
          devId: "chiller02",
          deviceName: "Chiller 02",
          status: "on",
          power: numeral(Math.random() * 100 + 60).format("0,0.00"),
          drawer: numeral(Math.random() * 34 + 50).format("0"),
          chillerSupplyTemp: numeral(Math.random() * 3 + 40).format("0.00"),
          chillerReturnTemp: numeral(Math.random() * 4 + 60).format("0.00"),
          chillerSupplySetTemp: numeral(Math.random() * 3 + 40).format("0.00"),
          control: "on",
        },
        {
          id: 3,
          devId: "chiller03",
          deviceName: "Chiller 03",
          status: "off",
          power: numeral(Math.random() * 100 + 60).format("0,0.00"),
          drawer: numeral(Math.random() * 34 + 50).format("0"),
          chillerSupplyTemp: numeral(Math.random() * 3 + 40).format("0.00"),
          chillerReturnTemp: numeral(Math.random() * 4 + 60).format("0.00"),
          chillerSupplySetTemp: numeral(Math.random() * 3 + 40).format("0.00"),
          control: "off",
        },
        {
          id: 4,
          devId: "chiller04",
          deviceName: "Chiller 04",
          status: "offline",
          power: "-",
          drawer: "-",
          chillerSupplyTemp: "-",
          chillerReturnTemp: "-",
          chillerSupplySetTemp: "-",
          control: "-",
        },
      ],
    },
    2: {
      data: [
        {
          id: 2,
          devId: "ahu02",
          deviceName: "AHU 02",
          position: { x: 450, y: 440 },
          status: "off",
          supplyTemp: 0,
          supplyTempSetPoint: 17,
          returnTemp: 23.57,
          vsdDrive: 0,
          vsdPower: 0,
          vsdSpeed: 0,
          controlValve: 0,
          automation: "off",
        },
        {
          id: 3,
          devId: "ahu03",
          deviceName: "AHU 03",
          position: { x: 250, y: 510 },
          status: "on",
          supplyTemp: 14.55,
          supplyTempSetPoint: 17,
          returnTemp: 23.5,
          vsdDrive: 40,
          vsdPower: 2.2,
          vsdSpeed: 1179,
          controlValve: 20.32,
          automation: "off",
        },
      ],
    },
  };

  const id = params.buildingId;
  const responseData = ahuData[id]?.data;

  if (responseData) {
    return NextResponse.json(responseData);
  }
  // return NextResponse.json({ message: "no data" });
  return NextResponse.json([]);
}
