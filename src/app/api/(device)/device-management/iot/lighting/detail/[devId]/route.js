import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const randomData = Math.random() < 0.3 ? "off" : "on";
  const randomData2 = Math.random() < 0.7 ? "off" : "on";

  const ahuData = {
    lighting01: {
      id: 1,
      devId: "lighting01",
      deviceTypeId: 12,
      deviceTypeName: "iot_lighting",
      deviceName: "ไฟห้องโถงกลาง",
      position: { x: 450, y: 440 },
      status: randomData,
      control: randomData,
    },
    lighting02: {
      id: 2,
      devId: "lighting02",
      deviceTypeId: 12,
      deviceTypeName: "iot_lighting",
      deviceName: "ไฟห้องทำงาน 1",
      position: { x: 510, y: 280 },
      status: randomData2,
      control: randomData2,
    },
    lighting03: {
      id: 3,
      devId: "lighting03",
      deviceTypeId: 12,
      deviceTypeName: "iot_lighting",
      deviceName: "ไฟห้องผู้ช่วย",
      position: { x: 250, y: 510 },
      status: "offline",
      control: "offline",
    },
    lighting04: {
      id: 4,
      devId: "lighting04",
      deviceTypeId: 12,
      deviceTypeName: "iot_lighting",
      deviceName: "ไฟห้องผู้ช่วย 2",
      position: { x: 250, y: 510 },
      status: randomData,
      control: randomData,
    },
  };

  const id = params.devId;
  const responseData = ahuData[id];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
