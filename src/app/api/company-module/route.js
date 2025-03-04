import { NextResponse } from "next/server";
import ExecuteQuery from "@/utils/db";
import { unique } from "@/utils/function";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? 1;
  const lang = searchParams.get("lang")?.toLowerCase() ?? "en";

  var sql = `SELECT
	CompanyModule.CompanyId,
	[Module].ModuleName,
	[Module].Name_TH as ModuleName_TH,
	[Module].Name_ENG as ModuleName_ENG,
	[Module].ModuleUrl,
	SubModule.SubModuleName,
	SubModule.Name_TH as SubModuleName_TH,
	SubModule.Name_ENG as SubModuleName_ENG,
	SubModule.SubModuleUrl,
	[Module].IsActive,
	CASE WHEN [SubModule].IsActive IS NOT NULL AND [Module].IsActive = 0 THEN CONVERT(BIT,0) ELSE  SubModule.IsActive END  as SubModuleIsActive
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
        name: item.ModuleName,
        label: lang === "en" ? item.ModuleName_ENG : item.ModuleName_TH,
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
          (object) => object.label === subItem.ModuleName_ENG
        );

        let navSubItem = {
          name: subItem.SubModuleName,
          label:
            lang === "en"
              ? subItem.SubModuleName_ENG
              : subItem.SubModuleName_TH,
          href: subItem.SubModuleUrl,
          isActive: subItem.SubModuleIsActive,
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
