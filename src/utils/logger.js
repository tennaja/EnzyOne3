const { createLogger, format, transports, exitOnError } = require("winston");
require("winston-daily-rotate-file");
const fs = require("fs");

// var logpath = `D:\\Logs\\${process.env.NEXT_PUBLIC_NODE_ENV}\\`;
const logpath = `logs`;
//Everyone Full Control Shared Folder WORKED!!!
//var logpath = `X:\\${systemType}\\`
// var logpath = `\\\\10.40.62.95\\Logs$\\${systemType}\\`

// Create the log directory if it does not exist
if (!fs.existsSync(logpath)) {
  fs.mkdirSync(logpath);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logpath}/%DATE%.log`,
  datePattern: "YYYY-MM-DD",
});

export const logger = createLogger({
  // change level if in dev environment versus production
  //level: env === 'development' ? 'verbose' : 'info',
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
    dailyRotateFileTransport,
  ],
});
