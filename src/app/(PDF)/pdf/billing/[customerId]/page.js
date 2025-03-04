import BillingDetail from "@/app/(main-app)/report/billing/BillingDetail";
import { getBillingData } from "@/utils/api";

import dayjs from "dayjs";
import _ from "lodash";

const buddhistEra = require("dayjs/plugin/buddhistEra");
const th = require("dayjs/locale/th");

dayjs.extend(buddhistEra);
dayjs.locale(th);
export default async function PDFSummaryPage({ params, searchParams }) {
  const paramsObj = {
    year: searchParams.year,
    month: searchParams.month,
    customerId: params.customerId,
  };
  const yearMonth = searchParams.year + "-" + searchParams.month;
  console.log("paramsObj", paramsObj);
  const response = await getBillingData(paramsObj);
  console.log("response======:", response);
  console.log("response", response.data);
  const invoiceData = response.data;

  const summaryData = {
    subTotal: "0.00",
    vat: "0.00",
    grandTotal: "0.00",
  };

  if (!_.isEmpty(invoiceData)) {
    for (const transaction of invoiceData?.transaction) {
      if (transaction?.transactionType == "sub-total") {
        summaryData.subTotal = transaction?.transactionAmount;
      } else if (transaction?.transactionType == "vat") {
        summaryData.vat = transaction?.transactionAmount;
      } else if (transaction?.transactionType == "grand-total") {
        summaryData.grandTotal = transaction?.transactionAmount;
      }
    }
  }
  const title = `ประจำเดือน ${dayjs(yearMonth, "YYYY-MM").format(
    "MMMM BBBB"
  )} `;

  return (
    <>
      <BillingDetail
        invoiceData={invoiceData}
        summaryData={summaryData}
        invoiceNumber={searchParams.invoiceNumber}
        isPDF={true}
      />
    </>
  );
}
