import { formatTimestampData, unique } from "@/utils/function";
import dayjs from "dayjs";
import ExecuteQuery from "@/utils/kustoService";
import { NextResponse } from "next/server";
import { ceil, floor } from "@/utils/utils";

export async function GET(request) {
  dayjs.extend(floor);
  dayjs.extend(ceil);
  const { searchParams } = new URL(request.url);

  const site_string = searchParams.get("site");
  const devid_string = searchParams.get("devid");
  const sampling = searchParams.get("sampling") ?? "5m";

  const now = dayjs();

  let datetimeNow;
  let datetimeEnd;

  if (sampling == "1h") {
    datetimeNow = now.format("YYYY-MM-DD HH[:00:00]");
    datetimeEnd = now.add(1, "hour").format("YYYY-MM-DD HH[:00:00]");
  } else if (sampling == "5m") {
    // todo function for sampling
    datetimeNow = now.floor("minute", 5).format("YYYY-MM-DD HH:mm:[00]");
    datetimeEnd = now.ceil("minute", 5).format("YYYY-MM-DD HH:mm:[00]");
  }

  const query = `let table = SensorDataH
  | where site_string == '${site_string}' 
      and devid_string == '${devid_string}'
      and n_string == 'kwh'
      and timestamp >= datetime('${datetimeNow}')
      and timestamp <= datetime('${datetimeEnd}')
  | summarize 
      (maxTimestamp, maxValue) = arg_max(timestamp, v_double);
    table`;

  const response = await ExecuteQuery(query);

  const responseData = response.data[0];
  var minValue = responseData.minValue;
  var maxValue = responseData.maxValue;

  // console.log("responseData", responseData);
  /*  
 var totalEnergy =
    maxValue - minValue >= 0
      ? maxValue - minValue
      : maxValue - minValue + 1000000;
 */
  var noDataResponse = {
    message: "no data",
  };

  var data = {
    ts: datetimeNow,
    site: site_string,
    devid: devid_string,
    n: "kwh",
    value: maxValue,
  };

  return NextResponse.json(data);
}
