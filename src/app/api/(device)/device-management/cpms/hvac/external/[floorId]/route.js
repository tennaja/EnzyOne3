import { NextResponse } from "next/server";
import numeral from "numeral";
export async function GET(request, { params }) {
  const shouldReturnNull = Math.random() < 0.3 ? false : true;
  const externalData = {
    1: [
      {
        name: "Outside Temperature",
        value: 31,
        unit: "°C",
      },
      {
        name: "Wind",
        value: 7,
        unit: "km/h",
      },
      {
        name: "Humidity",
        value: 70,
        unit: "%",
      },
    ],
    2: [
      {
        name: "Outside Temperature",
        value: 32.1,
        unit: "°C",
      },
      {
        name: "Wind",
        value: 4,
        unit: "km/h",
      },
      {
        name: "Humidity",
        value: 67,
        unit: "%",
      },
    ],
    16: [
      {
        name: "Outside Temperature",
        value: shouldReturnNull
          ? numeral(Math.random() * 6 + 32).format("0.00")
          : "-",
        unit: "°C",
      },
      {
        name: "Wind",
        value: shouldReturnNull
          ? numeral(Math.random() * 2 + 4).format("0.00")
          : "-",
        unit: "km/h",
      },
      {
        name: "Humidity",
        value: shouldReturnNull
          ? numeral(Math.random() * 26 + 50).format("0.00")
          : "-",
        unit: "%",
      },
    ],
  };

  const id = params.floorId;
  const responseData = externalData[id];

  if (responseData) {
    return NextResponse.json(responseData);
  } else if (id >= 16 || id <= 116) {
    return NextResponse.json(externalData[16]);
  }
  // return NextResponse.json({ message: "no data" });
  return NextResponse.json([]);
}
