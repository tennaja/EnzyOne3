import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import axios from "axios";
import dayjs from "dayjs";
import numeral from "numeral";
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

const config = {
  chiller_api_host: `https://enzy-chiller.egat.co.th/api/get-plant-history`,
};
const https = require("https");

// At request level
const agent = new https.Agent({
  rejectUnauthorized: false,
});
export async function getChillerPlantAPI(req) {
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
    let timeAxisData = [];
    let valueData = [];
    let series = [];
    const responseArray = [];
    for (let index = 0; index < data?.["CH_SUPPLY_TEMP"].length; index++) {
      const value = data?.["CH_SUPPLY_TEMP"][index].value;
      const time = data?.["CH_SUPPLY_TEMP"][index].time;

      const dataObject = {
        time: dayjs(time, "DD-MMM-YY h:mm A").format("YYYY-MM-DD HH:mm"),
        value: value,
      };

      responseArray.push(dataObject);
    }

    const responseFlowArray = [];
    for (let index = 0; index < data?.["CH_WATER_FLOW"].length; index++) {
      const value = data?.["CH_WATER_FLOW"][index].value;
      const time = data?.["CH_WATER_FLOW"][index].time;

      const dataObject = {
        time: dayjs(time, "DD-MMM-YY h:mm A").format("YYYY-MM-DD HH:mm"),
        value: value,
      };

      responseFlowArray.push(dataObject);
    }

    const responseReturnTempArray = [];
    for (let index = 0; index < data?.["CH_RETURN_TEMP"].length; index++) {
      const value = data?.["CH_RETURN_TEMP"][index].value;
      const time = data?.["CH_RETURN_TEMP"][index].time;

      const dataObject = {
        time: dayjs(time, "DD-MMM-YY h:mm A").format("YYYY-MM-DD HH:mm"),
        value: value,
      };

      responseReturnTempArray.push(dataObject);
    }

    const responseData = {
      CH_SUPPLY_TEMP: responseArray,
      CH_WATER_FLOW: responseFlowArray,
      CH_RETURN_TEMP: responseReturnTempArray,
    };
    return responseData;
  }
}
