import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import {
  checkAuthorization,
  jwtGenerate,
  validateRefreshToken,
  validateToken,
} from "./utils/function";
import { jwtDecode } from "jwt-decode";
import { getUserByUsername } from "./utils/api";

class jwtPayload {
  data: any;
}

export async function middleware(request: NextRequest) {
  console.log("INSIDE >......................")
  const response = NextResponse.next();

  const pathName = request.nextUrl.pathname;

  if (pathName.startsWith("/api")) {
    // add the CORS headers to the response

    const allowedOrigins = [
      "http://localhost:3000",
      "https://enzy-oneweb.vercel.app",
    ];
    const origin = request.headers.get("origin");

    response.headers.set("Access-Control-Allow-Credentials", "true");
    if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    // response.headers.set(
    //   "Access-Control-Allow-Origin",
    //   "http://localhost:3000"
    // ); // replace this your actual origin
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  let requestToken = request.cookies.get("token");
  let token = requestToken?.value;
  console.log("token from backend", token);

  if (token == undefined || token == null) {
    const headersList = headers();
    const authorization = (await headersList).get("Authorization");
    console.log("authorization", authorization);
    // console.log("request.headers", request.headers);
    // const authorization =  request.headers.authorization

    if (!authorization) {
      if (pathName.startsWith("/api/user/login")) return response;
      if (pathName.startsWith("/api")) return response;
      // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      else return NextResponse.redirect(new URL("/login", request.url));
    }
    token = authorization.replace("Bearer ", "");
    // console.log("token from header", token);
  }

  /** API Middleware */
  console.log(pathName)
  if (pathName.startsWith("/api")) {
    // Bypass api route ที่ไม่ต้องการใช้ TOKEN
    if (
      pathName.startsWith("/api/jobSchedule") ||
      pathName.startsWith("/api/user/auth") ||
      pathName.startsWith("/api/user/login") ||
      pathName.startsWith("/api/contact") ||
      pathName.startsWith("/api/ems/log") ||
      pathName.startsWith("/api/report/usageSummary") ||
      pathName.startsWith("/api/report/billing")
    ) {
      return response;
    } else {
      try {
        const result = await validateToken(token);
        console.log("result", result);
        console.log("response", response);
        if (result.status != false) return response;
        else {
          const resultToken = await regenAccessToken(token);
          if (resultToken.status != false) {
            response.cookies.set("token", resultToken?.token);
            return response;
          } else {
            console.log("ERROR IN ELSE 1 !!!!!!!!!!!!!")
            return NextResponse.json(
              {
                message: "Unauthorized",
              },
              {
                status: 401,
              }
            );
          }
        }
      } catch (error) {
        console.log("CASH !!!!!!!!!!!!!!!!!!!")
        return NextResponse.json(
          {
            message: "Unauthorized",
          },
          {
            status: 401,
          }
        );
      }
    }
  }

  if (!token) {
    // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const result = await validateToken(token);

    console.log("result run middleware", result);

    if (result.status != false) return response;
    else {
      /**
       * Try get Refreshtoken from Database by using username from accessToken
       */
      
      console.log("run else function try get RefreshToken");
      const resultToken = await regenAccessToken(token);
      console.log(resultToken)
      if (resultToken.status != false) {
        console.log("Tokennnnnnnn เข้า")
        response.cookies.set("token", resultToken?.token);
        return response;
      } else {
        console.log("Tokennnnnnnn ไม่เข้า")
        return NextResponse.redirect(
          
          new URL(`/?err=${result.message}`, request.url)
        );
      }
      /*  

      
      if (sqlResult.length > 0) {
        const refreshToken = sqlResult?.[0].RefreshToken;

        const userObject = {
          username: sqlResult?.[0].Username,
          user_group_id: sqlResult?.[0].UserGroupId,
        };

        const resultRefreshToken = await validateRefreshToken(refreshToken);

        console.log("resultRefreshToken :", resultRefreshToken);
        // if Refreshtoken is not valid then create new access token and store in cookies
        if (resultRefreshToken.status != false) {
          const newAccessToken = await jwtGenerate(userObject);
          response.cookies.set("token", newAccessToken);
          return response;
        }
      } else {
        return NextResponse.redirect(
          new URL(`/?err=${result.message}`, request.url)
        );
      } */
    }
  } catch (error) {
    // console.log("error", error);
    return NextResponse.redirect(new URL(`/?err=forbidden`, request.url));
  }

  //   return NextResponse.json({ name: "Cannot" });
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/api/:path*",
    "/cpms/:path*",
    "/device/:path*",
    "/energy/:path*",
    "/overview/:path*",
    "/powergen/:path*",
    "/recommend/:path*",
    "/report/:path*",
  ],
};

async function regenAccessToken(token: any) {
  const decoded = jwtDecode<jwtPayload>(token);
  try {
    const params = {
      username: decoded?.data?.username,
    };
    const result = await getUserByUsername(params);

    const json = await result.json();
    if (json.message !== "no data") {
      const refreshToken = json?.RefreshToken;

      const userObject = {
        username: json?.Username,
        user_group_id: json?.UserGroupId,
        name: json?.Name,
        email: json?.Email,
      };

      const resultRefreshToken = await validateRefreshToken(refreshToken);

      console.log("resultRefreshToken :", resultRefreshToken);
      // if Refreshtoken is valid then create new access token and store in cookies
      if (resultRefreshToken.status != false) {
        const newAccessToken = await jwtGenerate(userObject);
        return {
          status: true,
          token: newAccessToken,
        };
        // response.cookies.set("token", newAccessToken);
        // return response;
      } else {
        return { status: false };
        // NextResponse.redirect(
        //   new URL(`/?err=${resultRefreshToken.message}`, request.url)
        // );
      }
    } else {
      return { status: false };
      // NextResponse.redirect(
      //   new URL(`/?err=${result.message}`, request.url)
      // );
    }
  } catch (error) {
    return { status: false };
    // console.log("error", error);
  }
}
