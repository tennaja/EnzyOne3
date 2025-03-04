import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import axios from "axios";
import dayjs from "dayjs";
import numeral from "numeral";
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

const config = {
  chiller_api_host: `https://enzy-chiller.egat.co.th/api/get-chiller-history`,
};
const https = require("https");

// At request level
const agent = new https.Agent({
  rejectUnauthorized: false,
});
export async function getChillerAPI(req) {
  const parameters = {
    dateFrom: req.dateFrom,
    dateTo: req.dateTo,
    id: req.id,
  };

  const res = await axios.get(`${config.chiller_api_host}`, {
    params: parameters,
    httpsAgent: agent,
  });

  if (res.status === 200) {
    const data = res.data;
    let timeAxisData = [];
    let valueData = [];
    let series = [];
    const responseObject = [];
    for (let index = 0; index < data?.["Current L1"].length; index++) {
      const current_l1 = data?.["Current L1"][index]?.value;
      const current_l2 = data?.["Current L2"][index]?.value;
      const current_l3 = data?.["Current L3"][index]?.value;
      const voltage_ab = data?.["Voltage AB"][index]?.value;
      const time = data?.["Current L1"][index]?.time;

      const power =
        (1.732 *
          numeral(voltage_ab).value() *
          (numeral(current_l1).value() +
            numeral(current_l2).value() +
            numeral(current_l3).value())) /
        1000;

      const dataObject = {
        time: dayjs(time, "DD-MMM-YY h:mm A").format("YYYY-MM-DD HH:mm"),
        value: power,
      };

      responseObject.push(dataObject);
    }
    return responseObject;
  }
}
