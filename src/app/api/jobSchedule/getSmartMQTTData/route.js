import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";
import axios from "axios";
import dayjs from "dayjs";
import { floor } from "@/utils/utils";
import { logger } from "@/utils/logger";
import { mockData, mockPowerMeterData } from "./mockData";
const https = require("https");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let now = dayjs();
  dayjs.extend(floor);
  let datetime = now.floor("minute", 5).format("YYYY-MM-DD HH:mm:[00]");

  // const apiDeviceData = await axios.get(
  //   `${process.env.SMARTENERGY_MQTT_API_URL}/api/SmartIR/log/last`
  // );
  // console.log("apiDeviceData.data", apiDeviceData.data);
  // const deviceData = apiDeviceData.data;

  axios
    .get(
      `${process.env.SMARTENERGY_MQTT_API_URL}/api/SmartIR/log/lastbyapp/GSB_APP`
    )
    .then(async (response) => {
      const branchMappingQuery = `SELECT  [BranchId]
      ,[BranchMappingName] FROM ApiBranchMapping`;

      const branchMappingResponse = await ExecuteQuery(branchMappingQuery);
      const apiDeviceData = response;
      // console.log("apiDeviceData.data", apiDeviceData.data);
      const deviceData = apiDeviceData.data;
      for (const branch of branchMappingResponse) {
        const branchApiDataRoomKey = `${branch.BranchMappingName}-IR01`;
        const branchApiDataRoomObject = deviceData[branchApiDataRoomKey];

        const branchApiDataAirCondKey = `${branch.BranchMappingName}-IR02`;
        const branchApiDataAirCondObject = deviceData[branchApiDataAirCondKey];

        const temperature = branchApiDataRoomObject?.temperaturePV ?? null;
        const humidity = branchApiDataRoomObject?.humidityPV ?? null;

        const temperatureSetPoint =
          branchApiDataAirCondObject?.temperatureSP ?? null;
        const power =
          branchApiDataAirCondObject?.power == "On" ? 1 : "Off" ? 0 : null;

        const mode =
          branchApiDataAirCondObject?.mode == "Auto"
            ? 0
            : branchApiDataAirCondObject?.mode == "Cool"
            ? 1
            : branchApiDataAirCondObject?.mode == "Dry"
            ? 2
            : branchApiDataAirCondObject?.mode == "Fan"
            ? 3
            : branchApiDataAirCondObject?.mode == "Heat"
            ? 4
            : null;

        const fanState = branchApiDataAirCondObject?.fanState ?? null;

        const deviceQuery = `SELECT
      Branch.Id AS BranchID,
      Device.Id AS DeviceId,
      Device.DeviceTypeId,
      Device.Name 
    FROM
      Branch
      JOIN ApiBranchMapping ON Branch.id = ApiBranchMapping.BranchId
      JOIN Area ON branch.Id = Area.BranchId
      JOIN AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
      JOIN Building ON AreaBuildingMapping.BuildingId = Building.Id
      JOIN Floor ON Building.Id = Floor.BuildingId
      JOIN Device ON Floor.Id = Device.FloorId 
    WHERE
      ( Device.DeviceTypeId LIKE '%hvac%'  AND Device.DeviceTypeId NOT LIKE '%pm%')
        AND Branch.Id = ${branch.BranchId} `;

        const deviceResponse = await ExecuteQuery(deviceQuery);

        // console.log("deviceResponse", deviceResponse);
        for (const device of deviceResponse) {
          if (device.DeviceTypeId == "hvac_split_type_s_ir") {
            insertData(datetime, device.DeviceId, "power", power);
            insertData(datetime, device.DeviceId, "mode", mode);
            insertData(
              datetime,
              device.DeviceId,
              "temperature_set_point",
              temperatureSetPoint
            );
            insertData(datetime, device.DeviceId, "fanState", fanState);
          } else if (device.DeviceTypeId == "hvac_iot_tmp") {
            insertData(datetime, device.DeviceId, "temperature", temperature);
            insertData(datetime, device.DeviceId, "humidity", humidity);
          } else if (device.DeviceTypeId == "hvac_split_type_tmp") {
          }
        }

        // return NextResponse.json(branchApiDataRoomObject);
      }
    })
    .catch((error) => {
      logger.error(`getSmartMQTTData : ${JSON.stringify(error)}`);
    });

  // const deviceData = mockData;

  // const apiDevicePowerMeterData = await axios.get(
  //   `${process.env.SMARTENERGY_MQTT_API_URL}/api/PowerMeter/log/last`
  // );

  // const devicePowerMeterData = apiDevicePowerMeterData.data;

  // const devicePowerMeterData = mockPowerMeterData;

  axios
    .get(
      `${process.env.SMARTENERGY_MQTT_API_URL}/api/PowerMeter/log/lastbyapp/GSB_APP`
    )
    .then(async (response) => {
      const branchMappingQuery = `SELECT  [BranchId]
      ,[BranchMappingName] FROM ApiBranchMapping`;

      const branchMappingResponse = await ExecuteQuery(branchMappingQuery);

      const apiDevicePowerMeterData = response;
      const devicePowerMeterData = apiDevicePowerMeterData.data;

      for (const branch of branchMappingResponse) {
        const branchApiDataPowerMeterKey = `${branch.BranchMappingName}-PM01`;
        const branchApiDataPowerMeterObject =
          devicePowerMeterData[branchApiDataPowerMeterKey];

        const voltage = branchApiDataPowerMeterObject?.voltageLNAvg ?? null;
        const current = branchApiDataPowerMeterObject?.currentTotal ?? null;
        const activePower =
          branchApiDataPowerMeterObject?.activePowerTotal ?? null;
        const reactivePower =
          branchApiDataPowerMeterObject?.reactivePowerTotal ?? null;
        const activeEnergy =
          branchApiDataPowerMeterObject?.activeEnergyTotal ?? null;
        const reactiveEnergy =
          branchApiDataPowerMeterObject?.reactiveEnergyTotal ?? null;

        const deviceQuery = `SELECT
        Branch.Id AS BranchID,
        Device.Id AS DeviceId,
        Device.DeviceTypeId,
        Device.Name 
      FROM
        Branch
        JOIN ApiBranchMapping ON Branch.id = ApiBranchMapping.BranchId
        JOIN Area ON branch.Id = Area.BranchId
        JOIN AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
        JOIN Building ON AreaBuildingMapping.BuildingId = Building.Id
        JOIN Floor ON Building.Id = Floor.BuildingId
        JOIN Device ON Floor.Id = Device.FloorId 
      WHERE
        ( Device.DeviceTypeId LIKE '%hvac%'  AND Device.DeviceTypeId   LIKE '%pm%')
          AND Branch.Id = ${branch.BranchId} `;

        const deviceResponse = await ExecuteQuery(deviceQuery);

        for (const device of deviceResponse) {
          insertData(datetime, device.DeviceId, "v_avg", voltage);
          insertData(datetime, device.DeviceId, "i_avg", current);
          insertData(datetime, device.DeviceId, "kw_total", activePower);
          insertData(datetime, device.DeviceId, "kvar", reactivePower);
          insertData(datetime, device.DeviceId, "kwh", activeEnergy);
          insertData(datetime, device.DeviceId, "kvarh", reactiveEnergy);
        }
      }
    })
    .catch((error) => {
      logger.error(`getSmartMQTTData : ${JSON.stringify(error)}`);
    });

  return NextResponse.json(datetime);
}

async function insertData(datetime, devId, field, value) {
  // ดักถ้าส่ง value เข้ามาเป็น undefined จะให้ insert null เข้าไปแทน
  value = value == undefined ? null : value;
  const insertQuery = `IF NOT EXISTS (SELECT Id  FROM RawData WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${devId} AND Field = '${field}')
    BEGIN
     INSERT INTO RawData (Timestamp, DevId, Field, Value) VALUES (convert(datetime,'${datetime}'),${devId},'${field}',${value})
     END
     ELSE
     UPDATE RawData SET Value = ${value} WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${devId} AND Field = '${field}'`;

  await ExecuteQuery(insertQuery);
}
