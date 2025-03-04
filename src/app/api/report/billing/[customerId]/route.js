import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import numeral from "numeral";
import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import { calculateFlatRateCost } from "@/app/api/utils/function";

require("dayjs/locale/th");
dayjs.locale("th");
dayjs.extend(require("dayjs/plugin/buddhistEra"));

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const id = params.customerId;
  const year = searchParams.get("year") ?? dayjs().get("year");
  const month = searchParams.get("month") ?? dayjs().get("month") + 1;

  const monthYear = `${year}-${month}-01`;
  /* const mockBillingResponseData = {
    id: 1,
    invoiceNumber: "INV-456",
    invoiceDate: dayjs(monthYear).format("[1] MMMM BBBB"),
    year: dayjs(monthYear).format("BBBB"),
    month: dayjs(monthYear).add(-1, "month").format("MMMM"),
    transactionStartDate: dayjs(monthYear)
      .add(-1, "month")
      .startOf("month")
      .format("D MMMM BBBB"),
    transactionEndDate: dayjs(monthYear)
      .add(-1, "month")
      .endOf("month")
      .format("D MMMM BBBB"),
    subTotal: numeral(194412.85).format("0,0.00"),
    vat: numeral(13608.9).format("0,0.00"),
    grandTotal: numeral(208021.75).format("0,0.00"),
    contract: {
      contractId: 1,
      contractNumber: "CN-101",
      contractName:
        "Private Power Purchase Agreement EGCO Cogeneration Company Limited and Tuntex Textile (Thailand) Co., Ltd.",
      contractPeriod: "มิถุนายน 2567 - พฤษภาคม 2570",
      contractDiscountRate: 20,
      contractCOD: "1 พฤษภาคม 2567",
    },
    customer: {
      customerId: 1,
      customerName:
        "Private Power Purchase Agreement EGCO Cogeneration Company Limited and Tuntex Textile (Thailand) Co., Ltd.",
      customerAddress:
        "Rayong Industrial Park No.1, Moo 8, 3191 Rd., Mapkha, Nikhom Phatthana, Rayong, Thailand, 21180",
      customerTaxId: "TAX1234567",
      customerTelephone: "123-456-7890",
    },
    payment: {
      paymentMethod: "Bank Transfer",
      paymentBankName: "ธนาคารทหารไทยธนชาต จำกัด (มหาชน) สาขาสำนักพหลโยธิน",
      paymentAccount: "123-456-7890",
      paymentAccountName: "บริษัท เอ็กโก โคเจนเนอเรชั่น จำกัด",
      paymentDueDate: dayjs().endOf("month").format("YYYY-MM-DD"),
      paymentNote:
        "(มีระยะเวลาในการชำระ  1 เดือน กรณีเกินกำหนดชำระเงิน มีค่าปรับเป็น 15% ต่อปี)",
    },
    minimumTake: [
      {
        minimumTakeId: 1,
        minimumTakeDescription:
          "จำนวนพลังงานไฟฟ้าที่ผลิตได้สะสมงวดที่ 1 ระหว่างเดือน ม.ค. - มิ.ย.",
        minimumTakeQuantity: numeral(1000000.0).format("0,0.00"),
        minimumTakeUnit: "kWh",
      },
      {
        minimumTakeId: 2,
        minimumTakeDescription:
          "จำนวนพลังงานไฟฟ้าที่ต้องใช้สะสมงวดที่ 1 ระหว่างเดือน ม.ค. - มิ.ย. (90%)",
        minimumTakeQuantity: numeral(900000.0).format("0,0.00"),
        minimumTakeUnit: "kWh",
      },
      {
        minimumTakeId: 3,
        minimumTakeDescription:
          "จำนวนพลังงานไฟฟ้าที่ใช้จริงสะสมงวดที่ 1 ระหว่างเดือน ม.ค. - มิ.ย.",
        minimumTakeQuantity: numeral(885000.0).format("0,0.00"),
        minimumTakeUnit: "kWh",
      },
    ],
    transaction: [
      {
        transactionId: 1,
        transactionDescription: "Weekday: peak energy usage",
        transactionQuantity: numeral(30000).format("0,0.00"),
        transactionUnit: "kWh",
        transactionRate: numeral(4.1839).format("0,0.0000"),
        transactionAmount: numeral(125517.0).format("0,0.00"),
      },
      {
        transactionId: 2,
        transactionDescription: "Weekday: off-peak energy usage",
        transactionQuantity: numeral(10000).format("0,0.00"),
        transactionUnit: "kWh",
        transactionRate: numeral(2.6037).format("0,0.0000"),
        transactionAmount: numeral(26037.0).format("0,0.00"),
      },
      {
        transactionId: 3,
        transactionDescription: "Weekend energy usage",
        transactionQuantity: numeral(2500).format("0,0.00"),
        transactionUnit: "kWh",
        transactionRate: numeral(2.6037).format("0,0.0000"),
        transactionAmount: numeral(6509.25).format("0,0.00"),
      },
      {
        transactionId: 4,
        transactionDescription: "Holiday energy usage",
        transactionQuantity: numeral(2500).format("0,0.00"),
        transactionUnit: "kWh",
        transactionRate: numeral(2.6037).format("0,0.0000"),
        transactionAmount: numeral(6509.25).format("0,0.00"),
      },
      {
        transactionId: 5,
        transactionDescription: "Total energy usage",
        transactionQuantity: numeral(45000.0).format("0,0.00"),
        transactionUnit: "kWh",
        transactionRate: null,
        transactionAmount: null,
      },
      {
        transactionId: 6,
        transactionDescription: "Total before discount",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: numeral(2000000.5).format("0,0.00"),
      },
      {
        transactionId: 7,
        transactionDescription: "Ft.",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: numeral(0.0625).format("0,0.0000"),
        transactionAmount: numeral(2000000.5).format("0,0.00"),
      },
      {
        transactionId: 8,
        transactionDescription: "Discount rate",
        transactionQuantity: numeral(20).format("0"),
        transactionUnit: "%",
        transactionRate: numeral(0.0625).format("0,0.0000"),
        transactionAmount: numeral(2000000.5).format("0,0.00"),
      },
      {
        transactionId: 9,
        transactionDescription: "Total after discount",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: numeral(133908.0).format("0,0.00"),
      },
      {
        transactionId: 10,
        transactionDescription: "Top-Up Factor",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: numeral(1.12).format("0,0.00"),
        transactionAmount: numeral(149776.85).format("0,0.00"),
      },
      {
        transactionId: 11,
        transactionDescription:
          "ค่าชดเชยจาก Minimum take งวดที่ 1 (ม.ค. - มิ.ย. 2567)",
        transactionQuantity: numeral(15000.0).format("0,0.00"),
        transactionUnit: "kWh",
        transactionRate: numeral(2.9757).format("0,0.00"),
        transactionAmount: numeral(44636.0).format("0,0.00"),
      },
      {
        transactionId: 12,
        transactionDescription: "Sub Total",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: numeral(194412.85).format("0,0.00"),
      },
      {
        transactionId: 13,
        transactionDescription: "Vat 7%",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: numeral(13608.9).format("0,0.00"),
      },
      {
        transactionId: 14,
        transactionDescription: "Grand Total",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: numeral(208021.75).format("0,0.00"),
      },
    ],
  }; */

  const billingData = await getBillingData({ customerId: id, year, month });

  return NextResponse.json(billingData);
  // return NextResponse.json(mockBillingResponseData);
}

