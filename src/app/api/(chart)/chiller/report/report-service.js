import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import axios from "axios";
import dayjs from "dayjs";
import numeral from "numeral";
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

const config = {
  chiller_api_host: `https://enzy-chiller.egat.co.th/api/get-report-history`,
};
const https = require("https");

// At request level
const agent = new https.Agent({
  rejectUnauthorized: false,
});
export async function getReportAPI(req) {
  const parameters = {
    dateFrom: req.dateFrom,
    dateTo: req.dateTo,
  };

  const res = await axios.get(`${config.chiller_api_host}`, {
    params: parameters,
    httpsAgent: agent,
  });

  if (res.status === 200) {
    const data = res.data;
    const responseArray = [];
    for (let index = 0; index < data?.["CPMS Power(kW)"].length; index++) {
      const value = data?.["CPMS Power(kW)"][index]?.value;
      const time = data?.["CPMS Power(kW)"][index]?.time;

      const dataObject = {
        time: dayjs(time, "DD-MMM-YY h:mm A").format("YYYY-MM-DD HH:mm"),
        value: value,
      };

      responseArray.push(dataObject);
    }

    const responseKwTonArray = [];
    for (let index = 0; index < data?.["CPMS kW/ton"].length; index++) {
      const value = data?.["CPMS kW/ton"][index]?.value;
      const time = data?.["CPMS kW/ton"][index]?.time;

      const dataObject = {
        time: dayjs(time, "DD-MMM-YY h:mm A").format("YYYY-MM-DD HH:mm"),
        value: value,
      };

      responseKwTonArray.push(dataObject);
    }

    const responseData = {
      "CPMS Power(kW)": responseArray,
      "CPMS kW/ton": responseKwTonArray,
    };
    return responseData;
  }
}
