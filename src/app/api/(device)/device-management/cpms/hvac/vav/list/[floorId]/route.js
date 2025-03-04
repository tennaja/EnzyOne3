import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const vavData = {
    16: {
      data: [
        {
          id: 1,
          devId: "vav01",
          deviceName: "VAV 01",
          position: { x: 330, y: 540 },
          status: "on",
          temp: numeral(Math.random() * 3 + 18).format("0.00"),
          airFlow: numeral(Math.random() * 50 + 690).format("0,0"),
          damper: numeral(Math.random() * 1 + 53).format("0.00"),
        },
        {
          id: 2,
          devId: "vav02",
          deviceName: "VAV 02",
          position: { x: 450, y: 550 },
          status: "off",
          temp: numeral(Math.random() * 3 + 18).format("0.00"),
          airFlow: numeral(Math.random() * 50 + 690).format("0,0"),
          damper: numeral(Math.random() * 1 + 53).format("0.00"),
        },
        {
          id: 3,
          devId: "vav03",
          deviceName: "VAV 03",
          position: { x: 570, y: 550 },
          status: "offline",
          temp: "-",
          airFlow: "-",
          damper: "-",
        },
      ],
    },
    17: {
      data: [
        {
          id: 4,
          devId: "vav04",
          deviceName: "VAV 04",
          position: { x: 570, y: 550 },
          status: "on",
          temp: 21.2,
          airFlow: 1146,
          damper: 100,
        },
      ],
    },
  };
  const id = params.floorId;
  const responseData = vavData[id]?.data;

  const responseData2 = [];

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
	AND (DeviceTypeId LIKE '%hvac%' AND DeviceTypeId LIKE '%vav%') 
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
      const vavDataQuery = `SELECT 	TOP 1
    Timestamp,
    DevId, 
    MAX(CASE WHEN field = 'status' THEN value END) AS status,
    MAX(CASE WHEN field = 'temp' THEN value END) AS temp,
    MAX(CASE WHEN field = 'airflow' THEN value END) AS airFlow,
    MAX(CASE WHEN field = 'damper' THEN value END) AS damper
FROM 
    RawData
		WHERE DevId = '${device.DeviceId}'
GROUP BY 
    timestamp, DevId
		ORDER BY [Timestamp] desc`;

      const vavDataResponse = await ExecuteQuery(vavDataQuery);

      const timestamp = vavDataResponse?.[0]?.Timestamp;
      const now = dayjs();
      const dataTimestamp = dayjs(timestamp);
      const dataStatus = splitTypeDataResponse?.[0]?.status;
      const temp = vavDataResponse?.[0]?.temp;
      const airFlow = vavDataResponse?.[0]?.airFlow;
      const damper = vavDataResponse?.[0]?.damper;

      let deviceStatus;

      if (now.diff(dataTimestamp, "minute") > 5 || timestamp == undefined)
        deviceStatus = "Offline";
      else deviceStatus = dataStatus == 1 ? "On" : "Off";

      const vavDataObject = {
        id: device.DeviceId,
        devId: device.DevId,
        deviceName: device.DeviceName,
        status: deviceStatus,
        position: {
          x: position_x != null ? position_x : 0,
          y: position_y != null ? position_y : 0,
        },
        temp: temp != null ? numeral(temp).format("0,0.00") : "-",
        airFlow: airFlow != null ? numeral(airFlow).format("0,0.00") : "-",
        damper: damper != null ? numeral(damper).format("0,0.00") : "-",
      };

      responseData.push(vavDataObject);
    }
  }

  if (responseData) {
    return NextResponse.json(responseData);
  }
  // return NextResponse.json({ message: "no data" });
  return NextResponse.json([]);
}
