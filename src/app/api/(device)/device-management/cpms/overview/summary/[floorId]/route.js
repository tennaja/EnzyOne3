import { NextResponse } from "next/server";
import numeral from "numeral";

export async function GET(request, { params }) {
  const summaryData = {
    1: [
      {
        name: "Efficiency",
        value: random(["Low", "Medium", "High", null]),
        unit: "",
      },
      {
        name: "Power Consumption",
        value:
          Math.random() < 0.4
            ? null
            : numeral(Math.random() * 100 + 60).format("0,0.00"),
        unit: "kW",
      },
      {
        name: "Energy Cost",
        value:
          Math.random() < 0.4
            ? null
            : numeral(Math.random() * 10000 + 10000).format("0,0.00"),
        unit: "baht/month VS baseline",
      },
    ],
    2: [
      {
        name: "Efficiency",
        value: random(["Low", "Medium", "High"]),
        unit: "",
      },
      {
        name: "Power Consumption",
        value:
          Math.random() < 0.4
            ? null
            : numeral(Math.random() * 100 + 60).format("0,0.00"),
        unit: "kW",
      },
      {
        name: "Energy Cost",
        value:
          Math.random() < 0.4
            ? null
            : numeral(Math.random() * 10000 + 10000).format("0,0.00"),
        unit: "baht/month VS baseline",
      },
    ],
  };
  const id = params.floorId;
  const responseData = summaryData[id];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  // return NextResponse.json({ message: "no data" });
  return NextResponse.json([]);
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
