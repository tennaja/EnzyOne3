import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";

export async function insertInvoiceTransactionData({
  monthlyEnergyData,
  InvoiceId,
  contractData,
  startDate,
  RATE_DATA,
  minimumTakeData,
  isDuringInstallmentPeriod,
  energyDuringInstallmentPeriod,
}) {
  const { ContractDiscountRate, ContractCOD, InstallmentPeriod } = contractData;

  const { RATE_PEAK, RATE_OFF_PEAK, RATE_WEEKEND, RATE_HOLIDAY, RATE_FT } =
    RATE_DATA;

  const dateCOD = dayjs(ContractCOD);
  const dateInvoice = dayjs(startDate);

  // console.log("monthlyEnergyData", monthlyEnergyData);
  let totalEnergyUsage =
    monthlyEnergyData.onPeak +
    monthlyEnergyData.offPeak +
    monthlyEnergyData.weekend +
    monthlyEnergyData.holiday;

  let totalAmountBeforeDiscount =
    monthlyEnergyData.onPeak * RATE_PEAK +
    monthlyEnergyData.offPeak * RATE_OFF_PEAK +
    monthlyEnergyData.weekend * RATE_WEEKEND +
    monthlyEnergyData.holiday * RATE_HOLIDAY +
    totalEnergyUsage * RATE_FT;

  let totalAmountWithDiscountRate =
    monthlyEnergyData.onPeak * RATE_PEAK * (1 - ContractDiscountRate / 100) +
    monthlyEnergyData.offPeak *
      RATE_OFF_PEAK *
      (1 - ContractDiscountRate / 100) +
    monthlyEnergyData.weekend *
      RATE_WEEKEND *
      (1 - ContractDiscountRate / 100) +
    monthlyEnergyData.holiday *
      RATE_HOLIDAY *
      (1 - ContractDiscountRate / 100) +
    totalEnergyUsage * RATE_FT * (1 - ContractDiscountRate / 100);

  // console.log({ totalAmountBeforeDiscount });
  // console.log({ totalAmountWithDiscountRate });

  let discountAmount = totalAmountBeforeDiscount * (ContractDiscountRate / 100);
  let totalAmountAfterDiscount = totalAmountBeforeDiscount - discountAmount;
  // console.log({ totalAmountAfterDiscount });

  let topUpFactor = 1;
  let totalAmountWithInstallmentPeriod = 0;
  if (isDuringInstallmentPeriod) {
    // console.log("insertInvoiceTransacitonData");
    // console.log("isDuringInstallmentPeriod", isDuringInstallmentPeriod);
    // console.log(
    //   "energyDuringInstallmentPeriod.totalCost",
    //   energyDuringInstallmentPeriod.totalCost
    // );
    totalAmountWithInstallmentPeriod =
      energyDuringInstallmentPeriod.totalCost + totalAmountWithDiscountRate;

    topUpFactor =
      !isFinite(
        totalAmountWithInstallmentPeriod / totalAmountWithDiscountRate
      ) || isNaN(totalAmountWithInstallmentPeriod / totalAmountWithDiscountRate)
        ? 1
        : totalAmountWithInstallmentPeriod / totalAmountWithDiscountRate;
  }

  let totalAmountAfterTopUpFactor = totalAmountAfterDiscount * topUpFactor;

  const minimumTakeAmount = checkMinimumtakeAmount({
    totalEnergyGeneration: minimumTakeData?.totalEnergyGeneration,
    totalEnergyConsumption: minimumTakeData?.totalEnergyConsumption,
  });

  const minimumTakeCost =
    minimumTakeAmount * minimumTakeData?.weigthedAverageDiscountRate;

  let totalAmountMinimumTake = minimumTakeCost ?? 0;

  let totalAmountBeforeVat =
    totalAmountAfterTopUpFactor + totalAmountMinimumTake;

  let vatAmount = totalAmountBeforeVat * 0.07;

  let totalAmountAfterVat = totalAmountBeforeVat + vatAmount;

  const insertDataArray = [
    {
      type: "peak",
      description: "Weekday: peak energy usage",
      quantity: monthlyEnergyData.onPeak,
      unit: "kWh",
      rate: RATE_PEAK,
      amount: monthlyEnergyData.onPeak * RATE_PEAK,
    },
    {
      type: "off-peak",
      description: "Weekday: Off-peak energy usage",
      quantity: monthlyEnergyData.offPeak,
      unit: "kWh",
      rate: RATE_OFF_PEAK,
      amount: monthlyEnergyData.offPeak * RATE_OFF_PEAK,
    },
    {
      type: "weekend",
      description: "Weekend energy usage",
      quantity: monthlyEnergyData.weekend,
      unit: "kWh",
      rate: RATE_WEEKEND,
      amount: monthlyEnergyData.weekend * RATE_WEEKEND,
    },
    {
      type: "holiday",
      description: "Holiday energy usage",
      quantity: monthlyEnergyData.holiday,
      unit: "kWh",
      rate: RATE_HOLIDAY,
      amount: monthlyEnergyData.holiday * RATE_HOLIDAY,
    },
    {
      type: "ft",
      description: "Ft.",
      quantity: totalEnergyUsage,
      unit: null,
      rate: RATE_FT,
      amount: totalEnergyUsage * RATE_FT,
    },
    {
      type: "discount",
      description: "Discount rate",
      quantity: ContractDiscountRate,
      unit: "%",
      rate: null,
      amount: discountAmount,
    },
    {
      type: "top-up",
      description: "Top-Up Factor",
      quantity: null,
      unit: null,
      rate: topUpFactor,
      amount: totalAmountAfterTopUpFactor,
    },
    {
      type: "minimum-take",
      description: "Minimum Take",
      quantity: minimumTakeAmount,
      unit: null,
      rate: minimumTakeData?.weigthedAverageDiscountRate,
      amount: totalAmountMinimumTake,
    },
    {
      type: "sub-total",
      description: "Sub Total",
      quantity: null,
      unit: null,
      rate: null,
      amount: totalAmountBeforeVat,
    },
    {
      type: "vat",
      description: "Vat 7%",
      quantity: null,
      unit: null,
      rate: 0.07,
      amount: vatAmount,
    },
    {
      type: "grand-total",
      description: "Grand Total",
      quantity: null,
      unit: null,
      rate: null,
      amount: totalAmountAfterVat,
    },
  ];

  for (const insertData of insertDataArray) {
    // insert หรือ update ข้อมูลลง InvoiceTransaction
    const { type, description, unit } = insertData;
    let { quantity, rate, amount } = insertData;

    if (type === "top-up" && !isDuringInstallmentPeriod) {
      continue;
    }
    if (type === "minimum-take" && minimumTakeAmount <= 0) {
      quantity = null;
      rate = null;
      amount = null;
    }

    const insertInvoiceDetailQuery = `IF NOT EXISTS (SELECT * FROM InvoiceTransaction WHERE InvoiceId = ${InvoiceId} AND Type = '${type}' )  BEGIN
    INSERT INTO InvoiceTransaction (InvoiceId, Type, Description, Quantity, Unit, Rate, Amount, CreatedAt, UpdatedAt)
    VALUES 
    (${InvoiceId}, '${type}', '${description}', ${quantity}, ${
      unit ? `'${unit}'` : null
    }, ${rate}, ${amount}, GETDATE(), GETDATE())
    END
    ELSE
    BEGIN
    UPDATE InvoiceTransaction SET Quantity = ${quantity}, Rate = ${rate}, Amount = ${amount}, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = '${type}'
    END
    `;

    await ExecuteQuery(insertInvoiceDetailQuery);
  }

  // insert หรือ update ข้อมูลลง InvoiceTransaction
  /* const insertInvoiceDetailQuery = `IF NOT EXISTS (SELECT * FROM InvoiceTransaction WHERE InvoiceId = ${InvoiceId} )  BEGIN
        INSERT INTO InvoiceTransaction (InvoiceId, Type, Description, Quantity, Unit, Rate, Amount, CreatedAt, UpdatedAt)
        VALUES 
        (${InvoiceId}, 'peak', 'Weekday: peak energy usage', ${
    monthlyEnergyData.onPeak
  }, 'kWh', ${RATE_PEAK}, ${
    monthlyEnergyData.onPeak * RATE_PEAK
  }, GETDATE(), GETDATE()),
        (${InvoiceId}, 'off-peak', 'Weekday: Off-peak energy usage', ${
    monthlyEnergyData.offPeak
  }, 'kWh', ${RATE_OFF_PEAK}, ${
    monthlyEnergyData.offPeak * RATE_OFF_PEAK
  }, GETDATE(), GETDATE()),
     (${InvoiceId}, 'weekend', 'Weekend energy usage', ${
    monthlyEnergyData.weekend
  }, 'kWh', ${RATE_WEEKEND}, ${
    monthlyEnergyData.weekend * RATE_WEEKEND
  }, GETDATE(), GETDATE()),
        (${InvoiceId}, 'holiday', 'Holiday energy usage', ${
    monthlyEnergyData.holiday
  }, 'kWh', ${RATE_HOLIDAY}, ${
    monthlyEnergyData.holiday * RATE_HOLIDAY
  }, GETDATE(), GETDATE()),
        (${InvoiceId}, 'ft', 'Ft.', null, null, ${RATE_FT}, ${
    totalEnergyUsage * RATE_FT
  }, GETDATE(), GETDATE()),
        (${InvoiceId}, 'discount', 'Discount rate', ${ContractDiscountRate}, '%', null , ${discountAmount} , GETDATE(), GETDATE()),
        ${
          isDuringInstallmentPeriod
            ? `(${InvoiceId}, 'top-up', 'Top-Up Factor', null, null, ${topUpFactor}, ${totalAmountAfterTopUpFactor}, GETDATE(), GETDATE()),`
            : ""
        }
        ${
          minimumTakeAmount > 0
            ? `(${InvoiceId}, 'minimum-take', 'Minimum Take', ${minimumTakeAmount}, null, ${minimumTakeData?.weigthedAverageDiscountRate}, ${minimumTakeCost}, GETDATE(), GETDATE()),`
            : ""
        }
        (${InvoiceId}, 'sub-total', 'Sub Total', null, null, null, ${totalAmountBeforeVat}, GETDATE(), GETDATE()),
        (${InvoiceId}, 'vat', 'Vat 7%', null, null, 0.07, ${vatAmount}, GETDATE(), GETDATE()),
        (${InvoiceId}, 'grand-total', 'Grand Total', null, null, null, ${totalAmountAfterVat}, GETDATE(), GETDATE())
        
        END
        ELSE
        BEGIN
        UPDATE InvoiceTransaction SET Quantity = ${
          monthlyEnergyData.onPeak
        }, Amount = ${
    monthlyEnergyData.onPeak * RATE_PEAK
  }, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'peak';
        UPDATE InvoiceTransaction SET Quantity = ${
          monthlyEnergyData.offPeak
        }, Amount = ${
    monthlyEnergyData.offPeak * RATE_OFF_PEAK
  }, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'off-peak';
   UPDATE InvoiceTransaction SET Quantity = ${
     monthlyEnergyData.weekend
   }, Amount = ${
    monthlyEnergyData.weekend * RATE_WEEKEND
  }, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'weekend';
        UPDATE InvoiceTransaction SET Quantity = ${
          monthlyEnergyData.holiday
        }, Amount = ${
    monthlyEnergyData.holiday * RATE_HOLIDAY
  }, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'holiday';
        UPDATE InvoiceTransaction SET Amount = ${
          totalEnergyUsage * RATE_FT
        }, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'ft';
        UPDATE InvoiceTransaction SET Quantity = ${ContractDiscountRate}, Amount = ${discountAmount}, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'discount';
        ${
          isDuringInstallmentPeriod
            ? ` UPDATE InvoiceTransaction SET rate = ${topUpFactor}, Amount = ${totalAmountAfterTopUpFactor}, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'top-up';`
            : ""
        }
        ${
          minimumTakeAmount > 0
            ? `UPDATE InvoiceTransaction SET Quantity=${minimumTakeAmount}, rate = ${minimumTakeData?.weigthedAverageDiscountRate}, Amount = ${minimumTakeCost}, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'minimum-take';`
            : ""
        }
        UPDATE InvoiceTransaction SET Amount = ${totalAmountBeforeVat}, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'sub-total';
        UPDATE InvoiceTransaction SET Amount = ${vatAmount}, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'vat';
        UPDATE InvoiceTransaction SET Amount = ${totalAmountAfterVat}, UpdatedAt = GETDATE() WHERE InvoiceId = ${InvoiceId} AND Type = 'grand-total';
        END
        `;

  await ExecuteQuery(insertInvoiceDetailQuery); */
}

