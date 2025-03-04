import { formatToNumberWithDecimalPlaces } from "@/utils/utils";
import axios from "axios";
import dayjs from "dayjs";
import numeral from "numeral";
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

const config = {
  ir_api_host: `https://apim-enzy-api-prd-sea-01.azure-api.net/dec/s0018/`,
};

export async function getIrAPI(req) {
  const res = await axios.get(`${config.ir_api_host}/${req.id}/${req.value}`, {
    headers: {
      "Ocp-Apim-Subscription-Key": process.env.AZURE_APIM_KEY,
    },
  });

  if (res.status === 200) {
    const data = res.data;
    return data;
  }
}
