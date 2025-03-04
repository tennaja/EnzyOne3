import { data } from "autoprefixer";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const ahuData = {
    16: {
      data: [
        {
          id: 1,
          devId: "ahu01",
          deviceName: "AHU 01",
        },
        {
          id: 2,
          devId: "ahu02",
          deviceName: "AHU 02",
        },
        {
          id: 3,
          devId: "ahu03",
          deviceName: "AHU 03",
        },
      ],
    },
    17: {
      data: [
        {
          id: 4,
          devId: "ahu04",
          deviceName: "AHU 04",
        },
        {
          id: 5,
          devId: "ahu05",
          deviceName: "AHU 05",
        },
      ],
    },
  };

  const { searchParams } = new URL(request.url);
  const floorId = searchParams.get("floorId") ?? 1;
  let dateFrom = searchParams.get("dateFrom") ?? dayjs().format("YYYY-MM-DD");
  let dateTo = searchParams.get("dateTo") ?? dayjs().format("YYYY-MM-DD");

  if (dateFrom == dateTo) {
    dateTo = dayjs(dateTo).add(1, "day").format("YYYY-MM-DD");
  }

  const ahuDataList = ahuData[floorId].data;

  let controlValveResponseArray = [];
  let supplyTempResponseArray = [];
  let returnTempResponseArray = [];
  for (const device of ahuDataList) {
    let controlValveArray = [];
    let supplyTempArray = [];
    let returnTempArray = [];
    if (device.devId === "ahu01") {
      for (
        let index = dayjs(dateFrom).valueOf();
        index < dayjs(dateTo).valueOf();
        index += 60000
      ) {
        const dataObject = {
          time: dayjs(index).format("YYYY-MM-DD HH:mm"),
          value: numeral(
            numeral(Math.random() * 10 + 49).format("0.00")
          ).value(),
        };
        controlValveArray.push(dataObject);

        const supplyTempDataObject = {
          time: dayjs(index).format("YYYY-MM-DD HH:mm"),
          value: numeral(
            numeral(Math.random() * 3 + 15).format("0.00")
          ).value(),
        };
        supplyTempArray.push(supplyTempDataObject);

        const returnTempDataObject = {
          time: dayjs(index).format("YYYY-MM-DD HH:mm"),
          value: numeral(
            numeral(Math.random() * 3 + 17).format("0.00")
          ).value(),
        };
        returnTempArray.push(returnTempDataObject);
      }
    } else {
      for (
        let index = dayjs(dateFrom).valueOf();
        index < dayjs(dateTo).valueOf();
        index += 60000
      ) {
        const dataObject = {
          time: dayjs(index).format("YYYY-MM-DD HH:mm"),
          value: 0,
        };
        controlValveArray.push(dataObject);

        const supplyTempDataObject = {
          time: dayjs(index).format("YYYY-MM-DD HH:mm"),
          value: 0,
        };
        supplyTempArray.push(supplyTempDataObject);

        const returnTempDataObject = {
          time: dayjs(index).format("YYYY-MM-DD HH:mm"),
          value: 0,
        };
        returnTempArray.push(returnTempDataObject);
      }
    }
    let controlValveDataObject = {
      id: device.id,
      devId: device.devId,
      deviceName: device.deviceName,
      data: controlValveArray,
    };
    controlValveResponseArray.push(controlValveDataObject);

    let supplyTempDataObject = {
      id: device.id,
      devId: device.devId,
      deviceName: device.deviceName,
      data: supplyTempArray,
    };
    supplyTempResponseArray.push(supplyTempDataObject);

    let returnTempDataObject = {
      id: device.id,
      devId: device.devId,
      deviceName: device.deviceName,
      data: returnTempArray,
    };
    returnTempResponseArray.push(returnTempDataObject);
  }

  const responseData = {
    controlValve: controlValveResponseArray,
    supplyTemp: supplyTempResponseArray,
    returnTemp: returnTempResponseArray,
  };

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