export async function getMonthlyEnergyData({ deviceData, startDate, endDate }) {
  const interval = 1000 * 60 * 60 * 24; // 1 day

  const energyData = [];
  for (
    let index = startDate.valueOf();
    index < endDate.valueOf();
    index += interval
  ) {
    const datetime = dayjs(index).format("YYYY-MM-DD");

    let energyObject = {
      datetime: datetime,
      onPeak: 0,
      offPeak: 0,
      holiday: 0,
      weekend: 0,
    };
    for (const device of deviceData) {
      const { ContractId, DeviceId, DeviceTypeId, DevId } = device;

      const itemData = await getDeviceDataEnergy({ device, datetime });

      // console.log("itemData", itemData);

      if (DeviceTypeId.includes("pm")) {
        energyObject.onPeak -= Math.abs(itemData.sumEnergyExportOnPeak);
        energyObject.offPeak -= Math.abs(itemData.sumEnergyExportOffPeak);
        energyObject.holiday -= Math.abs(itemData.sumEnergyExportHoliday);
        energyObject.weekend -= Math.abs(itemData.sumEnergyExportWeekend);
      } else {
        energyObject.onPeak += itemData.sumEnergyOnPeak;
        energyObject.offPeak += itemData.sumEnergyOffPeak;
        energyObject.holiday += itemData.sumEnergyHoliday;
        energyObject.weekend += itemData.sumEnergyWeekend;
      }
    }
    energyData.push(energyObject);
    // console.log("energyObject", energyObject);
  }

  const monthlyEnergyData = {
    onPeak: energyData.reduce((acc, cur) => acc + cur.onPeak, 0),
    offPeak: energyData.reduce((acc, cur) => acc + cur.offPeak, 0),
    weekend: energyData.reduce((acc, cur) => acc + cur.weekend, 0),
    holiday: energyData.reduce((acc, cur) => acc + cur.holiday, 0),
  };

  /** ====== Start mock test data  ======*/
  /* monthlyEnergyData.onPeak = 30000;
  monthlyEnergyData.offPeak = 10000;
  monthlyEnergyData.weekend = 2500;
  monthlyEnergyData.holiday = 2500; */
  /** ====== end Mock Data  ======*/

  return monthlyEnergyData;
}
export async function getDeviceDataEnergy({ device, datetime }) {
  const { ContractId, DeviceId, DeviceTypeId, DevId } = device;
  const itemData = {
    deviceId: DeviceId,
    datetime: datetime,
    deviceTypeId: DeviceTypeId,
    sumEnergyHoliday: 0,
    sumEnergyWeekend: 0,
    sumEnergyOffPeak: 0,
    sumEnergyOnPeak: 0,
    sumEnergyImportHoliday: 0,
    sumEnergyImportWeekend: 0,
    sumEnergyImportOffPeak: 0,
    sumEnergyImportOnPeak: 0,
    sumEnergyExportHoliday: 0,
    sumEnergyExportWeekend: 0,
    sumEnergyExportOffPeak: 0,
    sumEnergyExportOnPeak: 0,
  };
  // ข้อมูล weekend ใช้ kwh_import แทนเพราะไม่ได้มี field ของ kwh_weekend
  const energyQuery = `SELECT dbo.CalEnergyOffPeak(${DeviceId},'kwh_offpeak','${datetime}') AS EnergyOffPeak,
  dbo.CalEnergyOnPeak(${DeviceId},'kwh_peak','${datetime}') AS EnergyPeak,
  dbo.CalEnergyHoliday(${DeviceId},'kwh_holiday','${datetime}') AS EnergyHoliday,
  dbo.CalEnergyWeekend(${DeviceId},'kwh_holiday','${datetime}') AS EnergyWeekend,
  dbo.CalEnergyOffPeak(${DeviceId},'kwh_import','${datetime}') AS EnergyImportOffPeak,
  dbo.CalEnergyOnPeak(${DeviceId},'kwh_import','${datetime}') AS EnergyImportOnPeak,
  dbo.CalEnergyHoliday(${DeviceId},'kwh_import','${datetime}') AS EnergyImportHoliday,
  dbo.CalEnergyWeekend(${DeviceId},'kwh_import','${datetime}') AS EnergyImportWeekend,
  dbo.CalEnergyOffPeak(${DeviceId},'kwh_export','${datetime}') AS EnergyExportOffPeak,
  dbo.CalEnergyOnPeak(${DeviceId},'kwh_export','${datetime}') AS EnergyExportOnPeak,
  dbo.CalEnergyHoliday(${DeviceId},'kwh_export','${datetime}') AS EnergyExportHoliday,
  dbo.CalEnergyWeekend(${DeviceId},'kwh_export','${datetime}') AS EnergyExportWeekend
  `;

  const energyData = await ExecuteQuery(energyQuery);

  if (energyData.length > 0) {
    itemData.sumEnergyOnPeak += energyData[0].EnergyPeak;
    itemData.sumEnergyOffPeak += energyData[0].EnergyOffPeak;
    itemData.sumEnergyHoliday += energyData[0].EnergyHoliday;
    itemData.sumEnergyWeekend += energyData[0].EnergyWeekend;
    itemData.sumEnergyImportOnPeak += energyData[0].EnergyImportOnPeak;
    itemData.sumEnergyImportOffPeak += energyData[0].EnergyImportOffPeak;
    itemData.sumEnergyImportHoliday += energyData[0].EnergyImportHoliday;
    itemData.sumEnergyImportWeekend += energyData[0].EnergyImportWeekend;
    itemData.sumEnergyExportOnPeak += energyData[0].EnergyExportOnPeak;
    itemData.sumEnergyExportOffPeak += energyData[0].EnergyExportOffPeak;
    itemData.sumEnergyExportHoliday += energyData[0].EnergyExportHoliday;
    itemData.sumEnergyExportWeekend += energyData[0].EnergyExportWeekend;
  }

  return itemData;
}

