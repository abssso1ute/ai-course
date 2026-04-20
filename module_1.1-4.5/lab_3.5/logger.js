import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "monitor.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),

    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      )
    })
  ]
});