import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { getIrAPI } from "./ir-service";

const irId = [
  {
    id: "sm_ir001",
    position: { x: 300, y: 400 },
    labelPosition: { x: 10, y: 100 },
    connectorPosition: [
      { x: 75, y: 130 },
      { x: 305, y: 130 },
      { x: 305, y: 405 },
    ],
  },
  {
    id: "sm_ir002",
    position: { x: 380, y: 560 },
    labelPosition: { x: 270, y: 640 },
    connectorPosition: [
      { x: 335, y: 660 },
      { x: 385, y: 660 },
      { x: 385, y: 565 },
    ],
  },
  {
    id: "sm_ir003",
    position: { x: 530, y: 390 },
    labelPosition: { x: 450, y: 640 },
    connectorPosition: [
      { x: 480, y: 640 },
      { x: 480, y: 395 },
      { x: 535, y: 395 },
    ],
  },
  {
    id: "sm_ir004",
    position: { x: 640, y: 460 },
    labelPosition: { x: 950, y: 410 },
    connectorPosition: [
      { x: 645, y: 465 },
      { x: 645, y: 440 },
      { x: 950, y: 440 },
    ],
  },
  {
    id: "sm_ir005",
    position: { x: 700, y: 300 },
    labelPosition: { x: 950, y: 260 },
    connectorPosition: [
      { x: 705, y: 305 },
      { x: 830, y: 305 },
      { x: 830, y: 270 },
      { x: 950, y: 270 },
    ],
  },
  {
    id: "sm_ir006",
    position: { x: 520, y: 300 },
    labelPosition: { x: 500, y: 50 },
    connectorPosition: [
      { x: 525, y: 305 },

      { x: 525, y: 95 },
    ],
  },
  {
    id: "sm_ir007",
    position: { x: 550, y: 560 },
    labelPosition: { x: 540, y: 640 },
    connectorPosition: [
      { x: 555, y: 565 },
      { x: 555, y: 640 },
    ],
  },
];
export async function GET(request) {
  const responseData = [];
  for (const { id, position, labelPosition, connectorPosition } of irId) {
    const paramsTemp = { id: id, value: "temp" };
    try {
      const responseTemp = await getIrAPI(paramsTemp);
      const paramsHumid = { id: id, value: "rh" };
      const responseHumid = await getIrAPI(paramsHumid);

      const dataObject = {
        temp: responseTemp?.value,
        rh: responseHumid?.value,
      };
      const responseObject = {
        ir_id: id,
        data: dataObject,
        position: position,
        labelPosition: labelPosition,
        connectorPosition: connectorPosition,
      };
      responseData.push(responseObject);
    } catch (error) {}
  }

  return NextResponse.json(responseData);
}