export async function getVariableData() {
  const variableQuery = `
  SELECT * FROM (
  SELECT
  CASE WHEN [Data] = 'OnPeak_Cost' THEN 'OnPeak_Cost'
  WHEN [Data] = 'OffPeak_Cost' THEN 'OffPeak_Cost'
  WHEN [Data] = 'FT' THEN 'FT'
  ELSE 'Other' END AS Type, [Value] 
  FROM VariableData
  WHERE Year = 2024 and Month = 7
  ) t
  PIVOT (
      SUM(Value)
      FOR Type IN ([OnPeak_Cost], [OffPeak_Cost], [FT])
  ) pvt
  `;

  const variableData = await ExecuteQuery(variableQuery);

  return variableData;
}

export async function getEnergyDuringInstallmentPeriod({
  deviceData,
  dateStartCountingBeforeCOD,
  dateCOD,
  installmentPeriod = 1,
  RATE_DATA,
  contractData,
}) {
  const energyDataResponse = {
    onPeak: 0,
    offPeak: 0,
    holiday: 0,
    totalEnergy: 0,
    onPeakCost: 0,
    offPeakCost: 0,
    holidayCost: 0,
    totalCost: 0,
  };

  const { RATE_PEAK, RATE_OFF_PEAK, RATE_HOLIDAY } = RATE_DATA;
  const { ContractDiscountRate } = contractData;

  const RATE_DATA_DISCOUNT = {
    RATE_PEAK: RATE_PEAK * (1 - ContractDiscountRate / 100),
    RATE_OFF_PEAK: RATE_OFF_PEAK * (1 - ContractDiscountRate / 100),
    RATE_HOLIDAY: RATE_HOLIDAY * (1 - ContractDiscountRate / 100),
  };

  for (const device of deviceData) {
    const { ContractId, DeviceId, DeviceTypeId, DevId } = device;

    if (DeviceTypeId.includes("pm")) {
      continue;
    }

    //   check if dateCOD is dayjs object
    if (dayjs.isDayjs(dateCOD)) {
      dateCOD = dateCOD.format("YYYY-MM-DD");
    } else {
      dateCOD = dayjs(dateCOD).format("YYYY-MM-DD");
    }

    const energyDuringInstallmentPeriodQuery = `SELECT dbo.CalEnergyCOD(${DeviceId},'kwh_offpeak', '${dateCOD}') AS EnergyOffPeak,
  dbo.CalEnergyCOD(${DeviceId},'kwh_peak','${dateCOD}') AS EnergyPeak,
  dbo.CalEnergyCOD(${DeviceId},'kwh_holiday','${dateCOD}') AS EnergyHoliday`;

    const energyData = await ExecuteQuery(energyDuringInstallmentPeriodQuery);

    if (energyData.length > 0) {
      // console.log("energyData", energyData[0]);
      energyDataResponse.onPeak += energyData[0].EnergyPeak / installmentPeriod;
      energyDataResponse.offPeak +=
        energyData[0].EnergyOffPeak / installmentPeriod;
      energyDataResponse.holiday +=
        energyData[0].EnergyHoliday / installmentPeriod;

      energyDataResponse.onPeakCost =
        energyDataResponse.onPeak * RATE_DATA_DISCOUNT.RATE_PEAK;
      energyDataResponse.offPeakCost =
        energyDataResponse.offPeak * RATE_DATA_DISCOUNT.RATE_OFF_PEAK;
      energyDataResponse.holidayCost =
        energyDataResponse.holiday * RATE_DATA_DISCOUNT.RATE_HOLIDAY;

      energyDataResponse.totalEnergy =
        energyDataResponse.onPeak +
        energyDataResponse.offPeak +
        energyDataResponse.holiday;

      energyDataResponse.totalCost =
        energyDataResponse.onPeakCost +
        energyDataResponse.offPeakCost +
        energyDataResponse.holidayCost;
    }
  }

  /** ====== Start mock test data  ======*/
  /* energyDataResponse.onPeak = 8000 / installmentPeriod;
  energyDataResponse.offPeak = 5000 / installmentPeriod;
  energyDataResponse.holiday = 5000 / installmentPeriod;

  energyDataResponse.onPeakCost =
    energyDataResponse.onPeak * RATE_DATA_DISCOUNT.RATE_PEAK;
  energyDataResponse.offPeakCost =
    energyDataResponse.offPeak * RATE_DATA_DISCOUNT.RATE_OFF_PEAK;
  energyDataResponse.holidayCost =
    energyDataResponse.holiday * RATE_DATA_DISCOUNT.RATE_HOLIDAY;

  energyDataResponse.totalEnergy =
    energyDataResponse.onPeak +
    energyDataResponse.offPeak +
    energyDataResponse.holiday;

  energyDataResponse.totalCost =
    energyDataResponse.onPeakCost +
    energyDataResponse.offPeakCost +
    energyDataResponse.holidayCost; */
  /** ====== end Mock Data  ======*/

  // console.log("energyDataResponse", energyDataResponse);
  return energyDataResponse;
}

