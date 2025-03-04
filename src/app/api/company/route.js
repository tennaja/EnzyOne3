import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";

import dayjs from "dayjs";
import { ceil, floor, formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { format } from "winston";
import { calculateFlatRateCost } from "../utils/function";

export async function GET(request) {
  dayjs.extend(floor);
  dayjs.extend(ceil);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? 1;
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
	Area.Id AS AreaId,
	Area.Name AS AreaName,
	Building.Id AS BuildingId,
	Building.Name AS BuildingName
FROM
	dbo.Company
	INNER JOIN dbo.Branch ON Company.Id = Branch.CompanyId
	INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
	INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
	INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
WHERE
	Company.Id = ${id} ${
    branchIdList.length > 0
      ? ` AND Branch.Id IN ( ${branchIdList.join(",")} )`
      : ""
  }`;

  const response = await ExecuteQuery(sql);

  if (response.length > 0) {
    const companyName = unique(response, "Name")[0];
    const companyDescription = unique(response, "Description")[0];
    const branch = unique(response, "BranchId");
    const area = unique(response, "AreaId");
    const building = unique(response, "BuildingId");

    const now = dayjs();
    // const datetimeNow = now.format("YYYY-MM-DD HH:[00:00]");
    const datetimeNow = now.floor("minute", 5).format("YYYY-MM-DD HH:mm:[00]");
    const datetimeEnd = now.ceil("minute", 5).format("YYYY-MM-DD HH:mm:[00]");

    const variableSql = `SELECT
	VariableData.Data, 
	VariableData.[Value], 
	VariableData.[Year], 
	VariableData.[Month]
FROM
	dbo.VariableData
	WHERE [Year] = ${now.get("year")}
	and [Month] = ${now.get("month") + 1}`;

    const responseVariable = await ExecuteQuery(variableSql);
    let offPeak_cost = 0;
    let onPeak_cost = 0;
    let solar_hour = 0;
    let flat_rate_level_1_cost = 0;
    let flat_rate_level_2_cost = 0;
    let flat_rate_level_3_cost = 0;

    for (const variable of responseVariable) {
      if (variable.Data.toLowerCase() == "offpeak_cost")
        offPeak_cost = variable.Value;
      else if (variable.Data.toLowerCase() == "onpeak_cost")
        onPeak_cost = variable.Value;
      else if (variable.Data.toLowerCase() == "solarhour")
        solar_hour = variable.Value;
      else if (variable.Data.toLowerCase() == "flat_level_1_cost")
        flat_rate_level_1_cost = variable.Value;
      else if (variable.Data.toLowerCase() == "flat_level_2_cost")
        flat_rate_level_2_cost = variable.Value;
      else if (variable.Data.toLowerCase() == "flat_level_3_cost")
        flat_rate_level_3_cost = variable.Value;
    }

    const currentDemandQuery = `SELECT SUM ( RawData.Value ) AS CurrentDemand  
  FROM
    dbo.Building
    INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
    INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
    INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
  WHERE
    Building.Id IN ( ${building} ) 
    AND Device.DeviceTypeId LIKE '%pm%'
    AND Device.Sequence = 1
    AND RawData.Field = 'kw'
    AND RawData.Timestamp >=Convert(datetime,'${datetimeNow}')
    AND RawData.Timestamp < Convert(datetime,'${datetimeEnd}')`;

    const currentDemandResponse = await ExecuteQuery(currentDemandQuery);

    const powerGenerationQuery = `SELECT SUM ( RawData.Value ) AS PowerGeneration
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${building} ) 
      AND Device.DeviceTypeId LIKE '%gen%'
      AND RawData.Field = 'kw'
      AND RawData.Timestamp >=Convert(datetime,'${datetimeNow}')
      AND RawData.Timestamp < Convert(datetime,'${datetimeEnd}')`;
    const powerGenerationResponse = await ExecuteQuery(powerGenerationQuery);

    const today = now.format("YYYY-MM-DD");

    const energyGenerationQuery = `SELECT
    Type,
    SUM ( MaxEnergy - MinEnergy ) AS EnergyGeneration 
  FROM
    (
    SELECT
      'Solar' AS Type,
      MAX ( RawData.Value ) AS MaxEnergy,
      MIN ( RawData.Value ) AS MinEnergy 
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${building} ) 
      AND Device.DeviceTypeId LIKE '%gen%' 
      AND RawData.Field = 'kwh'
      AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) 
    GROUP BY
      RawData.DevId 
    ) t 
  GROUP BY
    Type`;

    const energyGenerationResponse = await ExecuteQuery(energyGenerationQuery);

    const offPeakEnergyQuery = `SELECT
    Type,
    SUM ( MaxEnergy - MinEnergy ) AS Energy 
  FROM
    (
    SELECT
      'Off-peak' AS Type,
      MAX ( RawData.Value ) AS MaxEnergy,
      MIN ( RawData.Value ) AS MinEnergy 
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${building} ) 
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
  GROUP BY
    Type
  `;

    const offPeakEnergyResponse = await ExecuteQuery(offPeakEnergyQuery);

    const onPeakEnergyQuery = `
    SELECT
    Type,
    SUM ( MaxEnergy - MinEnergy ) AS Energy 
  FROM
    (
    SELECT
    'On-peak' AS Type,
     Max( RawData.Value ) AS MaxEnergy, Min( RawData.Value ) AS MinEnergy
  FROM
    dbo.Building
    INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
    INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
    INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
  WHERE
    Building.Id IN ( ${building} ) 
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
		RawData.DevId  ) t GROUP BY Type`;

    const flatEnergyQuery = `
    SELECT
    Type,
    SUM ( MaxEnergy - MinEnergy ) AS Energy 
  FROM
    (
    SELECT
    'Flat' AS Type,
     Max( RawData.Value ) AS MaxEnergy, Min( RawData.Value ) AS MinEnergy
  FROM
    dbo.Building
    INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
    INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
    INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
  WHERE
    Building.Id IN ( ${building} ) 
    AND Device.DeviceTypeId LIKE '%pm%' 
    AND Device.Sequence = 1
    AND RawData.Field = 'kwh'
    AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) GROUP BY
		RawData.DevId  ) t GROUP BY Type`;

    const flatEnergyResponse = await ExecuteQuery(flatEnergyQuery);

    const solarGenerationQuery = `SELECT
    Type,
    SUM ( MaxEnergy - MinEnergy ) AS Energy 
  FROM
    (
    SELECT
      'Solar' AS Type,
      MAX ( RawData.Value ) AS MaxEnergy,
      MIN ( RawData.Value ) AS MinEnergy 
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${building} ) 
      AND Device.DeviceTypeId LIKE '%gen_solar%' 
      AND RawData.Field = 'kwh'
      AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) 
    GROUP BY
      RawData.DevId 
    ) t 
  GROUP BY
    Type`;

    const solarGenerationResponse = await ExecuteQuery(solarGenerationQuery);

    const onPeakEnergyResponse = await ExecuteQuery(onPeakEnergyQuery);

    const energy_onpeak = onPeakEnergyResponse?.[0]?.Energy ?? 0;
    const energy_offpeak = offPeakEnergyResponse?.[0]?.Energy ?? 0;
    const flat_energy = flatEnergyResponse?.[0]?.Energy ?? 0;
    const solar_energy = solarGenerationResponse?.[0]?.Energy ?? 0;

    const energy_onpeak_cost = energy_onpeak * onPeak_cost;
    const energy_offpeak_cost = energy_offpeak * offPeak_cost;
    const flat_energy_cost = calculateFlatRateCost(
      flat_energy,
      flat_rate_level_1_cost,
      flat_rate_level_2_cost,
      flat_rate_level_3_cost
    );
    const yield_solar = solar_energy * solar_hour;

    const totalYield = yield_solar;
    const energy_total = energy_offpeak + energy_onpeak;
    const energy_total_cost = energy_offpeak_cost + energy_onpeak_cost;

    const returnResponse = [
      {
        id: id,
        name: companyName,
        description: companyDescription,
        branch: branch.length,
        area: area.length,
        building: building.length,
        current_demand:
          formatToNumberWithDecimalPlaces(
            currentDemandResponse?.[0]?.CurrentDemand,
            2
          ) ?? 0,
        power_generation:
          formatToNumberWithDecimalPlaces(
            powerGenerationResponse?.[0]?.PowerGeneration,
            2
          ) ?? 0,
        energy_consumption: formatToNumberWithDecimalPlaces(energy_total, 2),
        energy_generation:
          formatToNumberWithDecimalPlaces(
            energyGenerationResponse?.[0]?.EnergyGeneration,
            2
          ) ?? 0,
        energy_offpeak: formatToNumberWithDecimalPlaces(energy_offpeak),
        energy_onpeak: formatToNumberWithDecimalPlaces(energy_onpeak),
        energy_offpeak_cost: formatToNumberWithDecimalPlaces(
          energy_offpeak_cost,
          2
        ),
        energy_onpeak_cost: formatToNumberWithDecimalPlaces(
          energy_onpeak_cost,
          2
        ),
        energy_total_cost:
          id == 5
            ? formatToNumberWithDecimalPlaces(flat_energy_cost, 2)
            : formatToNumberWithDecimalPlaces(energy_total_cost, 2),

        total_yield: formatToNumberWithDecimalPlaces(totalYield, 2),
      },
    ];

    return NextResponse.json(returnResponse[0]);
  } else {
    const returnResponse = [
      {
        message: "no data",
      },
    ];

    return NextResponse.json(returnResponse[0]);
  }
}

export function POST(request) {
  return NextResponse.json();
}
