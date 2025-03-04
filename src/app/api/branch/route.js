import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { ceil, floor, formatToNumberWithDecimalPlaces } from "@/utils/utils";

export async function GET(request) {
  dayjs.extend(floor);
  dayjs.extend(ceil);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("company_id") ?? 1;
  const username = searchParams.get("username") ?? null;

  let branchIdList = [];
  if (username !== null || username !== undefined) {
    const userBranchQuery = `SELECT
    BranchId 
  FROM
    User_Branch 
  WHERE
    Username = '${username}' `;

    const userBranchResponse = await ExecuteQuery(userBranchQuery);
    for (const userBranchObject of userBranchResponse) {
      branchIdList.push(userBranchObject.BranchId);
    }
  }

  const sql = `SELECT
	Company.Id,
	Company.Name,
	Company.Description,
	Branch.Id AS BranchId,
	Branch.Name AS BranchName,
	Branch.Description AS BranchDescription
FROM
	dbo.Company
	INNER JOIN dbo.Branch ON Company.Id = Branch.CompanyId
WHERE
	Company.Id = ${id} ${
    branchIdList.length > 0
      ? ` AND Branch.Id IN ( ${branchIdList.join(",")} )`
      : ""
  }`;

  const response = await ExecuteQuery(sql);

  const branchData = [];
  let branchResponse = [];

  if (response.length > 0) {
    const branch = unique(response, "BranchId");

    const now = dayjs();
    const today = now.format("YYYY-MM-DD");
    // const datetimeNow = now.format("YYYY-MM-DD HH:[00:00]");
    const datetimeNow = now.floor("minute", 5).format("YYYY-MM-DD HH:mm:[00]");
    const datetimeEnd = now.ceil("minute", 5).format("YYYY-MM-DD HH:mm:[00]");

    /** ใช้ for...of หรือ for...in เพื่อรอให้ Loop ทำงานเสร็จก่อน */
    for (const branchItem of response) {
      const branchCurrentDemandQuery = `SELECT SUM ( RawData.Value ) AS CurrentDemand
      FROM
        dbo.Branch
        INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
        INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
        INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Branch.Id IN ( ${branchItem.BranchId} ) 
        AND Device.DeviceTypeId LIKE '%pm%'
        AND Device.Sequence = 1
        AND RawData.Field = 'kw'
        AND RawData.Timestamp >= Convert(datetime,'${datetimeNow}')
        AND RawData.Timestamp < Convert(datetime,'${datetimeEnd}')`;

      const branchCurrentDemandResponse = await ExecuteQuery(
        branchCurrentDemandQuery
      );

      const branchPowerGenerationQuery = `SELECT SUM ( RawData.Value ) AS PowerGeneration
      FROM
      dbo.Branch
      INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
      INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
      INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Branch.Id IN ( ${branchItem.BranchId} ) 
        AND Device.DeviceTypeId LIKE '%gen%'
        AND RawData.Field ='kw'
        AND RawData.Timestamp >= Convert(datetime,'${datetimeNow}')
        AND RawData.Timestamp < Convert(datetime,'${datetimeEnd}')`;
      const branchPowerGenerationResponse = await ExecuteQuery(
        branchPowerGenerationQuery
      );

      const energyGenerationQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS EnergyGeneration FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value ) AS MaxEnergy
        FROM
        dbo.Branch
        INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
        INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
        INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Branch.Id IN ( ${branchItem.BranchId} ) 
        AND Device.DeviceTypeId LIKE '%gen%'
          AND Device.Sequence = 1
          AND RawData.Field = 'kwh'
        AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) GROUP BY RawData.DevId) t`;

      const energyGenerationResponse = await ExecuteQuery(
        energyGenerationQuery
      );

      const branchEnergyQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS Energy FROM (
      SELECT 
      Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value ) AS MaxEnergy
      FROM
      dbo.Branch
      INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
      INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
      INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
    Branch.Id IN ( ${branchItem.BranchId} ) 
      AND Device.DeviceTypeId LIKE '%pm%'
        AND Device.Sequence = 1
        AND RawData.Field = 'kwh'
      AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) GROUP BY RawData.DevId) t`;

      const branchEnergyResponse = await ExecuteQuery(branchEnergyQuery);

      const branchOnPeakEnergyQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS Energy FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value ) AS MaxEnergy
        FROM
        dbo.Branch
        INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
        INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
        INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Branch.Id IN ( ${branchItem.BranchId} ) 
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

      const branchOnPeakEnergyResponse = await ExecuteQuery(
        branchOnPeakEnergyQuery
      );

      const branchOffPeakEnergyQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS Energy FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value ) AS MaxEnergy
        FROM
        dbo.Branch
        INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
        INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
        INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Branch.Id IN ( ${branchItem.BranchId} ) 
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
      const branchOffPeakEnergyResponse = await ExecuteQuery(
        branchOffPeakEnergyQuery
      );

      const energy_onpeak = branchOnPeakEnergyResponse?.[0].Energy ?? 0;
      const energy_offpeak = branchOffPeakEnergyResponse?.[0].Energy ?? 0;

      // const energy_onpeak_cost = energy_onpeak * onPeak_cost;
      // const energy_offpeak_cost = energy_offpeak * offPeak_cost;

      const energy_total = energy_offpeak + energy_onpeak;
      // const energy_total_cost = energy_offpeak_cost + energy_onpeak_cost;

      const branchObj = {
        id: branchItem.BranchId,
        name: branchItem.BranchName,
        description: branchItem.BranchDescription,
        current_demand:
          formatToNumberWithDecimalPlaces(
            branchCurrentDemandResponse?.[0].CurrentDemand,
            2
          ) ?? 0,
        power_generation:
          formatToNumberWithDecimalPlaces(
            branchPowerGenerationResponse?.[0].PowerGeneration,
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

      branchData.push(branchObj);
    }

    branchResponse = [{ company_id: id, data: branchData }];
    // console.log("response", branchData);
  }

  const returnResponse = branchResponse.filter((obj) => {
    return obj.company_id == id;
  });
  const noDataResponse = {
    message: "no data",
  };
  return NextResponse.json(returnResponse[0]?.data ?? noDataResponse);
}

export function POST(request) {
  return NextResponse.json();
}
