import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";
import axios from "axios";
import dayjs from "dayjs";
import { floor } from "@/utils/utils";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  var loadDeviceQuery = `SELECT
    Device.Id,
    Device.Name,
    Device.DeviceTypeId,
    Device.Sequence,
    Device.DevId,
    DeviceMapping.ApiTarget ,
    DeviceMapping.ApiType ,
    DeviceMapping.Field
  FROM
    dbo.Building
    INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
    INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
    INNER JOIN dbo.DeviceMapping ON Device.Id = DeviceMapping.DeviceId`;

  var loadDeviceRespone = await ExecuteQuery(loadDeviceQuery);

  var now = dayjs();
  dayjs.extend(floor);
  var datetime = now.floor("minute", 5).format("YYYY-MM-DD HH:mm:[00]");
  loadDeviceRespone.forEach(async (loadItem) => {
    // กลุ่ม Energy kWh ใช้วิธีการ Query ดึงข้อมูลจาก Azure DEC โดยตรง
    if (loadItem.Field == "kwh") {
      if (loadItem.ApiType == "azure-dec") {
        var currentEnergy = await axios.get(loadItem.ApiTarget);

        var energy = currentEnergy.data.value;
      }

      /* var insertQuery = `IF NOT EXISTS (SELECT Id  FROM RawData WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${loadItem.Id})
      BEGIN
       INSERT INTO RawData (Timestamp, DevId, Power, Energy) VALUES (convert(datetime,'${datetime}'),${loadItem.Id},0,${energy})
       END
       ELSE
       UPDATE RawData SET Energy = ${energy} WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${loadItem.Id} `; */

      var insertQuery = `IF NOT EXISTS (SELECT Id  FROM RawData WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${loadItem.Id} AND Field = 'kwh')
      BEGIN
       INSERT INTO RawData (Timestamp, DevId, Field, Value) VALUES (convert(datetime,'${datetime}'),${loadItem.Id},'kwh',${energy})
       END
       ELSE
       UPDATE RawData SET Value = ${energy} WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${loadItem.Id} AND Field = 'kwh'`;

      ExecuteQuery(insertQuery);
    } else if (loadItem.Field == "kw_total" || loadItem.Field == "kw") {
      if (loadItem.ApiType == "backend") {
        var currentDemand = await axios.get(loadItem.ApiTarget);
        // console.log(now);

        // console.log(currentDemand.data);

        var searchDatetime = now.format("YYYY-MM-DD[T]HH:[00:00.000Z]");

        var power = currentDemand.data.find(
          ({ date }) => date === searchDatetime
        ).value;
      } else if (loadItem.ApiType == "azure-apim") {
        var currentDemand = await axios.get(loadItem.ApiTarget, {
          headers: {
            "Ocp-Apim-Subscription-Key": process.env.AZURE_APIM_KEY,
          },
        });

        var power = currentDemand.data.value;
      }

      var insertQuery = `IF NOT EXISTS (SELECT Id  FROM RawData WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${loadItem.Id} AND Field = 'kw')
      BEGIN
       INSERT INTO RawData (Timestamp, DevId, Field, Value) VALUES (convert(datetime,'${datetime}'),${loadItem.Id}, 'kw' , ${power})
       END
       ELSE
       UPDATE RawData SET Value = ${power} WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${loadItem.Id} AND Value <= ${power} AND Field = 'kw'`;

      ExecuteQuery(insertQuery);
    } else {
      if ((loadItem.ApiType = "azure-apim")) {
        const statusResponse = await axios.get(loadItem.ApiTarget, {
          headers: {
            "Ocp-Apim-Subscription-Key": process.env.AZURE_APIM_KEY,
          },
        });
        var status = statusResponse.data.value;
      }

      var insertQuery = `IF NOT EXISTS (SELECT Id  FROM RawData WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${loadItem.Id} AND Field = '${loadItem.Field}')
      BEGIN
       INSERT INTO RawData (Timestamp, DevId, Field, Value) VALUES (convert(datetime,'${datetime}'),${loadItem.Id}, '${loadItem.Field}' , ${status})
       END
       ELSE
       UPDATE RawData SET Value = ${status} WHERE Timestamp = convert(datetime,'${datetime}') AND DevId = ${loadItem.Id} AND Field = '${loadItem.Field}'`;

      ExecuteQuery(insertQuery);
    }
  });

  /* 
  var returnResponse = [
    {
      id: id,
      name: companyName,
      description: companyDescription,
      branch: branch.length,
      area: area.length,
      building: building.length,
    },
  ]; */

  return NextResponse.json(loadDeviceRespone);
}
