import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import {
  calculateMinimumTake,
  getEnergyDuringInstallmentPeriod,
  getMonthlyEnergyData,
  getVariableData,
  insertInvoiceTransactionData,
} from "./invoiceService";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // SET ค่าเริ่มต้น
  const RATE_DATA = {
    RATE_PEAK: 4.1839,
    RATE_OFF_PEAK: 2.6037,
    RATE_WEEKEND: 2.6037,
    RATE_HOLIDAY: 2.6037,
    RATE_FT: 0.0625,
  };

  const variableData = await getVariableData();

  if (variableData.length > 0) {
    RATE_DATA.RATE_PEAK = variableData[0].OnPeak_Cost;
    RATE_DATA.RATE_OFF_PEAK = variableData[0].OffPeak_Cost;
    RATE_DATA.RATE_WEEKEND = variableData[0].OffPeak_Cost;
    RATE_DATA.RATE_HOLIDAY = variableData[0].OffPeak_Cost;
    RATE_DATA.RATE_FT = variableData[0].FT;
  }

  const PAYMENT_METHOD = "Bank Transfer";
  const PAYMENT_BANK_NAME = "ธนาคารกรุงเทพ จำกัด(มหาชน) สาขาสำนักงานใหญ่";
  const PAYMENT_ACCOUNT = "101-3-49281-2";
  const PAYMENT_ACCOUNT_NAME = "Security Agent Account (BBL/EGCO)";
  const PAYMENT_NOTE =
    "มีระยะเวลาในการชำระ  30 วันนับจากที่ได้รับใบแจ้งหนี้ กรณีเกินกำหนดชำระเงิน มีค่าปรับเป็น 15% ต่อปี";
  // เรียก ข้อมูลจาก Contract
  let PAYMENT_DUE_DATE;
  let INVOICE_DATE;

  const contractQuery = `SELECT
    Contract.Id AS ContractId,
    Customer.Id AS CustomerId,
    Customer.Name AS CustomerName,
    Contract.ContractDiscountRate,
    Contract.ContractCOD,
    Contract.InstallmentPeriod

FROM Contract
    JOIN Customer ON Contract.CustomerId = Customer.Id`;

  const contractData = await ExecuteQuery(contractQuery);

  for (const contract of contractData) {
    const {
      ContractId,
      CustomerId,
      CustomerName,
      ContractDiscountRate,
      ContractStartCountingDateBeforeCOD,
      ContractCOD,
      InstallmentPeriod,
    } = contract;

    const deviceQuery = `SELECT
    Contract.Id AS ContractID  ,
    Device.Id AS DeviceId,
    Device.DeviceTypeId,
    Device.Name AS DeviceName,
    Device.DevId AS DevId 
  FROM
    Contract
    JOIN Company ON Contract.companyId = Company.Id
    JOIN Branch ON Company.Id = Branch.CompanyId
    JOIN Area ON Branch.Id = Area.BranchId
    JOIN AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
    JOIN Building ON AreaBuildingMapping.BuildingId = Building.Id
    JOIN Floor ON Building.Id = Floor.BuildingId
    JOIN Device ON Floor.Id = Device.FloorId 
  WHERE  Contract.Id = ${ContractId}
  AND
    (Device.DeviceTypeId LIKE '%pm%' OR Device.[DeviceTypeId] LIKE '%gen%') AND [Sequence] = 1`;

    const deviceData = await ExecuteQuery(deviceQuery);

    let startDate, endDate;
    if (dayjs().date() === 1) {
      // ย้อนดึงข้อมูลของเดือนก่อนหน้า
      startDate = dayjs().add(-1, "month").startOf("month");
      endDate = dayjs().add(-1, "month").endOf("month").add(1, "day");

      PAYMENT_DUE_DATE = dayjs().add(30, "day").format("YYYY-MM-DD");
      INVOICE_DATE = dayjs().format("YYYY-MM-DD");
    } else {
      // set start date and end date to first day of the month and last day of the month
      startDate = dayjs().startOf("month");
      endDate = dayjs().endOf("month").add(1, "day");

      PAYMENT_DUE_DATE = null;
      INVOICE_DATE = null;
    }

    // เช็คว่าเป็นช่วงที่อยู่ในระยะหลัง COD ตามจำนวนงวดชำระ
    const dateCOD = dayjs(ContractCOD);

    if (startDate.diff(dateCOD, "day") < 0) {
      // วันที่ข้อมูลเริ่มต้น น้อยกว่าวันที่ COD ให้้เริ่มคำนวณข้อมูลจากวันที่ COD
      startDate = dateCOD;
    }

    const isDuringInstallmentPeriod =
      startDate.diff(dateCOD, "month") <= InstallmentPeriod &&
      startDate.diff(dateCOD, "month") >= 0;

    let energyDuringInstallmentPeriod = 0;

    if (isDuringInstallmentPeriod) {
      const dateStartCountingBeforeCOD = dayjs(
        ContractStartCountingDateBeforeCOD
      );

      // คำนวณหน่วยไฟก่อน COD  (ดึงจาก MeterValue ณ วันที่ COD)
      energyDuringInstallmentPeriod = await getEnergyDuringInstallmentPeriod({
        deviceData,
        dateStartCountingBeforeCOD,
        dateCOD,
        installmentPeriod: InstallmentPeriod,
        RATE_DATA,
        contractData: contract,
      });

      // const topUpFactorData ;
      // ${dateInvoice.diff(dateCOD, "month") > InstallmentPeriod ? `(${InvoiceId} , 'top-up', 'Top-Up Factor' , null , null , ${} , )` : ''}
    }

    let minimumTake = await calculateMinimumTake({
      contractData: contract,
      RATE_DATA,
      deviceData: deviceData,
      month: startDate.month() + 1,
      // month: 7,
    });
    // console.log("minimumTake", minimumTake);
    /* 
    console.log("minimumTake", minimumTake);
    return NextResponse.json({ data: minimumTake }); */

    // ทำข้อมูล Monthly Energy
    const monthlyEnergyData = await getMonthlyEnergyData({
      deviceData,
      startDate,
      endDate,
    });

    // insert หรือ update ข้อมูลลง invoice
    const insertInvoiceQuery = `IF NOT EXISTS (SELECT * FROM Invoice WHERE ContractId = ${ContractId} AND Year = ${startDate.year()} AND Month = ${
      startDate.month() + 1
    }) BEGIN 
INSERT INTO Invoice
    (Year,Month, InvoiceDate,TransactionStartDate , TransactionEndDate,ContractId,CustomerId, PaymentMethod, PaymentBankName , PaymentAccount, PaymentAccountName , PaymentDueDate , PaymentNote , CreatedAt, UpdatedAt)
    VALUES ( ${startDate.year()}, ${startDate.month() + 1}, ${
      INVOICE_DATE ? `CONVERT(DATETIME,'${INVOICE_DATE}')` : null
    }
     , '${startDate.format("YYYY-MM-DD")}' , '${startDate
      .endOf("month")
      .format(
        "YYYY-MM-DD"
      )}' , ${ContractId} , ${CustomerId} , '${PAYMENT_METHOD}' , '${PAYMENT_BANK_NAME}' , '${PAYMENT_ACCOUNT}' , '${PAYMENT_ACCOUNT_NAME}' , ${
      PAYMENT_DUE_DATE ? `CONVERT(DATETIME,'${PAYMENT_DUE_DATE}')` : null
    } , '${PAYMENT_NOTE}' , GETDATE() , GETDATE() )
    END
    ELSE
    BEGIN
    UPDATE INVOICE SET InvoiceDate =  ${
      INVOICE_DATE ? `CONVERT(DATETIME,'${INVOICE_DATE}')` : null
    }, PaymentDueDate = ${
      PAYMENT_DUE_DATE ? `CONVERT(DATETIME,'${PAYMENT_DUE_DATE}')` : null
    }, UpdatedAt = GETDATE() WHERE ContractId = ${ContractId} AND Year = ${startDate.year()} AND Month = ${
      startDate.month() + 1
    }
    END
    `;

    await ExecuteQuery(insertInvoiceQuery);

    // ดึงข้อมูล invoice ที่เพิ่มลงไป เพื่อเอา invoice ID
    const invoiceQuery = `SELECT * FROM Invoice WHERE ContractId = ${ContractId} AND Year = ${startDate.year()} AND Month = ${
      startDate.month() + 1
    }`;

    const invoiceData = await ExecuteQuery(invoiceQuery);

    for (const invoice of invoiceData) {
      const { Id: InvoiceId } = invoice;

      await insertInvoiceTransactionData({
        monthlyEnergyData,
        InvoiceId,
        contractData: contract,
        startDate,
        RATE_DATA,
        minimumTakeData: minimumTake,
        isDuringInstallmentPeriod,
        energyDuringInstallmentPeriod,
      });
    }
  }
  return NextResponse.json({
    data: "successfully",
    contractData: contractData,
  });
}