export async function calculateMinimumTake({
  contractData,
  RATE_DATA,
  deviceData,
  month,
}) {
  const { ContractDiscountRate, ContractCOD } = contractData;

  const checkDate = dayjs();
  const dateCOD = dayjs(ContractCOD);
  let startDate = dayjs();
  // ตั้งให้วันสุดท้ายเป็นวันปัจจุบันของเดือนที่ส่งเข้ามา โดยเพิ่มอีก 1 วันเพื่อให้ครอบคลุมวัน
  let endDate = dayjs()
    .month(month - 1)
    .add(1, "day");

  let period = 1;
  // เช็คเงื่อนไขว่าถ้าเป็นวันที่ 1 ก.ค. หรือ 1 ม.ค.
  if (checkDate.month(month - 1).date() === 1 && month == 7) {
    // ถ้าเป็น 1 ก.ค. ให้เอาข้อมูลจาก 1 ม.ค. จนถึง 30 มิ.ย.
    startDate = dayjs().startOf("year");
    endDate = dayjs().month(5).endOf("month").add(1, "day");
    period = 1;
  } else if (checkDate.month(month - 1).date() === 1 && month == 1) {
    // ถ้าเป็น 1 ม.ค. ให้เอาข้อมูลจาก 1 ก.ค. จนถึง 31 ธ.ค.
    startDate = dayjs().month(6).startOf("month");
    endDate = dayjs().endOf("year").add(1, "day");
    period = 2;
  }

  // ถ้าเป็นวันอื่น ๆ ให้ดูจากเดือนปัจจุบัน
  if (month <= 6) {
    // ถ้าเป็นเดือน 1-6 ให้เอาข้อมูลจาก 1 ม.ค. ถึงวันที่ปัจจจุบัน
    startDate = dayjs().startOf("year");
    period = 1;
  } else {
    // ถ้าเป็นเดือน 7-12 ให้เอาข้อมูลจาก 1 ก.ค. ถึงวันที่ปัจจุบัน
    startDate = dayjs().month(6).startOf("month");
    period = 2;
  }

  if (startDate.diff(dateCOD, "day") < 0) {
    // วันที่ข้อมูลเริ่มต้น น้อยกว่าวันที่ COD ให้้เริ่มคำนวณข้อมูลจากวันที่ COD
    startDate = dateCOD;
  }
  const { RATE_PEAK, RATE_OFF_PEAK, RATE_HOLIDAY, RATE_WEEKEND, RATE_FT } =
    RATE_DATA;

  const RATE_DATA_DISCOUNT = {
    RATE_PEAK: RATE_PEAK * (1 - ContractDiscountRate / 100),
    RATE_OFF_PEAK: RATE_OFF_PEAK * (1 - ContractDiscountRate / 100),
    RATE_HOLIDAY: RATE_HOLIDAY * (1 - ContractDiscountRate / 100),
    RATE_WEEKEND: RATE_WEEKEND * (1 - ContractDiscountRate / 100),
    RATE_FT: RATE_FT * (1 - ContractDiscountRate / 100),
  };

  const interval = 1000 * 60 * 60 * 24; // 1 day

  const energyGenerationDataArray = [];
  const energyConsumptionDataArray = [];
  for (
    let index = startDate.valueOf();
    index < endDate.valueOf();
    index += interval
  ) {
    const datetime = dayjs(index).format("YYYY-MM-DD");

    let energyGenerationObject = {
      datetime: datetime,
      onPeak: 0,
      offPeak: 0,
      holiday: 0,
      weekend: 0,
    };

    let energyConsumptionObject = {
      datetime: datetime,
      onPeak: 0,
      offPeak: 0,
      holiday: 0,
      weekend: 0,
    };

    // หน่วยไฟที่ผลิต = (kwh_import ของ meter solar)
    // หน่วยไฟที่ใช้ = (kwh_import ของ meter solar) - (kwh_export ของ meter grid)
    // เอา kwh_export มาลบออกเพื่อดูจำนวนไฟที่ใช้จริง

    for (const device of deviceData) {
      const { ContractId, DeviceId, DeviceTypeId, DevId } = device;

      const itemData = await getDeviceDataEnergy({ device, datetime });

      if (!DeviceTypeId.includes("pm")) {
        energyGenerationObject.onPeak += itemData.sumEnergyOnPeak;
        energyGenerationObject.offPeak += itemData.sumEnergyOffPeak;
        energyGenerationObject.holiday += itemData.sumEnergyHoliday;
        energyGenerationObject.weekend += itemData.sumEnergyWeekend;
      }

      // เอา kwh_export ของ meter grid มาลบออกเพื่อดูจำนวนไฟที่ใช้จริง
      // หน่วยไฟที่ใช้ = (kwh_peak, kwh_offpeak, kwh_holiday ของ meter solar) - (kwh_export ของ meter grid)
      if (DeviceTypeId.includes("pm")) {
        energyConsumptionObject.onPeak -= Math.abs(
          itemData.sumEnergyExportOnPeak
        );
        energyConsumptionObject.offPeak -= Math.abs(
          itemData.sumEnergyExportOffPeak
        );
        energyConsumptionObject.holiday -= Math.abs(
          itemData.sumEnergyExportHoliday
        );
        energyConsumptionObject.weekend -= Math.abs(
          itemData.sumEnergyExportWeekend
        );
      } else {
        energyConsumptionObject.onPeak += itemData.sumEnergyOnPeak;
        energyConsumptionObject.offPeak += itemData.sumEnergyOffPeak;
        energyConsumptionObject.holiday += itemData.sumEnergyHoliday;
        energyConsumptionObject.weekend += itemData.sumEnergyWeekend;
      }
    }
    energyGenerationDataArray.push(energyGenerationObject);
    energyConsumptionDataArray.push(energyConsumptionObject);
  }

  const monthlyEnergyGenerationData = {
    onPeak: energyGenerationDataArray.reduce((acc, cur) => acc + cur.onPeak, 0),
    offPeak: energyGenerationDataArray.reduce(
      (acc, cur) => acc + cur.offPeak,
      0
    ),
    weekend: energyGenerationDataArray.reduce(
      (acc, cur) => acc + cur.weekend,
      0
    ),
    holiday: energyGenerationDataArray.reduce(
      (acc, cur) => acc + cur.holiday,
      0
    ),
  };
  const monthlyEnergyConsumptionData = {
    onPeak: energyConsumptionDataArray.reduce(
      (acc, cur) => acc + cur.onPeak,
      0
    ),
    offPeak: energyConsumptionDataArray.reduce(
      (acc, cur) => acc + cur.offPeak,
      0
    ),
    weekend: energyConsumptionDataArray.reduce(
      (acc, cur) => acc + cur.weekend,
      0
    ),
    holiday: energyConsumptionDataArray.reduce(
      (acc, cur) => acc + cur.holiday,
      0
    ),
  };

  /** ====== Start check logic data  ======*/
  /*  monthlyEnergyConsumptionData.onPeak = 30000;
  monthlyEnergyConsumptionData.offPeak = 10000;
  monthlyEnergyConsumptionData.weekend = 5000;
  monthlyEnergyConsumptionData.holiday = 0; */
  /** ====== end Mock Data  ======*/

  // หน่วยไฟที่ผลิตทั้งหมด
  const totalEnergyGeneration =
    monthlyEnergyGenerationData.onPeak +
    monthlyEnergyGenerationData.offPeak +
    monthlyEnergyGenerationData.weekend +
    monthlyEnergyGenerationData.holiday;

  // หน่วยไฟที่ใช้จริงทั้งหมด
  const totalEnergyConsumption =
    monthlyEnergyConsumptionData.onPeak +
    monthlyEnergyConsumptionData.offPeak +
    monthlyEnergyConsumptionData.weekend +
    monthlyEnergyConsumptionData.holiday;

  const weigthedAverageDiscountRate =
    (monthlyEnergyConsumptionData.onPeak / totalEnergyConsumption) *
      RATE_DATA_DISCOUNT.RATE_PEAK +
    (monthlyEnergyConsumptionData.offPeak / totalEnergyConsumption) *
      RATE_DATA_DISCOUNT.RATE_OFF_PEAK +
    (monthlyEnergyConsumptionData.weekend / totalEnergyConsumption) *
      RATE_DATA_DISCOUNT.RATE_WEEKEND +
    (monthlyEnergyConsumptionData.holiday / totalEnergyConsumption) *
      RATE_DATA_DISCOUNT.RATE_HOLIDAY +
    RATE_DATA_DISCOUNT.RATE_FT;

  /** ====== Start mock test data  ======*/
  /* monthlyEnergyData.onPeak = 30000;
  monthlyEnergyData.offPeak = 10000;
  monthlyEnergyData.weekend = 2500;
  monthlyEnergyData.holiday = 2500; */
  /** ====== end Mock Data  ======*/

  insertMinimumTakeData({
    contractData,
    minimumTakeData: {
      totalEnergyGeneration,
      totalEnergyConsumption,
      weigthedAverageDiscountRate,
      minimumTakePeriod: period,
    },
  });

  const returnData = {
    monthlyEnergyGenerationData,
    monthlyEnergyConsumptionData,
    weigthedAverageDiscountRate,
    totalEnergyGeneration,
    totalEnergyConsumption,
    minimumTakePeriod: period,
  };

  // console.log("cal MinimumTake returnData", returnData);
  return returnData;
}

