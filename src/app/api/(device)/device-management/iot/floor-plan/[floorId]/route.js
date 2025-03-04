import { NextResponse } from "next/server";

const floorData = {
  1: {
    id: 1,
    name: "Building: โรงงาน 1 Floor: ชั้น 1",
    imageUrl: "https://enzy.egat.co.th/images/floor.png",
    deviceType: [
      { id: 0, name: "all", displayName: "All Type" },
      {
        id: 5,
        name: "iot_indoor_temp_humid",
        displayName: "Indoor Temp & Humid",
      },
      {
        id: 6,
        name: "iot_outdoor_temp_humid",
        displayName: "Outdoor Temp & Humid",
      },
      {
        id: 7,
        name: "iot_pressure_gauge",
        displayName: "Pressure Gauge",
      },
      {
        id: 8,
        name: "iot_power_meter",
        displayName: "Power Meter",
      },
      {
        id: 9,
        name: "iot_inverter",
        displayName: "Inverter",
      },
      {
        id: 10,
        name: "iot_flow_meter",
        displayName: "Flow Meter",
      },
      {
        id: 11,
        name: "iot_motion_sensor",
        displayName: "Motion Sensor",
      },
      {
        id: 12,
        name: "iot_lighting",
        displayName: "Lighting",
      },
      {
        id: 13,
        name: "iot_counter",
        displayName: "Counter",
      },
      {
        id: 14,
        name: "iot_smart_ir",
        displayName: "Smart IR",
      },
      {
        id: 15,
        name: "iot_efficiency",
        displayName: "Efficiency",
      },
      {
        id: 16,
        name: "iot_cctv",
        displayName: "CCTV",
      },
      {
        id: 17,
        name: "iot_co2_sensor",
        displayName: "CO2 Sensor",
      },
      {
        id: 18,
        name: "iot_water_meter",
        displayName: "Water Meter",
      },
      {
        id: 19,
        name: "iot_heater",
        displayName: "Heater",
      },
      {
        id: 20,
        name: "iot_heater_water",
        displayName: "Heater Water",
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
        id: 5,
        name: "iot_indoor_temp_humid",
        displayName: "Indoor Temp & Humid",
      },
      {
        id: 6,
        name: "iot_outdoor_temp_humid",
        displayName: "Outdoor Temp & Humid",
      },
      {
        id: 8,
        name: "iot_power_meter",
        displayName: "Power Meter",
      },
      {
        id: 20,
        name: "iot_heater_water",
        displayName: "Heater Water",
      },
    ],
  },
};
export async function GET(request, { params }) {
  const id = params.floorId;
  const responseData = floorData[id];

  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
