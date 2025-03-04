import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";
import axios from "axios";
import dayjs from "dayjs";
import { floor } from "@/utils/utils";
import { logger } from "@/utils/logger";
import { sendDataToIotHub } from "../../utils/iothub";
const https = require("https");

//   ดึง StationCode จาก mapping ของแต่ละสาขา
/* {
    "aidType": 1,
    "buildState": null,
    "capacity": 0.0055,
    "combineType": null,
    "linkmanPho": "",
    "stationAddr": "180 ต.ศรีพนมมาศ อ.ลับแล จ.อุตรดิตถ์ 53130",
    "stationCode": "NE=51773954",  // <== นี่คือ StationCode
    "stationLinkman": "",
    "stationName": "3703_LAP LAE"
}, */

// เอา StationCode ไปหา Device ID ของ Huawei
/* {
    "devDn": "NE=51481764",
    "devName": "Dongle-HV2340452298",
    "devTypeId": 62,
    "esnCode": "HV2340452298",
    "id": 1000000051481764, // <== นี่คือ Device ID
    "invType": null,
    "latitude": 13.81238,
    "longitude": 100.726599,
    "optimizerNumber": null,
    "softwareVersion": "V200R022C10SPC103",
    "stationCode": "NE=51481762"
}, */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let now = dayjs();
  dayjs.extend(floor);
  let datetime = now.floor("minute", 5).format("YYYY-MM-DD HH:mm:[00]");

  // ดึง token ที่มีใน Database มาใช้งาน
  let token = await getApiToken();

  if (!token) {
    // ถ้าไม่มี token ให้ไป login ก่อน
    await login();
    token = await getApiToken();
  }

  // ดึงข้อมูล API ID จาก Database เพื่อเอาไปใช้ยิง API ของ Huawei
  const inverterSql = `SELECT
    DeviceId,
    ApiDeviceId ,
    Multiplier,
    SiteId,
    Device.DevId
FROM
    ApiGetDeviceDataMapping
    LEFT JOIN AZ_Sites ON ApiGetDeviceDataMapping.AZSiteId = AZ_Sites.Id
    JOIN Device ON ApiGetDeviceDataMapping.DeviceId = Device.Id
WHERE
	ApiTypeId = 1`;

  const responseInverter = await ExecuteQuery(inverterSql);

  let inverterIdArray = [];
  for (const inverter of responseInverter) {
    inverterIdArray.push(inverter.ApiDeviceId);
  }
  let iverterIdString = inverterIdArray.join(",");

  // ดึงข้อมูล Inverter จาก API ของ Huawei ใช้ typeId = 1
  const paramsInverterData = {
    devIds: iverterIdString,
    devTypeId: 1,
  };
  let inverterDataResponse = await getInverterData(paramsInverterData, token);
  if (inverterDataResponse.data?.failCode === 305) {
    await login();
    token = await getApiToken();
    inverterDataResponse = await getInverterData(paramsInverterData, token);
  }

  const inverterData = inverterDataResponse.data?.data;
  let inverterRawDataArray = [];

  const iotHubDataArray = [];
  // วน Insert ข้อมูลลง Database
  if (inverterData !== null) {
    for (const inverter of inverterData) {
      const apiDeviceId = inverter?.devId;
      const deviceObject = responseInverter.find(
        (item) => item.ApiDeviceId == apiDeviceId
      );
      const multiplier = deviceObject?.Multiplier;
      const deviceId = deviceObject?.DeviceId;
      const activePower = inverter?.dataItemMap?.active_power * multiplier;
      const exportEnergy = inverter?.dataItemMap?.total_cap;
      const az_siteId = deviceObject?.SiteId;
      const az_devId = deviceObject?.DevId;

      const insertString = `( ${deviceId}, 'kw', ${activePower} )`;
      inverterRawDataArray.push(insertString);

      if (deviceId !== undefined) {
        const insertQuery = `IF NOT EXISTS (SELECT Id  FROM RawData WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${deviceId} AND Field = 'kw')
    BEGIN
     INSERT INTO RawData (Timestamp, DevId, Field, Value) VALUES (convert(datetime,'${datetime}'),${deviceId},'kw',${activePower})
     END
     ELSE
     UPDATE RawData SET Value = ${activePower} WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${deviceId} AND Field = 'kw'`;

        logger.info(
          `insertQuery Inverter: ${datetime} devId: ${deviceId} value: ${activePower}`
        );
        ExecuteQuery(insertQuery);

        const iotHubDataObject = {
          siteId: az_siteId,
          deviceId: az_devId,
          nString: "kw",
          value: activePower,
        };
        iotHubDataArray.push(iotHubDataObject);

        const insertExportEnergyQuery = `IF NOT EXISTS (SELECT Id  FROM RawData WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${deviceId} AND Field = 'kwh')
    BEGIN
     INSERT INTO RawData (Timestamp, DevId, Field, Value) VALUES (convert(datetime,'${datetime}'),${deviceId},'kwh',${exportEnergy})
     END
     ELSE
     UPDATE RawData SET Value = ${exportEnergy} WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${deviceId} AND Field = 'kwh'`;

        logger.info(
          `insertQuery Inverter Energy: ${datetime} devId: ${deviceId} value: ${exportEnergy}`
        );
        ExecuteQuery(insertExportEnergyQuery);

        const iotHubDataObjectEnergy = {
          siteId: az_siteId,
          deviceId: az_devId,
          nString: "kwh",
          value: exportEnergy,
        };
        iotHubDataArray.push(iotHubDataObjectEnergy);
      }
    }
  }

  // console.log("iotHubDataArray", iotHubDataArray);

  // ดึงข้อมูล API ID จาก Database เพื่อเอาไปใช้ยิง API ของ Huawei
  const meterSql = `SELECT
    DeviceId,
    ApiDeviceId ,
    Multiplier,
    SiteId,
    Device.DevId
FROM
    ApiGetDeviceDataMapping
    LEFT JOIN AZ_Sites ON ApiGetDeviceDataMapping.AZSiteId = AZ_Sites.Id
    JOIN Device ON ApiGetDeviceDataMapping.DeviceId = Device.Id
WHERE
	ApiTypeId = 47`;

  const responseMeter = await ExecuteQuery(meterSql);

  let meterIdArray = [];
  for (const inverter of responseMeter) {
    meterIdArray.push(inverter.ApiDeviceId);
  }
  let meterIdString = meterIdArray.join(",");

  // ดึงข้อมูล Inverter จาก API ของ Huawei ใช้ typeId = 1
  const paramsMeterData = {
    devIds: meterIdString,
    devTypeId: 47,
  };

  // console.log("paramsMeterData", paramsMeterData);
  let meterDataResponse = await getMeterData(paramsMeterData, token);
  if (meterDataResponse.data?.failCode === 305) {
    await login();
    token = await getApiToken();
    meterDataResponse = await getMeterData(paramsMeterData, token);
  }

  const meterData = meterDataResponse.data?.data;
  // console.log("meterData", meterData);
  // วน Insert ข้อมูลลง Database
  if (meterData !== null) {
    for (const meter of meterData) {
      const apiDeviceId = meter?.devId;
      const deviceObject = responseMeter.find(
        (item) => item.ApiDeviceId == apiDeviceId
      );

      const multiplier = deviceObject?.Multiplier;
      const deviceId = deviceObject?.DeviceId;
      const activePower = meter?.dataItemMap?.active_power * multiplier;
      const importEnergy = meter?.dataItemMap?.reverse_active_cap;
      const az_siteId = deviceObject?.SiteId;
      const az_devId = deviceObject?.DevId;

      if (deviceId !== undefined) {
        const insertQuery = `IF NOT EXISTS (SELECT Id  FROM RawData WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${deviceId} AND Field = 'kw')
    BEGIN
     INSERT INTO RawData (Timestamp, DevId, Field, Value) VALUES (convert(datetime,'${datetime}'),${deviceId},'kw',${activePower})
     END
     ELSE
     UPDATE RawData SET Value = ${activePower} WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${deviceId} AND Field = 'kw'`;

        logger.info(
          `insertQuery Meter: ${datetime} devId: ${deviceId} value: ${activePower}`
        );
        ExecuteQuery(insertQuery);

        const iotHubDataObject = {
          siteId: az_siteId,
          deviceId: az_devId,
          nString: "kw",
          value: activePower,
        };
        iotHubDataArray.push(iotHubDataObject);

        const insertImportEnergyQuery = `IF NOT EXISTS (SELECT Id  FROM RawData WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${deviceId} AND Field = 'kwh')
    BEGIN
     INSERT INTO RawData (Timestamp, DevId, Field, Value) VALUES (convert(datetime,'${datetime}'),${deviceId},'kwh',${importEnergy})
     END
     ELSE
     UPDATE RawData SET Value = ${importEnergy} WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${deviceId} AND Field = 'kwh'`;

        logger.info(
          `insertQuery Meter Energy: ${datetime} devId: ${deviceId} value: ${importEnergy}`
        );
        ExecuteQuery(insertImportEnergyQuery);

        const iotHubDataObjectEnergy = {
          siteId: az_siteId,
          deviceId: az_devId,
          nString: "kwh",
          value: importEnergy,
        };
        iotHubDataArray.push(iotHubDataObjectEnergy);
      }
    }
  }

  // console.log("iotHubDataArray MeterData", iotHubDataArray);
  // ส่งข้อมูลไป IotHub
  sendDataToIotHub(iotHubDataArray);

  const data = {
    status: "success",
    datetime: datetime,
    data: [...responseInverter, ...responseMeter],
  };
  return NextResponse.json(data);
}

