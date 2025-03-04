import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import axios from "axios";
import dayjs from "dayjs";
import numeral from "numeral";
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

const config = {
  vav_api_host: `https://enzy-chiller.egat.co.th/api/get-vav-fl4`,
};
const https = require("https");

// At request level
const agent = new https.Agent({
  rejectUnauthorized: false,
});
export async function getVavAPI(req) {
  const parameters = {
    id: req.id,
  };

  const res = await axios.get(`${config.vav_api_host}`, {
    params: parameters,
    httpsAgent: agent,
  });

  if (res.status === 200) {
    const data = res.data;
    return data;
  }
}
