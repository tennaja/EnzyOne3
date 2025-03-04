const KustoClient = require("azure-kusto-data").Client;
const KustoConnectionStringBuilder =
  require("azure-kusto-data").KustoConnectionStringBuilder;

const config = {
  dec_host: process.env.DEC_HOST,
  dec_appid: process.env.DEC_APPID,
  dec_appkey: process.env.DEC_APPKEY,
  dec_authorityId: process.env.DEC_AUTHID,
  dec_database: process.env.DEC_DATABASE,
};

export default async function ExecuteQuery(query, options) {
  try {
    const kcsb =
      KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
        `${config.dec_host}`,
        `${config.dec_appid}`,
        `${config.dec_appkey}`,
        `${config.dec_authorityId}`
      );
    const client = new KustoClient(kcsb);
    // When no longer needed, close the client with the `close` method.

    // `execute()` infers the type of command from the query, although you can also specify the type explicitly using the methods `excuteQuery()`,`executeQueryV1()` or `executeMgmt()`
    const results = await client.execute(`${config.dec_database}`, `${query}`);

    client.close();

    // console.log(results.primaryResults[0].toString());

    let response = JSON.parse(results.primaryResults[0].toString());
    return response;
  } catch (error) {
    console.log(error);
  }
}
