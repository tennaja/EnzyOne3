import { logger } from "./logger";

const nodemailer = require("nodemailer");

export async function sendMail(subject, toEmail, otpText) {
  var transporter = nodemailer.createTransport({
    host: "appsmtp.egat.co.th",
    port: "25",
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  var mailOptions = {
    from: `${process.env.NODEMAILER_DISPLAYNAME} <${process.env.NODEMAILER_EMAIL}>`,
    to: toEmail,
    subject: subject,
    html: otpText,
  };
  // เช็ค config ว่าจะต้องส่งเมลมั้ย
  if (process.env.CONFIG_SENDMAIL === "true") {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        logger.error(error);
        throw new Error(error);
      } else {
        logger.info(`subject= ${subject} toEmail= ${toEmail}`);
        console.log("Email Sent");
        return true;
      }
    });
  } else {
    return true;
  }
}
