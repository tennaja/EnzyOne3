import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const randomData = Math.random() < 0.3 ? "off" : "on";
  const randomData2 = Math.random() < 0.7 ? "off" : "on";

  const ahuData = {
    1: {
      id: 1,
      devId: "ahu01",
      deviceName: "AHU 01",
      position: { x: 300, y: 400 },
      status: randomData,
      supplyTemp: numeral(Math.random() * 3 + 15).format("0.00"),
      supplyTempSetPoint: numeral(Math.random() * +17).format("0.00"),
      returnTemp: numeral(Math.random() * 3 + 17).format("0.00"),
      vsdDrive: numeral(Math.random() * 3 + 38).format("0.00"),
      vsdPower: numeral(Math.random() * 1 + 2).format("0.00"),
      vsdSpeed: numeral(Math.random() * 200 + 1000).format("0,0.00"),
      controlValve: numeral(Math.random() * 10 + 49).format("0.00"),
      automation: randomData,
    },
    2: {
      id: 2,
      devId: "ahu02",
      deviceName: "AHU 02",
      position: { x: 450, y: 440 },
      status: randomData2,
      supplyTemp: numeral(Math.random() * 3 + 15).format("0.00"),
      supplyTempSetPoint: numeral(Math.random() * +17).format("0.00"),
      returnTemp: numeral(Math.random() * 3 + 17).format("0.00"),
      vsdDrive: numeral(Math.random() * 3 + 38).format("0.00"),
      vsdPower: numeral(Math.random() * 1 + 2).format("0.00"),
      vsdSpeed: numeral(Math.random() * 200 + 1000).format("0,0.00"),
      controlValve: numeral(Math.random() * 10 + 49).format("0.00"),
      automation: "off",
    },
    3: {
      id: 3,
      devId: "ahu03",
      deviceName: "AHU 03",
      position: { x: 250, y: 510 },
      status: "offline",
      supplyTemp: "-",
      supplyTempSetPoint: "-",
      returnTemp: "-",
      vsdDrive: "-",
      vsdPower: "-",
      vsdSpeed: "-",
      controlValve: "-",
      automation: "-",
    },
    4: {
      id: 4,
      devId: "ahu04",
      deviceName: "AHU 04",
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
    5: {
      id: 5,
      devId: "ahu05",
      deviceName: "AHU 05",
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
  };
  const id = params.devId;
  const responseData = ahuData[id];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
