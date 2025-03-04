import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const second = numeral(dayjs().second() % 6).value();
  const control = dayjs().second() % 2 === 0 ? "on" : "off";
  const fan = dayjs().second() % 2 === 0 ? "low" : "high";
  const mode = dayjs().second() % 2 === 0 ? "cool" : "dry";
  const splitTypeData = {
    1: {
      data: [
        {
          id: 1,
          devId: "spt01",
          deviceName: "Carrier 7",
          position: { x: 250, y: 310 },
          status: "on",
          roomTemp: 25,
          humidity: 47,
          setTemp: 24 + second,
          control: control,
          fan: fan,
          mode: mode,
          automation: control,
        },
        {
          id: 2,
          devId: "spt02",
          deviceName: "Daikin Inverter",
          position: { x: 330, y: 340 },
          status: "off",
          roomTemp: 25,
          humidity: 47,
          setTemp: 24,
          control: "off",
          fan: "auto",
          mode: "cool",
          automation: "off",
        },
        {
          id: 3,
          devId: "spt03",
          deviceName: "Carrier 10",
          position: { x: 450, y: 340 },
          status: "offline",
          roomTemp: 25,
          humidity: 47,
          setTemp: 24,
          control: "offline",
          fan: "auto",
          mode: "cool",
          automation: "off",
        },
      ],
    },
    2: {
      data: [
        {
          id: 4,
          devId: "spt04",
          deviceName: "Mitsubishi 1",
          position: { x: 250, y: 410 },
          status: "on",
          roomTemp: 25,
          humidity: 47,
          setTemp: 24,
          control: "on",
          fan: "auto",
          mode: "cool",
          automation: "off",
        },
        {
          id: 5,
          devId: "spt05",
          deviceName: "Mitsubishi 2",
          position: { x: 330, y: 440 },
          status: "on",
          roomTemp: 25,
          humidity: 47,
          setTemp: 24,
          control: "on",
          fan: "low",
          mode: "cool",
          automation: "off",
        },
      ],
    },
  };
  const id = params.floorId;
  // const responseData_fix = airCompressorData[id]?.data;

  const responseData = [];

  const roomTempDeviceQuery = `SELECT
	Floor.Id,
	Floor.Name,
	Device.Id AS DeviceId,
	Device.DevId,
	Device.Name AS DeviceName 
FROM
	Floor
	JOIN Device ON Floor.Id = Device.FloorId 
WHERE
	Floor.Id = ${id}
	AND (DeviceTypeId LIKE '%hvac%' AND DeviceTypeId LIKE '%tmp%') 
  AND Room <> 0  `;

  const roomTempDeviceResponse = await ExecuteQuery(roomTempDeviceQuery);

  let avgRoomTemp = null;
  let avgHumidity = null;

  if (roomTempDeviceResponse.length > 0) {
    let roomTempDeviceDataArray = [];
    for (const tmpDevice of roomTempDeviceResponse) {
      const tmpQuery = `SELECT 	TOP 1
      Timestamp,
      DevId, 
      MAX(CASE WHEN field = 'temperature' THEN value END) AS roomTemp,
      MAX(CASE WHEN field = 'humidity' THEN value END) AS humidity 
      FROM 
    RawData
		WHERE DevId = '${tmpDevice.DeviceId}'
GROUP BY 
    timestamp, DevId
		ORDER BY [Timestamp] desc `;
      const tmpResponse = await ExecuteQuery(tmpQuery);
      if (tmpResponse.length > 0) roomTempDeviceDataArray.push(tmpResponse[0]);
    }

    if (roomTempDeviceDataArray.length > 0) {
      // get Average Room Temp from roomTempDeviceDataArray and push to responseData
      let sumRoomTemp = 0;
      let sumHumidity = 0;
      for (const tmpData of roomTempDeviceDataArray) {
        sumRoomTemp += tmpData.roomTemp;
        sumHumidity += tmpData.humidity;
      }
      avgRoomTemp = sumRoomTemp / roomTempDeviceDataArray.length;
      avgHumidity = sumHumidity / roomTempDeviceDataArray.length;
    }
  }

  const sql = `SELECT
	Floor.Id,
	Floor.Name,
	Device.Id AS DeviceId,
	Device.DevId,
	Device.Name AS DeviceName 
FROM
	Floor
	JOIN Device ON Floor.Id = Device.FloorId 
WHERE
	Floor.Id = ${id}
	AND DeviceTypeId LIKE '%split_type%' 
  AND Room <> 0 `;

  const response = await ExecuteQuery(sql);

  if (response.length > 0) {
    for (const device of response) {
      // ดึงข้อมูล Device position จาก DevicePosition
      const devicePositionQuery = `SELECT Position_X, Position_Y FROM DevicePosition WHERE DevId = '${device.DeviceId}'`;
      const devicePositionResponse = await ExecuteQuery(devicePositionQuery);
      const position_x = devicePositionResponse?.[0]?.Position_X;
      const position_y = devicePositionResponse?.[0]?.Position_Y;

      // ดึงข้อมูล จาก RawData โดยเรียงลำดับจาก Timestamp ล่าสุด
      const splitTypeDataQuery = `SELECT 	TOP 1
    Timestamp,
    DevId, 
    MAX(CASE WHEN field = 'temperature_set_point' THEN value END) AS setTemp,
		MAX(CASE WHEN field = 'power' THEN value END) AS control,
		MAX(CASE WHEN field = 'fanState' THEN value END) AS fan,
		MAX(CASE WHEN field = 'mode' THEN value END) AS mode,
		MAX(CASE WHEN field = 'automation' THEN value END) AS automation
FROM 
    RawData
		WHERE DevId = '${device.DeviceId}'
GROUP BY 
    timestamp, DevId
		ORDER BY [Timestamp] desc`;

      const splitTypeDataResponse = await ExecuteQuery(splitTypeDataQuery);

      const timestamp = splitTypeDataResponse?.[0]?.Timestamp;
      const now = dayjs();
      const dataTimestamp = dayjs(timestamp);

      const dataStatus = splitTypeDataResponse?.[0]?.control;
      const roomTemp = avgRoomTemp;
      const humidity = avgHumidity;
      const setTemp = splitTypeDataResponse?.[0]?.setTemp;
      const control = splitTypeDataResponse?.[0]?.control == 0 ? "off" : "on";
      const fanValue = splitTypeDataResponse?.[0]?.fan;
      const fan = fanValue == 0 ? "auto" : fanValue;
      const modeValue = splitTypeDataResponse?.[0]?.mode;
      const mode =
        modeValue == 0
          ? "auto"
          : modeValue == 1
          ? "cool"
          : modeValue == 2
          ? "dry"
          : modeValue == 3
          ? "fan"
          : modeValue == 4
          ? "heat"
          : "-";
      const automation = splitTypeDataResponse?.[0]?.automation;

      let deviceStatus;
      if (dataStatus == null) deviceStatus = "offline";
      else {
        if (now.diff(dataTimestamp, "minute") > 5) deviceStatus = "offline";
        else deviceStatus = dataStatus == 1 ? "on" : "off";
      }

      const splitTypeDataObject = {
        id: device.DeviceId,
        devId: device.DevId,
        deviceName: device.DeviceName,
        status: deviceStatus,
        position: {
          x: position_x != null ? position_x : 0,
          y: position_y != null ? position_y : 0,
        },
        roomTemp: roomTemp != null ? numeral(roomTemp).format("0,0.00") : "-",
        humidity: humidity != null ? numeral(humidity).format("0,0.00") : "-",
        setTemp: setTemp != null ? numeral(setTemp).format("0,0.00") : "-",
        control: control != null ? control : "-",
        fan: fan != null ? fan.toString() : "-",
        mode: mode != null ? mode : "-",
        automation: automation != null ? automation : "off",
      };

      responseData.push(splitTypeDataObject);
    }
  }

  if (responseData) {
    return NextResponse.json(responseData);
  }
  // return NextResponse.json({ message: "no data" });
  return NextResponse.json([]);
}
