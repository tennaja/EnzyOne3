import dayjs from "dayjs";
import { NextResponse } from "next/server";
import numeral from "numeral";
const deviceParameters = {
  1: {
    id: 1,
    deviceTypeId: 1,
    deviceTypeName: "hvac_split_type",
    field: "roomTemp",
    name: "Room Temp",
    unit: "°C",
    isShow: true,
  },
  2: {
    id: 2,
    deviceTypeId: 1,
    deviceTypeName: "hvac_split_type",
    field: "humidity",
    name: "Humidity",
    unit: "%",
    isShow: true,
  },
  3: {
    id: 3,
    deviceTypeId: 1,
    deviceTypeName: "hvac_split_type",
    field: "setTemp",
    name: "Set Temp",
    unit: "°C",
    isShow: true,
  },
  4: {
    id: 4,
    deviceTypeId: 1,
    deviceTypeName: "hvac_split_type",
    field: "control",
    name: "Control",
    unit: "",
    isShow: true,
  },
  5: {
    id: 5,
    deviceTypeId: 1,
    deviceTypeName: "hvac_split_type",
    field: "fan",
    name: "Fan Speed",
    unit: "",
    isShow: true,
  },
  6: {
    id: 6,
    deviceTypeId: 1,
    deviceTypeName: "hvac_split_type",
    field: "mode",
    name: "Mode",
    unit: "",
    isShow: true,
  },
  7: {
    id: 7,
    deviceTypeId: 2,
    deviceTypeName: "hvac_ahu",
    field: "supplyTemp",
    name: "Supply Temp",
    unit: "°C",
    isShow: true,
  },
  8: {
    id: 8,
    deviceTypeId: 2,
    deviceTypeName: "hvac_ahu",
    field: "supplyTempSetPoint",
    name: "Supply Temp Setpoint",
    unit: "°C",
    isShow: true,
  },
  9: {
    id: 9,
    deviceTypeId: 2,
    deviceTypeName: "hvac_ahu",
    field: "returnTemp",
    name: "Return Temp",
    unit: "°C",
    isShow: true,
  },
  10: {
    id: 10,
    deviceTypeId: 2,
    deviceTypeName: "hvac_ahu",
    field: "vsdDrive",
    name: "VSD %Drive",
    unit: "Hz",
    isShow: true,
  },
  11: {
    id: 11,
    deviceTypeId: 2,
    deviceTypeName: "hvac_ahu",
    field: "vsdPower",
    name: "VSD Power",
    unit: "kW",
    isShow: true,
  },
  12: {
    id: 12,
    deviceTypeId: 2,
    deviceTypeName: "hvac_ahu",
    field: "controlValve",
    name: "Control Valve",
    unit: "%",
    isShow: true,
  },
  13: {
    id: 13,
    deviceTypeId: 3,
    deviceTypeName: "hvac_vav",
    field: "temp",
    name: "Temp",
    unit: "°C",
    isShow: true,
  },
  14: {
    id: 14,
    deviceTypeId: 3,
    deviceTypeName: "hvac_vav",
    field: "airFlow",
    name: "Air Flow",
    unit: "CFM",
    isShow: true,
  },
  15: {
    id: 15,
    deviceTypeId: 3,
    deviceTypeName: "hvac_vav",
    field: "damper",
    name: "Damper",
    unit: "%",
    isShow: true,
  },
  16: {
    id: 16,
    deviceTypeId: 4,
    deviceTypeName: "hvac_iot",
    field: "temp",
    name: "Temp",
    unit: "°C",
    isShow: true,
  },
  17: {
    id: 17,
    deviceTypeId: 4,
    deviceTypeName: "hvac_iot",
    field: "humidity",
    name: "Humidity",
    unit: "%",
    isShow: true,
  },
  18: {
    id: 18,
    deviceTypeId: 4,
    deviceTypeName: "hvac_iot",
    field: "co2",
    name: "CO2",
    unit: "ppm",
    isShow: true,
  },
  19: {
    id: 19,
    deviceTypeId: 5,
    deviceTypeName: "iot_indoor_temp_humid",
    field: "roomTemp",
    name: "Room Temp",
    unit: "°C",
    isShow: true,
  },
  20: {
    id: 20,
    deviceTypeId: 5,
    deviceTypeName: "iot_indoor_temp_humid",
    field: "humidity",
    name: "Humidity",
    unit: "%",
    isShow: true,
  },
  21: {
    id: 21,
    deviceTypeId: 6,
    deviceTypeName: "iot_outdoor_temp_humid",
    field: "temp",
    name: "Temp",
    unit: "°C",
    isShow: true,
  },
  22: {
    id: 22,
    deviceTypeId: 6,
    deviceTypeName: "iot_outdoor_temp_humid",
    field: "humidity",
    name: "Humidity",
    unit: "%",
    isShow: true,
  },
  23: {
    id: 23,
    deviceTypeId: 7,
    deviceTypeName: "iot_pressure_gauge",
    field: "pressure",
    name: "Pressure",
    unit: "bar",
    isShow: true,
  },
  24: {
    id: 24,
    deviceTypeId: 8,
    deviceTypeName: "iot_power_meter",
    field: "power",
    name: "Power",
    unit: "kW",
    isShow: true,
  },
  25: {
    id: 25,
    deviceTypeId: 8,
    deviceTypeName: "iot_power_meter",
    field: "current",
    name: "Current",
    unit: "A",
    isShow: true,
  },
  26: {
    id: 26,
    deviceTypeId: 8,
    deviceTypeName: "iot_power_meter",
    field: "volt",
    name: "Volt",
    unit: "V",
    isShow: true,
  },
  27: {
    id: 27,
    deviceTypeId: 8,
    deviceTypeName: "iot_power_meter",
    field: "energy_import",
    name: "Energy import",
    unit: "kWh",
    isShow: true,
  },
  28: {
    id: 28,
    deviceTypeId: 8,
    deviceTypeName: "iot_power_meter",
    field: "energy_export",
    name: "Energy export",
    unit: "kWh",
    isShow: true,
  },
  29: {
    id: 29,
    deviceTypeId: 9,
    deviceTypeName: "iot_inverter",
    field: "power",
    name: "Power",
    unit: "kW",
    isShow: true,
  },
  30: {
    id: 30,
    deviceTypeId: 9,
    deviceTypeName: "iot_inverter",
    field: "current",
    name: "Current",
    unit: "A",
    isShow: true,
  },
  31: {
    id: 31,
    deviceTypeId: 9,
    deviceTypeName: "iot_inverter",
    field: "volt",
    name: "Volt",
    unit: "V",
    isShow: true,
  },
  32: {
    id: 32,
    deviceTypeId: 9,
    deviceTypeName: "iot_inverter",
    field: "energy",
    name: "Energy",
    unit: "kWh",
    isShow: true,
  },
  33: {
    id: 33,
    deviceTypeId: 10,
    deviceTypeName: "iot_flow_meter",
    field: "flow",
    name: "Flow",
    unit: "gal/min",
    isShow: true,
  },
  34: {
    id: 34,
    deviceTypeId: 11,
    deviceTypeName: "iot_motion_sensor",
    field: "detect",
    name: "Detected",
    unit: "",
    isShow: true,
  },
  35: {
    id: 35,
    deviceTypeId: 12,
    deviceTypeName: "iot_lighting",
    field: "status",
    name: "Status",
    unit: "",
    isShow: true,
  },
  36: {
    id: 36,
    deviceTypeId: 13,
    deviceTypeName: "iot_counter",
    field: "piece",
    name: "Pieces",
    unit: "ea",
    isShow: true,
  },
  37: {
    id: 37,
    deviceTypeId: 14,
    deviceTypeName: "iot_smart_ir",
    field: "setTemp",
    name: "Set Temp",
    unit: "°C",
    isShow: true,
  },
  41: {
    id: 41,
    deviceTypeId: 15,
    deviceTypeName: "iot_efficiency",
    field: "efficiency",
    name: "Efficiency",
    unit: "%",
    isShow: true,
  },
  42: {
    id: 42,
    deviceTypeId: 17,
    deviceTypeName: "iot_co2_sensor",
    field: "co2",
    name: "CO2",
    unit: "ppm",
    isShow: true,
  },
  43: {
    id: 43,
    deviceTypeId: 18,
    deviceTypeName: "iot_water_meter",
    field: "flow",
    name: "Flow",
    unit: "m3/min",
    isShow: true,
  },
  44: {
    id: 44,
    deviceTypeId: 19,
    deviceTypeName: "iot_heater",
    field: "temp",
    name: "Temp",
    unit: "°C",
    isShow: true,
  },
  45: {
    id: 45,
    deviceTypeId: 19,
    deviceTypeName: "iot_heater",
    field: "power",
    name: "Power",
    unit: "kW",
    isShow: true,
  },
  47: {
    id: 47,
    deviceTypeId: 19,
    deviceTypeName: "iot_heater",
    field: "waste",
    name: "Waste",
    unit: "ea",
    isShow: true,
  },
  48: {
    id: 48,
    deviceTypeId: 19,
    deviceTypeName: "iot_heater",
    field: "counter",
    name: "Counter",
    unit: "ea",
    isShow: true,
  },
  49: {
    id: 49,
    deviceTypeId: 19,
    deviceTypeName: "iot_heater",
    field: "control",
    name: "Control",
    unit: "",
    isShow: true,
  },
  50: {
    id: 50,
    deviceTypeId: 20,
    deviceTypeName: "iot_heater_water",
    field: "temp",
    name: "Temp",
    unit: "°F",
    isShow: true,
  },
};

