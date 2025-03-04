import ExecuteQuery from "@/utils/db";
import { jwtDecode } from "jwt-decode";
import { NextResponse, userAgent } from "next/server";
import bcrypt from "bcrypt";
import {
  checkUserModulePermission,
  saveActivityLog,
} from "../../../../utils/function";
import { sendMail } from "@/utils/mailService";
import dayjs from "dayjs";
import { logger } from "@/utils/logger";
import axios from "axios";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
/* 
dayjs.extend(utc);
dayjs.extend(timezone);

const timezoneName = "Asia/Bangkok";
dayjs.tz.setDefault(timezoneName); */
// import { checkUserModuleControlPermission } from "@/utils/function";
export async function GET() {}
export async function POST(request) {
  const { devId, username, password } = await request.json();
  const { ua: agent } = userAgent(request);

  const authorization = request.headers.get("Authorization");
  try {
    const token = authorization.replace("Bearer ", "");

    const decoded = jwtDecode(token);
    const tokenUsername = decoded?.data?.username;

    const sql = `SELECT Username,Password , Name, Email, UserGroupId FROM [User] WHERE Username = '${username}'`;

    const hashPassword = await ExecuteQuery(sql);
    // console.log("hashPassword", hashPassword);
    if (hashPassword.length > 0) {
      const result = await bcrypt.compare(password, hashPassword?.[0].Password);
      const userEmail = hashPassword?.[0]?.Email;
      const userAccountName = hashPassword?.[0]?.Name;
      if (result == true) {
        try {
          // #TODO ใส่เงื่อนไข user ที่ไม่มีสิทธิ์ในการ Control อุปกรณ์
          const moduleName = "AirCompressor";
          const checkPermission = await checkUserModulePermission(
            username,
            moduleName,
            3,
            1
          );
          console.log("checkPermission", checkPermission);
          if (checkPermission.status === "fail") {
            return NextResponse.json(
              {
                title: "Something went wrong",
                message:
                  "We aren't able to process your requested operation. Please try again.",
              },
              { status: 500 }
            );
          } else {
            if (checkPermission.permission === true) {
              // #TODO 1. Save access log by username
              const siteId = "s0001";
              await saveActivityLog(
                siteId,
                username,
                request.headers.get("X-Forwarded-For"),
                agent,
                request.nextUrl.pathname,
                "control device",
                `control air compressor device ${devId}`,
                "on"
              );
              // #TODO 2. Call API AirCompressor
              // get Control DevId, Field and Value from request devId
              const conDevIdQuery = `SELECT DeviceId, Field, Value FROM ControlDevice WHERE DeviceId = '${devId}'`;
              const conDevIdResponse = await ExecuteQuery(conDevIdQuery);
              if (conDevIdResponse.length <= 0) {
                // ไม่มีข้อมูล Control DevId, Field and ApiTarget
                return NextResponse.json(
                  {
                    title: "Something went wrong",
                    message:
                      "We aren't able to process your requested operation (No control devices). Please try again.",
                  },
                  { status: 500 }
                );
              } else {
                let controlBody = {};
                let controlApiTarget;
                for (const controlDevice of conDevIdResponse) {
                  if (controlDevice?.Field == "api_target") {
                    controlApiTarget = controlDevice?.Value;
                  } else {
                    controlBody = {
                      ...controlBody,
                      [controlDevice?.Field]: controlDevice?.Value,
                    };
                  }
                }

                const deviceStatusQuery = `SELECT TOP 1 Timestamp, DevId, MAX(CASE WHEN field = 'status' THEN value END) AS status FROM RawData WHERE DevId = '${devId}' GROUP BY timestamp, DevId ORDER BY [Timestamp] desc`;
                const deviceStatusResponse = await ExecuteQuery(
                  deviceStatusQuery
                );
                const timestamp = deviceStatusResponse?.[0]?.Timestamp;
                const status = deviceStatusResponse?.[0]?.status;

                const now = dayjs();
                const dataTimestamp = dayjs(timestamp);
                const differenceInMilliseconds = Math.abs(
                  now.diff(dataTimestamp)
                );

                console.log(
                  "dataTimestamp",
                  dataTimestamp.format("YYYY-MM-DD HH:mm:ss")
                );
                // Check if the difference is more than five minutes (300,000 milliseconds)
                const threshold = 5 * 60 * 1000; // 5 minutes in milliseconds

                // if cannot get status or last status is more than 5 minutes then return error

                // ติดปัญหาเช็คเวลาข้อมูล
                // if (status == null && differenceInMilliseconds > threshold) {
                if (status == null) {
                  return NextResponse.json(
                    {
                      title: "Something went wrong",
                      message:
                        "Cannot get last device status. Please try again",
                    },
                    { status: 500 }
                  );
                }

                // ถ้า controlField เป็น air_com ต้องเช็ค ady ด้วย (deviceId 78 และ 79)
                if (
                  controlBody?.type == "air_com" &&
                  (devId == 78 || devId == 79)
                ) {
                  let airDyerId;
                  if (devId == 78) airDyerId = 80;
                  else if (devId == 79) airDyerId = 81;
                  const airDyerStatusQuery = `SELECT TOP 1 Timestamp, DevId, MAX(CASE WHEN field = 'status' THEN value END) AS status FROM RawData WHERE DevId = '${airDyerId}' GROUP BY timestamp, DevId ORDER BY [Timestamp] desc`;
                  const airDyerStatusResponse = await ExecuteQuery(
                    airDyerStatusQuery
                  );
                  const timestamp = airDyerStatusResponse?.[0]?.Timestamp;
                  const now = dayjs();
                  const dataTimestamp = dayjs(timestamp);
                  const airDyerStatus = airDyerStatusResponse?.[0]?.status;
                  let deviceStatus;
                  const differenceInMilliseconds = Math.abs(
                    now.diff(dataTimestamp)
                  );
                  // Check if the difference is more than five minutes (300,000 milliseconds)
                  const threshold = 5 * 60 * 1000; // 5 minutes in milliseconds

                  if (airDyerStatus == null) deviceStatus = "Offline";
                  else {
                    // ติดปัญหาเช็คเวลาข้อมูล
                    /*  if (differenceInMilliseconds > threshold) {
                      return NextResponse.json(
                        {
                          title: "Something went wrong",
                          message: "Cannot get last device status.",
                        },
                        { status: 500 }
                      );
                    } else deviceStatus = airDyerStatus == 1 ? "On" : "Off"; */
                    deviceStatus = airDyerStatus == 1 ? "On" : "Off";
                  }

                  if (deviceStatus == "Offline" || deviceStatus == "Off") {
                    return NextResponse.json(
                      {
                        title: "Something went wrong",
                        message: "Please start Air Dyer first.",
                      },
                      { status: 500 }
                    );
                  }
                }

                // ส่งข้อมูลไป api sedp/api/control
                controlBody = {
                  ...controlBody,
                  ts: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                  command: "on",
                };

                console.log("controlBody", controlBody);

                // เช็ค config ว่าจะต้องส่ง control มั้ย
                if (process.env.CONFIG_CONTROL === "true") {
                  /* try {
                    logger.info(`Control : ${JSON.stringify(controlBody)}`);
                    const controlResponse = await fetch(controlApiTarget, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify(controlBody),
                    });
                    console.log("controlResponse", controlResponse);
                    logger.info(
                      `Control result: ${JSON.stringify(controlResponse)}`
                    );
                  } catch (error) {
                    logger.error(JSON.stringify(error));
                  } */

                  try {
                    logger.info(`Send control to url : ${controlApiTarget}`);
                    logger.info(`Control : ${JSON.stringify(controlBody)}`);
                    const controlResponse = await axios.post(
                      controlApiTarget,
                      controlBody
                    );
                    if (controlResponse.status !== 200) {
                      logger.error(
                        `failed : ${JSON.stringify(controlResponse)}`
                      );
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
                    logger.error(JSON.stringify(error));
                    return NextResponse.json(
                      {
                        title: "Something went wrong",
                        message:
                          "We aren't able to process your requested operation (failed). Please try again.",
                      },
                      { status: 500 }
                    );
                  }
                }
                // if (controlResponse) {
                // }

                // #TODO 3. Send email
                if (userEmail !== null) {
                  const emailMessage = `<p>Dear ${userAccountName}</p> <p>Your requested operation to turn on device has been successfully completed.</p>
                  <p>If this action wasn't initiated by you, please contact the admin promptly</p>
                  <p>Best regards,<br>ENZY Platform</p>`;
                  sendMail(
                    "Notification - Control device",
                    userEmail,
                    emailMessage
                  );
                }
                return NextResponse.json({
                  title: "Operation completed",
                  message:
                    "Your start operation has been executed successfully",
                });
              }
            } else {
              return NextResponse.json(
                {
                  title: "Something went wrong",
                  message:
                    "The user does not have the privilege to control this device.",
                },
                { status: 401 }
              );
            }
          }
        } catch (error) {
          return NextResponse.json(
            {
              title: "Something went wrong",
              message:
                "We aren't able to process your requested operation (failed). Please try again.",
            },
            { status: 500 }
          );
        }
      }
      // !! bcrypt.compare ไม่ผ่าน
      else {
        return NextResponse.json(
          {
            title: "Unauthorized",
            message: "Wrong username or password.",
          },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        {
          title: "Unauthorized",
          message: "Wrong username or password.",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { title: "Unauthorized", message: "can not get authorization." },
      { status: 400 }
    );
  }
}

/**
 * 
 *  // เจอข้อมูล
                const controlDevId = conDevIdResponse?.[0]?.DevId;
                const controlField = conDevIdResponse?.[0]?.Field;
                const controlApiTarget = conDevIdResponse?.[0]?.ApiTarget;

                // ถ้า controlField เป็น air_com ต้องเช็ค ady ด้วย (deviceId 78 และ 79)
                if (controlField == "air_com" && (devId == 78 || devId == 79)) {
                  let airDyerId;
                  if (devId == 78) airDyerId = 80;
                  else if (devId == 79) airDyerId = 81;
                  const airDyerStatusQuery = `SELECT TOP 1 Timestamp, DevId, MAX(CASE WHEN field = 'status' THEN value END) AS status FROM RawData WHERE DevId = '${airDyerId}' GROUP BY timestamp, DevId ORDER BY [Timestamp] desc`;
                  const airDyerStatusResponse = await ExecuteQuery(
                    airDyerStatusQuery
                  );
                  const timestamp = airDyerStatusResponse?.[0]?.Timestamp;
                  const now = dayjs();
                  const dataTimestamp = dayjs(timestamp);
                  const airDyerStatus = airDyerStatusResponse?.[0]?.status;
                  let deviceStatus;
                  if (airDyerStatus == null) deviceStatus = "Offline";
                  else {
                    if (now.diff(dataTimestamp, "minute") > 5)
                      deviceStatus = "Offline";
                    else deviceStatus = airDyerStatus == 1 ? "On" : "Off";
                  }

                  if (deviceStatus == "Offline" || deviceStatus == "Off") {
                    return NextResponse.json(
                      {
                        title: "Something went wrong",
                        message: "Please start Air Dyer first.",
                      },
                      { status: 500 }
                    );
                  }
                }
 */
