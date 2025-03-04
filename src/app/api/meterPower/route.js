import ExecuteQuery from "@/utils/db";
import { formatTimestampData, unique } from "@/utils/function";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("area_id") ?? 1;

  var sql = `SELECT
      Area.Id,
      Area.Name,
      Building.Id AS BuildingId,
      Building.Name AS BuildingName,
      Building.ImageUrl,
      Building.[Order] 
  FROM
      dbo.Area
      INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
      INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
  WHERE
      Area.id = ${id}`;

  var response = await ExecuteQuery(sql);

  if (response.length > 0) {
    var areaName = response[0].Name;
    var buildingList = unique(response, "BuildingId");
    var now = dayjs();
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

    var loadResponse = formatTimestampData(buildingCurrentDemandResponse);
    var genResponse = formatTimestampData(buildingPowerGenerationResponse);
    // console.log("buildingPowerGenerationQuery", buildingPowerGenerationQuery);
    var buildingObj = {
      // id: buildingId,
      // name: buildingItem.BuildingName,
      current_demand: loadResponse,
      power_generation: genResponse,
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
