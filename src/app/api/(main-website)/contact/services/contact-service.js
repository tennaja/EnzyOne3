import ExecuteQuery from "@/utils/db";

export async function saveContact(data) {
  const { name, email, phone, message } = data;

  try {
    var sql = `INSERT INTO [Contact] (name,email,phone,message) VALUES ( '${name}', '${email}' , '${phone}' ,'${message}')`;

    var contact = await ExecuteQuery(sql);
    return "success";
  } catch (error) {
    return error;
  }
}
