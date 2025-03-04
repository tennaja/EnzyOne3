import { name } from "dayjs/locale/th";
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
          Math.random() < 0.3
            ? null
            : numeral(Math.floor(Math.random() * 100 + 60)).format("0,0"),
        unit: "kW",
      },
      {
        name: "Chiller Efficiency",
        value:
          Math.random() < 0.3
            ? null
            : numeral(Math.random() * 0.3 + 0.7).format("0.00"),
        unit: "kW/ton",
      },
      {
        name: "AI Mode",
        value: Math.random() < 0.3 ? "on" : "off",
        unit: "",
      },
      {
        name: "Flow",
        value:
          Math.random() < 0.3
            ? null
            : numeral(Math.floor(Math.random() * 10000 + 10000)).format(
                "0,0.[00]"
              ),
        unit: "gal/min",
      },
      {
        name: "Chiller Supply Temperature",
        value:
          Math.random() < 0.3
            ? null
            : numeral(Math.floor(Math.random() * 3 + 40)).format("0,0.[00]"),
        unit: "°F",
      },
      {
        name: "Chiller Return Temperature",
        value:
          Math.random() < 0.3
            ? null
            : numeral(Math.floor(Math.random() * 4 + 60)).format("0,0.[00]"),
        unit: "°F",
      },
      {
        name: "Outdoor Temperature",
        value:
          Math.random() < 0.3
            ? null
            : numeral(Math.floor(Math.random() * 3 + 70)).format("0,0.[00]"),
        unit: "°F",
      },
      {
        name: "Humidity",
        value:
          Math.random() < 0.3
            ? null
            : numeral(Math.floor(Math.random() * 3 + 70)).format("0"),
        unit: "%",
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
          Math.random() < 0.3 ? null : Math.floor(Math.random() * 100 + 60),
        unit: "kW",
      },
      {
        name: "Energy Cost",
        value:
          Math.random() < 0.3
            ? null
            : Math.floor(Math.random() * 10000 + 10000),
        unit: "baht/month VS baseline",
      },
    ],
  };
  const id = params.buildingId;
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
