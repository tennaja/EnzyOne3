import ExecuteQuery from "@/utils/db";

export const checkUserModulePermission = async (
  username,
  moduleName,
  permissionId = 3, // 3 = can edit
  companyId = null
) => {
  const sql = `SELECT
      Username,
      ModuleName,
      PermissionId 
  FROM
      dbo.[User]
      INNER JOIN dbo.UserGroup ON [User].UserGroupId = UserGroup.Id
      INNER JOIN dbo.UserGroup_Role ON UserGroup.Id = UserGroup_Role.UserGroupId
			INNER JOIN dbo.UserGroupCompanyMapping ON UserGroup.Id = UserGroupCompanyMapping.UserGroupId
      INNER JOIN dbo.Role ON UserGroup_Role.RoleId = Role.Id
      INNER JOIN dbo.Role_Module_Permission ON Role.Id = Role_Module_Permission.RoleId
      INNER JOIN dbo.[Module] ON Role_Module_Permission.ModuleId = [Module].Id 
  WHERE
      [User].Username = '${username}' 
      AND [Module].ModuleName= '${moduleName}' 
			${companyId == null ? ` ` : `  AND CompanyId = ${companyId} `} 
      AND PermissionId = '${permissionId}'`;
  try {
    const sqlResult = await ExecuteQuery(sql);
    if (sqlResult.length > 0) {
      return { status: "ok", permission: true };
    } else {
      return { status: "ok", permission: false };
    }
  } catch (error) {
    return { status: "fail", permission: false };
  }
};

export const saveActivityLog = async (
  site,
  username,
  ip = null,
  agent = null,
  path = null,
  type,
  activity,
  value = null
) => {
  const sql = `INSERT INTO [dbo].[EventLog]
    ([Timestamp]
    ,[Type]
    ,[Ip]
    ,[Agent]
    ,[Path]
    ,[Username]
    ,[Site]
    ,[Detail])
  VALUES
    ( GETDATE()
    , '${type}'
    , '${ip}'
    , '${agent}'
    , '${path}'
    , '${username}'
    , '${site}'
    , '${activity}: ${value}')`;

  try {
    const sqlResult = await ExecuteQuery(sql);
    return { status: "ok", permission: true };
  } catch (error) {
    return { status: "fail", permission: false };
  }
};

export const calculateFlatRateCost = (
  energy,
  flat_rate_level_1_cost,
  flat_rate_level_2_cost,
  flat_rate_level_3_cost
) => {
  let returnFlatRateCost = 0;

  // console.log("energy", energy);
  // console.log("flat_rate_level_1_cost", flat_rate_level_1_cost);
  // console.log("flat_rate_level_2_cost", flat_rate_level_2_cost);
  // console.log("flat_rate_level_3_cost", flat_rate_level_3_cost);
  let remainingEnergy = energy;
  // 150 หน่วยแรกใช้ rate level 1
  if (remainingEnergy <= 150) {
    returnFlatRateCost += remainingEnergy * flat_rate_level_1_cost;
    return returnFlatRateCost;
  }
  if (remainingEnergy > 150) {
    returnFlatRateCost += 150 * flat_rate_level_1_cost;
    remainingEnergy -= 150;
  }
  // 250 หน่วยถัดไปใช้ rate level 2
  if (remainingEnergy >= 250) {
    returnFlatRateCost += 250 * flat_rate_level_2_cost;
    remainingEnergy -= 250;
  }
  // เกิน 400 หน่วยใช้ rate level 3
  if (remainingEnergy > 0) {
    returnFlatRateCost += remainingEnergy * flat_rate_level_3_cost;
  }
  return returnFlatRateCost;
};
