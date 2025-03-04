import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";

const iotData = {
  sm_ir001: {
    id: 1,
    devId: "sm_ir001",
    deviceName: "Smart IR 001",
    position: { x: 660, y: 550 },
    status: "on",
    temp: 21.7,
    humidity: 67,
    co2: 400,
  },
  sm_ir002: {
    id: 2,
    devId: "sm_ir002",
    deviceName: "Smart IR 002",
    position: { x: 540, y: 510 },
    status: "off",
    temp: 22.0,
    humidity: 68,
    co2: 400,
  },
  sm_ir003: {
    id: 3,
    devId: "sm_ir003",
    deviceName: "Smart IR 003",
    position: { x: 660, y: 410 },
    status: "offline",
    temp: 22.1,
    humidity: 68,
    co2: 440,
  },
  sm_ir004: {
    id: 4,
    devId: "sm_ir004",
    deviceName: "Smart IR 004",
    position: { x: 540, y: 340 },
    status: "on",
    temp: 22.6,
    humidity: 67,
    co2: 410,
  },
};
export async function GET(request, { params }) {
  const id = params.devId;
  // const responseData = iotData[id];

  const responseData = [];

  const deviceQuery = `SELECT 	Device.Id AS DeviceId,
	Device.DevId,
	Device.Name AS DeviceName  FROM Device WHERE Id = '${id}'
	AND DeviceTypeId LIKE '%iot%' AND Room <> 0 `;
  const deviceResponse = await ExecuteQuery(deviceQuery);
  if (deviceResponse.length > 0) {
    const devId = deviceResponse?.[0]?.DevId;
    const deviceName = deviceResponse?.[0]?.DeviceName;

    // ดึงข้อมูล Device position จาก DevicePosition
    const devicePositionQuery = `SELECT Position_X, Position_Y FROM DevicePosition WHERE DevId = '${id}'`;
    const devicePositionResponse = await ExecuteQuery(devicePositionQuery);
    const position_x = devicePositionResponse?.[0]?.Position_X;
    const position_y = devicePositionResponse?.[0]?.Position_Y;

    // ดึงข้อมูล จาก RawData โดยเรียงลำดับจาก Timestamp ล่าสุด
    const iotDataQuery = `SELECT 	TOP 1
    Timestamp,
    DevId, 
    MAX(CASE WHEN field = 'temperature' THEN value END) AS temp,
    MAX(CASE WHEN field = 'humidity' THEN value END) AS humidity,
    MAX(CASE WHEN field = 'co2' THEN value END) AS co2
FROM 
    RawData
		WHERE DevId = '${id}'
GROUP BY 
    timestamp, DevId
		ORDER BY [Timestamp] desc`;

    const iotDataResponse = await ExecuteQuery(iotDataQuery);

    const timestamp = iotDataResponse?.[0]?.Timestamp;
    const now = dayjs();
    const dataTimestamp = dayjs(timestamp);
    const temp = iotDataResponse?.[0]?.temp;
    const humidity = iotDataResponse?.[0]?.humidity;
    const co2 = iotDataResponse?.[0]?.co2;

    let deviceStatus;

    if (now.diff(dataTimestamp, "minute") > 5 || timestamp == undefined)
      deviceStatus = "offline";
    else deviceStatus = "on";

    const iotDataObject = {
      id: id,
      devId: devId,
      deviceName: deviceName,
      status: deviceStatus,
      position: {
        x: position_x != null ? position_x : 0,
        y: position_y != null ? position_y : 0,
      },
      temp: temp != null ? numeral(temp).format("0,0.00") : "-",
      humidity: humidity != null ? numeral(humidity).format("0,0.00") : "-",
      co2: co2 != null ? numeral(co2).format("0,0.00") : "-",
    };

    responseData.push(iotDataObject);
  }

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
