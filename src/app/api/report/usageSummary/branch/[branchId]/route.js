import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import numeral from "numeral";
import { formatToNumberWithDecimalPlaces } from "@/utils/utils";

import { calculateFlatRateCost } from "@/app/api/utils/function";

export async function GET(request, { params }) {
  const id = params.branchId;
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") ?? dayjs().get("year");
  const month = searchParams.get("month") ?? dayjs().get("month") + 1;
  const responseVariable = await getVariablesData(year, month);

  let useFlatRate = false;

  const startDate = dayjs()
    .month(month - 1)
    .year(year)
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss");

  const endDate = dayjs()
    .month(month - 1)
    .endOf("month")
    .year(year)
    .format("YYYY-MM-DD HH:mm:ss");

  const variables = {
    offPeak_cost: 0,
    onPeak_cost: 0,
    peakDemand_cost: 0,
    service_cost: 0,
    ft: 0,
    solarHour: 0,
    solarService_cost: 0,
    flat_rate_level_1_cost: 0,
    flat_rate_level_2_cost: 0,
    flat_rate_level_3_cost: 0,
  };

  for (const { Data, Value } of responseVariable) {
    switch (Data.toLowerCase()) {
      case "offpeak_cost":
        variables.offPeak_cost = Value;
        break;
      case "onpeak_cost":
        variables.onPeak_cost = Value;
        break;
      case "peakdemand_cost":
        variables.peakDemand_cost = Value;
        break;
      case "service_cost":
        variables.service_cost = Value;
        break;
      case "ft":
        variables.ft = Value;
        break;
      case "solarhour":
        variables.solarHour = Value;
        break;
      case "solarservice_cost":
        variables.solarService_cost = Value;
        break;
      case "flat_level_1_cost":
        variables.flat_rate_level_1_cost = Value;
        break;
      case "flat_level_2_cost":
        variables.flat_rate_level_2_cost = Value;
        break;
      case "flat_level_3_cost":
        variables.flat_rate_level_3_cost = Value;
        break;
      default:
        break;
    }
  }

  // ออมสินใช้ flat rate และไม่มี peak demand
  if (id >= 6 && id <= 105) {
    useFlatRate = true;
    variables.service_cost = 33.29;
  }

  const responsePeakDemand = await getPeakDemand(id, startDate, endDate);

  const maxPeakDemandObject = responsePeakDemand.reduce(
    (prev, current) =>
      prev && prev.peakDemand > current.peakDemand ? prev : current,
    []
  );

  const responseEnergyConsumption = await getEnergyConsumption(
    id,
    startDate,
    endDate
  );

  const totalEnergyConsumption = responseEnergyConsumption.reduce(
    (sum, { energy_consumption }) => sum + energy_consumption,
    0
  );

  const responseOnPeakEnergy = await getOnPeakEnergy(id, startDate, endDate);
  const responseOffPeakEnergy = await getOffPeakEnergy(id, startDate, endDate);

  const totalOnPeakEnergy = responseOnPeakEnergy.reduce(
    (sum, { energy_onpeak }) => sum + energy_onpeak,
    0
  );

  const totalOffPeakEnergy = responseOffPeakEnergy.reduce(
    (sum, { energy_offpeak }) => sum + energy_offpeak,
    0
  );

  const mergedOnpeakOffPeak = responseOffPeakEnergy.map((item) => {
    const matchedObject = responseOnPeakEnergy.find(
      (obj) => obj.date === item.date
    );
    return { ...item, ...matchedObject };
  });

  const mergedPeakDemandOnPeakOffPeak = mergedOnpeakOffPeak.map((item) => {
    const matchedObject = responsePeakDemand.find(
      (obj) => obj.date === item.date
    );
    return { ...item, ...matchedObject };
  });

  for (const dateItem of mergedPeakDemandOnPeakOffPeak) {
    let offPeak_cost = (dateItem.energy_offpeak ?? 0) * variables.offPeak_cost;
    let onPeak_cost = (dateItem.energy_onpeak ?? 0) * variables.onPeak_cost;
    let energy_total =
      (dateItem.energy_offpeak ?? 0) + (dateItem.energy_onpeak ?? 0);
    let energy_total_cost = offPeak_cost + onPeak_cost;
    dateItem.energy_total = formatToNumberWithDecimalPlaces(energy_total);
    dateItem.energy_total_cost = formatToNumberWithDecimalPlaces(
      energy_total_cost,
      2
    );
    dateItem.cost_average = formatToNumberWithDecimalPlaces(
      energy_total_cost / energy_total,
      2
    );
    dateItem.peakDemand = formatToNumberWithDecimalPlaces(
      dateItem.peakDemand,
      2,
      false
    );
    dateItem.energy_onpeak = formatToNumberWithDecimalPlaces(
      dateItem.energy_onpeak
    );
    dateItem.energy_offpeak = formatToNumberWithDecimalPlaces(
      dateItem.energy_offpeak
    );
  }
  const peakDemand = maxPeakDemandObject?.peakDemand ?? 0;
  const peakDemand_cost = useFlatRate
    ? 0
    : peakDemand * variables.peakDemand_cost;
  const onPeakEnergy = totalOnPeakEnergy;
  const onPeakEnergy_cost = onPeakEnergy * variables.onPeak_cost;
  const offPeakEnergy = totalOffPeakEnergy;
  const offPeakEnergy_cost = offPeakEnergy * variables.offPeak_cost;

  const flatRateCost = calculateFlatRateCost(
    totalEnergyConsumption,
    variables.flat_rate_level_1_cost,
    variables.flat_rate_level_2_cost,
    variables.flat_rate_level_3_cost
  );

  const totalEnergy = onPeakEnergy + offPeakEnergy;
  const totalEnergy_cost = useFlatRate
    ? flatRateCost
    : onPeakEnergy_cost + offPeakEnergy_cost;

  const returnResponse = {
    variables: variables,
    peakDemand: {
      date: dayjs(maxPeakDemandObject.date).format("DD MMM YYYY"),
      peakDemand: formatToNumberWithDecimalPlaces(
        maxPeakDemandObject.peakDemand,
        2
      ),
    },
    energy: {
      onPeak: formatToNumberWithDecimalPlaces(onPeakEnergy, 0),
      offPeak: formatToNumberWithDecimalPlaces(offPeakEnergy, 0),
      total: useFlatRate
        ? formatToNumberWithDecimalPlaces(totalEnergyConsumption)
        : formatToNumberWithDecimalPlaces(totalEnergy),
    },
    cost: {
      peakDemand: formatToNumberWithDecimalPlaces(peakDemand_cost, 2),
      onPeak: formatToNumberWithDecimalPlaces(onPeakEnergy_cost, 2),
      offPeak: formatToNumberWithDecimalPlaces(offPeakEnergy_cost, 2),
      energy: formatToNumberWithDecimalPlaces(totalEnergy_cost, 2),
      total: formatToNumberWithDecimalPlaces(
        totalEnergy_cost + peakDemand_cost,
        2
      ),
      service: formatToNumberWithDecimalPlaces(variables.service_cost, 2),
      vat: formatToNumberWithDecimalPlaces(
        (totalEnergy_cost + peakDemand_cost) * 0.07,
        2
      ),
      totalIncVat: formatToNumberWithDecimalPlaces(
        (totalEnergy_cost + peakDemand_cost) * 1.07 + variables.service_cost,
        2
      ),
    },
    tableData: mergedPeakDemandOnPeakOffPeak,
  };

  return NextResponse.json(returnResponse);
}

