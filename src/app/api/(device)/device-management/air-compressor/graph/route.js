import ExecuteQuery from "@/utils/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const floorId = searchParams.get("floorId") ?? 1;
  const unit = searchParams.get("unit") ?? "kw";
  let dateFrom = searchParams.get("dateFrom") ?? dayjs().format("YYYY-MM-DD");
  let dateTo = searchParams.get("dateTo") ?? dayjs().format("YYYY-MM-DD");
  let field;

  let isValidDate = dayjs(dateFrom).isValid() && dayjs(dateTo).isValid();
  switch (unit) {
    case "barg":
      field = "bar";
      break;
    case "kw":
      field = "kw";
      break;
    case "%":
      field = "efficiency";
      break;
    case "anomaly":
      field = "anomaly";
      break;
    default:
      field = "-";
      break;
  }
  if (dateFrom == dateTo) {
    dateTo = dayjs(dateTo).add(1, "day").format("YYYY-MM-DD");
  }
  const responseData = [];
  const sql = `SELECT
	Floor.Id,
	Floor.Name,
	Device.Id AS DeviceId,
	Device.DevId,
	Device.Name AS DeviceName 
FROM
	Floor
	JOIN Device ON Floor.Id = Device.FloorId 
WHERE
	Floor.Id = ${floorId}
	AND DeviceTypeId LIKE '%air_compressor%'
  AND Device.Name LIKE '%compressor%' `;

  const response = await ExecuteQuery(sql);

  if (response.length > 0) {
    for (const device of response) {
      if (isValidDate) {
        const airCompressorDataQuery = `SELECT 
    CONVERT(varchar(19),Timestamp,120) AS Timestamp,
    DevId,
    MAX(CASE WHEN field = '${field}' THEN value END) AS value 
FROM 
    RawData
		WHERE DevId = '${
      field == "kw" ? (device.DeviceId == 78 ? 19 : 20) : device.DeviceId
    }'
    AND Timestamp >= convert(datetime,'${dateFrom}')
    and Timestamp <= convert(datetime,'${dateTo}')
GROUP BY 
    timestamp, DevId
		ORDER BY [Timestamp]`;
        console.log("airCompressorDataQuery", airCompressorDataQuery);

        const airCompressorDataResponse = await ExecuteQuery(
          airCompressorDataQuery
        );
        const deviceDataArray = [];
        if (unit == "anomaly") {
          for (const data of airCompressorDataResponse) {
            // let anomalyValue = Math.random() < 0.03 ? 1 : 0; // ปิด random ค่า anomaly
            let anomalyValue = null;
            const dataObject = {
              time: data?.Timestamp,
              value: anomalyValue,
            };
            deviceDataArray.push(dataObject);
          }
        } else {
          for (const data of airCompressorDataResponse) {
            const dataObject = {
              time: data?.Timestamp,
              value: data?.value,
            };
            deviceDataArray.push(dataObject);
          }
        }

        const airCompressorDataObject = {
          id: device.DeviceId,
          name: device.DeviceName,
          data: deviceDataArray,
        };

        responseData.push(airCompressorDataObject);
      } else {
        const airCompressorDataObject = {
          id: device.DeviceId,
          name: device.DeviceName,
          data: [],
        };

        responseData.push(airCompressorDataObject);
      }
    }
  }
  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
