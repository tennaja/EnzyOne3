import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { ceil, floor, formatToNumberWithDecimalPlaces } from "@/utils/utils";

export async function GET(request) {
  dayjs.extend(floor);
  dayjs.extend(ceil);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("branch_id") ?? 1;

  const sql = `SELECT 
	Branch.Id AS  Id, 
  Branch.Name as Name,
	Area.Id AS AreaId,
	Area.Name AS AreaName
FROM 
  dbo.Branch
	INNER JOIN dbo.Area ON Branch.Id = Area.BranchId 
WHERE
	Branch.Id = ${id}`;

  const response = await ExecuteQuery(sql);

  let areaResponse = [];

  if (response.length > 0) {
    const branchName = response[0].Name;
    const area = unique(response, "AreaId");

    const now = dayjs();
    const today = now.format("YYYY-MM-DD");
    // const datetimeNow = now.format("YYYY-MM-DD HH:[00:00]");
    const datetimeNow = now.floor("minute", 5).format("YYYY-MM-DD HH:mm:[00]");
    const datetimeEnd = now.ceil("minute", 5).format("YYYY-MM-DD HH:mm:[00]");
    const areaData = [];

    /** ใช้ for...of หรือ for...in เพื่อรอให้ Loop ทำงานเสร็จก่อน */
    for (const areaItem of response) {
      const areaCurrentDemandQuery = `SELECT SUM ( RawData.Value ) AS CurrentDemand
      FROM
         dbo.Area 
        INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
        INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Area.Id IN ( ${areaItem.AreaId} ) 
        AND Device.DeviceTypeId LIKE '%pm%'
        AND Device.Sequence = 1
        AND RawData.Field = 'kw'
        AND RawData.Timestamp >= Convert(datetime,'${datetimeNow}')
        AND RawData.Timestamp < Convert(datetime,'${datetimeEnd}')`;

      const areaCurrentDemandResponse = await ExecuteQuery(
        areaCurrentDemandQuery
      );

      const areaPowerGenerationQuery = `SELECT SUM (  RawData.Value ) AS PowerGeneration
      FROM
      dbo.Area 
     INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
     INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
     INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
     INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
     INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
   WHERE
        Area.Id IN ( ${areaItem.AreaId}  ) 
        AND Device.DeviceTypeId LIKE '%gen%'
        AND RawData.Field = 'kw'
        AND RawData.Timestamp >= Convert(datetime,'${datetimeNow}')
        AND RawData.Timestamp < Convert(datetime,'${datetimeEnd}')`;
      const areaPowerGenerationResponse = await ExecuteQuery(
        areaPowerGenerationQuery
      );

      const energyGenerationQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS EnergyGeneration FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value) AS MaxEnergy
        FROM
        dbo.Area  
        INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
        INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Area.Id IN ( ${areaItem.AreaId} ) 
        AND Device.DeviceTypeId LIKE '%gen%'
          AND Device.Sequence = 1
          AND RawData.Field = 'kwh'
        AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) GROUP BY RawData.DevId) t`;

      const energyGenerationResponse = await ExecuteQuery(
        energyGenerationQuery
      );

      const areaEnergyQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS Energy FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value) AS MaxEnergy
        FROM
        dbo.Area  
        INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
        INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Area.Id IN ( ${areaItem.AreaId} ) 
        AND Device.DeviceTypeId LIKE '%pm%'
          AND Device.Sequence = 1
          AND RawData.Field = 'kwh'
        AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) GROUP BY RawData.DevId) t`;

      const areaEnergyResponse = await ExecuteQuery(areaEnergyQuery);

      const areaOnPeakEnergyQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS Energy FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value ) AS MaxEnergy
        FROM
        dbo.Area  
        INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
        INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Area.Id IN ( ${areaItem.AreaId} ) 
      AND Device.DeviceTypeId LIKE '%pm%' 
      AND Device.Sequence = 1
      AND (
          DATEPART( dw, TIMESTAMP ) BETWEEN 2 
          AND 6 -- Weekdays (Monday to Friday)
          
          AND ( DATEPART( HOUR, TIMESTAMP ) BETWEEN  9 AND 22 -- On-peak hours
        ) 
      ) 
      AND RawData.Field = 'kwh'
      AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) GROUP BY
      RawData.DevId  ) t `;

      const areaOnPeakEnergyResponse = await ExecuteQuery(
        areaOnPeakEnergyQuery
      );

      const areaOffPeakEnergyQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS Energy FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value ) AS MaxEnergy
        FROM
        dbo.Area  
        INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
        INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Area.Id IN ( ${areaItem.AreaId} ) 
        AND Device.DeviceTypeId LIKE '%pm%' 
        AND Device.Sequence = 1 
        AND (
          DATEPART( dw, TIMESTAMP ) IN ( 1, 7 ) -- Weekends (Saturday or Sunday)
          
          OR (
            DATEPART( dw, TIMESTAMP ) BETWEEN 2 
            AND 6 -- Weekdays (Monday to Friday)
            
            AND ( DATEPART( HOUR, TIMESTAMP ) < 9 OR DATEPART( HOUR, TIMESTAMP ) > 22 -- Off-peak hours
            ) 
          ) 
        ) 
        AND RawData.Field = 'kwh'
        AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) 
      GROUP BY
        RawData.DevId 
      ) t 
     `;
      const areaOffPeakEnergyResponse = await ExecuteQuery(
        areaOffPeakEnergyQuery
      );

      const energy_onpeak = areaOnPeakEnergyResponse?.[0].Energy ?? 0;
      const energy_offpeak = areaOffPeakEnergyResponse?.[0].Energy ?? 0;

      // const energy_onpeak_cost = energy_onpeak * onPeak_cost;
      // const energy_offpeak_cost = energy_offpeak * offPeak_cost;

      const energy_total = energy_offpeak + energy_onpeak;
      // const energy_total_cost = energy_offpeak_cost + energy_onpeak_cost;

      const areaObj = {
        id: areaItem.AreaId,
        name: areaItem.AreaName,
        current_demand:
          formatToNumberWithDecimalPlaces(
            areaCurrentDemandResponse?.[0].CurrentDemand,
            2
          ) ?? 0,
        power_generation:
          formatToNumberWithDecimalPlaces(
            areaPowerGenerationResponse?.[0].PowerGeneration,
            2
          ) ?? 0,
        energy_generation:
          formatToNumberWithDecimalPlaces(
            energyGenerationResponse?.[0]?.EnergyGeneration,
            2
          ) ?? 0,
        energy_total: formatToNumberWithDecimalPlaces(energy_total),
        energy_onpeak: formatToNumberWithDecimalPlaces(energy_onpeak),
        energy_offpeak: formatToNumberWithDecimalPlaces(energy_offpeak),
        cost_saving: 0,
        co2_saving: 0,
      };

      areaData.push(areaObj);
    }

    areaResponse = [{ branch_id: id, branch_name: branchName, data: areaData }];
    // console.log("response", branchData);
  }

  const returnResponse = areaResponse.filter((obj) => {
    return obj.branch_id == id;
  });

  const noDataResponse = {
    message: "no data",
  };
  return NextResponse.json(returnResponse[0] ?? noDataResponse);
}

export function POST(request) {
  return NextResponse.json();
}
