import SummaryDetail from "@/app/(main-app)/report/summary/SummaryDetail";
import SummaryFlatDetail from "@/app/(main-app)/report/summary/SummaryFlatDetail";
import { getReportSummaryByBranch } from "@/utils/api";

import dayjs from "dayjs";

const buddhistEra = require("dayjs/plugin/buddhistEra");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const th = require("dayjs/locale/th");

dayjs.extend(buddhistEra);
dayjs.extend(customParseFormat);

dayjs.locale(th);
export default async function PDFSummaryPage({ params, searchParams }) {
  const paramsObj = {
    year: searchParams.year,
    month: searchParams.month,
    branchId: params.branchId,
  };
  const yearMonth = searchParams.year + "-" + searchParams.month;
  const response = await getReportSummaryByBranch(paramsObj);
  // console.log("response", response.data);
  const dataSummary = response.data;
  const title = `ประจำเดือน ${dayjs(yearMonth, "YYYY-M").format("MMMM BBBB")} `;

  return params.branchId >= 5 && params.branchId <= 105 ? (
    <SummaryFlatDetail title={title} dataSummary={dataSummary} isPDF={true} />
  ) : (
    <SummaryDetail title={title} dataSummary={dataSummary} isPDF={true} />
  );
}
