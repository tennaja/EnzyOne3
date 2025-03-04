import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";
import XLSX from "xlsx-js-style";

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") ?? dayjs().get("year");
  const month = searchParams.get("month") ?? dayjs().get("month") + 1;
  const allBranchesQuery = searchParams.get("allBranches");
  const username = searchParams.get("username") ?? null;
  const companyId = searchParams.get("companyId");
  const branchId = searchParams.get("branchId");

  const allBranches = allBranchesQuery === "true" ? true : false;

  const responseVariable = await getVariablesData(year, month);

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
  let sql = ``;
  if (branchIdList.length > 0) {
    if (allBranches === true) {
      sql = `SELECT
      Company.Id,
      Company.Name,
      Company.Description,
      Branch.Id AS BranchId,
      Branch.Name AS BranchName
    FROM
      dbo.Company
      INNER JOIN dbo.Branch ON Company.Id = Branch.CompanyId
    WHERE
      Company.Id = ${companyId} ${
        branchIdList.length > 0
          ? ` AND Branch.Id IN ( ${branchIdList.join(",")} )`
          : ""
      }`;
    } else {
      if (!branchIdList.includes(branchId)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      sql = `SELECT
      Company.Id,
      Company.Name,
      Company.Description,
      Branch.Id AS BranchId,
      Branch.Name AS BranchName
    FROM
      dbo.Company
      INNER JOIN dbo.Branch ON Company.Id = Branch.CompanyId
    WHERE
      Company.Id = ${companyId} 
      and Branch.Id = ${branchId}`;
    }
  } else {
    if (allBranches === false) {
      sql = `SELECT
      Company.Id,
      Company.Name,
      Company.Description,
      Branch.Id AS BranchId,
      Branch.Name AS BranchName
    FROM
      dbo.Company
      INNER JOIN dbo.Branch ON Company.Id = Branch.CompanyId
    WHERE
      Company.Id = ${companyId} 
      and Branch.Id = ${branchId}`;
    } else {
      sql = `SELECT
      Company.Id,
      Company.Name,
      Company.Description,
      Branch.Id AS BranchId,
      Branch.Name AS BranchName
    FROM
      dbo.Company
      INNER JOIN dbo.Branch ON Company.Id = Branch.CompanyId
    WHERE
      Company.Id = ${companyId} `;
    }
  }

  const branchResponse = await ExecuteQuery(sql);

  if (branchResponse.length === 0) {
    return NextResponse.json({ message: "No data found." }, { status: 404 });
  }

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
    solarFlatRate_cost: 4.4, // fix Solar Flat Rate Cost 4.4 baht
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

  let branchDataArray = [];
  for (const branch of branchResponse) {
    const id = branch.BranchId;
    const dayInMonth = dayjs()
      .month(month - 1)
      .year(year)
      .daysInMonth();
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

    const previousStartDate = dayjs()
      .month(month - 1)
      .year(year)
      .add(-1, "month")
      .startOf("month")
      .format("YYYY-MM-DD HH:mm:ss");

    const previousEndDate = dayjs()
      .month(month - 1)
      .year(year)
      .add(-1, "month")
      .endOf("month")
      .format("YYYY-MM-DD HH:mm:ss");

    const responseEnergyConsumption = await getEnergyConsumption(
      id,
      startDate,
      endDate
    );

    const totalEnergyConsumption = responseEnergyConsumption.reduce(
      (sum, { energy_consumption }) => sum + energy_consumption,
      0
    );

    const responseEnergyGeneration = await getEnergyGeneration(
      id,
      startDate,
      endDate
    );

    const totalEnergyGeneration = responseEnergyGeneration.reduce(
      (sum, { energy_generation }) => sum + energy_generation,
      0
    );

    /* const baseLineStartDate = dayjs("2024-07-01").format("YYYY-MM-DD HH:mm:ss");
    const baseLineEndDate = dayjs("2024-08-01").format("YYYY-MM-DD HH:mm:ss");
    const responseBaselineAirConditionerConsumption =
      await getAirConditionerConsumption(
        id,
        baseLineStartDate,
        baseLineEndDate
      ); */

    /* const totalBaselineAirConditionerConsumption =
      responseBaselineAirConditionerConsumption.reduce(
        (sum, { energy_consumption }) => sum + energy_consumption,
        0
      ); */

    const averageBaselineAirConditioner =
      await getBaselineAirConditionerConsumption(
        id,
        previousStartDate,
        previousEndDate
      );

    const totalBaselineAirConditionerConsumption =
      averageBaselineAirConditioner[0].avg_8th_energy_consumption * dayInMonth;

    const responseAirConditionerConsumption =
      await getAirConditionerConsumption(id, startDate, endDate);

    const totalAirConditionerConsumption =
      responseAirConditionerConsumption.reduce(
        (sum, { energy_consumption }) => sum + energy_consumption,
        0
      );

    const responsePreviousEnergyConsumption = await getEnergyConsumption(
      id,
      previousStartDate,
      previousEndDate
    );

    const totalPreviousEnergyConsumption =
      responsePreviousEnergyConsumption.reduce(
        (sum, { energy_consumption }) => sum + energy_consumption,
        0
      );

    const energySaving =
      (totalEnergyGeneration /
        (totalEnergyConsumption + totalEnergyGeneration)) *
      100;

    const airConditionerSaving =
      (1 -
        totalAirConditionerConsumption /
          totalBaselineAirConditionerConsumption) *
      100;

    const flatRateCost = calculateFlatRateCost(
      totalEnergyConsumption,
      variables.flat_rate_level_1_cost,
      variables.flat_rate_level_2_cost,
      variables.flat_rate_level_3_cost
    );

    const previousFlatRateCost = calculateFlatRateCost(
      totalPreviousEnergyConsumption,
      variables.flat_rate_level_1_cost,
      variables.flat_rate_level_2_cost,
      variables.flat_rate_level_3_cost
    );

    let branchName;

    if (companyId == 5) {
      // ของธนาคารออมสินใส่ ชื่อ ด้านหน้าเพิ่ม
      branchName = `ธนาคารออมสิน สาขา${branch.BranchName}`;
    } else {
      branchName = branch.BranchName;
    }

    const branchData = [
      branchName,
      numeral(totalEnergyConsumption.toFixed(2)).value(),
      numeral(totalEnergyGeneration.toFixed(2)).value(),
      numeral(energySaving.toFixed(2)).value(),
      numeral(
        (totalEnergyGeneration * variables.solarFlatRate_cost).toFixed(2)
      ).value(),
      numeral(totalBaselineAirConditionerConsumption.toFixed(2)).value(),
      numeral(totalAirConditionerConsumption.toFixed(2)).value(),
      numeral(airConditionerSaving.toFixed(2)).value(),
      numeral(previousFlatRateCost.toFixed(2)).value(),
      numeral(flatRateCost.toFixed(2)).value(),
    ];
    branchDataArray.push(branchData);
  }

  // Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheetData = [
    [
      {
        v: `ประจำเดือน ${dayjs()
          .month(month - 1)
          .year(year)
          .format("MMMM YYYY")}`,
        s: {
          font: { bold: true, sz: 14 },
        },
      },
      {
        v: "Solar",
        s: {
          font: { bold: true, sz: 14 },
          fill: { fgColor: { rgb: "E2F0D9" } },
          alignment: { horizontal: "center" },
        },
      },
      ,
      ,
      ,
      /* C1 */ /* D1 */ /* E1 */
      {
        v: "Air Conditioner",
        s: {
          font: { bold: true, sz: 14 },
          fill: { fgColor: { rgb: "FFF2CC" } },
          alignment: { horizontal: "center" },
        },
      },
    ],
    [
      "สำนักงานสาขา",
      "หน่วยไฟที่ใช้ต่อเดือน (kWh)",
      "หน่วยไฟที่ผลิตได้ต่อเดือน (kWh)",
      "ประหยัดค่าไฟฟ้า (%)",
      "ประหยัดค่าไฟฟ้า (บาท)",
      "หน่วยไฟฟ้า Baseline ก่อน Optimized (kWh)",
      "หน่วยไฟฟ้าหลัง Optimized (kWh)",
      "ประหยัดค่าไฟฟ้า (%)",
      "บิลค่าไฟฟ้าเดือนก่อนหน้า (บาท)",
      "บิลค่าไฟฟ้าเดือนปัจจุบัน (บาท)",
    ],
    ...branchDataArray,
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  worksheet["!merges"] = [
    { s: { r: 0, c: 1 }, e: { r: 0, c: 4 } },
    { s: { r: 0, c: 5 }, e: { r: 0, c: 7 } },
  ];

  // Define the header style
  const headerStyle = {
    font: { bold: true, sz: 14 },
    fill: { fgColor: { rgb: "f1f5f9" } }, // Yellow background
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  // Apply the header style to the first row
  const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: C });
    if (!worksheet[cellAddress]) continue;
    worksheet[cellAddress].s = headerStyle;
  }

  // Auto-width each column
  const colWidths = worksheetData[1].map((_, colIndex) => {
    const colData = worksheetData.map((row) => row[colIndex]);
    const maxLength = Math.max(
      ...colData.map((val) => (val ? val.toString().length : 0))
    );
    return { wch: maxLength + 2 }; // Adding some padding
  });

  worksheet["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "summary");

  /* // Write the workbook to a file
  const filePath = "/path/to/your/file.xlsx";
  XLSX.writeFile(workbook, filePath); */

  // Alternatively, you can send the file as a response
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  // return NextResponse.json(worksheetData);
  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": `attachment; filename="enzy-summary-report-${year}-${month}.xlsx"`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
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

async function getEnergyGeneration(id, startDate, endDate) {
  const energyGenerationQuery = `SELECT  
      SUM ( MaxEnergy - MinEnergy ) AS energy_generation 
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
          AND Device.DeviceTypeId LIKE '%gen%' 
          AND Device.Sequence = 1 
          AND RawData.Field = 'kwh' 
          AND RawData.[Timestamp] >= CONVERT ( datetime, '${startDate}' ) 
          AND RawData.Timestamp < CONVERT ( datetime, '${endDate}' ) 
      GROUP BY
          RawData.DevId   
      ) t  `;

  const energyGenerationResponse = await ExecuteQuery(energyGenerationQuery);
  return energyGenerationResponse;
}

async function getAirConditionerConsumption(id, startDate, endDate) {
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
          AND Device.DeviceTypeId LIKE '%split_type_pm%' 
          AND RawData.Field = 'kwh' 
          AND RawData.[Timestamp] >= CONVERT ( datetime, '${startDate}' ) 
          AND RawData.Timestamp < CONVERT ( datetime, '${endDate}' ) 
      GROUP BY
          RawData.DevId   
      ) t  `;

  const energyConsumptionResponse = await ExecuteQuery(energyConsumptionQuery);
  return energyConsumptionResponse;
}

async function getBaselineAirConditionerConsumption(id, startDate, endDate) {
  const energyConsumptionQuery = `Select AVG(energy_consumption) as avg_8th_energy_consumption
FROM (
SELECT top (8)
        Date,
        SUM ( MaxEnergy - MinEnergy ) AS energy_consumption
    FROM
        (
      SELECT
            CONVERT(VARCHAR(10), RawData.Timestamp, 120) AS Date,
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
          AND Device.DeviceTypeId LIKE '%split_type_pm%' 
          AND RawData.Field = 'kwh' 
          AND RawData.[Timestamp] >= CONVERT ( datetime, '${startDate}' ) 
          AND RawData.Timestamp < CONVERT ( datetime, '${endDate}' ) 
      GROUP BY
      CONVERT(VARCHAR(10), RawData.Timestamp, 120),
          RawData.DevId   
      ) t
    GROUP BY Date
    order by energy_consumption desc
  ) energy
   WHERE energy_consumption > 0`;

  const energyConsumptionResponse = await ExecuteQuery(energyConsumptionQuery);
  return energyConsumptionResponse;
}

export const calculateFlatRateCost = (
  energy,
  flat_rate_level_1_cost,
  flat_rate_level_2_cost,
  flat_rate_level_3_cost
) => {
  let returnFlatRateCost = 0;

  // console.log("energy", energy);
  // console.log("flat_rate_level_1_cost", flat_rate_level_1_cost);
  // console.log("flat_rate_level_2_cost", flat_rate_level_2_cost);
  // console.log("flat_rate_level_3_cost", flat_rate_level_3_cost);
  let remainingEnergy = energy;
  // 150 หน่วยแรกใช้ rate level 1
  if (remainingEnergy <= 150) {
    returnFlatRateCost += remainingEnergy * flat_rate_level_1_cost;
    return returnFlatRateCost;
  }
  if (remainingEnergy > 150) {
    returnFlatRateCost += 150 * flat_rate_level_1_cost;
    remainingEnergy -= 150;
  }
  // 250 หน่วยถัดไปใช้ rate level 2
  if (remainingEnergy >= 250) {
    returnFlatRateCost += 250 * flat_rate_level_2_cost;
    remainingEnergy -= 250;
  }
  // เกิน 400 หน่วยใช้ rate level 3
  if (remainingEnergy > 0) {
    returnFlatRateCost += remainingEnergy * flat_rate_level_3_cost;
  }
  return returnFlatRateCost;
};
