import axios from "axios";

const config = {
  ems_api_model5_host: process.env.EMS_API_MODEL5_HOST,
  ems_api_model6_host: process.env.EMS_API_MODEL6_HOST,
  ems_api_token: process.env.EMS_API_TOKEN,
};

export async function getRecommend(req) {
  const parameters = {
    token: config.ems_api_token,
    start_datetime: req.start_datetime,
    end_datetime: req.end_datetime,
  };

  return { message: "success" };

  // ปิดการดึง API ไว้ก่อน
  const res = await axios.get(`${config.ems_api_model5_host}`, {
    params: parameters,
  });

  const logParams = {
    username: "enzy-dev",
    type: "model5",
    detail: "getEnergyUsageRecommend",
  };
  const logRes = await axios.post(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/ems/log`,
    logParams
  );

  let recommendData = res.data;
  return recommendData;
}

export async function getPeopleCounting(req) {
  const parameters = {
    token: config.ems_api_token,
    start_datetime: req.start_datetime,
    end_datetime: req.end_datetime,
    camera_id: req.camera_id,
  };
  console.log("config", config);
  // ปิดการดึง API ไว้ก่อน
  const res = await axios.get(`${config.ems_api_model6_host}`, {
    params: parameters,
  });

  console.log("res", res);
  const logParams = {
    username: "enzy-dev",
    type: "model6",
    detail: "getPeopleCounting",
  };
  const logRes = await axios.post(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/ems/log`,
    logParams
  );

  let peopleCountingData = res.data;
  return peopleCountingData;
}
