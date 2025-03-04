import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";

const airCompressorData = {
  1: {
    data: [
      {
        id: 1,
        name: "Air Compressor 1",
        pressure: 40,
        power: 80,
        status: "On",
        efficiency: 98.12,
        workingHours: 134,
      },
      {
        id: 2,
        name: "Air Compressor 2",
        pressure: 8,
        power: 40,
        status: "Off",
        efficiency: 97.0,
        workingHours: 150,
      },
    ],
  },
  2: {
    data: [
      {
        id: 3,
        name: "Air Compressor 3",
        pressure: 10,
        power: 45,
        status: "Off",
        efficiency: 97.0,
        workingHours: 150,
      },
    ],
  },
};
export async function GET(request, { params }) {
  const id = params.floorId;
  const responseData_fix = airCompressorData[id]?.data;

  const responseData = [];
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
	AND DeviceTypeId LIKE '%air_compressor%' `;

  const response = await ExecuteQuery(sql);

  if (response.length > 0) {
    for (const device of response) {
      const airCompressorDataQuery = `SELECT 	TOP 1
    Timestamp,
    DevId,
    MAX(CASE WHEN field = 'status' THEN value END) AS status,
    MAX(CASE WHEN field = 'bar' THEN value END) AS pressure,
    MAX(CASE WHEN field = 'kw_total' THEN value END) AS power,
		MAX(CASE WHEN field = 'efficiency' THEN value END) AS efficiency,
		MAX(CASE WHEN field = 'workingHours' THEN value END) AS workingHours
FROM 
    RawData
		WHERE DevId = '${device.DeviceId}'
GROUP BY 
    timestamp, DevId
		ORDER BY [Timestamp] desc`;

      const airCompressorDataResponse = await ExecuteQuery(
        airCompressorDataQuery
      );

      // Hard code for kw_total of device.DeviceId 78 and 79
      let airCompressorPower = null;
      if (device.DeviceId == 78 || device.DeviceId == 79) {
        let devicePowerMeterId = device.DeviceId == 78 ? 19 : 20;
        const kwTotalQuery = `SELECT TOP 1
        Timestamp,
        DevId,
        MAX(CASE WHEN field = 'kw' THEN value END) AS power
        FROM 
        RawData
        WHERE DevId = '${devicePowerMeterId}'
    GROUP BY 
        timestamp, DevId
        ORDER BY [Timestamp] desc
        `;
        const kwTotalResponse = await ExecuteQuery(kwTotalQuery);

        airCompressorPower = kwTotalResponse?.[0]?.power;
      }

      const timestamp = airCompressorDataResponse?.[0]?.Timestamp;
      const now = dayjs();
      const dataTimestamp = dayjs(timestamp);

      const dataStatus = airCompressorDataResponse?.[0]?.status;
      const pressure = airCompressorDataResponse?.[0]?.pressure;
      const power = airCompressorPower;
      const efficiency = airCompressorDataResponse?.[0]?.efficiency;
      const workingHours = airCompressorDataResponse?.[0]?.workingHours;

      // console.log("airCompressorDataResponse", airCompressorDataResponse);
      let deviceStatus;
      if (dataStatus == null) deviceStatus = "Offline";
      else {
        if (now.diff(dataTimestamp, "minute") > 5) deviceStatus = "Offline";
        else deviceStatus = dataStatus == 1 ? "On" : "Off";
      }

      const airCompressorDataObject = {
        id: device.DeviceId,
        name: device.DeviceName,
        pressure: pressure != null ? numeral(pressure).format("0,0.00") : "-",
        power: power != null ? numeral(power).format("0,0.00") : "-",
        status: deviceStatus,
        efficiency:
          efficiency != null ? numeral(efficiency).format("0,0.00") : "-",
        workingHours:
          workingHours != null ? numeral(workingHours).format("0,0") : "-",
      };

      responseData.push(airCompressorDataObject);
    }

    /*  const mockOfflineDataObject = {
      id: 101,
      name: "Air Compressor - Test Offline",
      pressure: numeral(5.01).format("0,0.00"),
      power: "-",
      status: "Offline",
      efficiency: "-",
      workingHours: "-",
    };
    responseData.push(mockOfflineDataObject);

    const status = dayjs().second() % 2 === 0 ? "On" : "Off";
    const mockRandomData = {
      id: 78,
      name: "Air Compressor - Test random data",
      pressure: numeral(5 + numeral(Math.random().toFixed(2)).value()).format(
        "0,0.00"
      ),
      power: "-",
      status: status,
      efficiency: "-",
      workingHours: "-",
    };
    responseData.push(mockRandomData); */
  }
  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
