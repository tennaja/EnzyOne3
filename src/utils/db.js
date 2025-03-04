import sql from "mssql";
import { logger } from "./logger";

// connection configs
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    // encrypt: true,
    trustServerCertificate: true,
  },
};

export default async function ExecuteQuery(query, options) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.log(query, error);
    logger.error(`ExecuteQuery: ${query} ${JSON.stringify(error)}`);
  }
}

export async function ConnectDB() {
  let pool = await sql.connect(config);
  return pool;
}
/* 
export default async function ExcuteQueryParam(query , param, options) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().input().query(query);
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
}
 */