const deviceListByFloorId = {
  1: {
    5: [
      {
        devId: "tmp01",
        deviceName: "ห้องโถงกลาง",
      },
      {
        devId: "tmp02",
        deviceName: "ห้อง AHU",
      },
    ],
    6: [
      {
        devId: "out_tmp01",
        deviceName: "ประตูทางเข้า 1",
      },
      {
        devId: "out_tmp02",
        deviceName: "ประตูทางเข้า 2",
      },
    ],
    7: [
      {
        devId: "pressure01",
        deviceName: "Gauge 1",
      },
      {
        devId: "pressure02",
        deviceName: "Gauge 2",
      },
    ],
    8: [
      {
        devId: "power_meter01",
        deviceName: "MDB 1",
      },
      {
        devId: "power_meter02",
        deviceName: "MDB 2",
      },
    ],
    9: [
      {
        devId: "inv01",
        deviceName: "Inverter 1",
      },
      {
        devId: "inv02",
        deviceName: "Inverter 2",
      },
    ],
    10: [
      {
        devId: "flow_meter01",
        deviceName: "Flow Meter 1",
      },
      {
        devId: "flow_meter02",
        deviceName: "Flow Meter 2",
      },
    ],
    11: [
      {
        devId: "motion_sensor01",
        deviceName: "Motion Sensor 1",
      },
      {
        devId: "motion_sensor02",
        deviceName: "Motion Sensor 2",
      },
    ],
    12: [
      {
        devId: "lighting01",
        deviceName: "ไฟห้องโถงกลาง",
      },
      {
        devId: "lighting02",
        deviceName: "ไฟห้องทำงาน 1",
      },
      {
        devId: "lighting03",
        deviceName: "ไฟห้องผู้ช่วย",
      },
    ],
    13: [
      {
        devId: "counter01",
        deviceName: "Counter 1",
      },
      {
        devId: "counter02",
        deviceName: "Counter 2",
      },
    ],
    14: [
      {
        devId: "smart_ir01",
        deviceName: "Smart IR 1",
      },
      {
        devId: "smart_ir02",
        deviceName: "Smart IR 2",
      },
      {
        devId: "smart_ir03",
        deviceName: "Smart IR 3",
      },
    ],
    15: [
      {
        devId: "efficiency01",
        deviceName: "Efficiency 1",
      },
      {
        devId: "efficiency02",
        deviceName: "Efficiency 2",
      },
    ],
    16: [
      {
        devId: "cctv01",
        deviceName: "CCTV 1",
      },
      {
        devId: "cctv02",
        deviceName: "CCTV 2",
      },
    ],
    17: [
      {
        devId: "co2_sensor01",
        deviceName: "CO2 Sensor 1",
      },
      {
        devId: "co2_sensor02",
        deviceName: "CO2 Sensor 2",
      },
    ],
    18: [
      {
        devId: "water_meter01",
        deviceName: "Water Meter 1",
      },
      {
        devId: "water_meter02",
        deviceName: "Water Meter 2",
      },
    ],
    19: [
      {
        devId: "heater01",
        deviceName: "Heater 1",
      },
      {
        devId: "heater02",
        deviceName: "Heater 2",
      },
      {
        devId: "heater03",
        deviceName: "Heater 3",
      },
    ],
    20: [
      {
        devId: "heater_water01",
        deviceName: "Heater Water 1",
      },
      {
        devId: "heater_water02",
        deviceName: "Heater Water 2",
      },
    ],
  },
  2: {
    5: [
      {
        devId: "tmp01",
        deviceName: "ห้องโถงกลาง",
      },
      {
        devId: "tmp02",
        deviceName: "ห้อง AHU",
      },
    ],
    6: [
      {
        devId: "out_tmp01",
        deviceName: "ประตูทางเข้า 1",
      },
      {
        devId: "out_tmp02",
        deviceName: "ประตูทางเข้า 2",
      },
    ],
    7: [
      {
        devId: "pressure01",
        deviceName: "Gauge 1",
      },
      {
        devId: "pressure02",
        deviceName: "Gauge 2",
      },
    ],
    8: [
      {
        devId: "power_meter01",
        deviceName: "MDB 1",
      },
      {
        devId: "power_meter02",
        deviceName: "MDB 2",
      },
    ],
    9: [
      {
        devId: "inv01",
        deviceName: "Inverter 1",
      },
      {
        devId: "inv02",
        deviceName: "Inverter 2",
      },
    ],
    10: [
      {
        devId: "flow_meter01",
        deviceName: "Flow Meter 1",
      },
      {
        devId: "flow_meter02",
        deviceName: "Flow Meter 2",
      },
    ],
    11: [
      {
        devId: "motion_sensor01",
        deviceName: "Motion Sensor 1",
      },
      {
        devId: "motion_sensor02",
        deviceName: "Motion Sensor 2",
      },
    ],
    12: [
      {
        devId: "lighting01",
        deviceName: "ไฟห้องโถงกลาง",
      },
      {
        devId: "lighting02",
        deviceName: "ไฟห้องทำงาน 1",
      },
      {
        devId: "lighting03",
        deviceName: "ไฟห้องผู้ช่วย",
      },
    ],
    13: [
      {
        devId: "counter01",
        deviceName: "Counter 1",
      },
      {
        devId: "counter02",
        deviceName: "Counter 2",
      },
    ],
    14: [
      {
        devId: "smart_ir01",
        deviceName: "Smart IR 1",
      },
      {
        devId: "smart_ir02",
        deviceName: "Smart IR 2",
      },
      {
        devId: "smart_ir03",
        deviceName: "Smart IR 3",
      },
    ],
    15: [
      {
        devId: "efficiency01",
        deviceName: "Efficiency 1",
      },
      {
        devId: "efficiency02",
        deviceName: "Efficiency 2",
      },
    ],
    16: [
      {
        devId: "cctv01",
        deviceName: "CCTV 1",
      },
      {
        devId: "cctv02",
        deviceName: "CCTV 2",
      },
    ],
    17: [
      {
        devId: "co2_sensor01",
        deviceName: "CO2 Sensor 1",
      },
      {
        devId: "co2_sensor02",
        deviceName: "CO2 Sensor 2",
      },
    ],
    18: [
      {
        devId: "water_meter01",
        deviceName: "Water Meter 1",
      },
      {
        devId: "water_meter02",
        deviceName: "Water Meter 2",
      },
    ],
    19: [
      {
        devId: "heater01",
        deviceName: "Heater 1",
      },
      {
        devId: "heater02",
        deviceName: "Heater 2",
      },
      {
        devId: "heater03",
        deviceName: "Heater 3",
      },
    ],
    20: [
      {
        devId: "heater_water01",
        deviceName: "Heater Water 1",
      },
      {
        devId: "heater_water02",
        deviceName: "Heater Water 2",
      },
    ],
  },
};
export async function GET(request, { params }) {
  const deviceParameterId = params.deviceParameterId;
  const { searchParams } = new URL(request.url);
  let floorId = searchParams.get("floorId") ?? 1;
  let dateFrom = searchParams.get("dateFrom") ?? dayjs().format("YYYY-MM-DD");
  let dateTo = searchParams.get("dateTo") ?? dayjs().format("YYYY-MM-DD");

  if (deviceParameterId == null) {
    return NextResponse.json({ message: "invalid parameter id" });
  }

  const unit = deviceParameters[deviceParameterId]?.unit ?? null;
  const deviceTypeId =
    deviceParameters[deviceParameterId]?.deviceTypeId ?? null;

  const deviceListByType = deviceListByFloorId[floorId]?.[deviceTypeId] ?? [];

  if (unit === null) {
    return NextResponse.json({ message: "this parameter does not have data." });
  }
  if (dateFrom == dateTo) {
    dateTo = dayjs(dateTo).add(1, "day").format("YYYY-MM-DD");
  }

  let deviceDataArray = [];

  let energy = Math.random() * 100000;

  for (const deviceList of deviceListByType) {
    const devId = deviceList.devId;
    const deviceName = deviceList.deviceName;
    let responseArray = [];
    for (
      let index = dayjs(dateFrom).valueOf();
      index < dayjs(dateTo).valueOf();
      index += 60000
    ) {
      let value = 0;

      if (unit === "°C") {
        value = numeral(numeral(Math.random() * 5 + 21).format("0.00")).value();
      } else if (unit === "°F") {
        value = numeral(
          numeral(Math.random() * 20 + 86).format("0.00")
        ).value();
      } else if (unit === "%") {
        value = numeral(numeral(Math.random() * 10 + 55).format("0")).value();
      } else if (unit === "bar") {
        value = numeral(
          numeral(Math.random() * 0.7 + 5).format("0.00")
        ).value();
      } else if (unit === "kW") {
        value = numeral(
          numeral(Math.random() * 1 + 0.7).format("0.00")
        ).value();
      } else if (unit === "A") {
        value = numeral(numeral(Math.random() * 10 + 1).format("0.00")).value();
      } else if (unit === "V") {
        value = numeral(numeral(Math.random() * 20 + 210).format("0")).value();
      } else if (unit === "kWh") {
        energy += Math.random() * 2.3;
        value = numeral(numeral(energy).format("0,0")).value();
      } else if (unit === "gal/min") {
        value = numeral(numeral(Math.random() * 3 + 10).format("0.00")).value();
      } else if (unit === "ea") {
        value = numeral(numeral(Math.random() * 4).format("0")).value();
      } else if (unit === "ppm") {
        value = numeral(numeral(Math.random() * 3 + 8).format("0.00")).value();
      } else if (unit === "m3/min") {
        value = numeral(numeral(Math.random() * 3 + 10).format("0.00")).value();
      } else if (unit === "") {
        value = numeral(numeral(Math.random() * 1).format("0")).value();
      }

      const dataObject = {
        time: dayjs(index).format("YYYY-MM-DD HH:mm"),
        value: value,
      };

      responseArray.push(dataObject);
    }

    const deviceObject = {
      devId: devId,
      label: deviceName,
      data: responseArray,
    };
    deviceDataArray.push(deviceObject);
  }

  const responseData = {
    field: deviceParameters[deviceParameterId].field,
    name: deviceParameters[deviceParameterId].name,
    unit: deviceParameters[deviceParameterId].unit,
    data: deviceDataArray,
  };
  if (responseData) {
    return NextResponse.json(responseData);
  }
  return NextResponse.json({ message: "no data" });
}
