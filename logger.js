require("express-async-errors");
const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "vidly.log" }),
  ],
});

module.exports = logger;
