import { NextResponse } from "next/server";
import { headers } from "next/headers";
import ExecuteQuery from "@/utils/db";
import { unique, validateToken } from "@/utils/function";
import { jwtDecode } from "jwt-decode";

export async function GET(request) {
  const headersList = headers();
  const authorization = headersList.get("authorization");
  if (!authorization)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const token = authorization.replace("Bearer ", "");
    const result = await validateToken(token);
    if (result.status !== false) {
      const decoded = jwtDecode(token);
      const sql = `SELECT
      UserGroup_Role.UserGroupId, 
      UserGroup_Role.RoleId, 
      Role.Name as RoleName
    FROM
      dbo.UserGroup_Role
      INNER JOIN
      dbo.Role
      ON 
          UserGroup_Role.RoleId = Role.Id
    WHERE
      UserGroupId = ${decoded?.data?.user_group_id} `;

      const responseRole = await ExecuteQuery(sql);

      //   console.log("responseRole", responseRole);
      if (responseRole.length > 0) {
        const role_id = responseRole?.[0].RoleId;
        const sqlRoleModule = `SELECT
          [Module].ModuleName AS Module,
          Permission.Name AS Permission 
      FROM
          dbo.Role_Module_Permission
          INNER JOIN dbo.Role ON Role_Module_Permission.RoleId = Role.Id
          INNER JOIN dbo.[Module] ON Role_Module_Permission.ModuleId = [Module].Id
          INNER JOIN dbo.Permission ON Role_Module_Permission.PermissionId = Permission.Id 
      WHERE
          Role.Id = ${role_id} UNION
      SELECT
          [SubModule].SubModuleName AS Module,
          Permission.Name AS Permission 
      FROM
          dbo.Role_SubModule_Permission
          INNER JOIN dbo.Role ON Role_SubModule_Permission.RoleId = Role.Id
          INNER JOIN dbo.[SubModule] ON Role_SubModule_Permission.SubModuleId = [SubModule].Id
          INNER JOIN dbo.Permission ON Role_SubModule_Permission.PermissionId = Permission.Id 
      WHERE
          Role.Id = ${role_id}`;

        const responseRoleModule = await ExecuteQuery(sqlRoleModule);

        if (responseRoleModule.length > 0) {
          return NextResponse.json(responseRoleModule);
        } else {
          const returnResponse = {
            message: "no data",
          };
          return NextResponse.json(returnResponse);
        }
      } else {
        const returnResponse = {
          message: "no data",
        };

        return NextResponse.json(returnResponse);
      }
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 500 });
  }
}

export function POST(request) {
  return NextResponse.json();
}
