import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { ceil, floor, formatToNumberWithDecimalPlaces } from "@/utils/utils";

export async function GET(request) {
  dayjs.extend(floor);
  dayjs.extend(ceil);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("area_id") ?? 1;

  const sql = `SELECT
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

  const response = await ExecuteQuery(sql);
  let buildingResponse = [];
  if (response.length > 0) {
    const areaName = response[0].Name;
    const now = dayjs();
    const today = now.format("YYYY-MM-DD");
    // const datetimeNow = now.format("YYYY-MM-DD HH:[00:00]");
    const datetimeNow = now.floor("minute", 5).format("YYYY-MM-DD HH:mm:[00]");
    const datetimeEnd = now.ceil("minute", 5).format("YYYY-MM-DD HH:mm:[00]");

    const buildingData = [];

    /** ใช้ for...of หรือ for...in เพื่อรอให้ Loop ทำงานเสร็จก่อน */
    for (const buildingItem of response) {
      const buildingCurrentDemandQuery = `SELECT SUM
      ( RawData.Value ) AS CurrentDemand 
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${buildingItem.BuildingId} ) 
        AND Device.DeviceTypeId LIKE '%pm%'
        AND Device.Sequence = 1
        AND RawData.Field = 'kw'
        AND RawData.Timestamp >= Convert(datetime,'${datetimeNow}')
        AND RawData.Timestamp < Convert(datetime,'${datetimeEnd}')`;

      const buildingCurrentDemandResponse = await ExecuteQuery(
        buildingCurrentDemandQuery
      );

      const buildingPowerGenerationQuery = `SELECT SUM
      ( RawData.Value ) AS PowerGeneration 
    FROM
      dbo.Building
      INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
      INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
      INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
    WHERE
      Building.Id IN ( ${buildingItem.BuildingId}  ) 
        AND Device.DeviceTypeId LIKE '%gen%'
        AND RawData.Field = 'kw'
        AND RawData.Timestamp >= Convert(datetime,'${datetimeNow}')
        AND RawData.Timestamp < Convert(datetime,'${datetimeEnd}')`;
      const buildingPowerGenerationResponse = await ExecuteQuery(
        buildingPowerGenerationQuery
      );

      const energyGenerationQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS EnergyGeneration FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value ) AS MaxEnergy
        FROM
          dbo.Building  
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Building.Id IN ( ${buildingItem.BuildingId}  ) 
        AND Device.DeviceTypeId LIKE '%gen%'
          AND Device.Sequence = 1
          AND RawData.Field = 'kwh'
        AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) GROUP BY RawData.DevId) t`;

      const energyGenerationResponse = await ExecuteQuery(
        energyGenerationQuery
      );

      const buildingEnergyQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS Energy FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value ) AS MaxEnergy
        FROM
          dbo.Building  
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Building.Id IN ( ${buildingItem.BuildingId}  ) 
        AND Device.DeviceTypeId LIKE '%pm%'
          AND Device.Sequence = 1
          AND RawData.Field = 'kwh'
        AND RawData.[Timestamp] >= CONVERT ( datetime, '${today}' ) GROUP BY RawData.DevId) t`;

      const buildingEnergyResponse = await ExecuteQuery(buildingEnergyQuery);
      // console.log("buildingEnergyQuery", buildingEnergyQuery);

      const buildingOnPeakEnergyQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS Energy FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value ) AS MaxEnergy
        FROM
          dbo.Building  
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Building.Id IN ( ${buildingItem.BuildingId}  ) 
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

      const buildingOnPeakEnergyResponse = await ExecuteQuery(
        buildingOnPeakEnergyQuery
      );

      const buildingOffPeakEnergyQuery = `SELECT SUM(MaxEnergy - MinEnergy) AS Energy FROM (
        SELECT 
        Min ( RawData.Value ) AS MinEnergy, Max( RawData.Value ) AS MaxEnergy
        FROM
          dbo.Building  
        INNER JOIN dbo.Floor ON Building.Id = Floor.BuildingId
        INNER JOIN dbo.Device ON Floor.Id = Device.FloorId
        INNER JOIN dbo.RawData ON Device.Id = RawData.DevId 
      WHERE
      Building.Id IN ( ${buildingItem.BuildingId}  ) 
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
      const buildingOffPeakEnergyResponse = await ExecuteQuery(
        buildingOffPeakEnergyQuery
      );

      const energy_onpeak = buildingOnPeakEnergyResponse?.[0].Energy ?? 0;
      const energy_offpeak = buildingOffPeakEnergyResponse?.[0].Energy ?? 0;

      // const energy_onpeak_cost = energy_onpeak * onPeak_cost;
      // const energy_offpeak_cost = energy_offpeak * offPeak_cost;

      const energy_total = energy_offpeak + energy_onpeak;
      // const energy_total_cost = energy_offpeak_cost + energy_onpeak_cost;

      const buildingObj = {
        id: buildingItem.BuildingId,
        name: buildingItem.BuildingName,
        image_url: buildingItem.ImageUrl,
        current_demand:
          formatToNumberWithDecimalPlaces(
            buildingCurrentDemandResponse?.[0].CurrentDemand,
            2
          ) ?? 0,
        power_generation:
          formatToNumberWithDecimalPlaces(
            buildingPowerGenerationResponse?.[0].PowerGeneration,
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

      buildingData.push(buildingObj);
    }

    buildingResponse = [
      { area_id: id, area_name: areaName, data: buildingData },
    ];
  }

  const returnResponse = buildingResponse.filter((obj) => {
    return obj.area_id == id;
  });

  const noDataResponse = {
    message: "no data",
  };

  return NextResponse.json(returnResponse[0] ?? noDataResponse);
}

