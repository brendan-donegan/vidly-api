const express = require("express");
const app = express();
const logger = require("./logger");

process.on("uncaughtException", (ex) => {
  logger.error(ex.message);
  process.exit(1);
});

process.on("unhandledRejection", (ex) => {
  logger.error(ex.message);
  process.exit(1);
});

require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/prod")(app);

module.exports = app;
