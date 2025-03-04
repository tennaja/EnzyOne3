import ExecuteQuery from "@/utils/db";
import axios from "axios";
import { NextResponse } from "next/server";
import numeral from "numeral";
// import { checkUserModuleControlPermission } from "@/utils/function";
export async function GET() {}
export async function POST(request) {
  const { devId, value } = await request.json();

  const validCommand = [
    "auto",
    "low",
    "medium",
    "high",
    0,
    1,
    2,
    3,
    4,
    5,
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
  ];
  if (!validCommand.includes(value))
    return NextResponse.json(
      {
        title: "Something went wrong",
        message:
          "We aren't able to process your requested operation. Please try again.",
      },
      { status: 500 }
    );
  try {
    const siteQuery = `SELECT
    ApiBranchMapping.BranchId ,
    ApiBranchMapping.BranchMappingName ,
    Device.DeviceTypeId 
  FROM
    ApiBranchMapping
    JOIN Area ON ApiBranchMapping.BranchId = Area.BranchId
    JOIN AreaBuildingMapping ON Area.Id = AreaBuildingMapping.AreaId
    JOIN Building ON Building.Id = AreaBuildingMapping.BuildingId
    JOIN Floor ON Floor.BuildingId = Building.Id
    JOIN Device ON Device.FloorId = Floor.Id 
  WHERE
    Device.Id = '${devId}' `;

    const siteResponse = await ExecuteQuery(siteQuery);

    const siteId = siteResponse[0].BranchMappingName;
    const ir = "IR02";
    const power = "On";
    const mode = "Auto";
    let inputValue = null;
    if (value == "auto" || value == 0 || value == "0") inputValue = 0;
    else if (value == "low" || value == 1 || value == "1") inputValue = 1;
    else if (value == "medium" || value == 3 || value == "3") inputValue = 3;
    else if (value == "high" || value == 5 || value == "5") inputValue = 5;
    else inputValue = numeral(value).value();
    const fanSpeed = inputValue;
    const requestParams = {
      site: siteId,
      ir: ir,
      power: power,
      mode: mode,
      FanState: fanSpeed,
    };

    const response = await axios.post(
      `${process.env.SMARTENERGY_MQTT_API_URL}/api/SmartIR/control`,
      {},
      { params: requestParams }
    );
    if (response.status === 200) {
      return NextResponse.json({
        title: "Operation completed",
        message: "Your operation has been executed successfully",
        log: `set value to ${devId}: ${value}`,
      });
    } else {
      return NextResponse.json(
        {
          title: "Something went wrong",
          message:
            "We aren't able to process your requested operation (failed). Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ message: "not success" }, { status: 500 });
  }
}