async function getVariablesData(year, month) {
  const variableSql = `SELECT
	VariableData.Data, 
	VariableData.[Value], 
	VariableData.[Year], 
	VariableData.[Month]
FROM
	dbo.VariableData
	WHERE [Year] = '${year}'
	and [Month] = '${month}'`;

  const responseVariable = await ExecuteQuery(variableSql);
  return responseVariable;
}

async function getPeakDemand(id, startDate, endDate) {
  const peakDemandQuery = `SELECT CONVERT(varchar(10),Timestamp,120) AS date, Max(MovingAverage)  AS peakDemand FROM(

    SELECT Timestamp,    AVG( Power ) OVER (
            ORDER BY Timestamp 
            ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
        ) AS MovingAverage
    FROM (
        SELECT 
        RawData.[Timestamp] as Timestamp,
            SUM( RawData.Value ) AS Power
        FROM dbo.Branch
            INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
            INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
            INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
            INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
            INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
            INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
          WHERE
          Branch.Id = '${id}'
            AND Device.DeviceTypeId LIKE '%pm%'
            AND Device.Sequence = 1
             AND (
            DATEPART( dw, TIMESTAMP ) BETWEEN 2 
            AND 6 -- Weekdays (Monday to Friday)
            
            AND ( DATEPART( HOUR, TIMESTAMP ) BETWEEN  9 AND 22 -- On-peak hours
          ) 
        ) 
            AND RawData.Field = 'kw'
            AND RawData.Timestamp >= Convert(datetime,'${startDate}')
            AND RawData.Timestamp < Convert(datetime,'${endDate}')
            GROUP BY [Timestamp]) t ) y
            GROUP BY CONVERT(varchar(10),Timestamp,120)`;
  const peakDemandResponse = await ExecuteQuery(peakDemandQuery);
  return peakDemandResponse;
}

