import BillingDetailForm2 from "@/app/(main-app)/report/billing/BillingDetailForm2";
import { getBillingData } from "@/utils/api";

import dayjs from "dayjs";
import _ from "lodash";

const buddhistEra = require("dayjs/plugin/buddhistEra");
const th = require("dayjs/locale/th");

dayjs.extend(buddhistEra);
dayjs.locale(th);
export default async function PDFSummaryPage({ params, searchParams }) {
  return (
    <>
      <BillingDetailForm2 isPDF={true} />
    </>
  );
}