export async function GET_TEMP(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("area_id") ?? 1;
  const data = [
    {
      area_id: 1,
      area_name: "คณะวิทยาศาสตร์",
      data: [
        {
          id: 1,
          name: "อาคารฟิสิกส์",
          power_generation: "4650",
          current_demand: "1200",
          energy: "300",
          cost_saving: "830000",
          co2_saving: "3",
        },
        {
          id: 2,
          name: "อาคารเคมี",
          power_generation: "8750",
          current_demand: "1400",
          energy: "600",
          cost_saving: "233000",
          co2_saving: "5",
        },
        {
          id: 3,
          name: "อาคารชีววิทยา",
          power_generation: "31616",
          current_demand: "1200",
          energy: "180",
          cost_saving: "130000",
          co2_saving: "2",
        },
      ],
    },
    {
      area_id: 2,
      area_name: "คณะประมง",
      data: [
        {
          id: 4,
          name: "อาคารเฉลิมฉลอง",
          power_generation: "380",
          current_demand: "380",
          energy: "1080",
          cost_saving: "13000",
          co2_saving: "10",
        },
        {
          id: 5,
          name: "อาคารเรียน 1",
          power_generation: "380",
          current_demand: "380",
          energy: "1080",
          cost_saving: "13000",
          co2_saving: "10",
        },
      ],
    },
    {
      area_id: 3,
      area_name: "คณะวิศวกรรมศาสตร์",
      data: [
        {
          id: 6,
          name: "Work shop",
          power_generation: "480",
          current_demand: "480",
          energy: "1080",
          cost_saving: "13000",
          co2_saving: "10",
        },
        {
          id: 7,
          name: "ภาควิชาวิศวกรรมไฟฟ้า",
          power_generation: "460",
          current_demand: "550",
          energy: "1080",
          cost_saving: "13000",
          co2_saving: "10",
        },
      ],
    },
    {
      area_id: 4,
      area_name: "ส่วนกลาง",
      data: [
        {
          id: 8,
          name: "บัณฑิตวิทยาลัย",
          power_generation: "480",
          current_demand: "480",
          energy: "1080",
          cost_saving: "13000",
          co2_saving: "10",
        },
        {
          id: 9,
          name: "สำนักหอสมุด",
          power_generation: "460",
          current_demand: "550",
          energy: "1080",
          cost_saving: "13000",
          co2_saving: "10",
        },
        {
          id: 10,
          name: "อาคารเรียนรู้",
          power_generation: "460",
          current_demand: "550",
          energy: "1080",
          cost_saving: "13000",
          co2_saving: "10",
        },
      ],
    },
    {
      area_id: 5,
      area_name: "คณะบริหารธุรกิจ",
      data: [
        {
          id: 11,
          name: "อาคารคณะบริหารธุรกิจ",
          power_generation: "480",
          current_demand: "480",
          energy: "1080",
          cost_saving: "13000",
          co2_saving: "10",
        },
      ],
    },
    {
      area_id: 6,
      area_name: "โรงอาหาร",
      data: [
        {
          id: 12,
          name: "ศูนย์อาหาร ม.เกษตร",
          power_generation: "480",
          current_demand: "480",
          energy: "1080",
          cost_saving: "13000",
          co2_saving: "10",
        },
      ],
    },
    {
      area_id: 7,
      area_name: "คณะเศรษฐศาสตร์",
      data: [
        {
          id: 13,
          name: "อาคารคณะเศรษฐศาสตร์",
          power_generation: "480",
          current_demand: "480",
          energy: "1080",
          cost_saving: "13000",
          co2_saving: "10",
        },
      ],
    },
  ];

  const response = data.filter((obj) => {
    return obj.area_id == id;
  });
  const noDataResponse = {
    message: "no data",
  };
  return NextResponse.json(response[0] ?? noDataResponse);
}

export function POST(request) {
  return NextResponse.json();
}
