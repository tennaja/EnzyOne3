import ExecuteQuery from "@/utils/db";
import { NextResponse } from "next/server";

const floorData = {
  1: {
    id: 1,
    name: "ชั้น 1 อาคาร ท.100",
    imageUrl: "https://enzy.egat.co.th/images/floor.png",
    deviceType: [
      { id: 0, name: "all", displayName: "All Type" },
      {
        id: 1,
        name: "hvac_split_type",
        displayName: "Split Type",
      },
      {
        id: 2,
        name: "hvac_ahu",
        displayName: "AHU",
      },
      {
        id: 3,
        name: "hvac_vav",
        displayName: "VAV",
      },
      {
        id: 4,
        name: "hvac_iot",
        displayName: "IoT",
      },
    ],
  },
  2: {
    id: 2,
    name: "ชั้น 2 อาคาร ท.100",
    imageUrl: "https://enzy.egat.co.th/images/floor.png",
    deviceType: [
      { id: 0, name: "all", displayName: "All Type" },
      {
        id: 1,
        name: "hvac_split_type",
        displayName: "Split Type",
      },
      {
        id: 2,
        name: "hvac_ahu",
        displayName: "AHU",
      },
      {
        id: 3,
        name: "hvac_vav",
        displayName: "VAV",
      },
      {
        id: 4,
        name: "hvac_iot",
        displayName: "IoT",
      },
    ],
  },
};
export async function GET(request, { params }) {
  const id = params.floorId;
  // const responseData = floorData[id];

  const responseData = [];
  const sql = `SELECT
	Floor.Id,
	Floor.Name,
  Building.Name as BuildingName,
	Device.DeviceTypeId
FROM
	Floor
  JOIN Building ON Building.Id = Floor.BuildingId
	JOIN Device ON Floor.Id = Device.FloorId 
WHERE
	Floor.Id = ${id}
	AND DeviceTypeId LIKE '%hvac%' `;

  const response = await ExecuteQuery(sql);

  if (response.length > 0) {
    let deviceTypeArray = [];
    let count = 1;
    for (const deviceType of response) {
      const deviceTypeId = deviceType.DeviceTypeId;
      if (deviceTypeId.includes("split_type")) {
        deviceTypeArray.push({
          id: count,
          name: deviceTypeId,
          displayName: "Split Type",
        });
      } else if (deviceTypeId.includes("ahu")) {
        deviceTypeArray.push({
          id: count,
          name: deviceTypeId,
          displayName: "AHU",
        });
      } else if (deviceTypeId.includes("vav")) {
        deviceTypeArray.push({
          id: count,
          name: deviceTypeId,
          displayName: "VAV",
        });
      } else if (deviceTypeId.includes("iot")) {
        deviceTypeArray.push({
          id: count,
          name: deviceTypeId,
          displayName: "IoT",
        });
      }

      count++;
    }

    // mock ข้อมูลสำหรับ ahu, vav
    if (id == 16 || id == 17) {
      deviceTypeArray.push({
        id: count,
        name: "hvac_ahu",
        displayName: "AHU",
      });
      deviceTypeArray.push({
        id: count + 1,
        name: "hvac_vav",
        displayName: "VAV",
      });
    }

    deviceTypeArray = deviceTypeArray.filter(
      (v, i, a) => a.findIndex((t) => t.displayName === v.displayName) === i
    );

    const responseDataObject = {
      id: response[0].Id,
      name: `Building: ${response[0].BuildingName} Floor: ${response[0].Name}`,
      imageUrl: "https://enzy.egat.co.th/images/floor.png",
      deviceType: deviceTypeArray,
    };
    responseData.push(responseDataObject);
  }

  if (responseData) {
    return NextResponse.json(responseData);
  }
  // return NextResponse.json({ message: "no data" });
  return NextResponse.json([]);
}