function transformText(text) {
  // Regular expression to match the pattern 123-456-7890
  const pattern = /(\d{3})-(\d{3})-(\d{4})/;
  // Replace the matched pattern by removing hyphens
  const transformedText = text.replace(pattern, "$1$2$3");
  return transformedText;
}

async function getBillingData({ customerId, year, month }) {
  const billingData = {};

  const contractData = {};
  const customerData = {};
  const paymentData = {};
  const transactionArray = [];

  const billingQuery = `SELECT
	Invoice.Id,
  Contract.Id as ContractId,
	Contract.ContractNumber,
	Contract.ContractName,
	Contract.ContractDiscountRate,
	Contract.ContractCOD,
	Contract.ContractStartDate,
	Contract.ContractEndDate,
	Contract.InstallmentPeriod,
  Customer.Id as CustomerId,
	Customer.Name,
	Customer.Address,
	Customer.TaxId,
	Customer.Telephone,
	Invoice.InvoiceNumber,
	Invoice.[Year],
	Invoice.[Month],
	Invoice.InvoiceDate,
	Invoice.TransactionStartDate,
	Invoice.TransactionEndDate,
	Invoice.PaymentMethod,
	Invoice.PaymentBankName,
	Invoice.PaymentAccount,
	Invoice.PaymentAccountName,
	Invoice.PaymentDueDate,
	Invoice.PaymentNote,
	Invoice.CreatedAt,
	Invoice.UpdatedAt 
FROM
	dbo.Invoice
	INNER JOIN dbo.Contract ON Invoice.ContractId = Contract.Id
	INNER JOIN dbo.Customer ON Contract.CustomerId = Customer.Id 
	AND Invoice.CustomerId = Customer.Id
	WHERE Invoice.[Year] = ${year}
	AND Invoice.[Month] = ${month} 
  AND Invoice.CustomerId = ${customerId}`;

  const billingResponse = await ExecuteQuery(billingQuery);

  if (billingResponse.length > 0) {
    //  transform data into the desired format

    const billing = billingResponse[0];
    billingData.id = billing?.Id ?? null;
    billingData.invoiceNumber = billing?.InvoiceNumber ?? null;
    billingData.invoiceDate = dayjs().format("D MMMM BBBB");
    /*  billingData.invoiceDate = billing?.InvoiceDate
      ? dayjs(billing.InvoiceDate).format("[1] MMMM BBBB")
      : null; */
    billingData.year = billing?.Year ?? null;
    billingData.month = billing?.Month ?? null;
    billingData.displayYear = billing?.Year
      ? dayjs().year(billing?.Year).format("BBBB")
      : null;
    billingData.displayMonth = billing?.Month
      ? dayjs()
          .month(billing?.Month - 1)
          .format("MMMM")
      : null;
    billingData.transactionStartDate = billing?.TransactionStartDate
      ? dayjs(billing.TransactionStartDate).format("D MMMM BBBB")
      : null;
    billingData.transactionEndDate = billing?.TransactionEndDate
      ? dayjs(billing.TransactionEndDate).format("D MMMM BBBB")
      : null;

    /** ปั้น data contract */
    contractData.contractId = billing?.ContractId ?? null;
    contractData.contractNumber = billing?.ContractNumber ?? null;
    contractData.contractName = billing?.ContractName ?? null;
    contractData.contractPeriod = billing?.ContractStartDate
      ? `${dayjs(billing.ContractStartDate).format("D MMMM BBBB")} - ${dayjs(
          billing.ContractEndDate
        ).format("D MMMM BBBB")}`
      : null;
    contractData.contractDiscountRate = billing?.ContractDiscountRate ?? null;
    contractData.contractCOD = billing?.ContractCOD
      ? dayjs(billing.ContractCOD).format("D MMMM BBBB")
      : null;

    billingData.contract = contractData;

    /** ปั้น data customer */
    customerData.customerId = billing?.CustomerId;
    customerData.customerName = billing?.Name;
    customerData.customerAddress = billing?.Address;
    customerData.customerTaxId = billing?.TaxId;
    customerData.customerTelephone = billing?.Telephone;

    billingData.customer = customerData;

    /** ปั้น data payment */
    paymentData.paymentMethod = billing?.PaymentMethod;
    paymentData.paymentBankName = billing?.PaymentBankName;
    paymentData.paymentAccount = billing?.PaymentAccount;
    paymentData.paymentAccountName = billing?.PaymentAccountName;
    paymentData.paymentDueDate = dayjs().add(30, "day").format("D MMMM BBBB");
    /*  paymentData.paymentDueDate = billing?.PaymentDueDate
      ? dayjs(billing.PaymentDueDate).format("YYYY-MM-DD")
      : null; */
    paymentData.paymentNote = billing?.PaymentNote;

    billingData.payment = paymentData;

    /** ปั้น minimumtake data */
    const minimumTakeData = await getMinimumTakeData({
      contractId: billing?.ContractId,
      startDate: dayjs(billing?.TransactionStartDate).format("YYYY-MM-DD"),
    });
    billingData.minimumTake = minimumTakeData;

    /** ปั้น transaction data */
    const transactionData = await getTransactionData({
      invoiceId: billingData.id,
    });

    billingData.transaction = transactionData;
    // console.log("transactionData", transactionData);
  }

  // console.log("billingData", billingData);
  return billingData;
}

