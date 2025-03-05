import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import numeral from "numeral";
import { SignJWT, jwtVerify } from "jose";

export function unique(array, key) {
  return [...new Set(array.map((item) => item[key]))];
}

export function pluck(array, key) {
  return array.map((i) => i[key]);
}

export function formatTimestampData(
  data,
  startDate = null,
  time = "1d",
  amount = 5,
  unit = "minute"
) {
  dayjs.extend(utc);

  var now = dayjs();
  if (startDate != null) {
    now = dayjs(startDate, ["YYYY-MM-DD", "YYYY/MM/DD"]);
  }
  let timeStart = 0;
  let timeStop = 0;

  switch (time) {
    case "1d":
      timeStart = now.set("hour", 0).set("minute", 0).set("second", 0);
      timeStop = now
        .add(1, "day")
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0);
      break;
  }

  let dateArray = [];
  let currentDate = dayjs(timeStart);
  let stopDate = dayjs(timeStop);
  while (currentDate < stopDate) {
    dateArray.push({
      date: currentDate.format("YYYY-MM-DD HH:mm:ss"),
      value: null,
    });
    currentDate = currentDate.add(amount, unit);
  }

  for (let i = 0; i < dateArray.length; i++) {
    const cursorDate = dateArray[i];

    let tempValue = null;
    for (let j = 0; j < data.length; j++) {
      const element = data[j];
      const tempDate = dayjs
        .utc(element.Timestamp)
        .format("YYYY-MM-DD HH:mm:ss");

      if (tempDate.includes(cursorDate.date)) {
        tempValue = element.value;
      }
    }
    dateArray[i].value =
      tempValue != null ? numeral(tempValue).format("0.[00]") : null;
  }
  return dateArray;

  var result = [];
  data.forEach((item) => {
    var date = dayjs.utc(item.Timestamp).format("YYYY-MM-DD HH:mm:ss");
    // var date = item.Timestamp;
    result.push({
      date: date,
      value: numeral(item.value).format("0,0.[00]"),
    });
  });
  return result;
}

export async function jwtGenerate(user, duration = "1h") {
  const iat = Math.floor(Date.now() / 1000);

  const accessToken = await new SignJWT({
    data: {
      username: user.username,
      name: user.name,
      email: user.email,
      user_group_id: user.user_group_id,
    },
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(iat)
    .setIssuer("ENZY-One")
    .setExpirationTime(duration)
    .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));

  return accessToken;
}

export async function jwtRefreshTokenGenerate(user) {
  const iat = Math.floor(Date.now() / 1000);
  const refreshToken = await new SignJWT({
    data: { username: user.username, user_group_id: user.user_group_id },
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(iat)
    .setIssuer("ENZY-One")
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));

  return refreshToken;
}

export async function validateToken(token) {
  console.log(token)
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)
    );

    // if its all good, return it, or perhaps just return a boolean

    return {
      status: true,
      message: "Ok",
    };
  } catch (error) {
    return {
      status: false,
      message: "Unauthorized",
    };
  }
}

export async function validateRefreshToken(token) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)
    );

    // if its all good, return it, or perhaps just return a boolean
    return {
      status: true,
      message: "Ok",
    };
  } catch (error) {
    return {
      status: false,
      message: "Unauthorized",
    };
  }
}

export const checkAuthorization = async (req) => {
  const accessToken = req.headers.get("authorization")?.split(" ")[1];

  if (!accessToken) {
    return {
      status: false,
      message: "Unauthorized",
    };
  } else {
    const result = await validateToken(accessToken);

    if (result.status != false)
      return {
        status: true,
        message: "Ok",
      };
    else {
      return {
        status: false,
        message: "Unauthorized",
      };
    }
  }
};