async function getApiToken() {
  const sql = `SELECT Token FROM ApiToken Where CompanyId = 5`;

  let response = await ExecuteQuery(sql);
  return response?.[0]?.Token;
}

async function login() {
  const loginParams = {
    userName: process.env.INVERTER_API_USERNAME,
    systemCode: process.env.INVERTER_API_PASSWORD,
  };

  const response = await axios.post(
    `${process.env.INVERTER_API_URL}/login`,
    loginParams,
    {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }
  );

  const data = response.data;
  const token = response.headers["xsrf-token"];

  // console.log("data", data);
  // console.log("token", token);

  const sql = `UPDATE ApiToken SET Token = '${token}' , UpdatedTime = GETDATE() WHERE CompanyId = 5`;
  await ExecuteQuery(sql);
}

async function getInverterData(paramsInverterData, token) {
  try {
    const inverterDataResponse = await axios.post(
      `${process.env.INVERTER_API_URL}/getDevRealKpi`,
      paramsInverterData,
      {
        headers: { "XSRF-TOKEN": token },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    );

    return inverterDataResponse;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

async function getMeterData(paramsInverterData, token) {
  try {
    const meterDataResponse = await axios.post(
      `${process.env.INVERTER_API_URL}/getDevRealKpi`,
      paramsInverterData,
      {
        headers: { "XSRF-TOKEN": token },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    );

    return meterDataResponse;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}
