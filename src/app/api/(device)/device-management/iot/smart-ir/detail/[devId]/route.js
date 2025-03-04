import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const ahuData = {
    smart_ir01: {
      id: 1,
      devId: "smart_ir01",
      deviceTypeId: 14,
      deviceTypeName: "iot_smart_ir",
      deviceName: "Smart IR 1",
      position: { x: 450, y: 440 },
      status: "on",
      setTemp: numeral(Math.floor(Math.random() * 8 + 46) / 2).format("0.00"),
      control: "on",
      fan: random(["auto", "1", "2", "3", "4", "5"]),
      mode: random(["auto", "cool", "fan", "dry", "heat"]),
    },
    smart_ir02: {
      id: 2,
      devId: "smart_ir02",
      deviceTypeId: 14,
      deviceTypeName: "iot_smart_ir",
      deviceName: "Smart IR 2",
      position: { x: 510, y: 280 },
      status: "off",
      setTemp: numeral(Math.floor(Math.random() * 8 + 46) / 2).format("0.00"),
      control: "off",
      fan: random(["auto", "0", "1", "2", "3", "4", "5"]),
      mode: random(["auto", "cool", "fan", "dry", "heat"]),
    },
    smart_ir03: {
      id: 3,
      devId: "smart_ir03",
      deviceTypeId: 14,
      deviceTypeName: "iot_smart_ir",
      deviceName: "Smart IR 3",
      position: { x: 250, y: 510 },
      status: "offline",
      setTemp: "-",
      control: "-",
      fan: "-",
      mode: "-",
    },
    smart_ir04: {
      id: 4,
      devId: "smart_ir04",
      deviceTypeId: 14,
      deviceTypeName: "iot_smart_ir",
      deviceName: "Smart IR 4",
      position: { x: 395, y: 630 },
      status: "offline",
      setTemp: "-",
      control: "-",
      fan: "-",
      mode: "-",
    },
  };
  const id = params.devId;
  const responseData = ahuData[id];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
