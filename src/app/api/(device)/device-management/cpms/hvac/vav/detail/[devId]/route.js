import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const vavData = {
    1: {
      id: 1,
      devId: "vav01",
      deviceName: "VAV 01",
      position: { x: 330, y: 540 },
      status: "on",
      temp: numeral(Math.random() * 3 + 18).format("0.00"),
      airFlow: numeral(Math.random() * 50 + 690).format("0,0"),
      damper: numeral(Math.random() * 1 + 53).format("0.00"),
    },
    2: {
      id: 2,
      devId: "vav02",
      deviceName: "VAV 02",
      position: { x: 450, y: 550 },
      status: "off",
      temp: numeral(Math.random() * 3 + 18).format("0.00"),
      airFlow: numeral(Math.random() * 50 + 690).format("0,0"),
      damper: numeral(Math.random() * 1 + 53).format("0.00"),
    },
    3: {
      id: 3,
      devId: "vav03",
      deviceName: "VAV 03",
      position: { x: 570, y: 550 },
      status: "offline",
      temp: "-",
      airFlow: "-",
      damper: "-",
    },
    4: {
      id: 4,
      devId: "vav04",
      deviceName: "VAV 04",
      position: { x: 570, y: 550 },
      status: "on",
      temp: 21.2,
      airFlow: 1146,
      damper: 100,
    },
  };
  const id = params.devId;
  const responseData = vavData[id];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