async function getOnPeakEnergy(id, startDate, endDate) {
  const onPeakEnergyQuery = `SELECT DATE as date
	,
	SUM ( MaxEnergy - MinEnergy ) AS energy_onpeak 
FROM
  (
    SELECT CONVERT
		( VARCHAR ( 10 ), [Timestamp], 120 ) AS DATE,
		'Off-peak' AS Type,
   Max( RawData.Value ) AS MaxEnergy, Min( RawData.Value ) AS MinEnergy
FROM  dbo.Branch
INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id 
INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
WHERE
Branch.Id = '${id}'
  AND Device.DeviceTypeId LIKE '%pm%' 
  AND Device.Sequence = 1
  AND (
      DATEPART( dw, TIMESTAMP ) BETWEEN 2 
      AND 6 -- Weekdays (Monday to Friday)
      
      AND ( DATEPART( HOUR, TIMESTAMP ) BETWEEN  9 AND 22 -- On-peak hours
    ) 
  ) 
  AND RawData.Field = 'kwh'
  AND RawData.[Timestamp] >= CONVERT ( datetime, '${startDate}' )
  AND RawData.Timestamp < Convert(datetime,'${endDate}')
   GROUP BY
  RawData.DevId  ,	CONVERT ( VARCHAR ( 10 ), [Timestamp], 120 )  ) t  
  GROUP BY
  DATE 
  ORDER BY
  DATE`;

  const onPeakEnergyResponse = await ExecuteQuery(onPeakEnergyQuery);
  return onPeakEnergyResponse;
}

async function getOffPeakEnergy(id, startDate, endDate) {
  const offPeakEnergyQuery = `SELECT DATE as date
	,
	SUM ( MaxEnergy - MinEnergy ) AS energy_offpeak 
FROM
	(
	SELECT CONVERT
		( VARCHAR ( 10 ), [Timestamp], 120 ) AS DATE,
		'Off-peak' AS Type,
		MAX ( RawData.Value ) AS MaxEnergy,
		MIN ( RawData.Value ) AS MinEnergy 
	FROM
		dbo.Branch
		INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
		INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
		INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id
		INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
		INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
		INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
	WHERE
		Branch.Id = '${id}' 
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
		AND RawData.[Timestamp] >= CONVERT ( datetime, '${startDate}' ) 
		AND RawData.Timestamp < CONVERT ( datetime, '${endDate}' ) 
	GROUP BY
		RawData.DevId ,
		CONVERT ( VARCHAR ( 10 ), [Timestamp], 120 ) 
	) t 
GROUP BY
DATE 
ORDER BY
DATE`;

  // console.log(offPeakEnergyQuery);
  const offPeakEnergyResponse = await ExecuteQuery(offPeakEnergyQuery);
  return offPeakEnergyResponse;
}

async function getEnergyConsumption(id, startDate, endDate) {
  const energyConsumptionQuery = `SELECT  
	SUM ( MaxEnergy - MinEnergy ) AS energy_consumption 
FROM
	(
	SELECT  
		'Off-peak' AS Type,
		MAX ( RawData.Value ) AS MaxEnergy,
		MIN ( RawData.Value ) AS MinEnergy 
	FROM
		dbo.Branch
		INNER JOIN dbo.Area ON Branch.Id = Area.BranchId
		INNER JOIN dbo.AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
		INNER JOIN dbo.Building ON AreaBuildingMapping.BuildingId = Building.Id
		INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
		INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
		INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
	WHERE
		Branch.Id = '${id}' 
		AND Device.DeviceTypeId LIKE '%pm%' 
		AND Device.Sequence = 1 
		AND RawData.Field = 'kwh' 
		AND RawData.[Timestamp] >= CONVERT ( datetime, '${startDate}' ) 
		AND RawData.Timestamp < CONVERT ( datetime, '${endDate}' ) 
	GROUP BY
		RawData.DevId   
	) t  `;

  const energyConsumptionResponse = await ExecuteQuery(energyConsumptionQuery);
  return energyConsumptionResponse;
}