function checkMinimumtakeAmount({
  totalEnergyGeneration,
  totalEnergyConsumption,
}) {
  const energyGenerationThreshold = totalEnergyGeneration * 0.9;

  if (totalEnergyConsumption < energyGenerationThreshold) {
    return energyGenerationThreshold - totalEnergyConsumption;
  } else {
    return 0;
  }
}

async function insertMinimumTakeData({ contractData, minimumTakeData }) {
  const { ContractId, ContractCOD } = contractData;
  const {
    totalEnergyGeneration,
    totalEnergyConsumption,
    weigthedAverageDiscountRate,
    minimumTakePeriod,
  } = minimumTakeData;

  let periodStart = dayjs();
  let periodEnd = dayjs();
  if (minimumTakePeriod === 1) {
    periodStart = dayjs().startOf("year");
    periodEnd = dayjs().month(5).endOf("month");
  } else {
    periodStart = dayjs().month(6).startOf("month");
    periodEnd = dayjs().endOf("year");
  }
  const insertMinimumTakeQuery = `IF NOT EXISTS (SELECT ContractId, PeriodNumber FROM MinimumTakePeriod WHERE ContractId = ${ContractId} AND PeriodNumber= ${minimumTakePeriod})
  BEGIN
  INSERT INTO MinimumTakePeriod (ContractId, PeriodNumber , PeriodStart , PeriodEnd)
  VALUES (${ContractId}, ${minimumTakePeriod}, CONVERT(DATETIME, '${periodStart.format(
    "YYYY-MM-DD"
  )}') , CONVERT(DATETIME, '${periodEnd.format("YYYY-MM-DD")}')   ) 
  END
  `;

  await ExecuteQuery(insertMinimumTakeQuery);

  const minimumTakeQuery = `SELECT * FROM MinimumTakePeriod WHERE ContractId = ${ContractId} AND PeriodNumber = ${minimumTakePeriod}`;
  const minimumTakeResponse = await ExecuteQuery(minimumTakeQuery);

  // console.log("minimumTakeResponse", minimumTakeResponse);

  const insertDataArray = [
    {
      type: "energy-generation",
      description: "Total Energy Generation",
      quantity: totalEnergyGeneration,
      unit: "kWh",
    },
    {
      type: "energy-consumption",
      description: "Total Energy Consumption",
      quantity: totalEnergyConsumption,
      unit: "kWh",
    },
  ];
  if (minimumTakeResponse.length > 0) {
    const minimumTakeId = minimumTakeResponse[0].id;

    for (const insertData of insertDataArray) {
      const { type, description, quantity, unit } = insertData;
      const insertMinimumTakeTransactionQuery = `IF NOT EXISTS (SELECT * FROM MinimumTakeTransaction WHERE MinimumTakeId = ${minimumTakeId} AND Type = '${type}' )  BEGIN
      INSERT INTO MinimumTakeTransaction (MinimumTakeId,  Type,  Description, Quantity, Unit,  CreatedAt, UpdatedAt)
      VALUES 
      (${minimumTakeId}, '${type}', '${description}', ${quantity}, '${unit}', GETDATE(), GETDATE())
      END
      ELSE
      BEGIN
      UPDATE MinimumTakeTransaction SET Quantity = ${quantity}, UpdatedAt = GETDATE() WHERE MinimumTakeId = ${minimumTakeId} AND Type = '${type}'
      END
      `;

      await ExecuteQuery(insertMinimumTakeTransactionQuery);
    }
  }
}
