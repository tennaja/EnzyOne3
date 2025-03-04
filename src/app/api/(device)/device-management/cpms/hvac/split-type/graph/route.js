import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET_mock(request, { params }) {
  const { searchParams } = new URL(request.url);
  const floorId = searchParams.get("floorId") ?? 1;
  let dateFrom = searchParams.get("dateFrom") ?? dayjs().format("YYYY-MM-DD");
  let dateTo = searchParams.get("dateTo") ?? dayjs().format("YYYY-MM-DD");

  if (dateFrom == dateTo) {
    dateTo = dayjs(dateTo).add(1, "day").format("YYYY-MM-DD");
  }

  let powerArray = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += 60000
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 1 + 0.7).format("0.00")).value(),
    };
    powerArray.push(dataObject);
  }

  let powerArray2 = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += 60000
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 1 + 0.4).format("0.00")).value(),
    };
    powerArray2.push(dataObject);
  }
  let tempArray = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += 60000
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 5 + 21).format("0")).value(),
    };
    tempArray.push(dataObject);
  }

  let tempArray2 = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += 60000
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 5 + 21).format("0")).value(),
    };
    tempArray2.push(dataObject);
  }

  let roomTempArray = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += 60000
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 5 + 21).format("0")).value(),
    };
    roomTempArray.push(dataObject);
  }

  let roomTempArray2 = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += 60000
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 5 + 21).format("0")).value(),
    };
    roomTempArray2.push(dataObject);
  }
  let outdoorTempArray = [];
  for (
    let index = dayjs(dateFrom).valueOf();
    index < dayjs(dateTo).valueOf();
    index += 60000
  ) {
    const dataObject = {
      time: dayjs(index).format("YYYY-MM-DD HH:mm"),
      value: numeral(numeral(Math.random() * 2 + 29).format("0")).value(),
    };
    outdoorTempArray.push(dataObject);
  }
  // const responseData = airCompressorData;
  const responseData = {
    power: [
      {
        id: 1,
        devId: "spt01",
        deviceName: "Carrier 7",
        data: powerArray,
      },
      {
        id: 2,
        devId: "spt02",
        deviceName: "Daikin Inverter",
        data: powerArray2,
      },
    ],
    temp: [
      {
        id: 1,
        devId: "spt01",
        deviceName: "Carrier 7",
        data: tempArray,
      },
      {
        id: 2,
        devId: "spt02",
        deviceName: "Daikin Inverter",
        data: tempArray2,
      },
    ],
    roomTemp: [
      {
        id: 1,
        devId: "spt01",
        deviceName: "Carrier 7",
        data: roomTempArray,
      },
      {
        id: 2,
        devId: "spt02",
        deviceName: "Daikin Inverter",
        data: roomTempArray2,
      },
    ],
    external: [
      {
        id: 1,
        deviceName: "Outdoor Temp",
        data: outdoorTempArray,
      },
    ],
  };

  if (responseData) {
    return NextResponse.json(responseData);
  }
  // return NextResponse.json({ message: "no data" });
  return NextResponse.json([]);
}

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const floorId = searchParams.get("floorId") ?? 1;
  let dateFrom = searchParams.get("dateFrom") ?? dayjs().format("YYYY-MM-DD");
  let dateTo = searchParams.get("dateTo") ?? dayjs().format("YYYY-MM-DD");

  if (dateFrom == dateTo) {
    dateTo = dayjs(dateTo).add(1, "day").format("YYYY-MM-DD");
  }

  const splitTypePowerArray = [];
  const splitTypeTempArray = [];
  const roomQuery = `SELECT 
  Room
  FROM
    Floor
    JOIN Device ON Floor.Id = Device.FloorId 
  WHERE
    Floor.Id  = ${floorId}
    AND (DeviceTypeId LIKE '%hvac%' AND DeviceTypeId LIKE '%tmp%') 
    AND Room <> 0 
    GROUP BY Room`;

  const roomResponse = await ExecuteQuery(roomQuery);

  if (roomResponse.length > 0) {
    for (const roomDevice of roomResponse) {
      const dataQuery = `SELECT Timestamp,
      AVG ( roomTemp ) AS value 
    FROM
      (
      SELECT CONVERT
        ( VARCHAR ( 19 ), TIMESTAMP, 120 ) AS Timestamp,
        DevId,
        MAX ( CASE WHEN field = 'temperature' THEN VALUE END ) AS roomTemp 
      FROM
        RawData 
      WHERE
        DevId IN (
        SELECT
          Device.Id AS DeviceId 
        FROM
          Floor
          JOIN Device ON Floor.Id = Device.FloorId 
        WHERE
          Floor.Id = ${floorId}
          AND ( DeviceTypeId LIKE '%hvac%' AND DeviceTypeId LIKE '%tmp%' ) 
          AND Room = ${roomDevice.Room}
        GROUP BY
          Room,
          Device.Id 
        ) 
        AND TIMESTAMP >= CONVERT ( datetime, '${dateFrom}' ) 
        AND TIMESTAMP <= CONVERT ( datetime, '${dateTo}' ) 
      GROUP BY
        TIMESTAMP,
        DevId 
      ) data 
    GROUP BY
      [Timestamp]
      ORDER BY Timestamp`;
      const dataResponse = await ExecuteQuery(dataQuery);

      const deviceDataArray = [];
      for (const data of dataResponse) {
        const dataObject = {
          time: data?.Timestamp,
          value: data?.value,
        };
        deviceDataArray.push(dataObject);
      }

      const roomDeviceQuery = `SELECT 
      Device.Id,
      Device.DevId,
      Device.Name
      FROM
      Floor
        JOIN Device ON Floor.Id = Device.FloorId 
      WHERE
        Floor.Id IN ( ${floorId} ) 
      AND DeviceTypeId LIKE '%split_type%' 
        AND Room = ${roomDevice.Room} `;

      const roomDeviceResponse = await ExecuteQuery(roomDeviceQuery);

      const splitTypeTempObject = {
        id: roomDeviceResponse?.[0]?.Id ?? 0,
        devId: roomDeviceResponse?.[0]?.DevId ?? "-",
        deviceName: roomDeviceResponse?.[0]?.Name ?? "-",
        data: deviceDataArray,
      };

      splitTypeTempArray.push(splitTypeTempObject);
    }
  }

  const roomDeviceMeterQuery = `SELECT 
  Device.Id,
  Device.DevId,
  Device.Name
  FROM
  Floor
    JOIN Device ON Floor.Id = Device.FloorId 
  WHERE
    Floor.Id IN ( ${floorId} ) 
  AND DeviceTypeId LIKE '%split_type%'  AND DeviceTypeId LIKE '%_pm%' `;

  const roomDeviceMeterResponse = await ExecuteQuery(roomDeviceMeterQuery);

  for (const device of roomDeviceMeterResponse) {
    const dataMeterQuery = ` SELECT CONVERT
    ( VARCHAR ( 19 ), TIMESTAMP, 120 ) AS Timestamp,
    DevId,
    MAX ( CASE WHEN field = 'kw_total' THEN VALUE END ) AS value 
  FROM
    RawData 
  WHERE
    DevId  = ${device.Id}
    AND TIMESTAMP >= CONVERT ( datetime, '${dateFrom}' ) 
    AND TIMESTAMP <= CONVERT ( datetime, '${dateTo}' ) 
  GROUP BY
    TIMESTAMP,
    DevId 
    ORDER BY Timestamp`;

    const dataMeterResponse = await ExecuteQuery(dataMeterQuery);

    const deviceDataArray = [];
    for (const data of dataMeterResponse) {
      const dataObject = {
        time: data?.Timestamp,
        value: data?.value,
      };
      deviceDataArray.push(dataObject);
    }

    const splitTypePowerObject = {
      id: device?.Id ?? 0,
      devId: device?.DevId ?? "-",
      deviceName: device?.Name ?? "-",
      data: deviceDataArray,
    };

    splitTypePowerArray.push(splitTypePowerObject);
  }

  const responseData = {
    power: splitTypePowerArray,
    temp: splitTypeTempArray,
    roomTemp: [],
    external: [],
  };

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
