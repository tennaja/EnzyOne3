import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { getVavAPI } from "./vav-service";

const vavId = [
  {
    id: "VB_4_01",
    position: { x: 250, y: 310 },
    labelPosition: { x: 10, y: 220 },
    connectorPosition: [
      { x: 75, y: 255 },
      { x: 255, y: 255 },
      { x: 255, y: 315 },
    ],
  },
  {
    id: "VB_4_02",
    position: { x: 330, y: 340 },
    labelPosition: { x: 10, y: 295 },
    connectorPosition: [
      { x: 75, y: 330 },
      { x: 335, y: 330 },
      { x: 335, y: 345 },
    ],
  },
  {
    id: "VB_4_03",
    position: { x: 450, y: 340 },
    labelPosition: { x: 90, y: 345 },
    connectorPosition: [
      { x: 155, y: 390 },
      { x: 400, y: 390 },
      { x: 455, y: 345 },
    ],
  },
  {
    id: "VB_4_04",
    position: { x: 250, y: 410 },
    labelPosition: { x: 10, y: 370 },
    connectorPosition: [
      { x: 75, y: 415 },
      { x: 255, y: 415 },
    ],
  },
  {
    id: "VB_4_05",
    position: { x: 330, y: 440 },
    labelPosition: { x: 10, y: 440 },
    connectorPosition: [
      { x: 75, y: 445 },
      { x: 335, y: 445 },
    ],
  },
  {
    id: "VB_4_06",
    position: { x: 450, y: 440 },
    labelPosition: { x: 90, y: 455 },
    connectorPosition: [
      { x: 155, y: 465 },
      { x: 440, y: 465 },
      { x: 455, y: 445 },
    ],
  },
  {
    id: "VB_4_07",
    position: { x: 250, y: 510 },
    labelPosition: { x: 10, y: 510 },
    connectorPosition: [
      { x: 75, y: 515 },
      { x: 255, y: 515 },
    ],
  },
  {
    id: "VB_4_08",
    position: { x: 330, y: 540 },
    labelPosition: { x: 80, y: 540 },
    connectorPosition: [
      { x: 145, y: 545 },
      { x: 335, y: 545 },
    ],
  },
  {
    id: "VB_4_09",
    position: { x: 450, y: 550 },
    labelPosition: { x: 50, y: 600 },
    connectorPosition: [
      { x: 115, y: 600 },
      { x: 430, y: 600 },
      { x: 455, y: 555 },
    ],
  },
  {
    id: "VB_4_10",
    position: { x: 570, y: 550 },
    labelPosition: { x: 700, y: 600 },
    connectorPosition: [
      { x: 575, y: 555 },
      { x: 575, y: 600 },
      { x: 700, y: 600 },
    ],
  },
  {
    id: "VB_4_11",
    position: { x: 660, y: 550 },
    labelPosition: { x: 780, y: 565 },
    connectorPosition: [
      { x: 665, y: 555 },
      { x: 665, y: 565 },
      { x: 780, y: 565 },
    ],
  },
  {
    id: "VB_4_12",
    position: { x: 540, y: 510 },
    labelPosition: { x: 870, y: 515 },
    connectorPosition: [
      { x: 545, y: 515 },
      { x: 870, y: 515 },
    ],
  },
  {
    id: "VB_4_13",
    position: { x: 660, y: 410 },
    labelPosition: { x: 940, y: 470 },
    connectorPosition: [
      { x: 665, y: 415 },
      { x: 750, y: 470 },
      { x: 940, y: 470 },
    ],
  },
  {
    id: "VB_4_14",
    position: { x: 540, y: 340 },
    labelPosition: { x: 870, y: 360 },
    connectorPosition: [
      { x: 545, y: 345 },
      { x: 545, y: 390 },
      { x: 870, y: 390 },
    ],
  },
  {
    id: "VB_4_15",
    position: { x: 660, y: 310 },
    labelPosition: { x: 870, y: 290 },
    connectorPosition: [
      { x: 665, y: 315 },
      { x: 870, y: 315 },
    ],
  },
  {
    id: "VB_4_16",
    position: { x: 710, y: 190 },
    labelPosition: { x: 870, y: 100 },
    connectorPosition: [
      { x: 715, y: 195 },
      { x: 715, y: 130 },
      { x: 870, y: 130 },
    ],
  },
  {
    id: "VB_4_17",
    position: { x: 710, y: 280 },
    labelPosition: { x: 870, y: 210 },
    connectorPosition: [
      { x: 715, y: 285 },
      { x: 760, y: 230 },
      { x: 870, y: 230 },
    ],
  },
  {
    id: "VB_4_18",
    position: { x: 760, y: 200 },
    labelPosition: { x: 940, y: 150 },
    connectorPosition: [
      { x: 765, y: 205 },
      { x: 765, y: 190 },
      { x: 940, y: 190 },
    ],
  },
];
export async function GET(request) {
  const responseData = [];
  for (const { id, position, labelPosition, connectorPosition } of vavId) {
    const params = { id: id };
    try {
      const response = await getVavAPI(params);

      const responseObject = {
        vav_id: id,
        data: response,
        position: position,
        labelPosition: labelPosition,
        connectorPosition: connectorPosition,
      };
      responseData.push(responseObject);
    } catch (error) {}
  }

  return NextResponse.json(responseData);
}
