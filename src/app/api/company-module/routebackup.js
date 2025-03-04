import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? 1;

  var sql = `SELECT
	CompanyModule.CompanyId,
	[Module].ModuleName,
	[Module].ModuleUrl,
	SubModule.SubModuleName,
	SubModule.SubModuleUrl,
CASE
		
		WHEN [Module].IsActive = 0 THEN
		0 
		WHEN [Module].IsActive= 1 
		AND SubModule.SubModuleName IS NULL THEN
			1 
			WHEN MODULE.IsActive = 1 
			AND SubModule.IsActive = 1 THEN
				1 
				WHEN MODULE.IsActive = 1 
				AND SubModule.IsActive = 0 THEN
					0 
					END AS IsActive 
			FROM
				dbo.CompanyModule
				LEFT JOIN dbo.[Module] ON CompanyModule.ModuleId = [Module].Id
				LEFT JOIN dbo.SubModule ON CompanyModule.SubModuleId = SubModule.Id 
			WHERE
				CompanyModule.CompanyId = ${id}
			ORDER BY
			[Module].DisplayOrder ASC,
	SubModule.DisplayOrder ASC`;

  var response = await ExecuteQuery(sql);

  if (response.length > 0) {
    const navItemResponse = [];
    for (const item of response) {
      let navItem = {
        label: item.ModuleName,
        href: item.ModuleUrl,
        icon: item.ModuleName,
        isActive: item.IsActive,
        sub: [],
      };

      navItemResponse.push(navItem);
    }
    let jsonObject = navItemResponse.map(JSON.stringify);
    let uniqueNavItem = new Set(jsonObject);
    let uniqueArray = Array.from(uniqueNavItem).map(JSON.parse);

    for (const subItem of response) {
      if (subItem.SubModuleName !== null) {
        let navItem = uniqueArray.find(
          (object) => object.label === subItem.ModuleName
        );

        let navSubItem = {
          label: subItem.SubModuleName,
          href: subItem.SubModuleUrl,
          isActive: subItem.IsActive,
        };
        navItem.sub.push(navSubItem);
      }
    }

    for (const item of uniqueArray) {
      if (item.sub.length <= 0) {
        delete item.sub;
      }
    }

    return NextResponse.json(uniqueArray);
  } else {
    var returnResponse = [
      {
        message: "no data",
      },
    ];

    return NextResponse.json(returnResponse[0]);
  }
}

export function POST(request) {
  return NextResponse.json();
}