async function getTransactionData({ invoiceId }) {
  const transactionArray = [];
  const transactionQuery = `SELECT
  InvoiceTransaction.Id,
  InvoiceTransaction.Type,
  InvoiceTransaction.Description,
  InvoiceTransaction.Quantity,
  InvoiceTransaction.Unit,
  InvoiceTransaction.Rate,
  InvoiceTransaction.Amount
  FROM InvoiceTransaction where InvoiceId = ${invoiceId}`;
  const transactionResponse = await ExecuteQuery(transactionQuery);

  let index = 1;
  let sumAmount = 0;
  for (const transaction of transactionResponse) {
    if (transaction?.Type !== "discount") {
      sumAmount += transaction?.Amount;
    }
    const transactionData = {};
    transactionData.transactionId = index;
    transactionData.transactionType = transaction?.Type ?? null;
    transactionData.transactionDescription = transaction?.Description ?? null;
    transactionData.transactionQuantity = transaction?.Quantity
      ? numeral(transaction?.Quantity).format("0,0")
      : transaction?.Unit == null
      ? null
      : "-";
    transactionData.transactionUnit = transaction?.Unit ?? null;
    transactionData.transactionRate = transaction?.Rate
      ? numeral(transaction?.Rate).format("0,0.[0000]")
      : null;
    transactionData.transactionAmount = transaction?.Amount
      ? numeral(transaction?.Amount).format("0,0.00")
      : transaction?.Unit == null
      ? null
      : "-";

    if (transactionData.transactionAmount !== null) {
      transactionArray.push(transactionData);
      index++;
    }

    if (transaction?.Type === "ft") {
      const beforeDiscountTransactionData = {
        transactionId: index,
        transactionType: "total-before-discount",
        transactionDescription: "Total before discount",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: numeral(sumAmount).format("0,0.00"),
      };
      transactionArray.push(beforeDiscountTransactionData);
      index++;
    }
    if (transaction?.Type === "discount") {
      sumAmount -= transaction?.Amount;

      const discountTransactionData = {
        transactionId: index,
        transactionType: "total-after-discount",
        transactionDescription: "Total after discount",
        transactionQuantity: null,
        transactionUnit: null,
        transactionRate: null,
        transactionAmount: numeral(sumAmount).format("0,0.00"),
      };
      transactionArray.push(discountTransactionData);
      index++;
    }
  }

  return transactionArray;
}

