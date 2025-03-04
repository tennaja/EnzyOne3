import ExecuteQuery from "@/utils/db";
import { formatTimestampData, unique } from "@/utils/function";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { NextResponse } from "next/server";

dayjs.extend(customParseFormat);

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const buildingId = searchParams.get("id");
  const timespan = searchParams.get("timespan") ?? "1d";
  const amount = searchParams.get("amount") ?? 5;
  const unit = searchParams.get("unit") ?? "minute";

  let startDate = searchParams.get("startDate") ?? null;
  let endDate = searchParams.get("endDate") ?? null;

  var sql = `SELECT 
      Building.Id AS BuildingId,
      Building.Name AS BuildingName,
      Building.ImageUrl,
      Building.[Order] 
  FROM
      Building
  WHERE
      Building.Id IN ( ${buildingId})`;

  var response = await ExecuteQuery(sql);

  if (response.length > 0) {
    var areaName = response[0].Name;
    var buildingList = unique(response, "BuildingId");
    var now = dayjs();
    if (startDate !== null) {
      now = dayjs(startDate, ["YYYY-MM-DD", "YYYY/MM/DD"]);
    }
    var datetimeNow = now.format("YYYY-MM-DD [00:00:00]");
    var datetimeEnd = now.add(1, "day").format("YYYY-MM-DD [00:00:00]");
    var buildingData = [];
    var buildingResponse = [];

    var buildingCurrentDemandQuery = `SELECT [Timestamp],
       SUM ( RawData.Value )  AS value
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${buildingList} ) 
        AND Device.DeviceTypeId LIKE '%pm%'
        AND Device.Sequence = 1
        AND RawData.Field = 'kw'
        AND RawData.Timestamp >= Convert(datetime,'${datetimeNow}')
        AND RawData.Timestamp <= Convert(datetime,'${datetimeEnd}')
        GROUP BY RawData.Timestamp`;

    // console.log("buildingCurrentDemandQuery", buildingCurrentDemandQuery);
    var buildingCurrentDemandResponse = await ExecuteQuery(
      buildingCurrentDemandQuery
    );

    var buildingPowerGenerationQuery = `SELECT [Timestamp],
       SUM ( RawData.Value )  AS value 
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${buildingList}  ) 
        AND Device.DeviceTypeId LIKE '%gen%'
        AND RawData.Field = 'kw'
        AND RawData.Timestamp >= Convert(datetime,'${datetimeNow}')
        AND RawData.Timestamp <= Convert(datetime,'${datetimeEnd}')
        GROUP BY RawData.Timestamp`;
    var buildingPowerGenerationResponse = await ExecuteQuery(
      buildingPowerGenerationQuery
    );

    const buildingActualDemandQuery = `SELECT grid.Timestamp ,  grid.value + gen.value as value FROM (
      SELECT [Timestamp],
             SUM ( RawData.Value )  AS value 
          FROM
            dbo.Building
            INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
            INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
            INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
          WHERE
            Building.Id IN ( ${buildingList}  ) 
              AND Device.DeviceTypeId = 'pm3_grid'
           AND Device.Sequence = 1
              AND RawData.Field = 'kw'
              AND RawData.Timestamp >= Convert(datetime,'${datetimeNow}')
              AND RawData.Timestamp <= Convert(datetime,'${datetimeEnd}')
             GROUP BY RawData.Timestamp) grid 
             INNER JOIN 
             (
      SELECT [Timestamp],
             SUM ( RawData.Value )  AS value 
          FROM
            dbo.Building
            INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
            INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
            INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
          WHERE
            Building.Id IN ( ${buildingList}  ) 
              AND Device.DeviceTypeId LIKE '%gen%'
              AND RawData.Field = 'kw'
              AND RawData.Timestamp >= Convert(datetime,'${datetimeNow}')
              AND RawData.Timestamp <= Convert(datetime,'${datetimeEnd}')
              GROUP BY RawData.Timestamp) gen
      
          ON grid.Timestamp = gen.Timestamp`;

    var buildingActualDemandResponse = await ExecuteQuery(
      buildingActualDemandQuery
    );

    var loadResponse = formatTimestampData(
      buildingCurrentDemandResponse,
      datetimeNow,
      timespan,
      amount,
      unit
    );
    var genResponse = formatTimestampData(
      buildingPowerGenerationResponse,
      datetimeNow,
      timespan,
      amount,
      unit
    );

    var actualResponse = formatTimestampData(
      buildingActualDemandResponse,
      datetimeNow,
      timespan,
      amount,
      unit
    );
    // console.log("buildingPowerGenerationQuery", buildingPowerGenerationQuery);
    var buildingObj = {
      // id: buildingId,
      // name: buildingItem.BuildingName,
      current_demand: loadResponse,
      power_generation: genResponse,
      actual_demand: actualResponse,
      // energy: 0,
      // cost_saving: 0,
      // co2_saving: 0,
    };

    buildingResponse = buildingObj;
  }

  /*  var response = buildingResponse.filter((obj) => {
    return obj.area_id == id;
  }); */

  var noDataResponse = {
    message: "no data",
  };

  return NextResponse.json(buildingResponse);
}