async function getMinimumTakeData({ contractId, startDate }) {
  const minimumTakeArray = [];

  const minimumTakeQuery = `SELECT MinimumTakePeriod.PeriodStart, MinimumTakePeriod.PeriodEnd, MinimumTakePeriod.PeriodNumber, mt.Id , mt.MinimumTakeId, mt.[Type] , mt.[Description] , mt.Quantity , mt.Unit
FROM MinimumTakePeriod JOIN MinimumTakeTransaction mt
    ON MinimumTakePeriod.Id = mt.MinimumTakeId
WHERE MinimumTakePeriod.ContractId = ${contractId} AND CONVERT(DATETIME,'${startDate}') >= MinimumTakePeriod.PeriodStart AND  CONVERT(DATETIME,'${startDate}') <= MinimumTakePeriod.PeriodEnd `;

  const minimumTakeResponse = await ExecuteQuery(minimumTakeQuery);

  if (minimumTakeResponse.length === 0) {
    return minimumTakeArray;
  } else {
    let index = 1;
    for (const minimumTake of minimumTakeResponse) {
      const minimumTakeData = {};
      const textStart = dayjs(minimumTake?.PeriodStart).format("MMM");
      const textEnd = dayjs(minimumTake?.PeriodEnd).format("MMM");

      minimumTakeData.minimumTakeId = index;
      minimumTakeData.minimumTakeType = minimumTake?.Type;
      if (minimumTake?.Type === "energy-generation") {
        minimumTakeData.minimumTakeDescription = `จำนวนพลังงานไฟฟ้าที่ผลิตได้สะสมงวดที่ ${minimumTake.PeriodNumber} ระหว่างเดือน ${textStart} - ${textEnd}`;
      } else {
        minimumTakeData.minimumTakeDescription = `จำนวนพลังงานไฟฟ้าที่ใช้จริงสะสมงวดที่ ${minimumTake.PeriodNumber} ระหว่างเดือน ${textStart} - ${textEnd}`;
      }
      minimumTakeData.minimumTakeQuantity = minimumTake?.Quantity
        ? numeral(minimumTake?.Quantity).format("0,0")
        : null;
      minimumTakeData.minimumTakeUnit = minimumTake?.Unit ?? null;

      minimumTakeArray.push(minimumTakeData);
      index++;

      if (minimumTake.Type == "energy-generation") {
        const thresholdObject = {
          minimumTakeId: index,
          minimumTakeType: "energy-generation-threshold",
          minimumTakeDescription: `จำนวนพลังงานไฟฟ้าที่ต้องใช้สะสมงวดที่ ${minimumTake.PeriodNumber} ระหว่างเดือน ${textStart} - ${textEnd} (90%)`,
          minimumTakeQuantity: numeral(minimumTake?.Quantity * 0.9).format(
            "0,0"
          ),
          minimumTakeUnit: minimumTake?.Unit ?? null,
        };
        minimumTakeArray.push(thresholdObject);
        index++;
      }
    }
  }

  return minimumTakeArray;
}
